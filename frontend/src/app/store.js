import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice'
import goalReducer from '../features/goals/goalSlice'

// this is what stores the global state of the application is a single javascript object
// readonly and can only be modified by dispatching actions
export const store = configureStore({
  // reducers take the current state and an action as arguments to return a new state
  // reducers are combined to form the root reducer, which is responsible for managing the entire state of the application
  reducer: {
    auth: authReducer,
    goals: goalReducer,
  },
  // a slice is a combination of a reducer function and a set of action creators.
  // it encapsulates the logic related to a specific piece of the application state.
});
