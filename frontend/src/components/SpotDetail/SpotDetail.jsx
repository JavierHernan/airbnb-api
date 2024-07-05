import {useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchSpotDetails } from "../../store/spots";

function SpotDetail() {
    const dispatch = useDispatch();
    const {id} = useParams();
    console.log("id", id)
    const spot = useSelector(state => state.spots.spot)
    console.log("spot", spot)

    useEffect(() => {
        dispatch(fetchSpotDetails(id))
    }, [dispatch, id])

    const handleReserve = () => {
        alert("Feature coming soon")
    }

    return (
        <>
            <div>
                <h1>{spot.name}</h1>
                <div>{spot.city}, {spot.state}, {spot.country}</div>
                <div>
                    <img src={spot.preview} />
                    <div>
                        {spot.SpotImages.map((image, index) => (
                            <img key={index} src={image} />
                        ))}
                    </div>
                </div>
                <p>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</p>
                {/* replace ownderId with the name of the owner */}
                <p>{spot.description}</p>
                <div>
                    <p>{spot.price} night</p>
                    <button onClick={handleReserve}>Reserve</button>
                </div>
            </div>
        </>
    )
}

export default SpotDetail;