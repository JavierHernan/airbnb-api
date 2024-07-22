
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteSpotThunk, manageSpotsThunk } from '../../store/spots';

import OpenModalButton from '../OpenModalButton/OpenModalButton';

import DeleteSpotConfirmationModal from '../DeleteReviewConfirmationModal/DeleteReviewConfirmationModal';
import './ManageSpots.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const ManageSpots = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const spots = useSelector(state => state.spots.userSpots)
    console.log("spots", spots)
    console.log("spots.length", spots.length)
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

    const handleClick = () => {
        navigate(`/spots/new`) //navigate to spot.id url within spots
    }

    return (
        <>
            <div>
                <h1>Manage Spots</h1>
                <button className='manage-create-button' onClick={handleClick}>Create a New Spot</button>
                {spots.length === 0 ? (
                    <div>
                        <p>You have not posted any spots yet.</p>
                        {/* <a href="/spots/new">Create a New Spot</a> */}
                    </div>
                ) : (
                    <div className="manage-list-container">
                        {spots.map(spot => (
                            <div>
                                <div className="manage-tile-container" key={spot.id} onClick={() => navigate(`/spots/${spot.id}`)}>
                                    <img className='manage-img' src={spot.previewImage} alt={spot.name} />
                                    <div className="manage-tile-content">
                                        {/* <h2>{spot.name}</h2> */}
                                        <div className='manage-spot-info'>
                                            <p>{spot.city}, {spot.state}</p>
                                            <p>${spot.price} night</p>
                                        </div>
                                        <div className='manage-ratings'>
                                            <FontAwesomeIcon icon={faStar} />
                                            {spot.avgRating ? spot.avgRating : "New"}
                                        </div>
                                    </div>
                                    <div className='manage-buttons-container'>
                                        <OpenModalButton
                                            buttonText="Delete"
                                            modalComponent={<DeleteSpotConfirmationModal
                                                // show={showModal} 
                                                onClose={closeModal}
                                                onConfirm={deleteConfirm}
                                            />}
                                        />
                                        <button className='manage-buttons' onClick={(e) => { e.stopPropagation(); update(spot.id); }}>Update</button>
                                        <button className='manage-buttons manage-delete' onClick={(e) => { e.stopPropagation(); deleteHandler(spot.id); }}>Delete</button>
                                    </div>
                                </div>
                                <div className='manage-buttons-container'>
                                        <OpenModalButton
                                            buttonText="Delete"
                                            modalComponent={<DeleteSpotConfirmationModal
                                                // show={showModal} 
                                                // onClose={closeModal}
                                                // onConfirm={deleteConfirm}
                                            />}
                                        />
                                        <button className='manage-buttons' onClick={(e) => { e.stopPropagation(); update(spot.id); }}>Update</button>
                                        <button className='manage-buttons manage-delete' onClick={(e) => { e.stopPropagation(); deleteHandler(spot.id); }}>Delete</button>
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