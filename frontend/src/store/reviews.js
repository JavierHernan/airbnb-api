import { csrfFetch } from './csrf';

// Action Types
const SET_REVIEWS = 'reviews/setReviews';
const ADD_REVIEW = 'reviews/addReview';

// Action Creators
const setReviews = (reviews) => ({
    type: SET_REVIEWS,
    payload: reviews,
  });

//add review action
const addReview = (review) => ({
  type: ADD_REVIEW,
  payload: review,
})

  // Thunks
export const fetchReviews = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
    const data = await response.json();
    console.log("reviews data", data)
    dispatch(setReviews(data.Reviews));
  };

export const createReview = (spotId, review) => async (dispatch) => {
  try {
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application.json'},
      body: JSON.stringify(review)
    }
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, options)
    if(response.ok) {
      const data = await response.json();
      dispatch(addReview(data))
      return response
    } else {
      const error = await response.json()
      throw error
    }
  } catch(e) {
    return e
  }
}

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
        // console.log("SET_REVIEWS TEST")
        newState = {...state};
        // console.log("reviews action.payload", action.payload)
        // action.payload.forEach((review) => (newState[review.id] = review))
        newState.allReviews = action.payload;

        for(let review of action.payload) {
            newState.byId[review.id] = review;
        }
        // console.log("newState2", newState)
      return newState;
    case ADD_REVIEW:
      console.log("ADD REVIEWS TEST")
      newState = {...state};
      newState.allReviews = [action.payload, ...newState.allReviews];
      newState.byId = {...newState.byId, [action.payload.id]: action.payload}
      console.log("newState2", newState)
      return newState
    default:
      return state;
  }
};

export default reviewsReducer;
