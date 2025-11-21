import { configureStore } from '@reduxjs/toolkit'
import { postsReducer } from './slices/postsSlice'
import { authReducer } from './slices/auth'
import { commentsReducer } from './slices/commentsSlice'

const store = configureStore({
    reducer: {
        posts: postsReducer,
        auth: authReducer,
        comments: commentsReducer
    }
})

export default store