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
        owner_id: 2,
        address: "1234 Fake Address Lane",
        city: "Fake City 1",
        state: "FakeState2",
        country: "United States",
        lat: -35.77673,
        lng: 6.31424,
        name: "Fake Name 1",
        description: "fake description 1",
        price: "69",
        
      },
      {
        owner_id: 2,
        address: "5678 Fake Address Lane",
        city: "Fake City 2",
        state: "FakeState2",
        country: "United States",
        lat: 29.63934,
        lng: -5.06109,
        name: "Fake Name 2",
        description: "fake description 2",
        price: "69",
      },
      {
        owner_id: 3,
        address: "5678999 Fake Address Lane",
        city: "Fake City 3",
        state: "FakeState3",
        country: "United States",
        lat: 29.63934,
        lng: -5.06109,
        name: "Fake Name 3",
        description: "fake description 3",
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
