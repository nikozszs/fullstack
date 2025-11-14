import express, { json } from 'express'
import multer from 'multer'
import mongoose from 'mongoose'
import { registerValidation, loginValidation, postCreateValidation } from './validations.js'
import { checkAuth, handleErrors } from './utils/index.js'
import { UserController, PostController } from './controllers/index.js'


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
app.use('/uploads', express.static('uploads'))

app.get('/auth/me', checkAuth, UserController.getMe)
app.post('/auth/login', loginValidation, handleErrors, UserController.login)
app.post('/auth/register', registerValidation, handleErrors, UserController.register)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

app.get('/posts', PostController.getAll)
app.get('/post/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, handleErrors, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleErrors, PostController.update)

app.listen(4444, (err) =>{
    if (err) {
        return console.log(err)
    }

    console.log('Server OK')
})