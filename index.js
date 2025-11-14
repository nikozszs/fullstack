import express from 'express'
import multer from 'multer'
import mongoose from 'mongoose'
import { registerValidation, loginValidation, postCreateValidation } from './validations.js'
import checkAuth from './utils/checkAuth.js'
import { register, login, getMe } from './controllers/UserController.js'
import { create, getAll, getOne, remove, update } from './controllers/PostController.js'


mongoose.connect('mongodb+srv://igormelnikov94_db_user:B3CClaZFwDYeXJMi@cluster0.7mmqj3e.mongodb.net/blog?appName=Cluster0',   
)
    .then(() => console.log('DB ok'))
    .catch((err) => console.log(err))

const app = express()

app.use(express.json())

app.get('/auth/me', checkAuth, getMe)

app.post('/auth/login', loginValidation, login)

app.post('/auth/register', registerValidation, register)

app.get('/posts', getAll)
app.get('/post/:id', getOne)
app.post('/posts', checkAuth, postCreateValidation, create)
app.delete('/posts/:id', checkAuth, remove)
app.patch('/posts/:id', checkAuth, update)

app.listen(4444, (err) =>{
    if (err) {
        return console.log(err)
    }

    console.log('Server OK')
})