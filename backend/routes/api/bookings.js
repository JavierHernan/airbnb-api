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
            where: {userId: userId},
            attributes: ['id', 'spotId', 'userId', 'startDate', 'endDate', 'createdAt', 'updatedAt'],
            include: [{
                model: Spot,
                attributes: [
                    'id',
                    'ownerId',
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
                spotId: booking.spotId,
                Spot: {
                    id: booking.Spot.id,
                    ownerId: booking.Spot.ownerId,
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
                userId: booking.userId,
                startDate: booking.startDate,
                endDate: booking.endDate,
                createdAt: booking.createdAt,
                updatedAt: booking.updatedAt
            }))
        }
        return res.status(200).json(response)
    }
)

//edit a booking
router.put(
    '/:bookingId',
    requireAuth,
    async (req, res) => {
        const bookingId = req.params.bookingId;
        const updated = req.body;
        const {startDate, endDate} = updated

        const booking = await Booking.findByPk(bookingId);

        if(!booking) {
            return res.status(404).json({message: "Booking couldn't be found"})
        }

        if (endDate <= startDate) {
            return res.status(400).json({ 
                message: "Bad Request",
                erros: {
                    "endDate": "endDate cannot come before startDate"
                } 
            });
        }

         //Find existing booking
        // const existingBooking = await Booking.findOne({
        //     where: {
        //         spotId: Spot.id,
        //         [Op.or]: [
        //             {
        //                 startDate: { [Op.between]: [startDate, endDate] }
        //             },
        //             {
        //                 endDate: { [Op.between]: [startDate, endDate] }
        //             }
        //         ]
        //     }
        // })
        const existingBooking = await Booking.findOne({
            where: {
                spotId: booking.spotId, // Assuming spotId is a field in the Booking model
                id: { [Op.ne]: booking.id }, // Exclude the current booking
                [Op.or]: [
                    {
                        startDate: { [Op.lt]: endDate }, // Existing booking starts before new booking ends
                        endDate: { [Op.gt]: startDate } // Existing booking ends after new booking starts
                    }
                ]
            }
        });
        if(existingBooking) {
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                errors: {
                    startDate: "Start date conflicts with an existing booking",
                    endDate: "End date conflicts with an existing booking"
                }
            })
        }

        await booking.update(updatedData);
        return res.status(200).json(booking)
    }
)

//delete a booking
router.delete(
    '/:bookingId',
    requireAuth,
    async (req, res) => {
        const bookingId = req.params.bookingId;

        const booking = await Booking.findByPk(bookingId);

        if(!booking) {
            return res.status(404).json({message: ""})
        }
    }
)

module.exports = router;