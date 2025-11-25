import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../axios'

const initialState = {
    postComments: {
        items: [],
        status: 'loading'
    },
    randomComments: {
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

export const fetchCommentsCountForPost = createAsyncThunk(
    'comments/fetchCommentsCountForPost',
    async (postId) => {
        const { data } = await axios.get(`/comments/post/${postId}`);
        return {
            postId,
            count: data.length
        };
    }
);

const commentsSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {},
    extraReducers: {
        // получение рандомных комментариев
        [fetchRandomComments.pending]: (state) => {
            state.randomComments.status = 'loading'
            state.randomComments.items = []
        },
        [fetchRandomComments.fulfilled]: (state, action) => {
            state.randomComments.status = 'loaded'
            state.randomComments.items = action.payload
        },
        [fetchRandomComments.rejected]: (state) => {
            state.randomComments.status = 'error'
            state.randomComments.items = []
        },
        // отправление созданного комментария
        [fetchCreateComment.fulfilled]: (state, action) => {
            state.postComments.items.unshift(action.payload);
        },
        [fetchCreateComment.rejected]: (state) => {
            state.postComments.status = 'error'
            state.postComments.items = []
        },
        // получение комментариев под постом
        [fetchCommentsInPost.pending]: (state) => {
            state.postComments.status = 'loading'
            state.postComments.items = []
        },
        [fetchCommentsInPost.fulfilled]: (state, action) => {
            state.postComments.status = 'loaded'
            state.postComments.items = action.payload
        },
        [fetchCommentsInPost.rejected]: (state) => {
            state.postComments.status = 'error'
            state.postComments.items = []
        },
        // получение комментариев под постом
        [fetchCommentsCountForPost.fulfilled]: (state, action) => {
            const { postId, count } = action.payload;
        }
    }
})

export const commentsReducer = commentsSlice.reducer
