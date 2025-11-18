import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../axios'

const initialState = {
    data: null,
    status: "loading"
}

export const fetchAuth = createAsyncThunk('auth/fetchUserData', async (params) => {
    const { data } = await axios.post('/auth/login', params)
    return data
})

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: {
        [fetchAuth.pending]: (state) => {
            state.status = 'loading'
            state.data = null
        },
        [fetchAuth.fulfilled]: (state, action) => {
            state.status = 'loaded'
            state.data = action.payload
        },
        [fetchAuth.rejected]: (state) => {
            state.status = 'error'
            state.data = null
        }
    }
})

export const selectIsAuth = state => Boolean(state.auth.data)

export const authReducer = authSlice.reducer