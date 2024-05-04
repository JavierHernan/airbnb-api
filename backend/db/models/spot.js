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
      Spot.hasMany(models.Spot_Image, {foreignKey: "spot_id"}),
      Spot.hasMany(models.Review, {foreignKey: "spot_id"}),
      Spot.hasMany(models.Booking, {foreignKey: "spot_id"}),
      Spot.belongsTo(models.User, {foreignKey: "owner_id", as: "owner"})

    }
  }
  Spot.init({
    owner_id: DataTypes.INTEGER,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.FLOAT,
    
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};