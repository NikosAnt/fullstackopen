import PropTypes from 'prop-types'
import { useState } from 'react'
import { Link, Routes, Route, useMatch, useNavigate } from 'react-router-dom'

import { useField } from './hooks'

const Menu = () => {
  const padding = {
    paddingRight: 5
  }
  return (
    <>
      <Link style={padding} to="/">
        anecdotes
      </Link>
      <Link style={padding} to="/create">
        create new
      </Link>
      <Link style={padding} to="/about">
        about
      </Link>
    </>
  )
}

const Notification = ({ notification }) => <p>{notification}</p>

const Anecdote = ({ anecdote }) => {
  if (!anecdote) {
    return <div>Anecdote not found.</div>
  }
  return (
    <>
      <h2>{anecdote.content}</h2>
      <div>{anecdote.author}</div>
      <div>{anecdote.info}</div>
      <div>votes {anecdote.votes}</div>
    </>
  )
}

const AnecdoteList = ({ anecdotes }) => (
  <>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote => (
        <li key={anecdote.id}>
          <Link to={`/${anecdote.id}`}>{anecdote.content}</Link>
        </li>
      ))}
    </ul>
  </>
)

const About = () => (
  <>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>
      An anecdote is a brief, revealing account of an individual person or an
      incident. Occasionally humorous, anecdotes differ from jokes because their
      primary purpose is not simply to provoke laughter but to reveal a truth
      more general than the brief tale itself, such as to characterize a person
      by delineating a specific quirk or trait, to communicate an abstract idea
      about a person, place, or thing through the concrete details of a short
      narrative. An anecdote is &ldquo;a story with a point&rdquo;.
    </em>

    <p>
      Software engineering is full of excellent anecdotes, at this app you can
      find the best and add more.
    </p>
  </>
)

const Footer = () => (
  <footer>
    Anecdote app for <a href="https://fullstackopen.com/">Full Stack Open</a>.
    See{' '}
    <a href="https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js">
      https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js
    </a>{' '}
    for the source code.
  </footer>
)

const CreateNew = ({ addNew }) => {
  const { reset: resetContent, ...content } = useField('text', 'content')
  const { reset: resetAuthor, ...author } = useField('text', 'author')
  const { reset: resetInfo, ...info } = useField('text', 'info')

  const handleSubmit = e => {
    e.preventDefault()
    addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    })
  }

  return (
    <>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content} />
        </div>
        <div>
          author
          <input {...author} />
        </div>
        <div>
          url for more info
          <input {...info} />
        </div>
        <button>create</button>
        <button
          type="button"
          onClick={() => {
            resetContent()
            resetAuthor()
            resetInfo()
          }}
        >
          reset
        </button>
      </form>
    </>
  )
}

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ])

  const [notification, setNotification] = useState('')
  const navigate = useNavigate()

  const addNew = anecdote => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))
    navigate('/')
    setNotification(`A new anecdote named ${anecdote.content} created!`)
    setTimeout(() => setNotification(''), 5000)
  }

  const anecdoteById = id => anecdotes.find(a => a.id === id)

  const vote = id => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    setAnecdotes(
      anecdotes.map(anecdote => (anecdote.id === id ? voted : anecdote))
    )
  }
  const match = useMatch('/:id')
  const anecdote = match
    ? anecdotes.find(anecdote => anecdote.id === Number(match.params.id))
    : null

  return (
    <>
      <h1>Software anecdotes</h1>
      <Menu />
      <Notification notification={notification} />
      <Routes>
        <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />} />
        <Route path="/:id" element={<Anecdote anecdote={anecdote} />} />
        <Route path="/create" element={<CreateNew addNew={addNew} />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
    </>
  )
}

Notification.propTypes = {
  notification: PropTypes.string.isRequired
}

Anecdote.propTypes = {
  anecdote: PropTypes.shape({
    id: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    info: PropTypes.string.isRequired,
    votes: PropTypes.number.isRequired
  }).isRequired
}

AnecdoteList.propTypes = {
  anecdotes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      content: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      info: PropTypes.string.isRequired,
      votes: PropTypes.number.isRequired
    }).isRequired
  ).isRequired
}

CreateNew.propTypes = {
  addNew: PropTypes.func.isRequired
}

export default App
