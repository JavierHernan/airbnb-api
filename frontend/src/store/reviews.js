import { csrfFetch } from './csrf';

// Action Types
const SET_REVIEWS = 'reviews/setReviews';
const ADD_REVIEW = 'reviews/addReview';
const DELETE_REVIEW = 'reviews/deleteReview';

// Action Creators
//get all review action
const setReviews = (reviews) => ({
    type: SET_REVIEWS,
    payload: reviews,
  });

//add review action
const addReview = (review) => ({
  type: ADD_REVIEW,
  payload: review,
})
//delete review action
const deleteReview = (reviewId) => ({
  type: DELETE_REVIEW,
  payload: reviewId
});

  // Thunks
//get all review thunk
export const fetchReviews = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
    const data = await response.json();
    console.log("reviews data", data)
    dispatch(setReviews(data.Reviews));
  };
//create review thunk
export const createReview = (spotId, review) => async (dispatch) => {
  console.log("SPOTID AND REVIEW CREATE REVIEW THUNK", spotId, review)
  try {
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(review)
    }
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, options)
    console.log("createReviewTHUNK RESPONSE", response)
    if(response.ok) {
      const data = await response.json();
      dispatch(addReview(data))
      return response
    } else {
      const error = await response.json()
      throw error
    }
  } catch(error) {
    return error
  }
}
//delete review thunk
export const deleteReviewThunk = (reviewId) => async (dispatch) => {
  try {
    const option = {method: 'DELETE'}
    const response = await csrfFetch(`/api/reviews/${reviewId}`, option)
    if(response.ok) {
      // const data = await response.json()
      dispatch(deleteReview(reviewId))
    } else {
      const error = await response.json()
      throw error
    }
  } catch (error) {
    return error
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
      return newState;
    case DELETE_REVIEW:
      newState = { ...state };
      newState.allReviews = newState.allReviews.filter(review => review.id !== action.payload);
      delete newState.byId[action.payload];
      return newState;
    default:
      return state;
  }
};

export default reviewsReducer;
