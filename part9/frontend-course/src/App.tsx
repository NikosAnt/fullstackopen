import { useEffect, useState, type SyntheticEvent } from 'react'

import type { Note } from './types'
import { getAllNotes, createNote } from './noteService'

const App = () => {
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState('')

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const data = await getAllNotes()
        setNotes(data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchNotes()
  }, [])

  const noteCreation = async (event: SyntheticEvent) => {
    event.preventDefault()
    try {
      const data = await createNote({ content: newNote })
      setNotes(notes.concat(data))
      setNewNote('')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <main>
      <form onSubmit={noteCreation}>
        <input
          value={newNote}
          onChange={event => setNewNote(event.target.value)}
        />
        <button type="submit">add</button>
      </form>
      <ul>
        {notes.map(note => (
          <li key={note.id}>{note.content}</li>
        ))}
      </ul>
    </main>
  )
}

export default App
