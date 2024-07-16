import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpots } from '../../store/spots';
import SpotTile from './SpotTile';
import './SpotList.css'

function SpotList() {
  const dispatch = useDispatch();
  const spots = useSelector(state => state.spots.allSpots); //
  console.log("spots",spots)

  const spotList = Object.values(spots) //converts spots object to array
  // console.log("spotList", spotList)

  useEffect(() => {
    console.log("useEffect Test SPOTLIST")
    dispatch(fetchSpots());
  }, [dispatch]);

  return (
    <div className="spot-list-container">
      {spotList.map((spot) => (
        <SpotTile key={spot.id} spot={spot} />
      ))}
    </div>
  );
}

export default SpotList;