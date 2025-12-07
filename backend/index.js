import express, { json } from 'express'
import multer from 'multer'
import mongoose from 'mongoose'
import { registerValidation, loginValidation, postCreateValidation, commentCreateValidation } from './validations.js'
import { checkAuth, handleErrors } from './utils/index.js'
import { getAll, create, update, remove, getOne, getTags, getPostsByTag, getPopularPosts } from './controllers/PostController.js'
import { getMe, login, register } from './controllers/UserController.js'
import cors from 'cors';
import { createComment, getPostComments, getRandomComments } from './controllers/CommentsController.js'
import fs from 'fs';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './config.js';
import { uploadAvatars, uploadFile } from './controllers/UploadController.js'

mongoose.connect('mongodb+srv://igormelnikov94_db_user:B3CClaZFwDYeXJMi@cluster0.7mmqj3e.mongodb.net/blog?appName=Cluster0',   
)
    .then(() => console.log('DB ok'))
    .catch((err) => console.log(err))

const app = express()

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'recipe-blog',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
      public_id: (req, file) => {
        return `post_${Date.now()}_${Math.round(Math.random() * 1E9)}`;
      }
    }
});

const avatarStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'recipe-blog/avatars',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 200, height: 200, crop: 'fill', gravity: 'face' }],
      public_id: (req, file) => {
        return `avatar_${Date.now()}_${Math.round(Math.random() * 1E9)}`;
      }
    }
});

const uploadAvatar = multer({ storage: avatarStorage });

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
})

app.use(express.json())
app.use(cors());

const uploadsDir = '/tmp/uploads';
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir))

app.get('/favicon.ico', (req, res) => {
    res.status(204).end()
})

app.get('/', (req, res) => {
    res.json({
        message: 'Recipe Blog API Server is running!',
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});

// Маршруты аутентификации
app.get('/auth/me', checkAuth, getMe)
app.post('/auth/login', loginValidation, handleErrors, login)
app.post('/auth/register', registerValidation, handleErrors, register)

// Маршрут загрузки файлов
app.post('/upload', upload.single('image'), uploadFile)
app.post('/upload-avatar', uploadAvatar.single('image'), uploadAvatars)

// Маршруты тегов
app.get('/tags', getTags)
app.get('/posts/tags/:tagName', getPostsByTag)

// Маршруты постов
app.get('/posts', getAll)
app.get('/post/:id', getOne)
app.get('/posts/popular', getPopularPosts)
app.post('/posts', checkAuth, postCreateValidation, handleErrors, create)
app.delete('/posts/:id', checkAuth, remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleErrors, update)

// Маршруты комментариев
app.post('/comments', checkAuth, commentCreateValidation, handleErrors, createComment)
app.get('/comments/random', getRandomComments)
app.get('/comments/post/:postId', getPostComments)

app.listen(4444, (err) => {
    if (err) {
        return console.log(err)
    }

    console.log(`Server OK`)
})