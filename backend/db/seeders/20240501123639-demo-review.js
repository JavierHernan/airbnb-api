'use strict';

const { Review } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        spot_id: 1,
        user_id: 2,
        review: "Fake Review 1",
        stars: 5
      },
      {
        spot_id: 1,
        user_id: 2,
        review: "Fake Review 2",
        stars: 4
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Review';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      review: { [Op.in]: ["Fake Review 1", "Fake Review 2"] }
    }, {});
  }
};
