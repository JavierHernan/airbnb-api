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
    console.log("data", data)
    dispatch(setSpots(data.Spots))
    console.log("response", response)
    return response
  }

//view spot details thunk
export const fetchSpotDetails = (id) => async (dispatch) => {
    console.log("test")
    const response = await csrfFetch(`/api/spots/${id}`);
    console.log("fetchSpotDetails", response)
    const data = await response.json();
    console.log("Details data", data)
    dispatch(spotDetails(data));
    return response;
}

//initial state
const initialState = { spots: []};

//reducer

const spotsReducer = (state = initialState, action) => {
    let newState;
    switch(action.type) {
        case SET_SPOTS:
            newState = {...state, spots: []}
            // newState[spots] = action.payload
            // console.log("newState", newState)
            // console.log("action.payload", action.payload)
            action.payload.forEach((spot) => (newState.spots.push(spot)))
            // return { ...state, spots: action.payload};
            return newState
        case SPOT_DETAILS:
            console.log("SPOT_DETALS TEST")
            newState = {...state}
            console.log("newState1", newState)
            console.log("action.payload", action.payload)
            // newState[spot] = action.payload
            newState = {...state, spot: action.payload}
            console.log("newState2", newState)

            // return { ...state, spot: action.payload}
            return newState
        default:
            return state;
    }
}

export default spotsReducer