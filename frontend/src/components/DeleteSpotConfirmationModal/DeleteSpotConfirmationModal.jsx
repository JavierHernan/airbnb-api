import './DeleteSpotConfirmationModal.css';

const DeleteSpotConfirmationModal = ({ onClose, onConfirm}) => {
    // if (!show) {
    //     return null;
    // }

    return (
        <div className='delete-spot-outer'>
            <div className='delete-confirm-container'>
                <h2 className='delete-confirm-h2'>Confirm Delete</h2>
                <p className='delete-confirm-p'>Are you sure you want to remove this spot?</p>
                <button className='delete-confirm-yes' onClick={onConfirm}>Yes (Delete Spot)</button>
                <button className='delete-confirm-no' onClick={onClose}>No (Keep Spot)</button>
            </div>
        </div>
    );
}

export default DeleteSpotConfirmationModal;