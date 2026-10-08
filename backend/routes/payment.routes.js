const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

router.use(protect);

router.post('/deliveries/:deliveryId/payments', restrictTo('CUSTOMER'), paymentController.createOrUpdatePayment);
router.get('/payments/:id', paymentController.getPayment);
router.get('/my-payments', restrictTo('CUSTOMER'), paymentController.getMyPayments);

module.exports = router;
