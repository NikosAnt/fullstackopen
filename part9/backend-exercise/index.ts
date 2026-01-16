import './ts-node-esm.ts'

import express from 'express'

import { calculateBmi } from './bmiCalculator.ts'
import { calculateExercises } from './exerciseCalculator.ts'

const app = express()
app.use(express.json())

app.get('/bmi', (req, res) => {
  const height = Number(req.query.height)
  const weight = Number(req.query.weight)

  if (
    req.query.height === undefined ||
    req.query.height === null ||
    req.query.weight === undefined ||
    req.query.weight === null ||
    Number.isNaN(height) ||
    Number.isNaN(weight)
  ) {
    return res.status(400).json({ error: 'malformatted parameters' })
  } else {
    const bmi = calculateBmi(height, weight)
    return res.json({ height, weight, bmi })
  }
})

app.post('/exercises', (req: express.Request, res: express.Response) => {
  const { daily_exercises, target } = req.body

  if (!daily_exercises || target === undefined) {
    return res.status(400).json({ error: 'parameters missing' })
  }

  if (
    !Array.isArray(daily_exercises) ||
    !daily_exercises.every(n => typeof n === 'number') ||
    typeof target !== 'number'
  ) {
    return res.status(400).json({ error: 'malformatted parameters' })
  }

  try {
    const result = calculateExercises(daily_exercises, target)
    const { averageTime, ...rest } = result
    return res.json({ ...rest, average: averageTime })
  } catch (error: unknown) {
    console.error(error)
    return res.status(400).json({ error: 'malformatted parameters' })
  }
})

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
