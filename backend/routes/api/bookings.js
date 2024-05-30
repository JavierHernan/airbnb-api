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
        const bookingData = booking.toJSON()
        if(bookingData.userId !== req.user.id) {
            return res.status(401).json({message: "Booking must belong to current User"})
        }

        if (endDate <= startDate) {
            return res.status(400).json({ 
                message: "Bad Request",
                erros: {
                    "endDate": "endDate cannot come before startDate"
                } 
            });
        }

        const allBookings = await Booking.findAll({
            where: {spotId: booking.spotId}
        });

        for(const existingBooking of allBookings) {
            if(existingBooking.id !== booking.id) {
                const existingStartDate = new Date(existingBooking.startDate);
                const existingEndDate = new Date(existingBooking.endDate);
                const newStartDate = new Date(startDate);
                const newEndDate = new Date(endDate);
                //conflict conditionals
                if (
                    (newStartDate < existingEndDate && newStartDate >= existingStartDate) ||
                    (newEndDate > existingStartDate && newEndDate <= existingEndDate) ||
                    (newStartDate <= existingStartDate && newEndDate >= existingEndDate)
                ) {
                    return res.status(403).json({
                        message: "Sorry, this spot is already booked for the specified dates",
                        errors: {
                            startDate: "Start date conflicts with an existing booking",
                            endDate: "End date conflicts with an existing booking"
                        }
                    });
                }
            }
        }

        await booking.update(updatedData);

        const response = {
            id: booking.id,
            spotId: booking.spotId,
            userId: booking.userId,
            startDate: booking.startDate,
            endDate: booking.endDate,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt
        };

        return res.status(200).json(booking)
    }
)

//delete a booking
router.delete(
    '/:bookingId',
    requireAuth,
    async (req, res) => {
        const bookingId = parseInt(req.params.bookingId, 10);

        const booking = await Booking.findByPk(bookingId);

        if(!booking) {
            return res.status(404).json({message: "Booking couldn't be found"})
        }
        const bookingData = booking.toJSON();
        if(bookingData.userId !== req.user.id) {
            
        }
        //has booking started?
        //grab date
        const today = new Date();
        //grab booking start date
        const bookingStartDate = new Date(booking.startDate);
        //if booking has started, error
        if(today >= bookingId) {
            return res.status(403).json({message: "Bookings that have been started can't be deleted"})
        }
        //delete the booking
        await booking.destroy()
        return res.status(200).json({message: "Successfully deleted"})
    }
)

module.exports = router;