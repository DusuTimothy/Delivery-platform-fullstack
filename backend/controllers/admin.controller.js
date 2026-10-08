const { User, Customer, Rider, Delivery, Payment, sequelize } = require('../models');

exports.getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalCustomers = await Customer.count();
    const totalRiders = await Rider.count();
    const totalDeliveries = await Delivery.count();
    const pendingDeliveries = await Delivery.count({ where: { deliveryStatus: 'PENDING' } });
    const deliveredDeliveries = await Delivery.count({ where: { deliveryStatus: 'DELIVERED' } });
    const successfulPayments = await Payment.count({ where: { paymentStatus: 'SUCCESSFUL' } });

    res.status(200).json({
      status: 'success',
      data: {
        totalUsers,
        totalCustomers,
        totalRiders,
        totalDeliveries,
        pendingDeliveries,
        deliveredDeliveries,
        successfulPayments
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ status: 'success', results: users.length, data: users });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { accountStatus } = req.body;
    if (!['ACTIVE', 'INACTIVE', 'SUSPENDED'].includes(accountStatus)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid account status' });
    }
    const user = await User.findByPk(req.params.userId);
    if (!user) return res.status(404).json({ status: 'fail', message: 'User not found' });
    await user.update({ accountStatus });
    res.status(200).json({ status: 'success', message: `User status updated to ${accountStatus}` });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll({
      include: [{ model: User, as: 'user', attributes: { exclude: ['password'] } }]
    });
    res.status(200).json({ status: 'success', results: customers.length, data: customers });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getAllRiders = async (req, res) => {
  try {
    const riders = await Rider.findAll({
      include: [{ model: User, as: 'user', attributes: { exclude: ['password'] } }]
    });
    res.status(200).json({ status: 'success', results: riders.length, data: riders });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.updateRiderAvailability = async (req, res) => {
  try {
    const { availability } = req.body;
    if (!['AVAILABLE', 'BUSY', 'OFFLINE'].includes(availability)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid availability' });
    }
    const rider = await Rider.findByPk(req.params.riderId);
    if (!rider) return res.status(404).json({ status: 'fail', message: 'Rider not found' });
    await rider.update({ availability });
    res.status(200).json({ status: 'success', message: 'Rider availability updated' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.findAll({
      include: [
        { model: Customer, as: 'customer', include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName'] }] },
        { model: Rider, as: 'rider', include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName'] }] },
        { model: Payment, as: 'payment' }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ status: 'success', results: deliveries.length, data: deliveries });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.assignRider = async (req, res) => {
  try {
    const { riderId } = req.body;
    const delivery = await Delivery.findByPk(req.params.deliveryId);
    if (!delivery) return res.status(404).json({ status: 'fail', message: 'Delivery not found' });

    if (delivery.deliveryStatus === 'DELIVERED' || delivery.deliveryStatus === 'CANCELLED') {
      return res.status(400).json({ status: 'fail', message: 'Cannot assign to completed/cancelled delivery' });
    }

    const rider = await Rider.findByPk(riderId);
    if (!rider) return res.status(404).json({ status: 'fail', message: 'Rider not found' });
    if (rider.availability !== 'AVAILABLE') {
      return res.status(400).json({ status: 'fail', message: 'Rider is not available' });
    }

    await delivery.update({ riderId: rider.id, deliveryStatus: 'ASSIGNED' });
    await rider.update({ availability: 'BUSY' });
    res.status(200).json({ status: 'success', message: 'Rider assigned successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: [{ model: Delivery, as: 'delivery' }],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ status: 'success', results: payments.length, data: payments });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
