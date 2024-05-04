const express = require('express')
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { Sequelize, Model, DataTypes } = require('sequelize');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { Spot, Spot_Image, Review, User, Booking, Review_Image } = require('../../db/models');


const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

router.get(
    '/',
    async(req, res, next) => {
        // const {id, address, city, state, country, lat, lng, name, description, price} = req.body;
        const {id, owner_id, address, city, state, country, lat, lng, name, description, price} = req.body;

        const getAll = await Spot.findAll({
            attributes: [
                // 'user_id',
                "id",
                'owner_id',
                'address',
                'city',
                'state',
                'country',
                'lat',
                'lng',
                'name',
                'description',
                'price',
                "createdAt",
                "updatedAt"
            ],
            include: [
                // {
                //     model: User,
                //     attributes: ["id"],
                //     as: 'owner_id'
                // },
                {
                    model: Review,
                    attributes: [[Sequelize.fn('AVG', Sequelize.col('stars')), 'avgRating']]
                },
                {
                    model: Spot_Image,
                    attributes: ["preview"]
                },
            ],
            group: ['Spot.id']
        })
        // console.log("getAll", getAll)
        const response = {
            Spots: getAll.map(spot => ({
                id: spot.id,
                owner_id: spot.owner_id,
                address: spot.address,
                city: spot.city,
                state: spot.state,
                country: spot.country,
                lat: spot.lat,
                lng: spot.lng,
                name: spot.name,
                description: spot.description,
                price: spot.price,
                createdAt: spot.createdAt,
                updatedAt: spot.updatedAt,
                avgRating: spot.avgRating,
                previewImage: spot.Spot_Image ? spot.Spot_Image.preview : null
            }))
            
        } 
        // console.log("response", response)
        return res.json(response)
    }
    // return res.json(response)
)

//create

const validateSpot = [
    check('address')
        .exists({checkFalsy: true})
        .withMessage('Street address is required'),
    check('city')
        .exists({checkFalsy: true})
        .withMessage('City is required'),
    check('state')
        .exists({checkFalsy: true})
        .withMessage('State is required'),
    check('country')
        .exists({checkFalsy: true})
        .withMessage('Country is required'),
    check('lat')
        .exists({checkFalsy: true})
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({checkFalsy: true})
        .withMessage('Longitude is not valid'),
    // check('name')
    //     // .exists({checkFalsy: true})
    //     .isLength({max: 50})
    //     .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({checkFalsy: true})
        .withMessage('Description is required'),
    check('price')
        .exists({checkFalsy: true})
        .withMessage('Price per day is required'),
    handleValidationErrors
]

router.post(
    '/',
    validateSpot,
    async (req, res) => {
        const {id, owner_id, address, city, state, country, lat, lng, name, description, price} = req.body;
        
        if(name.length > 50) {
            return res.status(400).json({
                message: "Name must be less than 50 characters",
            })
        }
        
        const newSpot = await Spot.create({
            id,
            owner_id,
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        })

        return res.status(201).json(newSpot)
    }
)

//create an image to spot based on spot id
router.post(
    '/:spotId/images',
    requireAuth,
    async (req, res) => {
        // console.log("req.params",req.params)
        //grab spotId in params
        // const {spotId} = req.params;
        const spotId = parseInt(req.params.spotId, 10);
        //grab image url from req.body
        const { url, preview } = req.body;
        
        const spot = await Spot.findByPk(spotId)
        if(!spot) {
            return res.status(404).json({message: "Spot couldn't be found"})
        }

        const createImage = await Spot_Image.create({
            url,
            preview,
            spot_id: spotId
        })
        const response = {
            id: createImage.id,
            url: createImage.url,
            preview: createImage.preview
        }

        return res.status(200).json(response)
    }
)

