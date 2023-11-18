// auth global state
// thunks are functions that can be dispatched and contain async logic
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import authService from './authService'

// get user from localStorage
const user = JSON.parse(localStorage.getItem('user'))

const initialState = {
    user: user? user : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}

// register user
// async thunk function - auth/register is the action
export const register = createAsyncThunk(
    'auth/register',
    async (user, thunkAPI) => {
    try {
        // returning payload with the user as the payload
        return await authService.register(user)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        // returning payload with the message as the payload
        return thunkAPI.rejectWithValue(message)
    }
})

export const login = createAsyncThunk(
    'auth/login',
    async (user, thunkAPI) => {
    try {
        // returning payload with the user as the payload
        return await authService.login(user)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        // returning payload with the message as the payload
        return thunkAPI.rejectWithValue(message)
    }
})


export const logout = createAsyncThunk('auth/logout', async () => {
    await authService.logout()
})

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // these bois are not async
        reset: (state) => {
            state.isLoading = false
            state.isError = false
            state.isSuccess = false
            state.message = ''
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                // payload is the data that comes with the action, so once register runs successfully, it returns authService.register(user)
                // and register(user) in authService returns response.data, which means action.payload = response.data
                // in our backend in userController.js we return this object from our register
                /*
                {
                    _id: user.id,
                    name: user.name,
                    email: user.email,
                    token: generateToken(user._id)
                }
                */
                state.user = action.payload
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.user = null
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.user = null
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null
            })

    }
})

export const {reset} = authSlice.actions
export default authSlice.reducer