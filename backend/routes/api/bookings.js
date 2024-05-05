const express = require('express')
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { Spot, Spot_Image, Review, User, Booking, Review_Image } = require('../../db/models');


const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


//get all of current User's Bookings
router.get(
    '/current',
    requireAuth,
    async (req,res) => {
        //get current user id
        const userId = req.user.id;

        //gel all of current user's bookings
        const getBookings = await Booking.findAll({
            where: {user_id: userId},
            attributes: ['id', 'spot_id', 'user_id', 'startDate', 'endDate', 'createdAt', 'updatedAt'],
            include: [{
                model: Spot,
                attributes: [
                    'id',
                    'owner_id',
                    'address',
                    'city',
                    'state',
                    'country',
                    'lat',
                    'lng',
                    'name',
                    'price',
                    
                ],
                include: [{
                    model: Spot_Image,
                attributes: [
                    'url'
                ]
                }]
            }
        ]
        })
        const response = {
            Bookings: getBookings.map(booking => ({
                id: booking.id,
                spotId: booking.spot_id,
                Spot: {
                    id: booking.Spot.id,
                    ownerId: booking.Spot.owner_id,
                    address: booking.Spot.address,
                    city: booking.Spot.city,
                    state: booking.Spot.state,
                    country: booking.Spot.country,
                    lat: booking.Spot.lat,
                    lng: booking.Spot.lng,
                    name: booking.Spot.name,
                    price: booking.Spot.price,
                    previewImage: booking.Spot.Spot_Images.length > 0 ? booking.Spot.Spot_Images[0].url : null // Assuming Spot_Images is an array
                },
                userId: booking.user_id,
                startDate: booking.startDate,
                endDate: booking.endDate,
                createdAt: booking.createdAt,
                updatedAt: booking.updatedAt
            }))
        }
        return res.status(200).json(response)
    }
)

module.exports = router;