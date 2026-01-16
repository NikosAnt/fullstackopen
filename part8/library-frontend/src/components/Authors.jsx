import { useQuery, useMutation } from '@apollo/client/react'
import { useState, useContext } from 'react'
import Select from 'react-select'

import UserContext from '../contexts/UserContext'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'

const Authors = () => {
  const { user } = useContext(UserContext)
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  const [selectedAuthor, setSelectedAuthor] = useState(null)

  const { data, loading, error } = useQuery(ALL_AUTHORS)

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    update: (cache, { data }) => {
      if (data?.editAuthor) {
        cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
          return {
            allAuthors: allAuthors.map(author =>
              author.name === data.editAuthor.name
                ? { ...author, born: data.editAuthor.born }
                : author
            )
          }
        })
      }
    },
    onError: error => console.error('Error', error.message)
  })

  const handleSubmit = async event => {
    event.preventDefault()
    const targetName = selectedAuthor || name
    if (!targetName) return
    await editAuthor({
      variables: {
        name: targetName,
        setBornTo: Number(born)
      }
    })
    setName('')
    setBorn('')
  }

  if (loading) return <div>loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!data) return null

  const authorOptions = data.allAuthors.map(author => ({
    value: author.name,
    label: author.name
  }))

  const authorValue = authorOptions.find(
    option => option.value === selectedAuthor
  )

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {data.allAuthors.map(a => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {user && (
        <>
          <h3>Set birth year</h3>
          <form onSubmit={handleSubmit}>
            <div>
              Author
              <Select
                options={authorOptions}
                value={authorValue}
                onChange={option =>
                  setSelectedAuthor(option ? option.value : null)
                }
              />
            </div>
            <label style={{ display: 'block' }} htmlFor="born">
              born
              <input
                id="born"
                type="text"
                value={born}
                onChange={({ target }) => setBorn(target.value)}
              />
            </label>
            <button
              type="submit"
              disabled={(!selectedAuthor && !name) || !born}
            >
              update author
            </button>
          </form>
        </>
      )}
    </div>
  )
}

export default Authors
