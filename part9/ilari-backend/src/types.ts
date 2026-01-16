import type { z } from 'zod'

import type { NewEntrySchema } from './utils'

export enum Weather {
  Sunny = 'sunny',
  Rainy = 'rainy',
  Cloudy = 'cloudy',
  Stormy = 'stormy',
  Windy = 'windy'
}

export enum Visibility {
  Great = 'great',
  Good = 'good',
  Ok = 'ok',
  Poor = 'poor'
}

export type NewDiaryEntry = z.infer<typeof NewEntrySchema>

export interface DiaryEntry extends NewDiaryEntry {
  id: number
}

export type NonSensitiveDiaryEntry = Omit<DiaryEntry, 'comment'>
