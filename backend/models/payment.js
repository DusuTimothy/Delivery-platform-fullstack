'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Payment belongs to Delivery
      Payment.belongsTo(models.Delivery, {
        foreignKey: 'deliveryId',
        as: 'delivery'
      });
    }
  }
  Payment.init({
    deliveryId: DataTypes.INTEGER,
    amount: DataTypes.DECIMAL(10, 2),
    paymentMethod: {
      type: DataTypes.ENUM('CASH', 'CARD', 'TRANSFER')
    },
    paymentStatus: {
      type: DataTypes.ENUM('PENDING', 'SUCCESSFUL', 'FAILED', 'REFUNDED'),
      defaultValue: 'PENDING'
    },
    transactionId: DataTypes.STRING,
    reference: DataTypes.STRING,
    paidAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Payment',
  });
  return Payment;
};
