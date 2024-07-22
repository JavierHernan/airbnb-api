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

    //hooks
    const dispatch = useDispatch();
    const { id } = useParams();
    // console.log("id", id)

    //use selector hooks
    const spot = useSelector(state => state.spots.byId[id])
    const review = useSelector(state => state.reviews)
    const allDemReviews = review.allReviews
    const sessionUser = useSelector(state => state?.session?.user)


    //state
    const [load, setLoad] = useState(false)
    const [showModal, setShowModal] = useState(false);

    //useEffect
    useEffect(() => {
        // console.log("useEffect TEST")
        const getData = async() => {
            await dispatch(fetchSpotDetails(id))
            await dispatch(fetchReviews(id))
            setLoad(true)
        }
        // if(true) {
            getData()
        // }

    }, [dispatch, load])

    //handler functions
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

    if(!load) {
        return <h1>Loading...</h1>
    } else {
        return (
            <>
                <div>
                    <div className="spot-header-container">
                        <h1>{spot.name}</h1>
                        <div>{spot.city}, {spot.state}, {spot.country}</div>
                    </div>
                    <div className="spot-images-container">
                        <img className="preview-image" src={spot?.SpotImages[0]?.url} />
                        <div className="other-images-container">
                            {spot?.SpotImages.slice(1).map((image, index) => (
                                <img className="other-image" key={index} src={image?.url} />
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
                                            {spot.avgRating ? spot.avgRating.toFixed(1) : "New"} 
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
                        <h2>Reviews</h2>
                        {/* {
    
                            (sessionUser.id !== spot.ownerId && !allDemReviews.some(review => review.userId === sessionUser.id)) && (<button onClick={handlePostReview}>Post Your Review</button>) 
                        } */}
                        {/* This works */}
                        {sessionUser && (sessionUser.id !== spot.ownerId && !allDemReviews.some(review => review.userId === sessionUser.id)) && (
                            <button className="post-review-button" onClick={handlePostReview}>Post Your Review</button>
                        )}
                        {
                            spot.numReviews > 0 && (
                                <div className="rating-reviews">
                                    <FontAwesomeIcon icon={faStar} />
                                    {spot.avgRating.toFixed(1)} · {spot.numReviews} {spot.numReviews === 1 ? 'Review' : 'Reviews'}
                                </div>
                            )
                        }
                        {/* this works */}
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
                            <>
                                <p>Be the first to post a review!</p>
                            </> 
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
        )
    }
}

export default SpotDetail;