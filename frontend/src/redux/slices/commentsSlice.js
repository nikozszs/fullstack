import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../axios'

const initialState = {
    data: {
        items: [],
        status: 'loading'
    }
}

export const fetchRandomComments = createAsyncThunk('auth/fetchRandomComments', async (limit = 5) => {
    const { data } = await axios.get(`/comments/random?limit=${limit}`)
    return data
})

export const fetchCreateComment = createAsyncThunk(
    'comments/fetchCreateComment',
    async ({ text, postId }) => {
        const { data } = await axios.post('/comments', { text, postId });
        return data;
});

export const fetchCommentsInPost = createAsyncThunk('posts/fetchPostsByTag', async (postId) => {
    const { data } = await axios.get(`/comments/post/${postId}`)
    return data
})

const commentsSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {},
    extraReducers: {
        // получение рандомных комментариев
        [fetchRandomComments.pending]: (state) => {
            state.data.status = 'loading'
            state.data.items = []
        },
        [fetchRandomComments.fulfilled]: (state, action) => {
            state.data.status = 'loaded'
            state.data.items = action.payload
        },
        [fetchRandomComments.rejected]: (state) => {
            state.data.status = 'error'
            state.data.items = []
        },
        // отправление созданного комментария
        [fetchCreateComment.fulfilled]: (state, action) => {
            state.data.items.unshift(action.payload);
        },
        [fetchCreateComment.rejected]: (state) => {
            state.data.status = 'error'
            state.data.items = []
        },
        // получение комментариев под постом
        [fetchCommentsInPost.pending]: (state) => {
            state.data.status = 'loading'
            state.data.items = []
        },
        [fetchCommentsInPost.fulfilled]: (state, action) => {
            state.data.status = 'loaded'
            state.data.items = action.payload
        },
        [fetchCommentsInPost.rejected]: (state) => {
            state.data.status = 'error'
            state.data.items = []
        }
    }
})

export const commentsReducer = commentsSlice.reducer
