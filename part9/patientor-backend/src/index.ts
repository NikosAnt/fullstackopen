import helmet from 'helmet'
import express from 'express'
import cors from 'cors'

import router from './routes/routes'

const app = express()
app.use(cors())
app.use(helmet())
app.use(express.json())
app.use('/api', router)

const PORT = 3001

app.listen(PORT, () => {
  console.info(`Server running on port ${PORT}`)
})
