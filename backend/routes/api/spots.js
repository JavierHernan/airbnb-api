const express = require('express')
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { Sequelize, Model, DataTypes } = require('sequelize');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { Spot, Spot_Image, Review, User, Booking, Review_Image } = require('../../db/models');


const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

//Get all Spots
router.get(
    '/',
    async(req, res, next) => {
        // const {id, address, city, state, country, lat, lng, name, description, price} = req.query;
        const {id, ownerId, address, city, state, country, lat, lng, name, description, price} = req.query;
        const spots = await Spot.findAll({
            // attributes: [
            //     "id",
            //     "ownerId",
            //     "address",
            //     "city",
            //     "state",
            //     "country",
            //     "lat",
            //     "lng",
            //     "name",
            //     "description",
            //     "price",
            //     "createdAt",
            //     "updatedAt"
            // ]
        });
        let test = await spots[0].toJSON()
        console.log("test", test)
        //grab id's
        const spotIds = spots.map(spot => spot.id)
        console.log("spotIds", spotIds)

        //query reviews for Spot
        const spotReviews = await Review.findAll({
            // attributes: [
            //     'spotId',
            //     //grabs and calculates average rating
            //     // [Sequelize.fn('AVG', Sequelize.col('stars')), 'avgRating']
            //     'stars'
            // ],
            // // where: { spotId: spotIds },
            // //when using aggregate, use group by the att that is associated with parent model
            // group: ['spotId']
        });
        console.log("spotReviews", spotReviews)

        //query images for Spot
        const spotImages = await Spot_Image.findAll({
            attributes: ['spotId','url'],
            where: { spotId: spotIds, preview: true }
        });

        // create object for reviews and images. Each object should have an array of their images/reviews
        const allReviewsObj = {};
        const allImagesObj = {};

        spotReviews.forEach(review => {
            //if current spot's reviews doesn't exist
            if(!allReviewsObj[review.spotId]) {
                //create array holding spot's reviews
                allReviewsObj[review.spotId] = []
            }
            //push the reviews rating into the spot's reviews array
            allReviewsObj[review.spotId].push(review.stars)
        })

        spotImages.forEach(image => {
            //assign to each image by spotId its url.
            allImagesObj[image.spotId] = image.url;
        })

        const response = {
            Spots: []
        }

        for (const spot of spots) {
            const ratings = allReviewsObj[spot.id] || []; //there are ratings or nothing
            const totalRatings = ratings.reduce((total, rating) => total + rating, 0); //sum
            const avgRating = ratings.length > 0 ? (totalRatings / ratings.length).toFixed(1) : null; //avg. If none, then null
            const previewImage = allImagesObj[spot.id] || null; //if no image, then null. if yes, then grab url by spot.id

            response.Spots.push({
                id: spot.id,
                ownerId: spot.ownerId,
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
                avgRating: avgRating ? parseFloat(avgRating) : null, //if rating, turn into number. if not, null
                previewImage: previewImage
            });
        }

        // const response = {
        //     Spots: spots.map(spot => {
        //         //finds review and images belonging to spot
        //         const reviewsForSpot = spotReviews.filter(review => review.spotId === spot.id);
        //         const imagesForSpot = spotImages.filter(image => image.spotId === spot.id);
        //         // console.log("reviewsForSpot", reviewsForSpot, "imagesForSpot", imagesForSpot)
        //         return {
        //             id: spot.id,
        //             ownerId: spot.ownerId,
        //             address: spot.address,
        //             city: spot.city,
        //             state: spot.state,
        //             country: spot.country,
        //             lat: spot.lat,
        //             lng: spot.lng,
        //             name: spot.name,
        //             description: spot.description,
        //             price: spot.price,
        //             createdAt: spot.createdAt,
        //             updatedAt: spot.updatedAt,
        //             avgRating: reviewsForSpot.length > 0 ? parseFloat(reviewsForSpot[0].dataValues.avgRating) : null,
        //             previewImage: imagesForSpot.length > 0 ? imagesForSpot[0].url : null
        //         }
        //     })
        // };
        return res.json(response)
    }
)

