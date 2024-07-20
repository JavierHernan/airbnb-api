import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchSpotDetails, updateSpotThunk } from '../../store/spots';

const UpdateSpotForm = () => {
    const {id} = useParams(); //grab spot to be updated by id
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const spot = useSelector(state => state.spots.byId[id]) //grab spot from db to be rendered

    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [description, setDescription] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        const fetchAndSetSpotDetails = async () => {
            const response = await dispatch(fetchSpotDetails(id));
            if (response.ok) {
                console.log("RESPONSE")
                // Spot details are now in Redux store, use `useSelector` to access them
            }
        };
        fetchAndSetSpotDetails();
    }, [dispatch, id]);

    useEffect(() => {
        if (spot) {
            setCountry(spot.country || '');
            setAddress(spot.address || '');
            setCity(spot.city || '');
            setState(spot.state || '');
            setDescription(spot.description || '');
            setName(spot.name || '');
            setPrice(spot.price || '');
        }
    }, [spot]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("HANDLEUPDATE TEST")
        const newSpotDetails = {
            country, 
            address, 
            city, 
            state, 
            description, 
            name, 
            price, 
            lat: -35.77673,
            lng: 6.31424
        }
        const data = await dispatch(updateSpotThunk(id, newSpotDetails));
        console.log("UPDATE DATA", data)
        if(data instanceof Response) {
            var newDataUpdate = await data.json();
            console.log("NEWDATAUPDATE", newDataUpdate)
            if(newDataUpdate.errors) {
                console.log("IF ERRORS", errors)
                console.log("newData.errors", newDataUpdate.errors)
                const newErrors = Object.values(newDataUpdate.errors)
                console.log("NEWERRORS", newErrors)
                setErrors(newErrors)
            }
        } else {
            navigate(`/spots/${id}`)
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <h1>Update your Spot</h1>
                {errors.length > 0 && (
                <ul>
                    {errors.map((error, index) => {
                        console.log("MAP ERROR", error)
                        return (
                            <li key={index}>{error}</li>
                        )
                    })}
                </ul>
            )}
                <div>
                    <label>
                        Country
                        <input 
                            type='text'
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            // required
                        />
                    </label>
                    <label>
                        Street Address
                        <input 
                            type='text'
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            // required
                        />
                    </label>
                    <label>
                        City
                        <input 
                            type='text'
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            // required
                        />
                    </label>
                    <label>
                        State
                        <input 
                            type='text'
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            // required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Description
                        <textarea 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Name
                        <input 
                            type='text'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            // required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Price per night (USD)
                        <input 
                            type='number'
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            // required
                        />
                    </label>
                </div>
                    <button type='submit'>Update your Spot</button>
            </form>
        </>
    )
}

export default UpdateSpotForm;