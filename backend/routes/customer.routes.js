const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

router.use(protect);
router.use(restrictTo('CUSTOMER'));

router.get('/profile', customerController.getProfile);
router.put('/profile', customerController.updateProfile);
router.get('/deliveries', customerController.getMyDeliveries);
router.get('/deliveries/:deliveryId', customerController.getMyDeliveryById);
router.post('/deliveries', customerController.createDeliveryRequest);
router.put('/deliveries/:deliveryId/cancel', customerController.cancelDelivery);

module.exports = router;
