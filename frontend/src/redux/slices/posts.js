import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    posts: {
        items: [],
        status: 'loading'
    },
    tags: {
        items: [],
        status: 'loading'
    }
}

const postsSlice = createSlice({
    name: 'posts',
    initialState: initialState,
    reducer: {

    },
    extraReducers: {
        [fetchPosts.pending]: (state, actios) => {
            state.posts.status = 'loading'
        }
    }
})

export const fetchPosts = createAsyncThunk('/posts/fetchPosts', async () => {
    const { data } = await axios.get('/posts')
    return data
})

export const postsReducer = postsSlice.reducer