import { useState } from 'react';
import { useDispatch} from 'react-redux';
import { createSpot } from '../../store/spots';
import { useNavigate } from 'react-router-dom';
import './CreateSpotForm.css';

const CreateSpotForm = () => {
    //hooks
    const dispatch = useDispatch();
    const navigate = useNavigate()
    // const [country, setCountry] = useState('')
    // const [address, setAddress] = useState('');
    // const [city, setCity] = useState('');
    // const [state, setState] = useState('');
    // const [description, setDescription] = useState('');
    // const [name, setName] = useState('');
    // const [price, setPrice] = useState('');
    // const [previewImage, setPreviewImage] = useState('');
    // const [imageUrls, setImageUrls] = useState(['', '', '', '', '']);

    //state
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

    //handler functions
    const handleFormUpdates = (label, value) => {
        console.log(label, value);
        setSpotForm(prev => {
            const newForm = {...prev}
            newForm[label] = value
            return newForm
        })
    }

    // const makeDemo = () => {
    //     setSpotForm({
    //         country: "United States",
    //         address: "555 something way",
    //         city: "Sim Cit",
    //         state: "Florida",
    //         description: "Some random demo description",
    //         name: "The cozy demo",
    //         price: "55",
    //         lat: 6.31424,
    //         lng: -35.77673,
    //         previewImage: "https://www.bhg.com/thmb/H9VV9JNnKl-H1faFXnPlQfNprYw=/1799x0/filters:no_upscale():strip_icc()/white-modern-house-curved-patio-archway-c0a4a3b3-aa51b24d14d0464ea15d36e05aa85ac9.jpg",
    //         img1: "https://www.houseplans.net/news/wp-content/uploads/2023/07/57260-768.jpeg",
    //         img2: "https://hips.hearstapps.com/hmg-prod/images/hbx030124tomscheerer-003-65f3148d6d76e.jpg",
    //         img3: "https://cdn.onekindesign.com/wp-content/uploads/2019/10/Traditional-English-Manor-House-Jauregui-Architect-01-1-Kindesign.jpg",
    //         img4: "https://archivaldesigns.com/cdn/shop/products/MAIN-IMAGE-Armani_1200x.jpg?v=1599433116",
    //         img5: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAU78WmYIXyfiRGKZ2F53fcPTh3mlzz8qlyw&s",
    //     })
    // }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = [];
        if (!spotForm.country) newErrors.push("Country is required");
        if (!spotForm.address) newErrors.push("Street Address is required");
        if (!spotForm.city) newErrors.push("City is required");
        if (!spotForm.state) newErrors.push("State is required");
        if (!spotForm.description || spotForm.description.length < 30) newErrors.push("Description needs 30 or more characters");
        if (!spotForm.name) newErrors.push("Name of your spot is required");
        if (!spotForm.price) newErrors.push("Price per night is required");
        if (!spotForm.previewImage) newErrors.push("Preview Image URL is required");

        if (newErrors.length) {
            setErrors(newErrors);
            return;
        }

        const data = await dispatch(createSpot(spotForm))
        navigate(`/spots/${data.id}`);
       
        // if(data instanceof Response) {
        //     var newDataCreate = await data.json(); //already jsonning from spots.js in create a spot Thunk. This is the response.
        //     console.log("NEWDATA", newDataCreate)
        //     if(newDataCreate.message === 'This Spot already exists') {
        //         console.log("NEWDATA.MESSAGETEST")
        //         // const newError = Object.values(newData.message)
        //         setErrors([newDataCreate.message])
        //     } else if (newDataCreate.errors) {
        //         console.log("IF ERRORS", errors)
        //         console.log("newData.errors", newDataCreate.errors)
        //         // if(!previewImage) {
        //         //     newDataCreate.errors.previewImage = "Preview Image is required";
        //         // }
        //         // const newErrors = [...errors, ...newData.errors]
        //         const newErrors = Object.values(newDataCreate.errors)
        //         console.log("newErrors", newErrors)
        //         setErrors(newErrors)
        //     }
        // }  else {
        //     navigate(`/spots/${data.newSpot.newSpot.id}`)
        // }
    }
    // console.log("ERRORS AFTER SETERRORS", errors)

    return (
        <>
            <div className='create-form-container'>
                <form className='create-form' onSubmit={handleSubmit}>
                    <h1 className='create-title-h1'>Create a New Spot</h1>
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
                        <h2 className='create-second-title'>{`Where's your place located?`}</h2>
                        <p>Guests will only get your exact address once they booked a reservation.</p>
                        <div>
                            <label className='create-country-label'>
                                Country
                                <input
                                    type='text'
                                    value={spotForm.country}
                                    onChange={(e) => handleFormUpdates("country", e.target.value)}
                                // required
                                />
                            </label>
                            <label className='create-address-label'>
                                Street Address
                                <input
                                    type='text'
                                    value={spotForm.address}
                                    onChange={(e) => handleFormUpdates("address", e.target.value)}
                                // required
                                />
                            </label>
                            <div className='create-city-state-labels'>
                                <label className='create-city-label'>
                                    City
                                    <input
                                        className='create-city-input'
                                        type='text'
                                        value={spotForm.city}
                                        onChange={(e) => handleFormUpdates("city", e.target.value)}
                                    // required
                                    />
                                </label>
                                <label className='create-state-label'>
                                    State
                                    <input
                                        className='create-state-input'
                                        type='text'
                                        value={spotForm.state}
                                        onChange={(e) => handleFormUpdates("state", e.target.value)}
                                    // required
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className='create-line-break'></div>

                    <div>
                        <h2 className='create-second-title'>Describe your place to guests</h2>
                        <p>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</p>
                        <textarea className='create-textarea'
                            value={spotForm.description}
                            onChange={(e) => handleFormUpdates("description", e.target.value)}
                            placeholder='Please write at least 30 characters'
                        // required
                        />
                    </div>

                    <div className='create-line-break'></div>

                    <div>
                        <h2 className='create-second-title'>Create a title for your spot</h2>
                        <p>{`Catch guests' attention with a spot title that highlights what makes your place special.`}</p>
                        <input
                            className='create-name-input'
                            type='text'
                            value={spotForm.name}
                            onChange={(e) => handleFormUpdates("name", e.target.value)}
                            placeholder='Name of your spot'
                        // required
                        />
                    </div>

                    <div className='create-line-break'></div>

                    <div>
                        <h2 className='create-second-title'>Set a base price for your spot</h2>
                        <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                        <div>
                            $
                            <input
                                className='create-price-input'
                                type='number'
                                value={spotForm.price}
                                onChange={(e) => handleFormUpdates("price", e.target.value)}
                                placeholder='Price per night (USD)'
                            // required
                            />
                        </div>
                        
                    </div>

                    <div className='create-line-break'></div>

                    <div>
                        <h2 className='create-second-title'>Liven up your spot with photos</h2>
                        <p>Submit a link to at least one photo to publish your spot.</p>
                        <div className='create-image-container'>
                            <input
                                className='create-image-input'
                                type='text'
                                value={spotForm.previewImage}
                                onChange={(e) => handleFormUpdates("previewImage", e.target.value)}
                                placeholder='Preview Image URL'
                            />
                            <input
                            className='create-image-input'
                                type='text'
                                value={spotForm.img1}
                                onChange={(e) => handleFormUpdates("img1", e.target.value)}
                                placeholder='Secondary Image'
                            />
                            <input
                            className='create-image-input'
                                type='text'
                                value={spotForm.img2}
                                onChange={(e) => handleFormUpdates("img2", e.target.value)}
                                placeholder='Secondary Image'
                            />
                            <input
                            className='create-image-input'
                                type='text'
                                value={spotForm.img3}
                                onChange={(e) => handleFormUpdates("img3", e.target.value)}
                                placeholder='Secondary Image'
                            />
                            <input
                            className='create-image-input'
                                type='text'
                                value={spotForm.img4}
                                onChange={(e) => handleFormUpdates("img4", e.target.value)}
                                placeholder='Secondary Image'
                            />
                            <input
                                type='text'
                                value={spotForm.img5}
                                onChange={(e) => handleFormUpdates("img5", e.target.value)}
                                placeholder='Secondary Image'
                            />
                        </div>
                        
                        {/* {
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
                } */}
                    </div>

                    <div className='create-line-break'></div>
                    <div className='create-submit-button-container'>
                        <button
                            type='submit'
                            className='create-submit-button'
                        >Create Spot</button>
                    </div>
                    
                </form>
            </div>
            
            {/* <button onClick={makeDemo}>Demo</button> */}
        </>
        
    ) 
}

export default CreateSpotForm