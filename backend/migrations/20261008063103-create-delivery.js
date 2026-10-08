'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Deliveries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      customerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Customers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      riderId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Riders',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      pickupAddress: {
        type: Sequelize.STRING,
        allowNull: false
      },
      pickupCity: {
        type: Sequelize.STRING,
        allowNull: false
      },
      dropoffAddress: {
        type: Sequelize.STRING,
        allowNull: false
      },
      dropoffCity: {
        type: Sequelize.STRING,
        allowNull: false
      },
      itemDescription: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      weight: {
        type: Sequelize.STRING
      },
      distanceKm: {
        type: Sequelize.DECIMAL(10, 2)
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      deliveryStatus: {
        type: Sequelize.ENUM('PENDING', 'CONFIRMED', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'),
        allowNull: false,
        defaultValue: 'PENDING'
      },
      instructions: {
        type: Sequelize.TEXT
      },
      pickedUpAt: {
        type: Sequelize.DATE
      },
      deliveredAt: {
        type: Sequelize.DATE
      },
      cancelledAt: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('Deliveries', ['customerId']);
    await queryInterface.addIndex('Deliveries', ['riderId']);
    await queryInterface.addIndex('Deliveries', ['deliveryStatus']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Deliveries');
  }
};
