import { useQuery } from '@apollo/client/react'
import { useState, useContext } from 'react'

import UserContext from '../contexts/UserContext'
import { ALL_BOOKS } from '../queries'

const Books = () => {
  const { user } = useContext(UserContext)
  const { data, loading, error } = useQuery(ALL_BOOKS)
  const [selectedGenre, setSelectedGenre] = useState(null)

  if (loading) return <div>loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!data) return null

  const genres = Array.from(new Set(data.allBooks.flatMap(book => book.genres)))

  const filteredBooks = selectedGenre
    ? data.allBooks.filter(book => book.genres.includes(selectedGenre))
    : data.allBooks

  return (
    <div>
      <h2>books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map(a => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author?.name || 'Uknown'}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {genres.map(genre => (
        <button key={genre} onClick={() => setSelectedGenre(genre)}>
          {genre}
        </button>
      ))}
      <button onClick={() => setSelectedGenre(null)}>all genres</button>
      {user && (
        <div>
          <h2>recommendations</h2>
          <p>
            books in your favourite genre <b>{user.favouriteGenre}</b>
          </p>
          <table>
            <tbody>
              <tr>
                <th></th>
                <th>author</th>
                <th>published</th>
              </tr>
              {data.allBooks
                .filter(book => book.genres.includes(user.favouriteGenre))
                .map(author => (
                  <tr key={author.title}>
                    <td>{author.title}</td>
                    <td>{author.author?.name || 'Unknown'}</td>
                    <td>{author.published}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Books
