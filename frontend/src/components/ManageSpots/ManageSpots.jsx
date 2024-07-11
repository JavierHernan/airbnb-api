import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { manageSpotsThunk } from '../../store/spots';

const ManageSpots = () => {
    const dispatch = useDispatch();
    const spots = useSelector(state => state.spots.userSpots)
    const sessionUser = useSelector(state => state.session.user)

    useEffect(() => {
        if (sessionUser) {
            dispatch(manageSpotsThunk())
        }
    }, [dispatch, sessionUser])

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
                                    <button onClick={(e) => { e.stopPropagation(); handleUpdate(spot.id); }}>Update</button>
                                    <button onClick={(e) => { e.stopPropagation(); handleDelete(spot.id); }}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}

export default ManageSpots;