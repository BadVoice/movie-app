import express from "express"
import cors from "cors"
import logger from 'morgan'

// routes
import streamRouter from './modules/stream/stream.controller'


const app = express()
app.use(cors())  // middlewares
app.use(express.json())
app.use(logger('dev'))

app.use('/stream', streamRouter)

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log("Server starting")
    console.log(`http://localhost:${PORT}`)
})