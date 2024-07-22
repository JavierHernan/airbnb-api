'use strict';
const { Spot_Image } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await Spot_Image.bulkCreate([
    {
      url: 'https://www.denofgeek.com/wp-content/uploads/2021/02/silence-of-the-lambs.jpg?fit=1600%2C1208',
      spotId: 1,
      preview: true
    },
    {
      url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYsdyBhzi95TSHSTQyZ67YDPssJKrawu97GA&s',
      spotId: 1,
      preview: false
    },
    {
      url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYsdyBhzi95TSHSTQyZ67YDPssJKrawu97GA&s',
      spotId: 1,
      preview: false
    },
    {
      url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYsdyBhzi95TSHSTQyZ67YDPssJKrawu97GA&s',
      spotId: 1,
      preview: false
    },
    {
      url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYsdyBhzi95TSHSTQyZ67YDPssJKrawu97GA&s',
      spotId: 1,
      preview: false
    },
    {
      url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYsdyBhzi95TSHSTQyZ67YDPssJKrawu97GA&s',
      spotId: 1,
      preview: false
    },
    {
      url: 'https://i.pinimg.com/736x/07/45/18/074518589c30a62a2c84cd00850d3ca1.jpg',
      spotId: 2,
      preview: true
    },
    {
      url: 'https://res.cloudinary.com/liaison-inc/image/upload/f_auto/q_auto,w_1200/v1681302127/content/homeguide/homeguide-red-barn-on-rural-property-in-New-England.jpg',
      spotId: 3,
      preview: true
    },
    {
      url: 'https://res.cloudinary.com/liaison-inc/image/upload/f_auto/q_auto,w_1200/v1681302127/content/homeguide/homeguide-red-barn-on-rural-property-in-New-England.jpg',
      spotId: 4,
      preview: true
    },
    {
      url: 'https://res.cloudinary.com/liaison-inc/image/upload/f_auto/q_auto,w_1200/v1681302127/content/homeguide/homeguide-red-barn-on-rural-property-in-New-England.jpg',
      spotId: 4,
      preview: false
    },
   ], {validate: true})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Spot_Images';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['www.spot_image_url.com', 'www.another-spot_image_url.com'] }
    }, {});
  }
};
