export interface Diary {
  id: string
  date: string
  weather: string
  visibility: string
  comment?: string
}

export type NewDiary = Omit<Diary, 'id'>
