const { Payment, Delivery, Customer } = require('../models');
const crypto = require('crypto');

exports.createOrUpdatePayment = async (req, res) => {
  try {
    const { paymentMethod, paymentStatus = 'PENDING' } = req.body;
    const deliveryId = req.params.deliveryId;

    if (!['CASH', 'CARD', 'TRANSFER'].includes(paymentMethod)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid payment method' });
    }
    if (!['PENDING', 'SUCCESSFUL', 'FAILED', 'REFUNDED'].includes(paymentStatus)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid payment status' });
    }

    const customer = await Customer.findOne({ where: { userId: req.user.id } });
    const delivery = await Delivery.findOne({ where: { id: deliveryId, customerId: customer.id } });
    if (!delivery) {
      return res.status(404).json({ status: 'fail', message: 'Delivery not found' });
    }

    let payment = await Payment.findOne({ where: { deliveryId } });
    if (payment) {
      await payment.update({
        paymentMethod,
        paymentStatus,
        paidAt: paymentStatus === 'SUCCESSFUL' ? new Date() : null
      });
      return res.status(200).json({ status: 'success', message: 'Payment updated', data: payment });
    }

    const transactionId = crypto.randomUUID();
    payment = await Payment.create({
      deliveryId,
      amount: delivery.price,
      paymentMethod,
      paymentStatus,
      transactionId,
      paidAt: paymentStatus === 'SUCCESSFUL' ? new Date() : null
    });
    res.status(201).json({ status: 'success', message: 'Payment recorded', data: payment });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getPayment = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id, { include: [{ model: Delivery, as: 'delivery' }] });
    if (!payment) return res.status(404).json({ status: 'fail', message: 'Payment not found' });
    res.status(200).json({ status: 'success', data: payment });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getMyPayments = async (req, res) => {
  try {
    const customer = await Customer.findOne({ where: { userId: req.user.id } });
    const deliveries = await Delivery.findAll({ where: { customerId: customer.id }, attributes: ['id'] });
    const deliveryIds = deliveries.map(d => d.id);
    const payments = await Payment.findAll({
      where: { deliveryId: deliveryIds },
      include: [{ model: Delivery, as: 'delivery' }],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ status: 'success', results: payments.length, data: payments });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
