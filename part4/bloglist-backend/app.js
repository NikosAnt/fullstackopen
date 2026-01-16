import compression from 'compression'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { connect } from 'mongoose'
import morgan from 'morgan'

import blogRouter from './controllers/blogs'
import loginRouter from './controllers/login'
import usersRouter from './controllers/users'
import { MONGODB_URI } from './utils/config'
import { info, error } from './utils/logger'
import {
  tokenExtractor,
  unknownEndpoint,
  errorHandler
} from './utils/middleware'

const app = express()

info('Connecting to', MONGODB_URI)

connect(MONGODB_URI)
  .then(() => {
    info('Connected to MongoDB')
  })
  .catch(err => {
    error('Error connecting to MongoDB:', err.message)
  })

app.use(
  compression({
    threshold: 512
  })
)
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())
app.use(cors())
app.use(tokenExtractor)

// Route definitions
app.get('/', (req, res) => {
  res.send('Bloglist API is running')
})

app.use('/api/blogs', blogRouter)
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)

if (process.env.NODE_ENV === 'test') {
  const { testingRouter } = await import('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(unknownEndpoint)
app.use(errorHandler)

export default app
