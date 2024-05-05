'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Team.hasMany(models.Review_Image, {foreignKey: "review_id"}) for bookings?
      Review.belongsTo(models.Spot, {foreignKey: "spot_id", onDelete: "CASCADE"}),
      Review.belongsTo(models.User, {foreignKey: "user_id"}),
      Review.hasMany(models.Review_Image, {foreignKey: "review_id", onDelete: "CASCADE"})
    }
  }
  Review.init({
    review: DataTypes.STRING,
    stars: DataTypes.INTEGER,
    spot_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};