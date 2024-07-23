'use strict';
const { Spot } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: "1234 Fake Address Lane",
        city: "Fake City 1",
        state: "FakeState2",
        country: "United States",
        lat: -35.77673,
        lng: 6.31424,
        name: "Pit in my basement",
        description: "fake description 1 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        price: "69",
        
      },
      {
        ownerId: 1,
        address: "5678 Fake Address Lane",
        city: "Fake City 2",
        state: "FakeState2",
        country: "United States",
        lat: 29.63934,
        lng: -5.06109,
        name: "Premium Dog house",
        description: "fake description 2 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        price: "69",
      },
      {
        ownerId: 2,
        address: "5678999 Fake Address Lane",
        city: "Fake City 3",
        state: "FakeState3",
        country: "United States",
        lat: 29.63934,
        lng: -5.06109,
        name: "A literal barn",
        description: "fake description 3 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        price: "69",
      },
      {
        ownerId: 2,
        address: "567899 Fake Address Lane",
        city: "Fake City 4",
        state: "FakeState4",
        country: "United States",
        lat: 29.63933,
        lng: -5.06108,
        name: "Fake Name 4",
        description: "fake description 4 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        price: "69",
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      address: { [Op.in]: ["1234 Fake Address Lane", "5678 Fake Address Lane"] }
    }, {});
  }
};
