import axios from 'axios'

import type { Diagnosis } from '../types'
import { apiBaseUrl } from '../constants'

export const getDiagnoses = async (): Promise<Diagnosis[]> => {
  const { data } = await axios.get<Diagnosis[]>(`${apiBaseUrl}/diagnoses`)
  return data
}
