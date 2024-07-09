import { csrfFetch } from './csrf';

//constants
const SET_SPOTS = 'spots/setSpots';
const SPOT_DETAILS = 'spots/spotDetails'


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

//thunk / action creator
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

//initial state
const initialState = {
    allSpots: [],
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
            return newState
        default:
            return state;
    }
}

export default spotsReducer