//create a spot validator
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
    check('name')
        .exists({checkFalsy: true})
        .withMessage('Name is required')
        .isLength({max: 50})
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({checkFalsy: true})
        .withMessage('Description is required'),
    check('price')
        .exists({checkFalsy: true})
        .withMessage('Price per day is required')
        .isFloat({min: 0})
        .withMessage('Price per day is required'),
    handleValidationErrors
]
//create a spot
router.post(
    '/',
    requireAuth,
    validateSpot,
    async (req, res) => {
        const {id, ownerId, address, city, state, country, lat, lng, name, description, price} = req.body;//
        //get the owner id, which is current user
        const owner_Id = req.user.id;//
        if(name.length > 50) {
            return res.status(400).json({
                message: "Name must be less than 50 characters",
            })
        }
        if(!name) {
            res.status(400).json({message: "Bad request.", errors: "Name is required"})
        }
        
        const newSpot = await Spot.create({
            id,
            ownerId: owner_Id,//
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

//Add an image to spot based on spot id
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

        //check if current user is spot owner
        if(spot.ownerId !== req.user.id) {
            return res.status(401).json({message: "Spot must belong to current User"})
        }

        const createImage = await Spot_Image.create({
            url,
            preview,
            spotId: spotId
        })
        const response = {
            id: createImage.id,
            url: createImage.url,
            preview: createImage.preview
            // ownerId: spot.owner_id
        }

        return res.status(200).json(response)
    }
)

//get all spots by current user
router.get(
    '/current',
    requireAuth,
    async (req, res) => {
        const id = req.user.id; 

        const spots = await Spot.findAll({
            attributes: [
                "id",
                "ownerId",
                "address",
                "city",
                "state",
                "country",
                "lat",
                "lng",
                "name",
                "description",
                "price",
                "createdAt",
                "updatedAt"
            ],
            where: {ownerId: id}
        })
        //grab id's
        const spotIds = spots.map(spot => spot.id)

        //query reviews for Spot
        const spotReviews = await Review.findAll({
            attributes: [
                'spotId',
                //grabs and calculates average rating
                [Sequelize.fn('AVG', Sequelize.col('stars')), 'avgRating']
            ],
            where: { spotId: spotIds },
            //when using aggregate, use group by the att that is associated with parent model
            group: ['spotId']
        });
        //query images for Spot
        const spotImages = await Spot_Image.findAll({
            attributes: ['spotId','url'],
            where: { spotId: spotIds, preview: true }
        });
        // console.log("SpotReviews: ", spotReviews);
        // console.log("SpotImages: ", spotImages);
        const response = {
            Spots: spots.map(spot => {
                //finds review and images belonging to spot
                const reviewsForSpot = spotReviews.filter(review => review.spotId === spot.id);
                const imagesForSpot = spotImages.filter(image => image.spotId === spot.id);
                // console.log("reviewsForSpot", reviewsForSpot, "imagesForSpot", imagesForSpot)
                return {
                    id: spot.id,
                    ownerId: spot.ownerId,
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
                    avgRating: reviewsForSpot.length > 0 ? parseFloat(reviewsForSpot[0].dataValues.avgRating) : null,
                    previewImage: imagesForSpot.length > 0 ? imagesForSpot[0].url : null
                }
            })
        };
        return res.json(response)

        // const spots = {
        //     Spots: getSpots.map(spot => ({
        //         id: spot.id,
        //         ownerId: spot.ownerId,
        //         address: spot.address,
        //         city: spot.city,
        //         state: spot.state,
        //         country: spot.country,
        //         lat: spot.lat,
        //         lng: spot.lng,
        //         name: spot.name,
        //         description: spot.description,
        //         price: spot.price,
        //         createdAt: spot.createdAt,
        //         updatedAt: spot.updatedAt,
        //         avgRating: spot.Reviews.length > 0 ? parseFloat(spot.Reviews[0].dataValues.avgRating) : null,
        //         // previewImage: spot.Spot_Image ? spot.Spot_Image.url : null
        //         previewImage: spot.Spot_Images.length > 0 ? spot.Spot_Images[0].url : null
        //     }))
        // }
        // return res.status(200).json(spots)
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
        const spotImages = await Spot_Image.findAll({where: {spotId: spotId }})
        //get owner details 
        const ownerDetails = await User.findByPk(spot.ownerId)
        //get # of reviews and avgRating
        const reviewDetails = await Review.findOne({
            attributes: [
                [Sequelize.fn('COUNT', Sequelize.col('review')), 'numReviews'],
                [Sequelize.fn('AVG', Sequelize.col('stars')), 'avgRating']
            ],
            where: {spotId: spotId}
        })

       //combine everything
       const spotDetails = {
            id: spot.id,
            ownerId: spot.ownerId,
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
            avgRating: reviewDetails.avgRating || "Currently no reviews for this spot", // if no reviews
            SpotImages: spotImages.map(image => ({
                id: image.id,
                url: image.url,
                preview: image.preview
            })),
            // {
            //     id: spotImages.id,
            //     url: spotImages.url,
            //     preview: spotImages.preview
            // },
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
        
        //get spot id
        // console.log("req.params",req.params)
        const spotId = parseInt(req.params.spotId, 10);
        //get updated info
        const updates = req.body;
        //get spot
        const spot = await Spot.findByPk(spotId)
        if(!spot) {
            return res.status(404).json({message: "Spot couldn't be found"})
        }
        if(spot.ownerId !== req.user.id) {
            return res.status(401).json({message: "Spot must belong to current User"})
        }
        if(name.length > 50) {
            return res.status(400).json({
                message: "Name must be less than 50 characters",
            })
        }
        if(!name) {
            res.status(400).json({message: "Bad request.", errors: "Name is required"})
        }
        await spot.update(updates);
        return res.status(200).json(spot)
    }
)

//delete a spot
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
        if(spot.ownerId !== req.user.id) {
            return res.status(401).json({message: "Spot must belong to current User"})
        }

        const reviews = await Review.findAll({
            where: { spotId: spotId }
        });
        //DESTROY ALL STUFF ASSOCIATED WITH THE SPOT FIRSSTTT!!!!
        const bookings = await Booking.findAll({ where: { spotId: spotId } });
        // await Promise.all(bookings.map(booking => booking.destroy()));
        bookings.map(booking => booking.destroy())

        const spotImages = await Spot_Image.findAll({ where: { spotId: spotId } });
        // await Promise.all(spotImages.map(spotImage => spotImage.destroy()));
        spotImages.map(spotImage => spotImage.destroy())

        // await Promise.all(reviews.map(async (review) => {
        //     const reviewImages = await Review_Image.findAll({ where: { reviewId: review.id } });
        //     await Promise.all(reviewImages.map(reviewImage => reviewImage.destroy()));
        // }));
        reviews.map((review) => {
            const reviewImages = Review_Image.findAll({ where: { reviewId: review.id } });
            reviewImages.map(reviewImage => reviewImage.destroy());
        })

        // await Promise.all(reviews.map(review => review.destroy()));
        reviews.map(review => review.destroy())

        //FINALLY YOU CAN DESTORY THE SPOT
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
            where: {spotId: spotId},
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
        const response = {
            Reviews: allReviews.map(review => ({
                id: review.id,
                userId: review.userId,
                spotId: review.spotId,
                review: review.review,
                stars: review.stars,
                createdAt: review.createdAt,
                updatedAt: review.updatedAt,
                User: {
                    id: review.User.id,
                    firstName: review.User.firstName,
                    lastName: review.User.lastName
                },
                ReviewImages: review.Review_Images.map(image => ({
                    id: image.id,
                    url: image.url
                }))
            }))
        }
        res.status(200).json(response)
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
        const userId = req.user.id
        const spot = await Spot.findByPk(spotId)
        if(!spot) {
            return res.status(404).json({message: "Spot couldn't be found"})
        }
        const existing = await Review.findOne({
            where: {
                spotId: spotId,
                userId: userId
            }
        })
        if(existing) {
            return res.status(500).json({message: "User already has a review for this spot"})
        }
        const newReview = await Review.create({
            spotId: spotId,
            userId: userId,
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
        const {startDate, endDate} = req.body;
        const userId = req.user.id;
        //find the actual spot
        const spot = await Spot.findByPk(spotId)
        if(!spot) {
            return res.status(404).json({message: "Spot couldn't be found"})
        }

        // const startDate = new Date(startDate);
        // const endDate = new Date(endDate);
        // console.log("start_date", startDate)
        // console.log("end_date", endDate)
        // console.log("startDate", startDate)
        // console.log("endDate", endDate)
        if (endDate <= startDate) {
            return res.status(403).json({ message: "End date must come after start date" });
        }
        // if(spot.user_id !== req.user.id) {
        //     return res.status(403).json({message: "Spot must belong to current User"})
        // }
        

        if (endDate <= startDate) {
            return res.status(403).json({ message: "End date must come after start date" });
        }

        //Find existing booking
        const existingBooking = await Booking.findOne({
            where: {
                spotId: spotId,
                [Op.or]: [
                    {
                        startDate: { [Op.between]: [startDate, endDate] }
                    },
                    {
                        endDate: { [Op.between]: [startDate, endDate] }
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
            spotId: spotId,
            userId: userId,
            startDate,
            endDate
        })

        const response = {
            id: newBooking.id,
            spotId: newBooking.spotId,
            userId: newBooking.userId,
            startDate: newBooking.startDate,
            endDate: newBooking.endDate,
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
                ownerId: ownerId
            }
        })
        let booking;
        //check if spot.owner_id is yours return all bookings for spot with extra info, if not, return all bookings of spot
        if(spot && spot.ownerId === ownerId) {
            booking = await Booking.findAll({
                where: {spotId: spotId},
                include: [{
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                }],
                attributes: ['id', 'spotId', 'userId', 'startDate', 'endDate', 'createdAt', 'updatedAt']
            })
        } else if(spot && spot.ownerId !== ownerId) {
            booking = await Booking.findAll({
                where: { spotId: spotId},
                attributes: ['spotId', 'startDate', 'endDate']
            })
            return res.status(200).json({Bookings: booking})
        }

       
        return res.status(200).json({Bookings: booking})
    }
)

//add query filter to get all spots



module.exports = router;