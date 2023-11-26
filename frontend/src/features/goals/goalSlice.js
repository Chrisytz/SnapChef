import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import authService from "../auth/authService";
import goalService from './goalService'

// every redux resource is gonna have the iserror, isloading, issuccess, message
const initialState = {
    goals: [],
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: ''
}

// create new goal
export const createGoal = createAsyncThunk(
    'goals/create',
    async (goalData, thunkAPI) => {
    try {
        // extracts the authentication token from the Redux state using thunkAPI.getState()
        // thunkAPI.getState() retrieves the current state of the Redux store
        // .auth accesses the authslice state
        // .user.token access the user property and then the user token stored in the authslice state
        // for more info go read line 70 in authSlice
        const token = thunkAPI.getState().auth.user.token
        return await goalService.createGoal(goalData, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        // returning payload with the message as the payload
        return thunkAPI.rejectWithValue(message)
    }
})

export const getGoals = createAsyncThunk(
    'goals/getAll',
    async(_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await goalService.getGoals(token)
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
            // returning payload with the message as the payload
            return thunkAPI.rejectWithValue(message)
        }
    })

export const deleteGoal = createAsyncThunk(
    'goals/delete',
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await goalService.deleteGoal(id, token)
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
            // returning payload with the message as the payload
            return thunkAPI.rejectWithValue(message)
        }
    })

export const goalSlice = createSlice({
    name: 'goal',
    initialState,
    reducers: {
        // reset function will set everything to initialstate
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(createGoal.pending, (state) => {
                state.isLoading = true
            })
            .addCase(createGoal.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                // adding the new goal data to state.goals
                state.goals.push(action.payload)
            })
            .addCase(createGoal.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(getGoals.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getGoals.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.goals = action.payload
            })
            .addCase(getGoals.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(deleteGoal.pending, (state) => {
                state.isLoading = true
            })
            .addCase(deleteGoal.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                // filtering out goals that have the id of the goal that has been deleted
                // (since delete goal doesn't return anything we don't do action.payload)
                state.goals = state.goals.filter((goal) => goal._id !== action.payload.id)
            })
            .addCase(deleteGoal.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
    }
})

export const {reset} = goalSlice.actions
export default goalSlice.reducer