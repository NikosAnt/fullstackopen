import type {
  NewDiaryEntry,
  NonSensitiveDiaryEntry,
  DiaryEntry
} from '../types'
import diaryEntries from '../../data/diaryEntries'

const getEntries = (): DiaryEntry[] => {
  return diaryEntries
}

const getNonSensitiveEntries = (): NonSensitiveDiaryEntry[] => {
  return diaryEntries.map(({ id, date, weather, visibility, comment }) => ({
    id,
    date,
    weather,
    visibility,
    comment
  }))
}

const addDiary = (entry: NewDiaryEntry): DiaryEntry => {
  const newDiaryEntry = {
    ...entry,
    id: Math.max(...diaryEntries.map(d => d.id)) + 1
  }

  diaryEntries.push(newDiaryEntry)
  return newDiaryEntry
}

const findById = (id: number): DiaryEntry | undefined => {
  const entry = diaryEntries.find(d => d.id === id)
  return entry
}

export default {
  getEntries,
  getNonSensitiveEntries,
  addDiary,
  findById
}
