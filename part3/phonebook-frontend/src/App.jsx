import { useState, useEffect } from 'react'
import personService from './services/persons'

let timeoutID;

const Filter = ({ handleFilterChange }) => {
  return (
    <div>filter shown with <input
      onChange={handleFilterChange} />
    </div>
  )
}

const PersonForm = ({ addPerson, newName, handlePersonChange,
  newNumber, handleNumberChange }) => {
  return (
    <form onSubmit={addPerson}>
      <div>name: <input value={newName}
        onChange={handlePersonChange} />
      </div>
      <div>number: <input value={newNumber}
        onChange={handleNumberChange} />
      </div>
      <button type="submit">add</button>
    </form>
  )
}

const DeleteButton = ({ id, deleteFunction }) => {
  return (
    <button onClick={() => deleteFunction(id)}>delete</button>
  )
}

const Person = ({ person, deleteFunction }) => {
  return (
    <p>
      {person.name} {person.number} <DeleteButton
        id={person.id} deleteFunction={deleteFunction}
      />
    </p>
  )
}

const Persons = ({ persons, deleteFunction }) => {
  return (
    <div>
      {persons.map((person) =>
        <Person key={person.id} person={person} deleteFunction={deleteFunction} />
      )}
    </div>
  )
}

const Notification = ({ message, type}) => {
  if (message === null) {
    return null
  }

  return (
    <div className={type ? 'error' : 'notification'}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterQuery, setFilterQuery] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    if (newName === '' || newNumber === '') {
      alert('Fields cannot be empty')
      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    const timer = () => {
      setNewName('')
      setNewNumber('')
      clearTimeout(timeoutID)
      timeoutID = setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }

    const names = persons.map(person => person.name)
    if (names.includes(newName)) {
      const person = persons.find(person => person.name === newName)
      if (window.confirm(`${person.name} is already added to the phonebook, 
        replace the old number with a new one?`)) {
        const updatedPerson = { ...person, number: newNumber }
        personService
          .update(person.id, updatedPerson)
          .then(updatedPerson => {
            setPersons(persons.map(person =>
              person.id !== updatedPerson.id ? person : updatedPerson))
          })
        setNotificationMessage(`Updated ${updatedPerson.name}`)
        timer()
      }
      return
    }

    personService
      .create(personObject)
      .then(initialPerson => {
        setPersons(persons.concat(initialPerson))
        setNotificationMessage(`Added ${initialPerson.name}`)
      })
      .catch(error => {
        setNotificationMessage(`Error: ${error.response.data.error}`)
      })
    timer()
  }

  const deletePerson = (id) => {
    const person = persons.find(person => person.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        }).catch(error => {
          setNotificationMessage(
            `Information of ${person.name} has already been removed from the server`
          )
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  const handleFilterChange = (event) => {
    setFilterQuery(event.target.value.toLowerCase())
  }

  const handlePersonChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} type={
        notificationMessage && notificationMessage.startsWith('Error') ? true : false
      } />
      <Filter handleFilterChange={handleFilterChange} />
      <h2>Add a new</h2>
      <PersonForm addPerson={addPerson} newName={newName}
        handlePersonChange={handlePersonChange} newNumber={newNumber}
        handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons persons={persons.filter(person =>
        person.name.toLowerCase().includes(filterQuery))}
        deleteFunction={deletePerson} />
    </div>
  )
}

export default App