import { useState } from 'react';
import { useDispatch} from 'react-redux';
import { createSpot } from '../../store/spots';
import { useNavigate } from 'react-router-dom';

const CreateSpotForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [country, setCountry] = useState('')
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [description, setDescription] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [previewImage, setPreviewImage] = useState('');
    const [imageUrls, setImageUrls] = useState(['', '', '', '', '']);
    const [errors, setErrors] = useState([]);
    // const [load, setLoad] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("HANDLESUBMITTEST")
        const spotInfo = {
            country,
            address,
            city,
            state,
            description,
            name,
            price,
            previewImage,
            imageUrls,
            lat: -35.77673,
            lng: 6.31424
        };
        const data = await dispatch(createSpot(spotInfo))
    
        console.log("dataCREATESPOTFORM", data)
        // if(data instanceof Response || !previewImage) { 
        //     if(data instanceof Response && !previewImage) {
        //         var newDataCreate = await data.json();
        //         console.log("NEWDATA", newDataCreate)
        //         if(newDataCreate.message === 'This Spot already exists') {
        //             console.log("NEWDATA.MESSAGETEST")
        //             setErrors([newDataCreate.message])
        //         } else if (newDataCreate.errors) {
        //             newDataCreate.errors.previewImage = "Preview Image is required";
        //             const newErrors = Object.values(newDataCreate.errors)
        //             setErrors(newErrors)
        //         }
        //     } else if(data instanceof Response && previewImage) {
        //         var newDataCreate = await data.json();
        //         if(newDataCreate.message === 'This Spot already exists') {
        //             console.log("NEWDATA.MESSAGETEST")
        //             setErrors([newDataCreate.message])
        //         } else if (newDataCreate.errors) {
        //             const newErrors = Object.values(newDataCreate.errors)
        //             setErrors(newErrors)
        //         }
        //     } else if (!previewImage) {
        //         const previewImageError = "Preview Image is required";
        //         setErrors([previewImageError])
        //     }
        // }else {
        //     navigate(`/spots/${data.id}`)
        // }
        if(data instanceof Response) {
            var newDataCreate = await data.json(); //already jsonning from spots.js in create a spot Thunk. This is the response.
            console.log("NEWDATA", newDataCreate)
            if(newDataCreate.message === 'This Spot already exists') {
                console.log("NEWDATA.MESSAGETEST")
                // const newError = Object.values(newData.message)
                setErrors([newDataCreate.message])
            } else if (newDataCreate.errors) {
                console.log("IF ERRORS", errors)
                console.log("newData.errors", newDataCreate.errors)
                // if(!previewImage) {
                //     newDataCreate.errors.previewImage = "Preview Image is required";
                // }
                // const newErrors = [...errors, ...newData.errors]
                const newErrors = Object.values(newDataCreate.errors)
                console.log("newErrors", newErrors)
                setErrors(newErrors)
            }
        }  else {
            navigate(`/spots/${data.id}`)
        }
    }
    // console.log("ERRORS AFTER SETERRORS", errors)
    return (
        <form onSubmit={handleSubmit}>
            <h1>Create a New Spot</h1>
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
                <h2>{`Where's your place located?`}</h2>
                <p>Guests will only get your exact address once they booked a reservation.</p>
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
                <h2>Describe your place to guests</h2>
                <p>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</p>
                <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder='Please write at least 30 characters'
                    // required
                />
            </div>
            <div>
                <h2>Create a title for your spot</h2>
                <p>{`Catch guests' attention with a spot title that highlights what makes your place special.`}</p>
                <input 
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='Name of your spot'
                    // required
                />
            </div>
            <div>
                <h2>Set a base price for your spot</h2>
                <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                <input 
                    type='number'
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder='Price per night (USD)'
                    // required
                />
            </div>
            <div>
                <h2>Liven up your spot with photos</h2>
                <p>Submit a link to at least one photo to publish your spot.</p>
                <input 
                    type='text'
                    value={previewImage}
                    onChange={(e) => setPreviewImage(e.target.value)}
                    placeholder='Preview Image URL'
                />
                {
                    imageUrls.map((url, idx) => (
                        <input 
                            key={idx}
                            type='text'
                            value={url}
                            onChange={(e) => {
                                const newImageUrls = [...imageUrls];
                                newImageUrls[idx] = e.target.value;
                                setImageUrls(newImageUrls)
                            }}
                            placeholder='Image URL'
                        />
                    ))
                }
            </div>
            <button 
                type='submit' 
                // disabled={errors.length > 0 ? 'true' : 'false'}
            >Create Spot</button>
        </form>
    ) 
}

export default CreateSpotForm