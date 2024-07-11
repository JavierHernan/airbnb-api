import { csrfFetch } from './csrf';

//constants
const SET_SPOTS = 'spots/setSpots';
const SPOT_DETAILS = 'spots/spotDetails';
const ADD_SPOT = 'spots/addSpot';
const MANAGE_SPOTS = 'spots/manageSpots';


//action creator
const setSpots = (spots) => {
    return {
      type: SET_SPOTS,
      payload: spots
    }
  }
//view spot details action
const spotDetails = (spot) => {
    return {
        type: SPOT_DETAILS,
        payload: spot
    }
}
//add spot action
const addSpot = (spot) => ({
    type: ADD_SPOT,
    payload: spot
})
//manage spots action
const manageSpots = (spots) => ({
    type: MANAGE_SPOTS,
    payload: spots
})

//thunks
export const fetchSpots = () => async (dispatch) => {
    const response = await csrfFetch("/api/spots");
    const data = await response.json();
    // console.log("SpotList data", data)
    dispatch(setSpots(data.Spots))
    // console.log("response", response)
    return response
  }

//view spot details thunk
export const fetchSpotDetails = (id) => async (dispatch) => {
    // console.log("test")
    const response = await csrfFetch(`/api/spots/${id}`);
    // console.log("fetchSpotDetails", response)
    const data = await response.json();
    // console.log("Details data", data)
    dispatch(spotDetails(data));
    return response;
}
// add spot thunk
export const createSpot = (spotForm) => async (dispatch) => {
    try {
        const options = {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(spotForm)
        }
        const response = await csrfFetch("/api/spots", options);
        if(response.ok) {
            const data = await response.json();
            dispatch(addSpot(data))
            return data;
        } else {
            const error = await response.json();
            throw error
        }
        // data.User = spotForm.user
    } catch(e) {
        return e
    }
    
}
//manage spots thunk
export const manageSpotsThunk = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots/current');
    const data = await response.json()
    dispatch(manageSpots(data.Spots))
}

//initial state
const initialState = {
    allSpots: [],
    userSpots: [],
    byId: {}
};

//reducer

const spotsReducer = (state = initialState, action) => {
    let newState;
    switch(action.type) {
        case SET_SPOTS:
            //make allSpots and byId accessible
            newState = {...state}
            // console.log("newState", newState)
            // console.log("action.payload", action.payload)
            // action.payload.forEach((spot) => (newState[spot.id] = spot))
            //biuld out allSpots
            newState.allSpots = action.payload;
            //build out byId
            for(let spot of action.payload) {
                newState.byId[spot.id] = spot;
            }
            // console.log("newState2", newState)
            return newState
        case SPOT_DETAILS:
            // console.log("SPOT_DETALS TEST")
            newState = {...state}
            // console.log("newState1", newState)
            // console.log("action.payload", action.payload)
            newState[action.payload.id] = action.payload
            newState.byId = {...newState.byId, [action.payload.id]: action.payload}
            // console.log("newState2", newState)
            return newState;
        case ADD_SPOT:
            newState = {... state};
            newState.allSpots = [action.payload, ...newState.allSpots];
            newState.byId = {...newState.byId, [action.payload.id]: action.payload}
            return newState
        case MANAGE_SPOTS:
            newState = {...state}
            newState.userSpots = action.payload;
            for(let spot of action.payload) {
                newState.byId[spot.id] = spot;
            }
            return newState;
        default:
            return state;
    }
}

export default spotsReducer