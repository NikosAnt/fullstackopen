import './ts-node-esm.ts'

import express from 'express'

import { calculator, type Operation } from './calculator.ts'

const app = express()

app.use(express.json())

app.get('/ping', (_req: express.Request, res: express.Response) => {
  res.send('pong')
})

app.post('/calculate', (req: express.Request, res: express.Response) => {
  const { value1, value2, op } = req.body

  if (!value1 || Number.isNaN(value1)) {
    return res.status(400).send({ error: '...' })
  }

  const operation = op as Operation
  const result = calculator(Number(value1), Number(value2), operation)
  return res.send({ result })
})

const PORT = 3003

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
