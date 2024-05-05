const express = require('express')
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { Spot, Spot_Image, Review, User, Booking, Review_Image } = require('../../db/models');


const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

//get all reviews of current User
router.get(
    '/current',
    requireAuth,
    async(req,res,next) => {
        const id = req.user.id;
        const reviews = await Review.findAll({
            where: {userId: id},
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
                        'price'
                    ],
                    include: [
                        {
                            model: Spot_Image,
                            attributes: ['url']
                        }
                    ]
                },
                {
                    model: Review_Image,
                    attributes: ['id', 'url']
                }
            ]
        })
        const response = {
            Reviews: reviews.map(
                review => ({
                    id: review.id,
                    userId: review.userId,
                    spotId: review.spotId,
                    review: review.review,
                    stars: review.stars,
                    createdAt: review.createdAt,
                    updatedAt: review.updatedAt,
                    User: review.User,
                    Spot: {
                        id: review.Spot.id,
                        ownerId: review.Spot.ownerId,
                        address: review.Spot.address,
                        city: review.Spot.city,
                        state: review.Spot.state,
                        country: review.Spot.country,
                        lat: review.Spot.lat,
                        lng: review.Spot.lng,
                        name: review.Spot.name,
                        price: review.Spot.price,
                        previewImage: review.Spot.Spot_Images.length > 0 ? review.Spot.Spot_Images[0].url : null
                    },
                    ReviewImages: review.Review_Images
                }))
        }
        return res.status(200).json(response)
    }
    
)


//add image to review based on review.id
router.post(
    '/:reviewId/images',
    requireAuth,
    async (req, res) => {
        //get image url from req.body
        const {url} = req.body;
        //get id of review to create image for
        const reviewId = parseInt(req.params.reviewId, 10)

        const findReview = await Review.findByPk(reviewId)
        if(!findReview) {
            return res.status(404).json({message: "Review couldn't be found"})
        }
        const count = await Review_Image.count({
            where: {reviewId: reviewId}
        })
        if(count > 10) {
            return res.status(403).json({message: "Maximum number of images for this resource was reached"})
        }
        const reviewImage = await Review_Image.create({
            reviewId: reviewId,
            url
        },
            {
                attributes: {
                    exlude: ['createdAt', 'updatedAt', 'reviewId']
                }
            }
        )

        const response = {
            id: reviewImage.id,
            url: reviewImage.url
        }
        res.status(200).json(response)
    }
)

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
//edit review
router.put(
    '/:reviewId',
    requireAuth,
    reviewValidation,
    async (req,res) => {
        //grab updates
        const {update} = req.body
        //grab reviewId, turn into integer
        const reviewId = parseInt(req.params.reviewId, 10)
        //grab review to update, can't be const because of reassign
        let review = await Review.findByPk(reviewId)
        if(review.userId !== req.user.id) {
            return res.status(401).json({message: "Review must belong to current User"})
        }
        if(!review) {
            return res.status(404).json({message: "Review couldn't be found"})
        }

        review = await review.update(update)
        return res.status(200).json(review)
    }
)

//delete review
router.delete(
    '/:reviewId',
    requireAuth,
    async (req, res) => {
        //grab review by id in params. turn into Integer
        const reviewId = parseInt(req.params.reviewId, 10);

        //get actual review by id
        const review = await Review.findByPk(reviewId)
        if(review.userId !== req.user.id) {
            return res.status(401).json({message: "Review must belong to current User"})
        }
        if(!review) {
            return res.status(404).json({message: "Review couldn't be found"})
        }
        //DELETE REVIEW IMAGES ASSOCIATED WITH REVIEW FIRST ONDELETE:CASCADE ISN"T WORKING
        const reviewImages = await Review_Image.findAll({ where: { reviewId: review.id } });
        // await reviewImages.destroy()
        // await reviewImages.map(async (reviewImage) => {
        //     await reviewImage.destroy():
        // })
        //Must Promise and await for each image to destroy before next
        await Promise.all(reviewImages.map(async (reviewImage) => {
            await reviewImage.destroy();
        }));
        
        await review.destroy()
        return res.status(200).json({message: "Successfully deleted"})
    }
)

module.exports = router;