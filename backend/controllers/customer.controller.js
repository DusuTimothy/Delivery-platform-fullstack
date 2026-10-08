const { Customer, User, Delivery, Payment, Rider } = require('../models');
const { Op } = require('sequelize');

exports.getProfile = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      where: { userId: req.user.id },
      include: [{ model: User, as: 'user', attributes: { exclude: ['password'] } }]
    });
    res.status(200).json({ status: 'success', data: customer });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;
    await User.update({ firstName, lastName, phone }, { where: { id: req.user.id } });
    res.status(200).json({ status: 'success', message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getMyDeliveries = async (req, res) => {
  try {
    const customer = await Customer.findOne({ where: { userId: req.user.id } });
    const deliveries = await Delivery.findAll({
      where: { customerId: customer.id },
      include: [
        { model: Rider, as: 'rider', include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName', 'phone'] }] },
        { model: Payment, as: 'payment' }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ status: 'success', results: deliveries.length, data: deliveries });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getMyDeliveryById = async (req, res) => {
  try {
    const customer = await Customer.findOne({ where: { userId: req.user.id } });
    const delivery = await Delivery.findOne({
      where: { id: req.params.deliveryId, customerId: customer.id },
      include: [
        { model: Rider, as: 'rider', include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName', 'phone'] }] },
        { model: Payment, as: 'payment' }
      ]
    });
    if (!delivery) {
      return res.status(404).json({ status: 'fail', message: 'Delivery not found' });
    }
    res.status(200).json({ status: 'success', data: delivery });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.createDeliveryRequest = async (req, res) => {
  try {
    const { pickupAddress, pickupCity, dropoffAddress, dropoffCity, itemDescription, weight, distanceKm, price, instructions } = req.body;

    if (!pickupAddress || !pickupCity || !dropoffAddress || !dropoffCity || !itemDescription || !price) {
      return res.status(400).json({ status: 'fail', message: 'Missing required fields' });
    }

    const customer = await Customer.findOne({ where: { userId: req.user.id } });

    const delivery = await Delivery.create({
      customerId: customer.id,
      pickupAddress,
      pickupCity,
      dropoffAddress,
      dropoffCity,
      itemDescription,
      weight,
      distanceKm,
      price,
      instructions,
      deliveryStatus: 'PENDING'
    });

    res.status(201).json({ status: 'success', message: 'Delivery request created successfully', data: delivery });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.cancelDelivery = async (req, res) => {
  try {
    const customer = await Customer.findOne({ where: { userId: req.user.id } });
    const delivery = await Delivery.findOne({ where: { id: req.params.deliveryId, customerId: customer.id } });

    if (!delivery) {
      return res.status(404).json({ status: 'fail', message: 'Delivery not found' });
    }

    const cancellableStatuses = ['PENDING', 'CONFIRMED'];
    if (!cancellableStatuses.includes(delivery.deliveryStatus)) {
      return res.status(400).json({ status: 'fail', message: 'Cannot cancel delivery in current status' });
    }

    await delivery.update({ deliveryStatus: 'CANCELLED', cancelledAt: new Date() });
    res.status(200).json({ status: 'success', message: 'Delivery cancelled successfully', data: delivery });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
