import {
  useQuery,
  useSubscription,
  useApolloClient
} from '@apollo/client/react'
import { useState, useRef } from 'react'

import LoginForm from './components/LoginForm'
import Notify from './components/Notify'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import PhoneForm from './components/PhoneForm'
import { ALL_PERSONS, PERSON_ADDED } from './queries'
import updateCache from './updateCache'

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem('phonebook-user-token')
  )
  const [errorMessage, setErrorMessage] = useState(null)
  const result = useQuery(ALL_PERSONS)
  const timeoutID = useRef(null)
  const client = useApolloClient()

  useSubscription(PERSON_ADDED, {
    onData: ({ data, client }) => {
      try {
        const addedPerson = data.data.personAdded
        notify(`${addedPerson.name} added`)
        updateCache(client.cache, { query: ALL_PERSONS }, addedPerson)
      } catch {
        // ignore
      }
    },
    onError: error => {
      console.error('PERSON_ADDED error:', error)
    }
  })

  if (result.loading) {
    return <div>loading...</div>
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const notify = message => {
    setErrorMessage(message)
    clearTimeout(timeoutID)
    timeoutID.current = setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  if (!token) {
    return (
      <div>
        <Notify errorMessage={errorMessage} />
        <h2>Login</h2>
        <LoginForm setToken={setToken} setError={notify} />
      </div>
    )
  }

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <button onClick={logout}>logout</button>
      <Persons />
      <PersonForm setError={notify} />
      <PhoneForm setError={notify} />
    </div>
  )
}

export default App
