import express, { json } from 'express'
import multer from 'multer'
import mongoose from 'mongoose'
import { registerValidation, loginValidation, postCreateValidation, commentCreateValidation } from './validations.js'
import { checkAuth, handleErrors } from './utils/index.js'
import { getAll, create, update, remove, getOne, getTags, getPostsByTag, getPopularPosts } from './controllers/PostController.js'
import { getMe, login, register } from './controllers/UserController.js'
import cors from 'cors';
import { createComment, getPostComments, getRandomComments } from './controllers/CommentsController.js'

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
        cb(null, file.originalname)
    }
})

const upload = multer({ storage })

app.use(express.json())
app.use(cors());
app.use('/uploads', express.static('uploads'))

app.get('/auth/me', checkAuth, getMe)
app.post('/auth/login', loginValidation, handleErrors, login)
app.post('/auth/register', registerValidation, handleErrors, register)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: ('/uploads/' + req.file.originalname),
    })
})

app.get('/tags', getTags)
app.get('/posts/tags/:tagName', getPostsByTag)


app.get('/posts', getAll)
app.get('/post/:id', getOne)
app.get('/posts/popular', getPopularPosts)
app.post('/posts', checkAuth, postCreateValidation, handleErrors, create)
app.delete('/posts/:id', checkAuth, remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleErrors, update)


app.post('/comments', checkAuth, commentCreateValidation, handleErrors, createComment)
app.get('/comments/random', getRandomComments)
app.get('/comments/post/:postId', getPostComments)

app.listen(4444, (err) =>{
    if (err) {
        return console.log(err)
    }

    console.log('Server OK')
})