'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Customer belongs to User
      Customer.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });

      // Customer has many Deliveries
      Customer.hasMany(models.Delivery, {
        foreignKey: 'customerId',
        as: 'deliveries'
      });
    }
  }
  Customer.init({
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Customer',
  });
  return Customer;
};
