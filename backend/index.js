import express, { json } from 'express'
import multer from 'multer'
import mongoose from 'mongoose'
import { registerValidation, loginValidation, postCreateValidation, commentCreateValidation } from './validations.js'
import { checkAuth, handleErrors } from './utils/index.js'
import { getAll, create, update, remove, getOne, getTags, getPostsByTag, getPopularPosts } from './controllers/PostController.js'
import { getMe, login, register } from './controllers/UserController.js'
import cors from 'cors';
import { createComment, getPostComments, getRandomComments } from './controllers/CommentsController.js'
import path from 'path'
import { fileURLToPath } from 'url'
import { uploadFile } from './controllers/UploadController.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose.connect('mongodb+srv://igormelnikov94_db_user:B3CClaZFwDYeXJMi@cluster0.7mmqj3e.mongodb.net/blog?appName=Cluster0',   
)
    .then(() => console.log('DB ok'))
    .catch((err) => console.log(err))

const app = express()

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const fileExtension = path.extname(file.originalname)
        const fileName = uniqueSuffix + fileExtension
        cb(null, fileName)
    }
})

const upload = multer({ 
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB лимит
    },
    fileFilter: (_, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Можно загружать только изображения'), false);
        }
    }
})

app.use(express.json())
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.get('/favicon.ico', (req, res) => {
    res.status(204).end()
})

app.get('/', (req, res) => {
    res.json({
        message: 'Recipe Blog API Server is running!',
        status: 'OK',
        timestamp: new Date().toISOString(),
        endpoints: {
        posts: '/posts, /post/:id, /posts/popular',
        auth: '/auth/login, /auth/register, /auth/me',
        uploads: '/upload',
        comments: '/comments, /comments/random, /comments/post/:postId',
        tags: '/tags, /posts/tags/:tagName'
        }
    });
});

// Маршруты аутентификации
app.get('/auth/me', checkAuth, getMe)
app.post('/auth/login', loginValidation, handleErrors, login)
app.post('/auth/register', registerValidation, handleErrors, register)

// Маршрут загрузки файлов
app.post('/upload', checkAuth, upload.single('image'), uploadFile)

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

app.listen(4444, (err) =>{
    if (err) {
        return console.log(err)
    }

    console.log('Server OK')
})