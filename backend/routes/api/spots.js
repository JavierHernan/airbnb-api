const express = require('express')
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { Sequelize, Model, DataTypes } = require('sequelize');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { Spot, Spot_Image, Review, User, Booking, Review_Image } = require('../../db/models');


const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const queryValidation = [
    check('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be greater than or equal to 1'),
    check('size')
        .optional()
        .isInt({ min: 1 }).withMessage('Size must be greater than or equal to 1'),
    check('lat')
        .optional()
        .isFloat({ min: -90}).withMessage('Minimum latitude is invalid')
        .isFloat({max: 90}).withMessage('Maximum latitude is invalid'),

        // .isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
    check('lng')
        .optional()
        .isFloat({ min: -180}).withMessage('Minimum longitude is invalid')
        .isFloat({max: 180}).withMessage('Maximum longitude is invalid'),

        // .isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
    check('price')
        .optional()
        .isFloat({ min: 0 }).withMessage('Minimum price must be greater than or equal to 0'),
]

//Get all Spots
router.get(
    '/',
    queryValidation,
    async(req, res, next) => {
        // const {id, address, city, state, country, lat, lng, name, description, price} = req.query;
        const {id, ownerId, address, city, state, country, lat, lng, name, description, price, page, size} = req.query;
        
        //convert
        const pageNumber = parseInt(page) || 1;
        const sizeNumber = parseInt(size) || 20;

        if (pageNumber < 1) return res.status(400).json({ message: "Page must be greater than or equal to 1" });
        if (sizeNumber < 1) return res.status(400).json({ message: "Size must be greater than or equal to 1" });
        
        //search queries
        const filters = {};
        if (id) filters.id = id;
        if (ownerId) filters.ownerId = ownerId;
        if (address) filters.address = address;
        if (city) filters.city = city;
        if (state) filters.state = state;
        if (country) filters.country = country;
        if (lat) filters.lat = lat;
        if (lng) filters.lng = lng;
        if (name) filters.name = name;
        if (description) filters.description = description;
        if (price) filters.price = price;
        
        //pagination
        const spots = await Spot.findAll({
            where: filters,
            limit: sizeNumber,
            offset: sizeNumber * (pageNumber - 1)
        });
        
        let test = await spots[0].toJSON()
        console.log("test", test)
        //grab id's
        const spotIds = spots.map(spot => spot.id)
        console.log("spotIds", spotIds)

        //query reviews for Spot
        const spotReviews = await Review.findAll({});
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
        //add page and size
        response.page = pageNumber;
        response.size = sizeNumber;
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
    check('previewImage')
        .optional({ nullable: true }) // Only the first image URL is required
        .isURL()
        .withMessage('Must include valid Preview Image URL'),
    handleValidationErrors
]
//create a spot
router.post(
    '/',
    requireAuth,
    validateSpot,
    async (req, res, next) => {
        try {
            const {
                country,
                address,
                city,
                state,
                description,
                name,
                price,
                lat,
                lng,
                previewImage,
                img1,
                img2,
                img3,
                img4,
                img5,
            } = req.body;
            
            //get the owner id, which is current user
            const ownerId = req.user.id;//
            if(name.length > 50) {
                return res.status(400).json({
                    message: "Name must be less than 50 characters",
                })
            }
    
            const spotExists = await Spot.findOne({
                where: {
                    address,
                    city,
                    state,
                    country
                }
            })
            if (spotExists) {
                return res.status(400).json({
                    message: "This Spot already exists",
                });
            }
            const newSpot = await Spot.create({
                ownerId: ownerId,
                address,
                city,
                state,
                country,
                lat,
                lng,
                name,
                description,
                price,
            })
    
            if(newSpot) {
                //create images
                if(previewImage) {
                    const spotPreviewImage = await Spot_Image.create({
                        url: previewImage,
                        preview: true,
                        spotId: newSpot.id,
                    });
                    const spotImages = [];
                    if(img1){
                        const spotimg1 = await Spot_Image.create({
                            url: img1,
                            preview: false,
                            spotId: newSpot.id,
                        });
                        spotImages.push(spotimg1)
                    }
                    if(img2){
                        const spotimg2 = await Spot_Image.create({
                            url: img2,
                            preview: false,
                            spotId: newSpot.id,
                        });
                        spotImages.push(spotimg2)
                    }
                    if(img3){
                        const spotimg3 = await Spot_Image.create({
                            url: img3,
                            preview: false,
                            spotId: newSpot.id,
                        });
                        spotImages.push(spotimg3)
                    }
                    if(img4){
                        const spotimg4 = await Spot_Image.create({
                            url: img4,
                            preview: false,
                            spotId: newSpot.id,
                        });
                        spotImages.push(spotimg4)
                    }
                    if(img5){
                        const spotimg5 = await Spot_Image.create({
                            url: img5,
                            preview: false,
                            spotId: newSpot.id,
                        });
                        spotImages.push(spotimg5)
                    }
    
                    const {ownerId, ...spotKeys} = await newSpot.toJSON();
                    const createdUser = await User.findByPk(ownerId);
    
                    res.status(201)
                    return res.json({
                        Owner: createdUser,
                        ...spotKeys,
                        previewImage,
                        SpotImages: [
                            previewImage,
                            ...spotImages
                        ]
                    })
                }
            }
            res.status(500);
            throw new Error("Internal Server Error")
        } catch (e) {
            next(e)
        }
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
        if (isNaN(req.params.spotId)) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }
        const spotId = parseInt(req.params.spotId, 10);
        //grab image url from req.body
        const { url, preview } = req.body;
        
        const spot = await Spot.findByPk(spotId)
        // console.log("spot", spot)
        // console.log("req.user.id", req.user.id)
        if(!spot) {
            return res.status(404).json({message: "Spot couldn't be found"})
        }

        //check if current user is spot owner
        const spotData = spot.toJSON()
        if(spotData.ownerId !== req.user.id) {
            // console.log("spot", spot)
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

        return res.status(201).json(response)
    }
)

//get all spots by current user
router.get(
    '/current',
    requireAuth,
    async (req, res) => {
        const id = req.user.id; 
        console.log("id", id)

        const spots = await Spot.findAll({
            where: {ownerId: id}
        })
        console.log("spots", spots)
        //grab id's
        const spotIds = spots.map(spot => spot.id)

        //query reviews for Spot
        const spotReviews = await Review.findAll({
            attributes: ['spotId', 'stars'],
            where: { spotId: spotIds }
        });
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
        console.log("allReviewsObj", allReviewsObj)
        console.log("allImagesObj", allImagesObj)
        const response = {
            Spots: []
        }

        for (const spot of spots) {
            const ratings = allReviewsObj[spot.id] || []; //there are ratings or nothing
            const totalRatings = ratings.reduce((total, rating) => total + rating, 0); //sum
            const avgRating = ratings.length > 0 ? (totalRatings / ratings.length).toFixed(1) : "NEW"; //avg. If none, then null
            console.log("avgRating", avgRating)
            const previewImage = allImagesObj[spot.id] || "NEW"; //if no image, then null. if yes, then grab url by spot.id

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
        
        return res.json(response)
    }
)

//get all details of spot from an id
router.get(
    '/:spotId',
    async (req,res) => {
        const {spotId} = req.params;
        // const {spotId} = req.query;
        console.log("spotId",spotId)

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
        const reviews = await Review.findAll({ where: { spotId: spotId } });
        // Calculate number of reviews and average rating
        const numReviews = reviews.length;
        let avgRating;
        if(numReviews > 0) {
            avgRating = numReviews > 0 ? reviews.reduce((sum, review) => sum + review.stars, 0) / numReviews : "NEW";
        }
        
        // const reviewDetails = await Review.findOne({
        //     attributes: [
        //         [Sequelize.fn('COUNT', Sequelize.col('review')), 'numReviews'],
        //         [Sequelize.fn('AVG', Sequelize.col('stars')), 'avgRating']
        //     ],
        //     where: {spotId: spotId}
        // })

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
            // numReviews: numReviews,
            numReviews: reviews.length > 0 ? numReviews : "NEW",
            avgRating: avgRating,
            SpotImages: spotImages.map((image, index) => ({
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

//Edit a spot
router.put(
    '/:spotId',
    requireAuth,
    validateSpot,
    async (req, res) => {
        const {name} = req.body;
        
        //get spot id
        // console.log("req.params",req.params)
        const spotId = parseInt(req.params.spotId);
        //get updated info
        const updates = req.body;
        //get spot
        const spot = await Spot.findByPk(spotId)
        if(!spot) {
            return res.status(404).json({message: "Spot couldn't be found"})
        }
        const spotData = spot.toJSON();
        if(spotData.ownerId !== req.user.id) {
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
        try {
            // const spot = await Spot.findByPk(spotId);

            // if (!spot) {
            //     return res.status(404).json({ message: "Spot couldn't be found" })
            // }
            // if (spot.ownerId !== req.user.id) {
            //     return res.status(401).json({ message: "Spot must belong to current User" })
            // }

            // const reviews = await Review.findAll({
            //     where: { spotId: spotId }
            // });
            // //DESTROY ALL STUFF ASSOCIATED WITH THE SPOT FIRSSTTT!!!!
            // const bookings = await Booking.findAll({ where: { spotId: spotId } });
            // // await Promise.all(bookings.map(booking => booking.destroy()));
            // bookings.map(booking => booking.destroy())

            // const spotImages = await Spot_Image.findAll({ where: { spotId: spotId } });
            // // await Promise.all(spotImages.map(spotImage => spotImage.destroy()));
            // spotImages.map(spotImage => spotImage.destroy())

            // // await Promise.all(reviews.map(async (review) => {
            // //     const reviewImages = await Review_Image.findAll({ where: { reviewId: review.id } });
            // //     await Promise.all(reviewImages.map(reviewImage => reviewImage.destroy()));
            // // }));
            // reviews.map((review) => {
            //     const reviewImages = Review_Image.findAll({ where: { reviewId: review.id } });
            //     reviewImages.map(reviewImage => reviewImage.destroy());
            // })

            // // await Promise.all(reviews.map(review => review.destroy()));
            // reviews.map(review => review.destroy())

            // //FINALLY YOU CAN DESTORY THE SPOT
            // await spot.destroy()
            // return res.status(200).json({ message: "Successfully deleted" })

            // Get spot by spot id
            const spot = await Spot.findByPk(spotId);

            if (!spot) {
                return res.status(404).json({ message: "Spot couldn't be found" });
            }
            if (spot.ownerId !== req.user.id) {
                return res.status(401).json({ message: "Spot must belong to current User" });
            }

            // Destroy all associated entities
            const reviews = await Review.findAll({ where: { spotId: spotId } });
            const bookings = await Booking.findAll({ where: { spotId: spotId } });
            const spotImages = await Spot_Image.findAll({ where: { spotId: spotId } });

            console.log('Bookings:', bookings);
            console.log('Spot Images:', spotImages);
            console.log('Reviews:', reviews);

            // Destroy bookings
            await Promise.all(bookings.map(booking => booking.destroy()));

            // Destroy spot images
            await Promise.all(spotImages.map(spotImage => spotImage.destroy()));

            // Destroy review images and reviews
            await Promise.all(reviews.map(async (review) => {
                const reviewImages = await Review_Image.findAll({ where: { reviewId: review.id } });
                console.log('Review Images for review ID', review.id, ':', reviewImages);
                await Promise.all(reviewImages.map(reviewImage => reviewImage.destroy()));
                await review.destroy();
            }));

            // Finally, destroy the spot
            await spot.destroy();

            return res.status(200).json({ message: "Successfully deleted" });
        } catch (error) {
            console.error('Error deleting spot:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }        
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
    requireAuth,
    async (req, res) => {
        //get spotId
        const spotId = parseInt(req.params.spotId, 10);
        // console.log("BACKEND SPOTID", spotId)
        //get new review data from req.body
        const {review, stars} = req.body;
        console.log("BACKEND REQ.BODY", req.body)
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
        // if (isNaN(req.params.spotId)) {
        //     return res.status(404).json({ message: "Spot couldn't be found" });
        // }
        //grab spot by req.params
        const spotId = parseInt(req.params.spotId);
        const {startDate, endDate} = req.body;
        const userId = req.user.id;

        //must have startDate and endDate
        if(!startDate || !endDate) {
            return res.status(400).json({message: "must have a startDate and endDate"})
        }
        //find the actual spot
        const spot = await Spot.findByPk(spotId)
        if(!spot) {
            return res.status(404).json({message: "Spot couldn't be found"})
        }
        const spotData = spot.toJSON()
        if(spotData.ownerId === req.user.id) {
            return res.status(401).json({message: "Spot must not belong to current User"})
        }

        // const startDate = new Date(startDate);
        // const endDate = new Date(endDate);
        // console.log("start_date", startDate)
        // console.log("end_date", endDate)
        // console.log("startDate", startDate)
        // console.log("endDate", endDate)
        const formattedStartDate = new Date(startDate);
        const formattedEndDate = new Date(endDate);
        if (formattedEndDate <= formattedStartDate) {
            // return res.status(403).json({ message: "End date must come after start date" });
            return res.status(403).json({ message: "Bad Request",  errors: "endDate cannot be on or before startDate" });

        }
        // if(spot.user_id !== req.user.id) {
        //     return res.status(403).json({message: "Spot must belong to current User"})
        // }
        
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
        return res.status(201).json(response)
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
            if(!booking) {
                return res.status(404).json({message: "There are no bookings for this Spot"})
            }
        } else if(spot && spot.ownerId !== ownerId) {
            booking = await Booking.findAll({
                where: { spotId: spotId},
                attributes: ['spotId', 'startDate', 'endDate']
            })
            if(!booking) {
                return res.status(404).json({message: "There are no bookings for this Spot"})
            }
            return res.status(200).json({Bookings: booking})
        }

       
        return res.status(200).json({Bookings: booking})
    }
)

//add query filter to get all spots



module.exports = router;