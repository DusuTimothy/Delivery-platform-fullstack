'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Delivery extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Delivery belongs to Customer
      Delivery.belongsTo(models.Customer, {
        foreignKey: 'customerId',
        as: 'customer'
      });

      // Delivery belongs to Rider
      Delivery.belongsTo(models.Rider, {
        foreignKey: 'riderId',
        as: 'rider'
      });

      // Delivery has one Payment
      Delivery.hasOne(models.Payment, {
        foreignKey: 'deliveryId',
        as: 'payment'
      });
    }
  }
  Delivery.init({
    customerId: DataTypes.INTEGER,
    riderId: DataTypes.INTEGER,
    pickupAddress: DataTypes.STRING,
    pickupCity: DataTypes.STRING,
    dropoffAddress: DataTypes.STRING,
    dropoffCity: DataTypes.STRING,
    itemDescription: DataTypes.TEXT,
    weight: DataTypes.STRING,
    distanceKm: DataTypes.DECIMAL(10, 2),
    price: DataTypes.DECIMAL(10, 2),
    deliveryStatus: {
      type: DataTypes.ENUM('PENDING', 'CONFIRMED', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'),
      defaultValue: 'PENDING'
    },
    instructions: DataTypes.TEXT,
    pickedUpAt: DataTypes.DATE,
    deliveredAt: DataTypes.DATE,
    cancelledAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Delivery',
  });
  return Delivery;
};
