import helmet from 'helmet'
import cors from 'cors'
import express from 'express'

import diaryRouter from './routes/diaries'

const app = express()
app.use(helmet())
app.use(cors())
app.use(express.json())

const PORT = 3000

app.get('/ping', (_req, res) => {
  console.info('someone pinged here')
  res.send('pong')
})

app.use('/api/diaries', diaryRouter)

app.listen(PORT, () => {
  console.info(`Server running on port ${PORT}`)
})
