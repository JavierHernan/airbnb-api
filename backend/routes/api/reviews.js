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
        const getAll = await Review.findAll({
            where: {user_id: id},
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
                        'owner_id',
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
        return res.status(200).json(getAll)
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

        const reviewImage = await Review_Image.create({
            review_id: reviewId,
            url
        },
            {
                attributes: {
                    exlude: ['createdAt', 'updatedAt', 'review_id']
                }
            }
        )

        const count = await Review_Image.count({
            where: {review_id: reviewId}
        })
        if(count > 10) {
            return res.status(403).json({message: "Maximum number of images for this resource was reached"})
        }
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
        if(!review) {
            return res.status(404).json({message: "Review couldn't be found"})
        }

        await review.destroy()
        return res.status(200).json({message: "Successfully deleted"})
    }
)

module.exports = router;