import React, { useState, useEffect } from 'react';
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newSpotDetails = {
            county, address, city, state, description, name, price
        }
        const data = await dispatch(updateSpotThunk(id, newSpotDetails));
        if(data.errors) {
            setErrors(data.errors)
        } else {
            navigate(`/spots/${id}`)
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <h1>Update your Spot</h1>
                {/* {errors} */}
                <div>
                    <label>
                        Country
                        <input 
                            type='text'
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Street Address
                        <input 
                            type='text'
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        City
                        <input 
                            type='text'
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        State
                        <input 
                            type='text'
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            required
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
                            required
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
                            required
                        />
                    </label>
                </div>
                    <button type='submit'>Update your Spot</button>
            </form>
        </>
    )
}

export default UpdateSpotForm;