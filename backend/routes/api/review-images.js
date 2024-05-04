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
        if(!image) {
            return res.status(404).json({message: "Spot image couldn't be found"})
        }

        await image.destroy()
        return res.status(200).json({message: "Successfully deleted"})
    }
)


module.exports = router;