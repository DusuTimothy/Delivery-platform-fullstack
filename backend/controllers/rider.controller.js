const { Rider, User, Delivery, Customer, Payment } = require('../models');
const { Op } = require('sequelize');

exports.getProfile = async (req, res) => {
  try {
    const rider = await Rider.findOne({
      where: { userId: req.user.id },
      include: [{ model: User, as: 'user', attributes: { exclude: ['password'] } }]
    });
    res.status(200).json({ status: 'success', data: rider });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, vehicleType, location } = req.body;
    await User.update({ firstName, lastName, phone }, { where: { id: req.user.id } });
    await Rider.update({ vehicleType, location }, { where: { userId: req.user.id } });
    res.status(200).json({ status: 'success', message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.updateAvailability = async (req, res) => {
  try {
    const { availability } = req.body;
    if (!['AVAILABLE', 'BUSY', 'OFFLINE'].includes(availability)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid availability status' });
    }
    await Rider.update({ availability }, { where: { userId: req.user.id } });
    res.status(200).json({ status: 'success', message: `Availability updated to ${availability}` });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getAvailableJobs = async (req, res) => {
  try {
    const deliveries = await Delivery.findAll({
      where: {
        riderId: null,
        deliveryStatus: { [Op.in]: ['PENDING', 'CONFIRMED'] }
      },
      include: [
        { model: Customer, as: 'customer', include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName', 'phone'] }] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ status: 'success', results: deliveries.length, data: deliveries });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getAssignedDeliveries = async (req, res) => {
  try {
    const rider = await Rider.findOne({ where: { userId: req.user.id } });
    const deliveries = await Delivery.findAll({
      where: {
        riderId: rider.id,
        deliveryStatus: { [Op.notIn]: ['DELIVERED', 'CANCELLED'] }
      },
      include: [
        { model: Customer, as: 'customer', include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName', 'phone'] }] },
        { model: Payment, as: 'payment' }
      ],
      order: [['updatedAt', 'DESC']]
    });
    res.status(200).json({ status: 'success', results: deliveries.length, data: deliveries });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.acceptDelivery = async (req, res) => {
  try {
    const rider = await Rider.findOne({ where: { userId: req.user.id } });
    if (rider.availability !== 'AVAILABLE') {
      return res.status(400).json({ status: 'fail', message: 'You must be AVAILABLE to accept deliveries' });
    }

    const delivery = await Delivery.findOne({ where: { id: req.params.deliveryId } });
    if (!delivery) {
      return res.status(404).json({ status: 'fail', message: 'Delivery not found' });
    }
    if (delivery.riderId) {
      return res.status(400).json({ status: 'fail', message: 'Delivery already assigned to another rider' });
    }
    if (!['PENDING', 'CONFIRMED'].includes(delivery.deliveryStatus)) {
      return res.status(400).json({ status: 'fail', message: 'Cannot accept delivery in current status' });
    }

    await delivery.update({ riderId: rider.id, deliveryStatus: 'ASSIGNED' });
    await rider.update({ availability: 'BUSY' });
    res.status(200).json({ status: 'success', message: 'Delivery accepted successfully', data: delivery });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['PICKED_UP', 'IN_TRANSIT', 'DELIVERED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid status update' });
    }

    const rider = await Rider.findOne({ where: { userId: req.user.id } });
    const delivery = await Delivery.findOne({ where: { id: req.params.deliveryId, riderId: rider.id } });

    if (!delivery) {
      return res.status(404).json({ status: 'fail', message: 'Delivery not found or not assigned to you' });
    }

    const allowedTransitions = {
      ASSIGNED: ['PICKED_UP'],
      PICKED_UP: ['IN_TRANSIT'],
      IN_TRANSIT: ['DELIVERED']
    };

    if (!allowedTransitions[delivery.deliveryStatus] || !allowedTransitions[delivery.deliveryStatus].includes(status)) {
      return res.status(400).json({ status: 'fail', message: `Cannot move from ${delivery.deliveryStatus} to ${status}` });
    }

    const updateData = { deliveryStatus: status };
    if (status === 'PICKED_UP') updateData.pickedUpAt = new Date();
    if (status === 'DELIVERED') {
      updateData.deliveredAt = new Date();
      await rider.update({ availability: 'AVAILABLE' });
    }

    await delivery.update(updateData);
    res.status(200).json({ status: 'success', message: 'Delivery status updated successfully', data: delivery });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getDeliveryHistory = async (req, res) => {
  try {
    const rider = await Rider.findOne({ where: { userId: req.user.id } });
    const deliveries = await Delivery.findAll({
      where: { riderId: rider.id, deliveryStatus: 'DELIVERED' },
      include: [{ model: Customer, as: 'customer', include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName', 'phone'] }] }],
      order: [['deliveredAt', 'DESC']]
    });
    res.status(200).json({ status: 'success', results: deliveries.length, data: deliveries });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
