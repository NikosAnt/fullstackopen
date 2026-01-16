import PromisePolyfill from 'promise-polyfill'
import { useState, useEffect } from 'react'
import axios from 'axios'

if (!window.Promise) {
  window.Promise = PromisePolyfill
}

const useNotes = url => {
  const [notes, setNotes] = useState([])
  useEffect(() => {
    axios.get(url).then(response => {
      setNotes(response.data)
    })
  }, [url])
  return notes
}

const App = () => {
  const [counter, setCounter] = useState(0)
  const [values, setValues] = useState([])
  const notes = useNotes(BACKEND_URL)

  const handleClick = () => {
    setCounter(counter => counter + 1)
    setValues(values.concat(counter))
  }

  return (
    <main className="container">
      hello webpack {counter} clicks
      <button onClick={handleClick}>press</button>
      <p>
        {notes.length} notes on the server {BACKEND_URL}
      </p>
    </main>
  )
}

export default App
