'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.hasMany(models.Spot_Image, {foreignKey: "spotId", onDelete: "CASCADE"}),
      Spot.hasMany(models.Review, {foreignKey: "spotId", onDelete: "CASCADE"}),
      Spot.hasMany(models.Booking, {foreignKey: "spotId", onDelete: "CASCADE"}),
      Spot.belongsTo(models.User, {foreignKey: "ownerId", as: "owner"})

    }
  }
  Spot.init({
    ownerId: DataTypes.INTEGER,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT,
    name: {
      type: DataTypes.STRING(50),
      validate: {
        len: [3, 50]
      }
    },
    description: {
      type: DataTypes.STRING(255),
      validate: {
        len: [3, 255]
      }
    },
    price: DataTypes.FLOAT,
    
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};