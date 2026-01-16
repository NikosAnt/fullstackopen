import { z } from 'zod'
import type { Request, Response } from 'express'

import { Gender } from './types'

export const DiagnosisSchema = z.object({
  code: z.string(),
  name: z.string(),
  latin: z.string().optional()
})

export const NewPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.coerce.date(),
  ssn: z.string(),
  gender: z.enum([Gender.female, Gender.male, Gender.other]),
  occupation: z.string()
})

export const DiagnosisCodesSchema = z.object({
  diagnosisCodes: z.array(z.string()).optional()
})

const BaseEntrySchema = z.object({
  id: z.string(),
  description: z.string(),
  date: z.string(),
  specialist: z.string(),
}).extend(DiagnosisCodesSchema.shape)

const HealthCheckEntrySchema = BaseEntrySchema.extend({
  type: z.literal('HealthCheck'),
  healthCheckRating: z.union([
    z.literal(0),
    z.literal(1),
    z.literal(2),
    z.literal(3)
  ])
})

const HospitalEntrySchema = BaseEntrySchema.extend({
  type: z.literal('Hospital'),
  discharge: z.object({
    date: z.string(),
    criteria: z.string()
  })
})

const OccupationalHealthcareEntrySchema = BaseEntrySchema.extend({
  type: z.literal('OccupationalHealthcare'),
  employerName: z.string(),
  sickLeave: z
    .object({
      startDate: z.string(),
      endDate: z.string()
    })
    .optional()
})

export const EntrySchema = z.discriminatedUnion('type', [
  HealthCheckEntrySchema,
  HospitalEntrySchema,
  OccupationalHealthcareEntrySchema
])

export const PatientSchema = NewPatientSchema.extend({
  id: z.string(),
  entries: z.array(EntrySchema)
})

export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response): void => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: 'Validation error' })
  } else {
    res.status(500).send({ error: 'Internal server error' })
  }
}
