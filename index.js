import express from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

mongoose.connect('mongodb+srv://igormelnikov94_db_user:B3CClaZFwDYeXJMi@cluster0.7mmqj3e.mongodb.net/?appName=Cluster0',   
)
    .then(() => console.log('DB ok'))
    .catch((err) => console.log(err))

const app = express()

app.use(express.json())

app.get('/', (req, res) =>{
    res.send('111Hello')
})

app.post('/auth/login', (req, res) => {
    console.log(req.body)

    const token = jwt.sign(
        {
            email: req.body.email,
            fullName: 'Vacya'
        }, 'secret123')

    res.json({
        success: true,
        token,
    })
})

app.listen(4444, (err) =>{
    if (err) {
        return console.log(err)
    }

    console.log('Server OK')
})