import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpots } from '../store/spots';
import SpotTile from './SpotTile';

function SpotList() {
  const dispatch = useDispatch();
  const spots = useSelector(state => state.spots);

  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch]);

  return (
    <div className="spot-list">
      {spots.map(spot => (
        <SpotTile key={spot.id} spot={spot} />
      ))}
    </div>
  );
}

export default SpotList;