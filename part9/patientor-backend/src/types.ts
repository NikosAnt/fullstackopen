import type { z } from 'zod'

import type { DiagnosisSchema, NewPatientSchema, PatientSchema } from './utils'

export enum Gender {
  male = 'male',
  female = 'female',
  other = 'other'
}

export type Diagnosis = z.infer<typeof DiagnosisSchema>

export type NewPatient = z.infer<typeof NewPatientSchema>

export type Patient = z.infer<typeof PatientSchema>

export type NonSensitivePatient = Omit<Patient, 'ssn'>
