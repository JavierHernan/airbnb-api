import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteSpotThunk, manageSpotsThunk } from '../../store/spots';
import DeleteSpotConfirmationModal from '../DeleteReviewConfirmationModal/DeleteReviewConfirmationModal';

const ManageSpots = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const spots = useSelector(state => state.spots.userSpots)
    const sessionUser = useSelector(state => state.session.user)
    const [showModal, setShowModal] = useState(false);
    const [deleteSpot, setDeleteSpot] = useState(null);

    useEffect(() => {
        if (sessionUser) {
            dispatch(manageSpotsThunk())
        }
    }, [dispatch, sessionUser])

    const update = (spotId) => {
        navigate(`/spots/${spotId}/edit`);
    }
    const deleteHandler = (spotId) => {
        setDeleteSpot(spotId)
        setShowModal(true)
    }
    const deleteConfirm = () => {
        dispatch(deleteSpotThunk(deleteSpot)).then(() => {
            setShowModal(false)
            setDeleteSpot(null);
            dispatch(manageSpotsThunk())
        })
    }
    const closeModal = () => {
        setShowModal(false)
        setDeleteSpot(null)
    }

    return (
        <>
            <div>
                <h1>Manage Spots</h1>
                {spots.length === 0 ? (
                    <div>
                        <p>You have not posted any spots yet.</p>
                        <a href="/spots/new">Create a New Spot</a>
                    </div>
                ) : (
                    <div className="spots-list">
                        {spots.map(spot => (
                            <div className="spot-tile" key={spot.id} onClick={() => navigate(`/spots/${spot.id}`)}>
                                <img src={spot.previewImage} alt={spot.name} />
                                <div className="spot-info">
                                    <h2>{spot.name}</h2>
                                    <p>{spot.city}, {spot.state}</p>
                                    <p>${spot.price} / night</p>
                                    <button onClick={(e) => { e.stopPropagation(); update(spot.id); }}>Update</button>
                                    <button onClick={(e) => { e.stopPropagation(); deleteHandler(spot.id); }}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <DeleteSpotConfirmationModal 
                show={showModal}
                onClose={closeModal}
                onConfirm={deleteConfirm}
            />
        </>
    )
}

export default ManageSpots;