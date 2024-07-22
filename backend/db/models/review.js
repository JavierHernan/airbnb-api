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
      Review.belongsTo(models.Spot, {foreignKey: "spotId", onDelete: "CASCADE"}),
      Review.belongsTo(models.User, {foreignKey: "userId"}),
      Review.hasMany(models.Review_Image, {foreignKey: "reviewId", onDelete: "CASCADE"})
    }
  }
  Review.init({
    review: {
      type: DataTypes.STRING(500)
    },
    stars: DataTypes.INTEGER,
    spotId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};