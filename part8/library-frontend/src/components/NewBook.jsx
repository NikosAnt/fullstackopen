import { useMutation } from '@apollo/client/react'
import { useState } from 'react'

import { ALL_BOOKS, ADD_BOOK, ALL_AUTHORS } from '../queries'
import updateCache from '../utils/updateCache'

const NewBook = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [addBook, { loading, error }] = useMutation(ADD_BOOK, {
    update: (cache, { data }) => {
      if (data?.addBook) {
        updateCache(cache, { query: ALL_BOOKS }, data.addBook)
      }
    },
    onError: error => console.error('Error:', error.message)
  })

  const submit = async event => {
    event.preventDefault()
    await addBook({
      variables: {
        title,
        author,
        published: Number(published),
        genres
      }
    })
    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  if (loading) return <div>loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook
