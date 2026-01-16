import { useQuery } from '@apollo/client/react'
import { useState } from 'react'

import { ALL_PERSONS, FIND_PERSON } from '../queries'
import Person from './Person'

const Persons = () => {
  const [nameToSearch, setNameToSearch] = useState(null)
  const { data } = useQuery(ALL_PERSONS)
  const result = useQuery(FIND_PERSON, {
    variables: { nameToSearch },
    skip: !nameToSearch
  })

  if (nameToSearch && result.data) {
    return (
      <Person
        person={result.data.findPerson}
        onClose={() => setNameToSearch(null)}
      />
    )
  }

  return (
    <div>
      <h2>Persons</h2>
      {data.allPersons.map(p => (
        <div key={p.id}>
          {p.name} {p.phone}
          <button onClick={() => setNameToSearch(p.name)}>show address</button>
        </div>
      ))}
    </div>
  )
}

export default Persons
