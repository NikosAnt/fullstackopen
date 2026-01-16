import { useApolloClient, useMutation } from '@apollo/client/react'
import PropTypes from 'prop-types'
import { useState } from 'react'

import { ALL_PERSONS, CREATE_PERSON } from '../queries'
import updateCache from '../updateCache'

const PersonForm = ({ setError }) => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const client = useApolloClient()

  const [createPerson] = useMutation(CREATE_PERSON, {
    refetchQueries: [{ query: ALL_PERSONS }],
    onError: error => {
      const message = error.message
      setError(message)
    },
    onCompleted: data => {
      updateCache(client.cache, { query: ALL_PERSONS }, data.addPerson)
    }
  })

  const submit = event => {
    event.preventDefault()

    createPerson({
      variables: {
        name,
        street,
        city,
        phone: phone.length > 0 ? phone : undefined
      }
    })

    setName('')
    setPhone('')
    setStreet('')
    setCity('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={submit}>
        <div>
          name
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          phone
          <input
            value={phone}
            onChange={({ target }) => setPhone(target.value)}
          />
        </div>
        <div>
          street
          <input
            value={street}
            onChange={({ target }) => setStreet(target.value)}
          />
        </div>
        <div>
          city
          <input
            value={city}
            onChange={({ target }) => setCity(target.value)}
          />
        </div>
        <button type="submit">add!</button>
      </form>
    </div>
  )
}

PersonForm.propTypes = {
  setError: PropTypes.func.isRequired
}

export default PersonForm
