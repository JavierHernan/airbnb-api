import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchSpotDetails, updateSpotThunk } from '../../store/spots';
import './UpdateSpotForm.css';

const UpdateSpotForm = () => {
    //hooks
    const {id} = useParams(); //grab spot to be updated by id
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const spot = useSelector(state => state.spots.byId[id]) //grab spot from db to be rendered

    // const [country, setCountry] = useState('');
    // const [address, setAddress] = useState('');
    // const [city, setCity] = useState('');
    // const [state, setState] = useState('');
    // const [description, setDescription] = useState('');
    // const [name, setName] = useState('');
    // const [price, setPrice] = useState('');
    // const [errors, setErrors] = useState([]);

    const [spotForm, setSpotForm] = useState({
        country: "",
        address: "",
        city: "",
        state: "",
        description: "",
        name: "",
        price: "",
        lat: 6.31424,
        lng: -35.77673,
        previewImage: "",
        img1: "",
        img2: "",
        img3: "",
        img4: "",
        img5: "",
    });
    const [errors, setErrors] = useState([]);



    useEffect(() => {
        const fetchAndSetSpotDetails = async () => {
            const response = await dispatch(fetchSpotDetails(id));
            if (response.ok) {
                console.log("RESPONSE")
                // Spot details are now in Redux store, use `useSelector` to access them
                // const spotData = await response.json();
                // console.log("SPOTDATA", spotData)
                console.log("UPDATE SPOT", spot)
                setSpotForm({
                    country: spot.country || "",
                    address: spot.address || "",
                    city: spot.city || "",
                    state: spot.state || "",
                    description: spot.description || "",
                    name: spot.name || "",
                    price: spot.price || "",
                    // lat: spot.lat || 6.31424,
                    // lng: spot.lng || -35.77673,
                    // previewImage: spot.previewImage || "",
                    // img1: spot.img1 || "",
                    // img2: spot.img2 || "",
                    // img3: spot.img3 || "",
                    // img4: spot.img4 || "",
                    // img5: spot.img5 || "",
                });
            }
        };
        fetchAndSetSpotDetails();
    }, [dispatch, id]);

    // useEffect(() => {
    //     if (spot) {
    //         setCountry(spot.country || '');
    //         setAddress(spot.address || '');
    //         setCity(spot.city || '');
    //         setState(spot.state || '');
    //         setDescription(spot.description || '');
    //         setName(spot.name || '');
    //         setPrice(spot.price || '');
    //     }
    // }, [spot]);

    //handler functions
    const handleFormUpdates = (label, value) => {
        console.log(label, value);
        setSpotForm(prev => {
            const newForm = {...prev}
            newForm[label] = value
            return newForm
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("HANDLEUPDATE TEST")
        // const newSpotDetails = {
        //     country, 
        //     address, 
        //     city, 
        //     state, 
        //     description, 
        //     name, 
        //     price, 
        //     lat: -35.77673,
        //     lng: 6.31424
        // }
        const data = await dispatch(updateSpotThunk(id, spotForm));
        console.log("UPDATE DATA", data)
        if (data.errors) {
            setErrors(data.errors);
        } else {
            navigate(`/spots/${id}`);
        }

        // if(data instanceof Response) {
        //     var newDataUpdate = await data.json();
        //     console.log("NEWDATAUPDATE", newDataUpdate)
        //     if(newDataUpdate.errors) {
        //         console.log("IF ERRORS", errors)
        //         console.log("newData.errors", newDataUpdate.errors)
        //         const newErrors = Object.values(newDataUpdate.errors)
        //         console.log("NEWERRORS", newErrors)
        //         setErrors(newErrors)
        //     }
        // } else {
        //     navigate(`/spots/${id}`)
        // }
    }

    return (
        <>
            <div className='update-form-container'>
                <form className='update-form' onSubmit={handleSubmit}>
                    <h1 className='update-title-h1'>Update your Spot</h1>
                    {errors.length > 0 && (
                        <ul>
                            {errors.map((error, index) => {
                                return (
                                    <li key={index}>{error}</li>
                                )
                            })}
                        </ul>
                    )}
                    <div>
                        <h2 className='update-second-title'>{`Where's your place located?`}</h2>
                        <p>Guests will only get your exact address once they booked a reservation.</p>
                        <div>
                            <label className='update-country-label'>
                                Country
                                <input
                                    type='text'
                                    value={spotForm.country}
                                    onChange={(e) => handleFormUpdates("country", e.target.value)}
                                // required
                                />
                            </label>
                            <label className='update-address-label'>
                                Street Address
                                <input
                                    type='text'
                                    value={spotForm.address}
                                        onChange={(e) => handleFormUpdates("address", e.target.value)}
                                // required
                                />
                            </label>
                            <div className='update-city-state-labels'>
                                <label className='update-city-label'>
                                    City
                                    <input
                                        className='update-city-input'
                                        type='text'
                                        value={spotForm.city}
                                        onChange={(e) => handleFormUpdates("city", e.target.value)}
                                    // required
                                    />
                                </label>
                                <label className='update-state-label'>
                                    State
                                    <input
                                        className='update-state-input'
                                        type='text'
                                        value={spotForm.state}
                                        onChange={(e) => handleFormUpdates("state", e.target.value)}
                                    // required
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div></div>

                    <div>
                        <h2 className='update-second-title'>Describe your place to guests</h2>
                        <p>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</p>
                        <textarea
                            className='update-textarea'
                            value={spotForm.description}
                            onChange={(e) => handleFormUpdates("description", e.target.value)}
                        />
                    </div>

                    <div></div>

                    <div>
                        <h2 className='update-second-title'>Create a title for your spot</h2>
                        <p>{`Catch guests' attention with a spot title that highlights what makes your place special.`}</p>
                        <input
                            className='update-name-input'
                            type='text'
                            value={spotForm.name}
                            onChange={(e) => handleFormUpdates("name", e.target.value)}
                        // required
                        />
                    </div>

                    <div></div>

                    <div>
                        <h2 className='update-second-title'>Set a base price for your spot</h2>
                        <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                        <div>
                            $
                            <input
                                className='update-price-input'
                                type='number'
                                value={spotForm.price}
                                onChange={(e) => handleFormUpdates("price", e.target.value)}
                            // required
                            />
                        </div>
                        
                    </div>

                    <div></div>

                    <div className='update-submit-button-container'>
                        <button type='submit' className='update-submit-button'>Update your Spot</button>
                    </div>
                </form>
            </div>
            
        </>
    )
}

export default UpdateSpotForm;