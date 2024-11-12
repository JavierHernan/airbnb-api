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
    {
      url: 'https://prod.rockmedialibrary.com/api/public/content/c75dce0bc2714ce8b23c20fb49628bfa?v=5fdae3b6',
      spotId: 5,
      preview: false
    },
    {
      url: 'https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/home-improvement/wp-content/uploads/2022/07/Paris_Exterior_4-Edit-e1714649473120.png',
      spotId: 5,
      preview: false
    },
    {
      url: 'https://wp-tid.zillowstatic.com/52/GettyImages-175259322-1_1200-1-d9e272-1024x805.jpg',
      spotId: 6,
      preview: false
    },
    {
      url: 'https://cdn.houseplansservices.com/content/h0rig2dbr8vsg0fcgqco7acmul/w991x660.jpg?v=9',
      spotId: 6,
      preview: false
    },
    {
      url: 'https://sgluxuryhomes.com.sg/wp-content/uploads/private-house.jpeg.webp',
      spotId: 7,
      preview: false
    },
    {
      url: 'https://wp.zillowstatic.com/trulia/wp-content/uploads/sites/1/2017/08/stonemansion.jpg',
      spotId: 8,
      preview: false
    },
    {
      url: 'https://www.dreamtinyliving.com/wp-content/uploads/2024/02/Small-House-Design-Idea-63-Sqft-1.jpg',
      spotId: 9,
      preview: false
    },
    {
      url: 'https://static.homeguide.com/assets/images/content/homeguide-typical-house-in-suburban-Los-Angeles-California.jpg',
      spotId: 9,
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
