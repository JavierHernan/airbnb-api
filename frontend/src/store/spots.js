import { csrfFetch } from './csrf';

//constants
const SET_SPOTS = 'spots/clearSpots';


//action creator
const setSpots = (spots) => {
    return {
      type: SET_SPOTS,
      payload: spots
    }
  }

//thunk / action creator
export const fetchSpots = () => async (dispatch) => {
    const response = await csrfFetch("/api/spots");
    const data = await response.json();
    dispatch(setSpots(data.spots))
    return response
  }

//initial state
const initialState = { spots: [] };

//reducer

const spotsReducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_SPOTS:
            return { ...state, spots: action.payload};
        default:
            return state;
    }
}

export default spotsReducer