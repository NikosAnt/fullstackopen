import axios from 'axios'
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'

const useField = type => {
  const [value, setValue] = useState('')

  const onChange = event => {
    setValue(event.target.value)
  }

  return { type, value, onChange }
}

const useCountry = name => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    if (!name) return
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
      .then(response => {
        setCountry({ ...response.data, found: true })
      })
      .catch(() => {
        setCountry({ found: false })
      })
  }, [name])

  if (!name) return null
  return country
}

const Country = ({ country }) => {
  if (!country) {
    return null
  }

  if (!country.found) {
    return <div>not found...</div>
  }

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital {country.capital[0]}</p>
      <p>Area {country.area}</p>
      <h2>Languages</h2>
      <ul>
        {Object.values(country.languages).map(language => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img alt="" src={country.flags.png} />
    </div>
  )
}

function App() {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const country = useCountry(name)

  const fetch = event => {
    event.preventDefault()
    setName(nameInput.value)
  }

  return (
    <>
      <form onSubmit={fetch}>
        find countries <input {...nameInput} />
        <button>find</button>
      </form>
      <Country country={country} />
    </>
  )
}

Country.propTypes = {
  country: PropTypes.shape({
    name: PropTypes.shape({
      common: PropTypes.string.isRequired
    }).isRequired,
    area: PropTypes.number.isRequired,
    capital: PropTypes.arrayOf(PropTypes.string), // optional
    languages: PropTypes.object, // optional
    flags: PropTypes.shape({
      png: PropTypes.string.isRequired
    }).isRequired,
    found: PropTypes.bool
  }).isRequired
}

export default App
