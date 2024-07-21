import './DeleteSpotConfirmationModal.css';

const DeleteSpotConfirmationModal = ({show, onClose, onConfirm}) => {
    if (!show) {
        return null;
    }

    return (
        <div className='delete-spot-outer'>
            <div >
                <h2>Confirm Delete</h2>
                <p>Are you sure you want to remove this spot?</p>
                <button onClick={onConfirm}>Yes (Delete Spot)</button>
                <button onClick={onClose}>No (Keep Spot)</button>
            </div>
        </div>
    );
}

export default DeleteSpotConfirmationModal;