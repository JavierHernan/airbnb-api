import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchSpotDetails } from "../../store/spots";
import { fetchReviews } from "../../store/reviews";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

function SpotDetail() {
    const dispatch = useDispatch();
    const { id } = useParams();
    const [load, setLoad] = useState(false)
    // console.log("id", id)

    useEffect(() => {
        // console.log("useEffect TEST")
        dispatch(fetchReviews(id))
        dispatch(fetchSpotDetails(id)).then(() => {
            setLoad(true)
        })
    }, [dispatch, id])

    const spot = useSelector(state => state.spots.byId[id])
    console.log("spot123", spot)
    const review = useSelector(state => state.reviews)
    // console.log("reviews REVIEW", review)

    const handleReserve = () => {
        alert("Feature coming soon")
    }

    return load ? (
        <>
            <div>
                <h1>{spot.name}</h1>
                <div>{spot.city}, {spot.state}, {spot.country}</div>
                <div>
                    <img src={spot.preview} />
                    <div>
                        {spot.SpotImages.map((image, index) => (
                            <img key={index} src={image} />
                        ))}
                    </div>
                </div>
                <p>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</p>
                <p>{spot.description}</p>
                <div>
                    <p>{spot.price} night</p>
                    <button onClick={handleReserve}>Reserve</button>
                </div>
                <div>
                    <FontAwesomeIcon icon={faStar} /> 
                    {spot.avgRating ? spot.avgRating : "New"} 
                    {spot.numReviews > 0 && (
                        <>
                            <p>-</p>
                            <p>
                                {spot.numReviews} {spot.numReviews === 1 ? "Review" : "Reviews"}
                            </p>
                        </>
                    )}
                </div>
                <div>
                    <h2>Reviews</h2>
                    {
                        spot.numReviews > 0 && (
                            <div>
                                <FontAwesomeIcon icon={faStar} />
                                {spot.avgRating} · {spot.numReviews} {spot.numReviews === 1 ? 'Review' : 'Reviews'}
                            </div>
                        )
                    }
                    {review.allReviews.length > 0 ? (
                        review.allReviews.map((review, index) => (
                            <div key={index}>
                                <p>{review.User.firstName} firstNameIndicator</p>
                                <p>{new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
                                <p>{review.review} reviewIndicator</p>
                                <p>{review.stars} stars</p>
                            </div>
                        ))
                    ) : (
                        <p>Be the first to post a review!</p>
                    )}            
                </div>
            </div>
        </>
    ) : (
        <h1>Loading...</h1>
    )
}

export default SpotDetail;