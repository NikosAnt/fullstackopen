import { type ReactElement, type FormEvent, useEffect, useState } from 'react'
import type { AxiosError } from 'axios'

import type { Diary } from './types'
import { createDiary, getAllDiaries } from './diaryService'

const App = (): ReactElement => {
  const [diaries, setDiaries] = useState<Diary[]>([])
  const [date, setDate] = useState('')
  const [weather, setWeather] = useState('')
  const [visibility, setVisibility] = useState('')
  const [comment, setComment] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        const data = await getAllDiaries()
        setDiaries(data)
      } catch (error) {
        console.error(error)
      }
    }
    void fetchDiaries()
  }, [])

  const diaryCreation = (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    void (async () => {
      try {
        const data = await createDiary({
          date,
          weather,
          visibility,
          comment
        })
        setDiaries(diaries.concat(data))
        setDate('')
        setWeather('')
        setVisibility('')
        setComment('')
      } catch (error: unknown) {
        const axiosError = error as AxiosError<{ error: string }>
        setError(axiosError.response?.data.error ?? 'An error occurred')
      }
    })()
  }

  return (
    <main>
      <h2>Add new entry</h2>
      {error !== null && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={diaryCreation}>
        <article>
          <label htmlFor="date">
            date
            <input
              id="date"
              type="date"
              value={date}
              onChange={event => setDate(event.target.value)}
            />
          </label>
        </article>
        <article>
          <span>visibility</span>
          {['great', 'good', 'ok', 'poor'].map(option => (
            <label key={option} htmlFor="visibility">
              <input
                type="radio"
                id="visibility"
                name="visibility"
                value={option}
                checked={visibility === option}
                onChange={() => setVisibility(option)}
                required
              />
              {option}
            </label>
          ))}
        </article>
        <article>
          <span>weather</span>
          {['sunny', 'rainy', 'cloudy', 'stormy'].map(option => (
            <label key={option} htmlFor="weather">
              <input
                type="radio"
                id="weather"
                name="weather"
                value={option}
                checked={weather === option}
                onChange={() => setWeather(option)}
                required
              />
              {option}
            </label>
          ))}
        </article>
        <article>
          <label htmlFor="comment">
            comment
            <input
              id="comment"
              type="text"
              value={comment}
              onChange={event => setComment(event.target.value)}
            />
          </label>
        </article>
        <button type="submit">add</button>
      </form>
      <section>
        <h2>Diary Entries</h2>
        {diaries.map(diary => (
          <article key={diary.id}>
            <h3>{diary.date.substring(10, -1)}</h3>
            <p>visibility: {diary.visibility}</p>
            <p>weather: {diary.weather}</p>
            {diary.comment != null && diary.comment !== '' ? (
              <p>comment: {diary.comment} </p>
            ) : null}
          </article>
        ))}
      </section>
    </main>
  )
}

export default App
