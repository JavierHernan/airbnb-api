import { useState } from "react";
import { useDispatch } from "react-redux";
import { createReview } from "../../store/reviews";


function CreateReviewFormModal({spotId, onClose}) {
    const dispatch = useDispatch();
    const [review, setReview] = useState('');
    const [stars, setStars] = useState(0);
    const [errors, setErrors] = useState([]);
    const sessionUser = useSelector(state => state.session.user);
    const [showModal, setShowModal] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newReview = {
            review,
            stars
        };
        const response = await dispatch(createReview(spotId, newReview));
        console.log("REVIEW MODAL RESPONSE", response)
        // if(response.errors) {
        //     setErrors(response.errors)
        // } else {
        //     onClose()
        // }
    }

    return (
        <>
            <div>
                <h2>How was your stay?</h2>
                {/* {errors.length > 0 && (
                    <ul>
                        {errors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                )} */}
                <form onSubmit={handleSubmit}>
                    <textarea 
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder="Leave your review here..."
                    />
                    <div>
                        <input 
                            type="number"
                            value={stars}
                            onChange={(e) => setStars(Number(e.target.value))}
                            min="1"
                            max="5"
                        />
                        <label>Stars</label>
                    </div>
                    <button type="submit" disabled={review.length < 10 || stars === 0}>
                        Submit Your Review
                    </button>
                </form>
                <button onClick={onClose}>Close</button>
            </div>
        </>
    )
}

export default CreateReviewFormModal;