const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect);
router.get('/me', userController.getMe);
router.put('/me', userController.updateMe);
router.put('/me/password', userController.updatePassword);

module.exports = router;
