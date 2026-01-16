import type { DiaryEntry } from '../src/types'
import { NewEntrySchema } from '../src/utils'

import data from './entries.json'

const diaryEntries: DiaryEntry[] = data.map(obj => {
  const object = NewEntrySchema.parse(obj)
  return {
    ...object,
    id: obj.id
  }
})

export default diaryEntries
