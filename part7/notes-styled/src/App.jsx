import PropTypes from 'prop-types'
import { useState } from 'react'
import {
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  useMatch
} from 'react-router-dom'
import style from 'styled-components'

const Button = style.button`
  background: Bisque;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid Chocolate;
  border-radius: 3px;
`
const Input = style.input`
  margin: 0.25em;
`

const Page = style.main`
  padding: 1em;
  background: papayawhip;
`

const Navigation = style.nav`
  background: BurlyWood;
  padding: 1em;
`

const Footer = style.footer`
  background: Chocolate;
  padding: 1em;
  margin-top: 1em;
`

const Home = () => (
  <div>
    <h2>TKTL notes app</h2>
    <p>
      Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      Lorem Ipsum has been the industry&apos;s standard dummy text ever since
      the 1500s, when an unknown printer took a galley of type and scrambled it
      to make a type specimen book. It has survived not only five centuries, but
      also the leap into electronic typesetting, remaining essentially
      unchanged. It was popularized in the 1960s with the release of Letraset
      sheets containing Lorem Ipsum passages, and more recently with desktop
      publishing software like Aldus PageMaker including versions of Lorem
      Ipsum.
    </p>
  </div>
)

const Note = ({ note }) => {
  if (!note) {
    return <section>Note not found.</section>
  }
  return (
    <section>
      <h2>{note.content}</h2>
      <p>{note.user}</p>
      <p>
        <strong>{note.important ? 'important' : ''}</strong>
      </p>
    </section>
  )
}

const Notes = ({ notes }) => (
  <section>
    <h2>Notes</h2>
    <ul>
      {notes.map(note => (
        <li key={note.id}>
          {' '}
          <Link to={`/notes/${note.id}`}>{note.content}</Link>{' '}
        </li>
      ))}
    </ul>
  </section>
)

const userList = [
  { id: 1, name: 'John Smith' },
  { id: 2, name: 'Adam Saddler' },
  { id: 3, name: 'Ares James' }
]

const Users = () => (
  <section>
    <h2>TKTL notes app</h2>
    <ul>
      {userList.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  </section>
)

const Login = props => {
  const navigate = useNavigate()

  const onSubmit = event => {
    event.preventDefault()
    props.onLogin('mluukkai')
    navigate('/')
  }

  return (
    <section>
      <h2>login</h2>
      <form onSubmit={onSubmit}>
        <label htmlFor="username">
          username: <Input id="username" type="text" />
        </label>
        <label htmlFor="password">
          password: <Input id="password" type="password" />
        </label>
        <Button type="submit" primary="">
          login
        </Button>
      </form>
    </section>
  )
}

const App = () => {
  const notes = [
    {
      id: 1,
      content: 'HTML is easy',
      important: true,
      user: 'Matti Luukkainen'
    },
    {
      id: 2,
      content: 'Browser can execute only Javascript',
      important: false,
      user: 'Matti Luukkainen'
    },
    {
      id: 3,
      content: 'Most important methods of HTTP-protocol are GET and POST',
      important: true,
      user: 'Arto Hellas'
    }
  ]

  const [user, setUser] = useState(null)

  const login = user => {
    setUser(user)
  }

  const padding = {
    padding: 5
  }

  const match = useMatch('/notes/:id')
  const note = match
    ? notes.find(note => note.id === Number(match.params.id))
    : null

  return (
    <Page>
      <Navigation>
        <Link style={padding} to="/">
          home
        </Link>
        <Link style={padding} to="/notes">
          notes
        </Link>
        <Link style={padding} to="/users">
          users
        </Link>
        {user ? (
          <em>{user} logged in</em>
        ) : (
          <Link style={padding} to="/login">
            login
          </Link>
        )}
      </Navigation>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/notes" element={<Notes notes={notes} />} />
        <Route path="/notes/:id" element={<Note note={note} />} />
        <Route
          path="/users"
          element={user ? <Users /> : <Navigate replace to="/login" />}
        />
        <Route path="/login" element={<Login onLogin={login} />} />
      </Routes>

      <Footer>
        <br />
        <i>Note app, Department of Computer Science 2024</i>
      </Footer>
    </Page>
  )
}

Note.propTypes = {
  note: PropTypes.shape({
    id: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    important: PropTypes.bool.isRequired,
    user: PropTypes.string.isRequired
  }).isRequired
}

Notes.propTypes = {
  notes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      content: PropTypes.string.isRequired,
      important: PropTypes.bool.isRequired,
      user: PropTypes.string.isRequired
    }).isRequired
  ).isRequired
}

Login.propTypes = {
  onLogin: PropTypes.func.isRequired
}

export default App
