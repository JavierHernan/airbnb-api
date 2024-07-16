import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteReviewThunk } from '../../store/reviews';
import DeleteReviewConfirmationModal from '../DeleteReviewConfirmationModal/DeleteReviewConfirmationModal';

const ReviewComponent = ({ review }) => {
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);
    const [showModal, setShowModal] = useState(false);

    const handleDeleteClick = () => {
        setShowModal(true);
    };

    const handleConfirmDelete = () => {
        dispatch(deleteReviewThunk(review.id)).then(() => {
            setShowModal(false);
        });
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <>
            <div className="review-tile">
            <p>{review?.User?.firstName} firstNameIndicator</p>
            <p>{new Date(review?.createdAt)?.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
            <p>{review?.review} reviewIndicator</p>
            <p>{review?.stars} stars</p>
            {sessionUser && sessionUser?.id === review?.userId && (
                <button onClick={handleDeleteClick}>Delete</button>
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
        </>
    );
}

export default ReviewComponent;