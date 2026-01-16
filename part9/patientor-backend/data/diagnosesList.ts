import type { Diagnosis } from '../src/types'

import diagnoses from './diagnoses.json'

export const diagnosisList: Diagnosis[] = diagnoses.map(patient => ({
  ...patient
}))
