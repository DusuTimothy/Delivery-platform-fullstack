const bcrypt = require('bcrypt');
const { User, Customer, Rider, sequelize } = require('../models');
const generateToken = require('../utils/generateToken');

exports.register = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { firstName, lastName, email, password, phone, role = 'CUSTOMER', vehicleType, licenseNumber } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      await t.rollback();
      return res.status(400).json({
        status: 'fail',
        message: 'Email already in use'
      });
    }

    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      role,
      accountStatus: 'ACTIVE'
    }, { transaction: t });

    if (role === 'CUSTOMER') {
      await Customer.create({
        userId: user.id
      }, { transaction: t });
    }

    if (role === 'RIDER') {
      if (!vehicleType || !licenseNumber) {
        await t.rollback();
        return res.status(400).json({
          status: 'fail',
          message: 'Vehicle type and license number are required for riders'
        });
      }

      const existingRider = await Rider.findOne({ where: { licenseNumber } });
      if (existingRider) {
        await t.rollback();
        return res.status(400).json({
          status: 'fail',
          message: 'License number already registered'
        });
      }

      await Rider.create({
        userId: user.id,
        vehicleType,
        licenseNumber,
        availability: 'OFFLINE'
      }, { transaction: t });
    }

    await t.commit();

    const token = generateToken(user.id, user.role);

    const userResponse = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      accountStatus: user.accountStatus
    };

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      token,
      user: userResponse
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({
      status: 'error',
      message: 'An error occurred during registration',
      error: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid email or password'
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid email or password'
      });
    }

    if (user.accountStatus !== 'ACTIVE') {
      return res.status(403).json({
        status: 'fail',
        message: `Your account is ${user.accountStatus}. Please contact admin.`
      });
    }

    const token = generateToken(user.id, user.role);

    const userResponse = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      accountStatus: user.accountStatus
    };

    res.status(200).json({
      status: 'success',
      message: 'Logged in successfully',
      token,
      user: userResponse
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'An error occurred during login',
      error: error.message
    });
  }
};
