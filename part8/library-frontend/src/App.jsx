import { useSubscription, useApolloClient } from '@apollo/client/react'
import { useContext } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'

import Authors from './components/Authors'
import Books from './components/Books'
import LoginForm from './components/LoginForm'
import NewBook from './components/NewBook'
import UserContext from './contexts/UserContext'
import { ALL_BOOKS, BOOK_ADDED } from './queries'
import { removeUserFromStorage } from './utils/storage'
import updateCache from './utils/updateCache'

const App = () => {
  const { user, setUser } = useContext(UserContext)
  const client = useApolloClient()

  const navigate = useNavigate()

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      try {
        const addedBook = data.data.bookAdded
        window.alert(`New book added: ${addedBook.title}`)
        updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
      } catch {
        // ignore
      }
    },
    onError: error => {
      console.error('BOOK_ADDED error:', error)
    }
  })

  const handleLogin = userData => {
    setUser(userData)
    navigate('/new')
  }

  const handleLogout = () => {
    setUser(null)
    removeUserFromStorage()
    client.resetStore()
    navigate('/login')
  }

  return (
    <div>
      <nav>
        <Link to="/authors">Authors</Link>
        <Link to="/books">Books</Link>
        {user ? (
          <>
            <Link to="/new">Add Book</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/Login">Login</Link>
        )}
      </nav>

      <Routes>
        <Route path="/authors" element={<Authors />} />
        <Route path="/books" element={<Books />} />
        {user && <Route path="/new" element={<NewBook />} />}
        {!user && (
          <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
        )}
      </Routes>
    </div>
  )
}

export default App
