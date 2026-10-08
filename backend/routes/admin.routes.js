const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

router.use(protect);
router.use(restrictTo('ADMIN'));

router.get('/dashboard', adminController.getDashboard);
router.get('/users', adminController.getAllUsers);
router.put('/users/:userId/status', adminController.updateUserStatus);
router.get('/customers', adminController.getAllCustomers);
router.get('/riders', adminController.getAllRiders);
router.put('/riders/:riderId/availability', adminController.updateRiderAvailability);
router.get('/deliveries', adminController.getAllDeliveries);
router.put('/deliveries/:deliveryId/assign', adminController.assignRider);
router.get('/payments', adminController.getAllPayments);

module.exports = router;