//get all spots by current user
router.get(
    '/current',
    requireAuth,
    async (req, res) => {
        // console.log("req.user.id", req.user.id)
        const id = req.user.id; 
        

        const getSpots = await Spot.findAll({
            where: {owner_id: id},
            include: [
                {
                    model: Review,
                    attributes: [
                        [Sequelize.fn('AVG', Sequelize.col('stars')), 'avgRating']
                    ],
                    // as: 'Reviews'
                },
                {
                    model: Spot_Image,
                    attributes: ['preview'],
                    // as: 'Spot_Images'
                }
            ],
            group: ['Spot.id']
        })
        const spots = {
            Spots: getSpots.map(spot => ({
                id: spot.id,
                ownerId: spot.owner_id,
                address: spot.address,
                city: spot.city,
                state: spot.state,
                country: spot.country,
                lat: spot.lat,
                lng: spot.lng,
                name: spot.name,
                description: spot.description,
                price: spot.price,
                createdAt: spot.createdAt,
                updatedAt: spot.updatedAt,
                avgRating: spot.Reviews.length > 0 ? parseFloat(spot.Reviews[0].dataValues.avgRating) : null,
                previewImage: spot.Spot_Image ? spot.Spot_Image.preview : null
            }))
        }
        return res.status(200).json(spots)
    }
)

//get all details of spot from an id
router.get(
    '/:spotId',
    async (req,res) => {
        const {spotId} = req.params;
        //get spot details by id in params
        const spot = await Spot.findByPk(spotId);

        if(!spot) {
            return res.status(404).json({message: "Spot couldn't be found"})
        }
        //get spot images (use findAll, where)
        const spotImages = await Spot_Image.findAll({where: {spot_id: spotId }})
        //get owner details 
        const ownerDetails = await User.findByPk(spot.owner_id)
        //get # of reviews and avgRating
        const reviewDetails = await Review.findOne({
            attributes: [
                [Sequelize.fn('COUNT', Sequelize.col('review')), 'numReviews'],
                [Sequelize.fn('AVG', Sequelize.col('stars')), 'avgRating']
            ],
            where: {spot_id: spotId}
        })

       //combine everything
       const spotDetails = {
            id: spot.id,
            ownerId: spot.owner_id,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat,
            lng: spot.lng,
            name: spot.name,
            description: spot.description,
            price: spot.price,
            createdAt: spot.createdAt,
            updatedAt: spot.updatedAt,
            numReviews: reviewDetails.numReviews,
            avgRating: reviewDetails.avgRating || 0, // if no reviews
            SpotImages: {
                id: spotImages.id,
                url: spotImages.url,
                preview: spotImages.preview
            },
            Owner: {
                id: ownerDetails.id,
                firstName: ownerDetails.firstName,
                lastName: ownerDetails.lastName
            }
       }
        return res.status(200).json(spotDetails)
    }
)

//Edit
router.put(
    '/:spotId',
    requireAuth,
    validateSpot,
    async (req, res) => {
        const {name} = req.body;
        if(name.length > 50) {
            return res.status(400).json({
                message: "Name must be less than 50 characters",
            })
        }
        //get spot id
        console.log("req.params",req.params)
        const spotId = parseInt(req.params.spotId, 10);
        //get updated info
        const updates = req.body;
        //get spot
        const spot = await Spot.findByPk(spotId)
        if(!spot) {
            return res.status(404).json({message: "Spot couldn't be found"})
        }
        await spot.update(updates);
        return res.status(200).json(spot)
    }
)

//delete
router.delete(
    '/:spotId',
    requireAuth,
    async (req, res) => {
        const spotId = parseInt(req.params.spotId, 10);
        //get spot by spot id
        const spot = await Spot.findByPk(spotId);

        if(!spot) {
            return res.status(404).json({message: "Spot couldn't be found"})
        }
        await spot.destroy()
        return res.status(200).json({message: "Spot deleted successfully"})
    }
)

//get all reviews by a spot's id
router.get(
    '/:spotId/reviews',
    async (req, res) => {
        //get spotId
        const {spotId} = req.params;
        // console.log("spotId", spotId)
        const spot = await Spot.findByPk(spotId)
        if(!spot) {
            return res.status(404).json({message: "Spot couldn't be found"})
        }

        //findAll by spotId
        const allReviews = await Review.findAll({
            where: {spot_id: spotId},
            include: [
                {
                    model: User,
                    attributes: [
                        'id',
                        'firstName',
                        'lastName'
                    ]
                },
                {
                    model: Review_Image,
                    attributes: [
                        'id',
                        'url',
                    ]
                }
            ]
        })
        res.status(200).json(allReviews)
    }
)

