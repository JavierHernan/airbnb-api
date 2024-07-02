import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';


function SpotTile({spot}) {
    const navigate = useNavigate();
    
    const handleClick = () => {
        navigate(`/spots/${spot.id}`) //navigate to spot.id url within spots
    }

    return (
        <>
        {/* title= spot.name is to be used in tooltip. tooltip being a css styling with text displayed onHover */}
            <div onClick={handleClick} title={spot.name}>
                <img src={spot.url}  />
                <div>
                    <div>{spot.city}, {spot.state}</div>
                    <div>{spot.price} night</div>
                    <div>
                        <FontAwesomeIcon icon={faStar} />
                        {spot.avgRating ? spot.avgRating : "New"}
                    </div>
                </div>
            </div>
        </>
    )
}

export default SpotTile;