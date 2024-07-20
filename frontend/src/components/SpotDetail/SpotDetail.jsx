import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams} from "react-router-dom";
import { fetchSpotDetails } from "../../store/spots";
import { fetchReviews} from "../../store/reviews";
import { deleteReviewThunk } from '../../store/reviews';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import ReviewComponent from "../Review/Review";
import CreateReviewFormModal from "../CreateReviewModal/CreateReviewFormModal";
import './SpotDetail.css';


function SpotDetail() {
    const dispatch = useDispatch();
    const { id } = useParams();
    const [load, setLoad] = useState(false)
    const [showModal, setShowModal] = useState(false);
    // console.log("id", id)

    useEffect(() => {
        // console.log("useEffect TEST")
        dispatch(fetchReviews(id))
        dispatch(fetchSpotDetails(id)).then(() => {
            setLoad(true)
        })
    }, [dispatch, id, showModal])

    const spot = useSelector(state => state?.spots?.byId[id]) //write conditional if no spot, redirect to home
    //if here
    // if(spot === undefined) {
    //     navigate(`/`)
    // }
    console.log("spot", spot)
    console.log("spot.SpotImages", spot?.SpotImages)
    // console.log("spot123", spot)
    const review = useSelector(state => state?.reviews)
    // console.log("reviews REVIEW", review)
    // console.log("review.allReviews", review?.allReviews)
    const allDemReviews = review.allReviews
    // console.log("ALLDEMREVIEWS", allDemReviews)
    // console.log("allDemReviews[0].userId", allDemReviews[0]?.userId)
    const sessionUser = useSelector(state => state?.session?.user)
    // console.log("SESSIONUSER", sessionUser)
    // console.log("SEssionUser.id", sessionUser.id)
    // console.log("TERNARY TEST",sessionUser.id !== spot.ownerID && !allDemReviews.some(review => review.userID === sessionUser.id))
    const handleReserve = () => {
        alert("Feature coming soon")
    }
    const handlePostReview = () => {
        setShowModal(true)
    }
    const handleCloseModal = () => {
        setShowModal(false);
    };
    const handleReviewSubmit = async () => {
        // const response = await dispatch(createReview(id, newReview));
        // if (response) {
            await dispatch(fetchSpotDetails(id)); // Fetch updated spot details
            await dispatch(fetchReviews(id)); // Fetch updated reviews
        // }
        setShowModal(false);
    };

    const handleReviewDelete = async (reviewId) => {
        await dispatch(deleteReviewThunk(reviewId));
        await dispatch(fetchSpotDetails(id)); // Fetch updated spot details
        await dispatch(fetchReviews(id)); // Fetch updated reviews
    };

    // sorts reviews by newest
    const sortedReviews = allDemReviews.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return load ? (
        <>
            <div>
                <div className="spot-header-container">
                    <h1>{spot.name}</h1>
                    <div>{spot.city}, {spot.state}, {spot.country}</div>
                </div>
                <div className="spot-images-container">
                    <img className="preview-image" src={spot?.SpotImages[0].url} />
                    <div className="other-images-container">
                        {spot?.SpotImages.slice(1).map((image, index) => (
                            <img className="other-image" key={index} src={image.url} />
                        ))}
                    </div>
                </div>
                <div className="spot-details-section-container">
                    <div className="details-text-container">
                        <p className="hosted">Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</p>
                        <p className="description">{spot.description}</p>
                    </div>
                    <div className="details-reserve-container">
                        <div className="details-box">
                            <div className="details">
                                <div className="details-inner">
                                    <div className="reserve-price-container">
                                        <p className="price-text">{spot.price} night</p>
                                    </div>
                                    <div className="reserve-review-container">
                                        <FontAwesomeIcon icon={faStar} /> 
                                        {spot.avgRating ? spot.avgRating : "New"} 
                                        {spot.numReviews > 0 && (
                                            <>
                                                <p className="details-box-review-text">·</p>
                                                <p className="details-box-review-text">
                                                    {spot.numReviews} {spot.numReviews === 1 ? "Review" : "Reviews"}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                                
                                
                            </div>
                            <div className="reserve-button-container">
                            <button className="reserve-button" onClick={handleReserve}>Reserve</button>

                            </div>
                        </div>
                    </div>
                    
                </div>
                
                <div className="review-section-container">
                    {/* <h2>Reviews</h2> */}
                    {/* {

                        (sessionUser.id !== spot.ownerId && !allDemReviews.some(review => review.userId === sessionUser.id)) && (<button onClick={handlePostReview}>Post Your Review</button>) 
                    } */}
                    {sessionUser && (sessionUser.id !== spot.ownerId && !allDemReviews.some(review => review.userId === sessionUser.id)) && (
                        <button onClick={handlePostReview}>Post Your Review</button>
                    )}
                    {
                        spot.numReviews > 0 && (
                            <div className="rating-reviews">
                                <FontAwesomeIcon icon={faStar} />
                                {spot.avgRating} · {spot.numReviews} {spot.numReviews === 1 ? 'Review' : 'Reviews'}
                            </div>
                        )
                    }
                    {/* {review.allReviews.length > 0 ? ( //SHOWS REVIEWS
                        review.allReviews.map((review, index) => (
                            // <div key={index}>
                            //     <p>{review.User.firstName} firstNameIndicator</p>
                            //     <p>{new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
                            //     <p>{review.review} reviewIndicator</p>
                            //     <p>{review.stars} stars</p>
                            // </div> //move to Review.jsx
                            <ReviewComponent //REVIEW TEMPLATE FOR SHOWING REVIEWS
                                key={index}
                                review={review}
                                sessionUser={sessionUser}
                                onDelete={handleReviewDelete}
                            />
                        ))
                    ) : (
                        <p>Be the first to post a review!</p>
                    )}             */}
                    {/* Newest Review is displayed */}
                    {sortedReviews.length > 0 ? (
                        sortedReviews.map((review, index) => (
                            <ReviewComponent
                                key={index}
                                review={review}
                                sessionUser={sessionUser}
                                onDelete={handleReviewDelete}
                            />
                        ))
                    ) : (
                        <p>Be the first to post a review!</p>
                    )}
                </div>
            </div>
            {showModal && 
                <CreateReviewFormModal 
                    spotId={id} 
                    onClose={handleCloseModal} 
                    onReviewSubmit={handleReviewSubmit}
                />
            } 
            {/* ^^POSTING A REVIEW^^ */}
        </>
    ) : (
        <h1>Loading...</h1>
    )
}

export default SpotDetail;