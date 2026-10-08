'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rider extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Rider belongs to User
      Rider.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });

      // Rider has many Deliveries
      Rider.hasMany(models.Delivery, {
        foreignKey: 'riderId',
        as: 'deliveries'
      });
    }
  }
  Rider.init({
    userId: DataTypes.INTEGER,
    vehicleType: DataTypes.STRING,
    licenseNumber: DataTypes.STRING,
    availability: {
      type: DataTypes.ENUM('AVAILABLE', 'BUSY', 'OFFLINE'),
      defaultValue: 'OFFLINE'
    },
    location: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Rider',
  });
  return Rider;
};
