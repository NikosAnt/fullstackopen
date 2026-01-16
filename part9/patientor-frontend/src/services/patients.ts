import axios from 'axios'

import type { Patient, PatientFormValues, Entry, NewEntry } from '../types'
import { apiBaseUrl } from '../constants'

export const getPatients = async (): Promise<Patient[]> => {
  const { data } = await axios.get<Patient[]>(`${apiBaseUrl}/patients`)
  return data
}

export const getPatientById = async (id: string): Promise<Patient> => {
  const { data } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`)
  return data
}

export const createPatient = async (
  object: PatientFormValues
): Promise<Patient> => {
  const { data } = await axios.post<Patient>(`${apiBaseUrl}/patients`, object)
  return data
}

export const createEntry = async (
  patientId: string,
  entry: NewEntry
): Promise<Entry> => {
  const { data } = await axios.post<Entry>(
    `${apiBaseUrl}/patients/${patientId}/entries`,
    entry
  )
  return data
}
