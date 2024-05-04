'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review_Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review_Image.belongsTo(models.Review, {foreignKey: "review_id"}) 
    }
  }
  Review_Image.init({
    url: DataTypes.STRING,
    review_id: { //added column
      type: DataTypes.INTEGER,
    }
  }, {
    sequelize,
    modelName: 'Review_Image',
  });
  return Review_Image;
};