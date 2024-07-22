import { useState } from 'react';
import DeleteReviewConfirmationModal from '../DeleteReviewConfirmationModal/DeleteReviewConfirmationModal';
import './Review.css';


const ReviewComponent = ({ review, sessionUser, onDelete }) => {
    // const sessionUser = useSelector(state => state.session.user);
    const [showModal, setShowModal] = useState(false);

    const handleDeleteClick = () => {
        setShowModal(true);
    };

    const handleConfirmDelete = () => {
        // dispatch(deleteReviewThunk(review.id)).then(() => {
        //     setShowModal(false);
        // });
        onDelete(review.id); // Call the onDelete function with the review id
        setShowModal(false);
    };

    const handleCloseModal = () => {
        onDelete(review.id);
        setShowModal(false);
    };

    return (
        <>
            <div className='review-container'>
                <div className="review-tile">
                <p className='review-name'>{review?.User?.firstName}</p>
                <div className='review-date-rating'>
                    <p className='review-date'>{new Date(review?.createdAt)?.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
                    <p className='review-rating'>{review?.stars} stars</p>
                </div>
                
                <p className='review'>{review?.review}</p>
                
                {sessionUser && sessionUser?.id === review?.userId && (
                    <button className='review-delete' onClick={handleDeleteClick}>Delete</button>
                )}
                <DeleteReviewConfirmationModal
                    show={showModal}
                    onClose={handleCloseModal}
                    onConfirm={handleConfirmDelete}
                    title="Confirm Delete"
                    message="Are you sure you want to delete this review?"
                    confirmText="Yes (Delete Review)"
                    cancelText="No (Keep Review)"
                />
                </div>
            </div>
            
        </>
    );
}

export default ReviewComponent;