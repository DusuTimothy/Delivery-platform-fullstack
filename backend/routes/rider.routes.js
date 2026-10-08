const express = require('express');
const router = express.Router();
const riderController = require('../controllers/rider.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

router.use(protect);
router.use(restrictTo('RIDER'));

router.get('/profile', riderController.getProfile);
router.put('/profile', riderController.updateProfile);
router.put('/availability', riderController.updateAvailability);
router.get('/available-jobs', riderController.getAvailableJobs);
router.get('/assigned-deliveries', riderController.getAssignedDeliveries);
router.put('/deliveries/:deliveryId/accept', riderController.acceptDelivery);
router.put('/deliveries/:deliveryId/update-status', riderController.updateDeliveryStatus);
router.get('/history', riderController.getDeliveryHistory);

module.exports = router;
