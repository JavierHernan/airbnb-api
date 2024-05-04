'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot_Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot_Image.belongsTo(models.Spot, {foreignKey: "spot_id"})
    }
  }
  Spot_Image.init({
    url: DataTypes.STRING,
    preview: DataTypes.BOOLEAN,
    spot_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Spot_Image',
  });
  return Spot_Image;
};