import React from 'react';

const DeleteReviewConfirmationModal = ({ show, onClose, onConfirm, title, message, confirmText, cancelText }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{title}</h2>
                <p>{message}</p>
                <button className="btn btn-red" onClick={onConfirm}>{confirmText}</button>
                <button className="btn btn-grey" onClick={onClose}>{cancelText}</button>
            </div>
        </div>
    );
}

export default DeleteReviewConfirmationModal;