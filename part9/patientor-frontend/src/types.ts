export interface Diagnosis {
  code: string
  name: string
  latin?: string
}

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other'
}

interface Discharge {
  date: string
  criteria: string
}

interface SickLeave {
  startDate: string
  endDate: string
}

export enum HealthCheckRating {
  Healthy = 0,
  LowRisk = 1,
  HighRisk = 2,
  CriticalRisk = 3
}

interface BaseEntry {
  id: string
  date: string
  description: string
  specialist: string
  diagnosisCodes?: string[]
}

interface HospitalEntry extends BaseEntry {
  type: 'Hospital'
  discharge: Discharge
}

interface OccupationalHealthcareEntry extends BaseEntry {
  type: 'OccupationalHealthcare'
  employerName: string
  sickLeave?: SickLeave
}

export interface HealthCheckEntry extends BaseEntry {
  type: 'HealthCheck'
  healthCheckRating: HealthCheckRating
}

export type NewHospitalEntry = Omit<HospitalEntry, 'id'>

export type NewOccupationalHealthcareEntry = Omit<
  OccupationalHealthcareEntry,
  'id'
>

export type NewHealthCheckEntry = Omit<HealthCheckEntry, 'id'>

export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry

export type NewEntry =
  | NewHospitalEntry
  | NewOccupationalHealthcareEntry
  | NewHealthCheckEntry

export interface Patient {
  id: string
  name: string
  occupation: string
  gender: Gender
  ssn?: string
  dateOfBirth?: string
  entries: Entry[]
}

export type PatientFormValues = Omit<Patient, 'id' | 'entries'>
