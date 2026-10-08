const { Delivery, Customer, Rider, User, Payment } = require('../models');

exports.getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.findAll({
      include: [
        { model: Customer, as: 'customer', include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName', 'email', 'phone'] }] },
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

exports.getDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findByPk(req.params.deliveryId, {
      include: [
        { model: Customer, as: 'customer', include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName', 'email', 'phone'] }] },
        { model: Rider, as: 'rider', include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName', 'phone'] }] },
        { model: Payment, as: 'payment' }
      ]
    });
    if (!delivery) return res.status(404).json({ status: 'fail', message: 'Delivery not found' });
    res.status(200).json({ status: 'success', data: delivery });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
