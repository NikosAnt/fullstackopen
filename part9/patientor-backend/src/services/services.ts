import { v4 as uuid } from 'uuid'

import { diagnosisList } from '../../data/diagnosesList'
import { patientList } from '../../data/patientsList'
import type {
  Diagnosis,
  Patient,
  NonSensitivePatient,
} from '../types'
import { EntrySchema, NewPatientSchema } from '../utils'

export const getDiagnoses = (): Diagnosis[] => {
  return diagnosisList
}

export const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patientList.map(
    ({ id, name, dateOfBirth, gender, occupation, entries }) => ({
      id,
      name,
      dateOfBirth,
      gender,
      occupation,
      entries
    })
  )
}

export const getNonSensitivePatient = (id: string): NonSensitivePatient => {
  const patient = patientList.find(patient => patient.id === id)
  if (!patient) {
    throw new Error('No patient found with that id')
  }
  return patient
}

export const addPatient = (obj: unknown): Patient => {
  const parsed = NewPatientSchema.parse(obj)
  const newPatient = {
    id: uuid(),
    entries: [],
    ...parsed
  }

  patientList.push(newPatient)
  return newPatient
}

export const addEntry = (patientId: string, entryData: object): Patient | undefined => {
  const parsedEntry = EntrySchema.parse({
    ...entryData,
    id: uuid()
  })

  const patient = patientList.find(patient => patient.id === patientId)
  if (!patient) return undefined
  patient.entries.push(parsedEntry)
  return patient
}