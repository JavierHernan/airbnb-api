'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      { //ownerId 1
        email: 'demo@user.io',
        username: 'Demo-lition',
        firstName: 'Demo',
        lastName: 'Lition',
        hashedPassword: bcrypt.hashSync('password')
      },
      { //ownerId 2
        email: 'user1@user.io',
        username: 'FakeUser1',
        firstName: 'Fake',
        lastName: 'User',
        hashedPassword: bcrypt.hashSync('password2')
      },
      { //ownerId 3
        email: 'user2@user.io',
        username: 'FakeUser2',
        firstName: 'Fake2',
        lastName: 'User2',
        hashedPassword: bcrypt.hashSync('password3')
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};