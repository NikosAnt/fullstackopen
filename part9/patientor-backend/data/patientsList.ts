import { PatientSchema } from '../src/utils'

import patients from './patients.json'

export const patientList = patients.map(obj => PatientSchema.parse(obj))
