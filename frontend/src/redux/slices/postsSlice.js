import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../axios'

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

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const { data } = await axios.get('/posts')
    return data
})

export const fetchPostsPopular = createAsyncThunk('posts/fetchPostsPopular', async () => {
    const { data } = await axios.get('/posts/popular')
    return data
})

export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
    const { data } = await axios.get('/tags')
    return data
})

export const fetchPostsByTag = createAsyncThunk('posts/fetchPostsByTag', async (tagName) => {
    const { data } = await axios.get(`/posts/tags/${tagName}`)
    return data
})

export const fetchRemovePost = createAsyncThunk('posts/fetchRemovePost', async (id) => {
    axios.delete(`/posts/${id}`)
})

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {},
    extraReducers: {
        // получение статей
        [fetchPosts.pending]: (state) => {
            state.posts.status = 'loading'
            state.posts.items = []
        },
        [fetchPosts.fulfilled]: (state, action) => {
            state.posts.status = 'loaded'
            state.posts.items = action.payload
        },
        [fetchPosts.rejected]: (state) => {
            state.posts.status = 'error'
            state.posts.items = []
        },
        // получение тегов
        [fetchTags.pending]: (state) => {
            state.tags.status = 'loading'
            state.tags.items = []
        },
        [fetchTags.fulfilled]: (state, action) => {
            state.tags.status = 'loaded'
            state.tags.items = action.payload
        },
        [fetchTags.rejected]: (state) => {
            state.tags.status = 'error'
            state.tags.items = []
        },
        // удаление статьи
        [fetchRemovePost.pending]: (state, action) => {
            state.posts.items = state.posts.items.filter(post => post._id !== action.meta.arg)
        },
        // получение тегов для отдельной страницы
        [fetchPostsByTag.pending]: (state) => {
            state.posts.status = 'loading'
            state.posts.items = []
        },
        [fetchPostsByTag.fulfilled]: (state, action) => {
            state.posts.status = 'loaded'
            state.posts.items = action.payload
        },
        [fetchPostsByTag.rejected]: (state) => {
            state.posts.status = 'error'
            state.posts.items = []
        },
        // получение популярных постов
        [fetchPostsPopular.pending]: (state) => {
            state.posts.status = 'loading'
            state.posts.items = []
        },
        [fetchPostsPopular.fulfilled]: (state, action) => {
            state.posts.status = 'loaded'
            state.posts.items = action.payload
        },
        [fetchPostsPopular.rejected]: (state) => {
            state.posts.status = 'error'
            state.posts.items = []
        },
    }
})

export const postsReducer = postsSlice.reducer