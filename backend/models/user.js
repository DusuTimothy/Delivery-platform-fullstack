'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // One User has One Customer
      User.hasOne(models.Customer, {
        foreignKey: 'userId',
        as: 'customer'
      });

      // One User has One Rider
      User.hasOne(models.Rider, {
        foreignKey: 'userId',
        as: 'rider'
      });
    }
  }
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phone: DataTypes.STRING,
    role: {
      type: DataTypes.ENUM('CUSTOMER', 'RIDER', 'ADMIN'),
      defaultValue: 'CUSTOMER'
    },
    accountStatus: {
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED'),
      defaultValue: 'ACTIVE'
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
