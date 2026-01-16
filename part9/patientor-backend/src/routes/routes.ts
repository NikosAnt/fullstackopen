import { Router, type Request, type Response } from 'express'

import type {
  Diagnosis,
  Patient,
  NonSensitivePatient
} from '../types'
import {
  getDiagnoses,
  getNonSensitivePatients,
  getNonSensitivePatient,
  addPatient,
  addEntry
} from '../services/services'
import { errorMiddleware } from '../utils'

const router = Router()

router.get('/diagnoses', (_req, res: Response<Diagnosis[]>) => {
  res.send(getDiagnoses())
})

router.get('/patients', (_req, res: Response<NonSensitivePatient[]>) => {
  res.send(getNonSensitivePatients())
})

router.get('/patients/:id', (req, res) => {
  try {
    const id = req.params.id
    res.send(getNonSensitivePatient(id))
  } catch (error) {
    res.status(404).send({ error: (error as Error).message })
  }
})

router.post(
  '/patients',
  (req: Request<unknown, unknown, unknown>, res: Response<Patient>) => {
    const addedPatient = addPatient(req.body)
    res.json(addedPatient)
  }
)

router.post(
  '/patients/:id/entries',
  (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const updatedPatient = addEntry(id, req.body)
      if (!updatedPatient) {
        return res.status(404).json({ error: 'Patient not found' })
      }
      return res.json(updatedPatient)
    } catch {
      return res.status(400).json({ error: 'Invalid entry data' })
    }
  }
)

router.use(errorMiddleware)

export default router
