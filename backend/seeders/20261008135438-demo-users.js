'use strict';
const bcrypt = require('bcrypt');

// This seeder creates demo accounts so you can test the platform instantly:
//  - a customer  -> login to create/pay/track deliveries
//  - a rider     -> login to accept and deliver jobs
// (an admin is created in the first seeder)
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashed = await bcrypt.hash('password123', 10);
    const now = new Date();

    // 1. Create the demo users (login accounts)
    const [customer, rider] = await queryInterface.bulkInsert('Users', [{
      firstName: 'Cathy',
      lastName: 'Customer',
      email: 'customer@delivery.com',
      password: hashed,
      phone: '3333333333',
      role: 'CUSTOMER',
      accountStatus: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
    }, {
      firstName: 'Ricky',
      lastName: 'Rider',
      email: 'rider@delivery.com',
      password: hashed,
      phone: '4444444444',
      role: 'RIDER',
      accountStatus: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
    }], { returning: true });

    // 2. Link them to their role-specific tables.
    // A User with role=CUSTOMER needs a Customer row (holds their deliveries).
    await queryInterface.bulkInsert('Customers', [{
      userId: customer.id,
      createdAt: now,
      updatedAt: now,
    }], {});

    // A User with role=RIDER needs a Rider row (availability, vehicle...).
    await queryInterface.bulkInsert('Riders', [{
      userId: rider.id,
      vehicleType: 'Motorbike',
      licenseNumber: 'DEMO-LIC-001',
      availability: 'AVAILABLE',
      location: 'Accra',
      createdAt: now,
      updatedAt: now,
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Riders', { licenseNumber: 'DEMO-LIC-001' }, {});
    await queryInterface.bulkDelete('Customers', null, {});
    await queryInterface.bulkDelete('Users', {
      email: { [Sequelize.Op.in]: ['customer@delivery.com', 'rider@delivery.com'] }
    }, {});
  }
};
