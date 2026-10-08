const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/delivery.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

router.use(protect);
router.get('/', restrictTo('ADMIN'), deliveryController.getAllDeliveries);
router.get('/:deliveryId', deliveryController.getDelivery);

module.exports = router;
