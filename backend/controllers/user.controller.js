const bcrypt = require('bcrypt');
const { User } = require('../models');

// getMe = returns the logged-in user's data (never the password hash)
exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
    res.status(200).json({ status: 'success', data: user });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// updateMe = update name/phone only (role & status are NOT user-editable)
exports.updateMe = async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;
    if (!firstName || !lastName) {
      return res.status(400).json({ status: 'fail', message: 'First and last name are required' });
    }
    await User.update(
      { firstName, lastName, phone },
      { where: { id: req.user.id } }
    );
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
    res.status(200).json({ status: 'success', message: 'Profile updated successfully', data: user });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// updatePassword = verify OLD password first, then store a NEW hash.
// Beginners: we never store plain passwords - bcrypt creates a one-way hash.
exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ status: 'fail', message: 'Old and new password are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ status: 'fail', message: 'New password must be at least 6 characters' });
    }

    const user = await User.findByPk(req.user.id);
    const ok = await bcrypt.compare(oldPassword, user.password);
    if (!ok) {
      return res.status(401).json({ status: 'fail', message: 'Current password is incorrect' });
    }

    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
    const hashed = await bcrypt.hash(newPassword, saltRounds);
    await user.update({ password: hashed });

    res.status(200).json({ status: 'success', message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
