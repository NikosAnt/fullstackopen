import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  TextField,
  Button,
  Alert,
  AppBar,
  Toolbar
} from '@mui/material'
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

const Home = () => (
  <section>
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
  </section>
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
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {notes.map(note => (
            <TableRow key={note.id}>
              <TableCell>
                <Link to={`/notes/${note.id}`}>{note.content}</Link>{' '}
              </TableCell>
              <TableCell>{note.user}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
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
        <legend>Login Form</legend>
        <TextField label="username" fullWidth margin="normal" />
        <TextField label="password" type="password" fullWidth margin="normal" />
        <Button variant="contained" color="primary" type="submit">
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
  const [message, setMessage] = useState(null)

  const login = user => {
    setUser(user)
    setMessage(`welcome ${user}`)
    setTimeout(() => setMessage(null), 10000)
  }

  const match = useMatch('/notes/:id')
  const note = match
    ? notes.find(note => note.id === Number(match.params.id))
    : null

  return (
    <Container component="main">
      <header>
        {message && <Alert severity="success">{message}</Alert>}
        <AppBar position="static">
          <Toolbar>
            <Button color="inherit" component={Link} to="/">
              home
            </Button>
            <Button color="inherit" component={Link} to="/notes">
              notes
            </Button>
            <Button color="inherit" component={Link} to="/users">
              users
            </Button>
            {user ? (
              <em>{user} logged in</em>
            ) : (
              <Button color="inherit" component={Link} to="/login">
                login
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </header>

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

      <footer>
        <br />
        <i>Note app, Department of Computer Science 2024</i>
      </footer>
    </Container>
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
