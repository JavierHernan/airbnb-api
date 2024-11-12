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
      { //spotId 1
        ownerId: 1, 
        address: "1234 Fake Address Lane",
        city: "Fake City 1",
        state: "FakeState2",
        country: "United States",
        lat: -35.77673,
        lng: 6.31424,
        name: "Pit in my basement",
        description: "fake description 1 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        price: "100",
        
      },
      { //spotId 2
        ownerId: 1,
        address: "5678 Fake Address Lane",
        city: "Fake City 2",
        state: "FakeState2",
        country: "United States",
        lat: 29.63934,
        lng: -5.06109,
        name: "Premium Dog house",
        description: "fake description 2 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        price: "100",
      },
      { //spotId 3
        ownerId: 2,
        address: "5678999 Fake Address Lane",
        city: "Fake City 3",
        state: "FakeState3",
        country: "United States",
        lat: 29.63934,
        lng: -5.06109,
        name: "A literal barn",
        description: "fake description 3 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        price: "100",
      },
      { //spotId 4
        ownerId: 2,
        address: "567899 Fake Address Lane",
        city: "Fake City 4",
        state: "FakeState4",
        country: "United States",
        lat: 29.63933,
        lng: -5.06108,
        name: "Fake Name 4",
        description: "fake description 4 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        price: "100",
      },
      { //spotId 5
        ownerId: 1,
        address: "1111 Fake Address Lane",
        city: "Fake City 5",
        state: "FakeState5",
        country: "United States",
        lat: 29.63933,
        lng: -5.06108,
        name: "Fake Name 5",
        description: "fake description 5 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        price: "150",
      },
      { //spotId 6
        ownerId: 3,
        address: "2222 Fake Address Lane",
        city: "Fake City 6",
        state: "FakeState6",
        country: "United States",
        lat: 29.63933,
        lng: -5.06108,
        name: "Fake Name 6",
        description: "fake description 6 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        price: "120",
      },
      { //spotId 7
        ownerId: 2,
        address: "3333 Fake Address Lane",
        city: "Fake City 7",
        state: "FakeState7",
        country: "United States",
        lat: 29.63933,
        lng: -5.06108,
        name: "Fake Name 7",
        description: "fake description 7 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        price: "130",
      },
      { //spotId 8
        ownerId: 3,
        address: "4444 Fake Address Lane",
        city: "Fake City 8",
        state: "FakeState8",
        country: "United States",
        lat: 29.63933,
        lng: -5.06108,
        name: "Fake Name 8",
        description: "fake description 8 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        price: "200",
      },
      { //spotId 9
        ownerId: 3,
        address: "5555 Fake Address Lane",
        city: "Fake City 9",
        state: "FakeState9",
        country: "United States",
        lat: 29.63933,
        lng: -5.06108,
        name: "Fake Name 9",
        description: "fake description 9 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        price: "210",
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
