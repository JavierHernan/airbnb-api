const express = require('express')
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { Spot, Spot_Image, Review, User, Booking, Review_Image } = require('../../db/models');


const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

//delete review image by image id, must be current user
router.delete(
    '/:imageId',
    requireAuth,
    async (req, res) => {
        //grab review by id in params. turn into Integer
        const imageId = parseInt(req.params.imageId, 10);

        //get actual review by id
        const image = await Review_Image.findByPk(imageId)
        // console.log("image", image)
        // console.log("image.user_id", image.user_id)
        // const reviewId = image.dataValues.reviewId;
        if(!image) {
            return res.status(404).json({message: "Review image couldn't be found"})
        }

        const review = await Review.findByPk(image.reviewId)
        
        if(!review || review.userId !== req.user.id) {
            return res.status(401).json({message: "User must own Review to delete Review Image"})
        }

        await image.destroy()
        return res.status(200).json({message: "Successfully deleted"})
    }
)


module.exports = router;