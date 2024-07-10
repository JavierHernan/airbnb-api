import { csrfFetch } from './csrf';

// Action Types
const SET_REVIEWS = 'reviews/setReviews';

// Action Creators
const setReviews = (reviews) => ({
    type: SET_REVIEWS,
    payload: reviews,
  });

  // Thunks
export const fetchReviews = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
    const data = await response.json();
    console.log("reviews data", data)
    dispatch(setReviews(data.Reviews));
  };

//   // Initial State
const initialState = {
    allReviews: [],
    byId: {}
};

// // Reducer
const reviewsReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case SET_REVIEWS:
        console.log("SET_REVIEWS TEST")
        newState = {...state};
        console.log("reviews action.payload", action.payload)
        // action.payload.forEach((review) => (newState[review.id] = review))
        newState.allReviews = action.payload;

        for(let review of action.payload) {
            newState.byId[review.id] = review;
        }
        console.log("newState2", newState)
      return newState
    default:
      return state;
  }
};

export default reviewsReducer;