//create review for spot based on spot.id
const reviewValidation = [
    check('review')
        .exists({checkFalsy: true})
        .withMessage('Review text is required'),
    check('stars')
        .exists({checkFalsy: true})
        .isInt({min: 1, max: 5})
        .withMessage('Stars must be an integer from 1 to 5'),
        handleValidationErrors
]
router.post(
    '/:spotId/reviews',
    reviewValidation,
    async (req, res) => {
        //get spotId
        const spotId = parseInt(req.params.spotId, 10);
        //get new review data from req.body
        const {review, stars} = req.body;
        const user_id = req.user.id
        const spot = await Spot.findByPk(spotId)
        if(!spot) {
            return res.status(404).json({message: "Spot couldn't be found"})
        }
        const existing = await Review.findOne({
            where: {
                spot_id: spotId,
                user_id: user_id
            }
        })
        if(existing) {
            return res.status(500).json({message: "User already has a review for this spot"})
        }
        const newReview = await Review.create({
            spot_id: spotId,
            user_id: user_id,
            review,
            stars
        })
        return res.status(201).json(newReview)
    }
)

//create a booking from a Spot based on Spot.id
router.post(
    '/:spotId/bookings',
    requireAuth,
    async (req, res) => {
        //grab spot by req.params
        const spotId = parseInt(req.params.spotId);
        const {start_date, end_date} = req.body;
        const userId = req.user.id;
        //find the actual spot
        const spot = await Spot.findByPk(spotId)
        if(!spot) {
            return res.status(404).json({message: "Spot couldn't be found"})
        }

        //Find existing booking
        const existingBooking = await Booking.findOne({
            where: {
                spot_id: spotId,
                [Op.or]: [
                    {
                        start_date: { [Op.between]: [start_date, end_date] }
                    },
                    {
                        end_date: { [Op.between]: [start_date, end_date] }
                    }
                ]
            }
        })
        if(existingBooking) {
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                errors: {
                    startDate: "Start date conflicts with an existing booking",
                    endDate: "End date conflicts with an existing booking"
                }
            })
        }

        //create Booking
        const newBooking = await Booking.create({
            spot_id: spotId,
            user_id: userId,
            start_date,
            end_date
        })

        const response = {
            id: newBooking.id,
            spot_id: newBooking.spot_id,
            user_id: newBooking.user_id,
            startDate: newBooking.start_date,
            endDate: newBooking.end_date,
            createdAt: newBooking.createdAt,
            updatedAt: newBooking.updatedAt
        }
        // createdAt: newBooking.getDataValue('createdAt'),
        // updatedAt: newBooking.getDataValue('updatedAt')
        return res.status(200).json(response)

    }
)

//get all bookings for a spot based on spot's id
router.get(
    '/:spotId/bookings',
    async (req,res) => {
        //grab spotId
        const spotId = parseInt(req.params.spotId)
        const spotCheck = await Spot.findByPk(spotId)
        if(!spotCheck) {
            return res.status(404).json({message: "Spot couldn't be found"})
        }
        //grab id of current
        const ownerId = req.user.id

        //grab Spot id and it's owner_id
        const spot = await Spot.findOne({
            where: {
                id: spotId,
                owner_id: ownerId
            }
        })
        let booking;
        //check if spot.owner_id is yours return all bookings for spot with extra info, if not, return all bookings of spot
        if(spot) {
            booking = await Booking.findAll({
                where: {spot_id: spotId},
                include: [{
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                }],
                attributes: ['id', 'spot_id', 'user_id', 'start_date', 'end_date', 'createdAt', 'updatedAt']
            })
        } else {
            booking = await Booking.findAll({
                where: { spot_id: spotId},
                attributes: ['spot_id', 'start_date', 'end_date']
            })
        }

       
        return res.status(200).json(booking)
    }
)


module.exports = router;