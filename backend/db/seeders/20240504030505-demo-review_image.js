'use strict';
const { Review_Image } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await Review_Image.bulkCreate([
    {
      url: 'www.review.com???',
      reviewId: 1
    },
    {
      url: 'www.another-review.com???',
      reviewId: 2
    },
   ], {validate: true})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Review_Images';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: [1, 2] }
    }, {});
  }
};
