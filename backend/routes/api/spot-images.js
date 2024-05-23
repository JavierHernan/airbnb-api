const express = require('express')
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { Spot, Spot_Image, Review, User, Booking, Review_Image } = require('../../db/models');


const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

//
router.delete(
    '/:imageId',
    requireAuth,
    async (req, res) => {
        //grab review by id in params. turn into Integer
        const imageId = parseInt(req.params.imageId, 10);

        //get actual review by id
        const image = await Spot_Image.findByPk(imageId)
        if(!image) {
            return res.status(404).json({message: "Spot Image couldn't be found"})
        }
        console.log("image", image)
        const spot = await Spot.findByPk(image.spotId)
        // console.log("spot.owner_id", spot.owner_id)
        if (spot.ownerId !== req.user.id) {
            return res.status(401).json({ message: "User must own Spot to delete the Spot Image" });
        }

        await image.destroy()
        return res.status(200).json({message: "Successfully deleted"})
    }
)

module.exports = router;