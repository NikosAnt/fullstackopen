import { useDispatch, useSelector } from 'react-redux'
import noteService from '../services/notes'
import { toggleImportanceOf } from '../reducers/noteReducer'

const Note = ({ note, handleClick }) => {
  return(
    <li onClick={handleClick}>
      {note.content} 
      <strong> {note.important ? 'important' : ''}</strong>
    </li>
  )
}

const Notes = () => {
  const dispatch = useDispatch()
  const handleToggleImportance = async (note) => {
    const updatedNote = await noteService.changeImportance(note)
    dispatch(toggleImportanceOf(updatedNote.id))
  }
  const notes = useSelector(state => {
    if (state.filter === 'ALL') {
      return state.notes
    }
    return state.filter === 'IMPORTANT'
      ? state.notes.filter(note => note.important)
      : state.notes.filter(note => !note.important)
  })

  return(
    <ul>
      {notes.map(note =>
        <Note
          key={note.id}
          note={note}
          handleClick={() => 
            handleToggleImportance(note)
          }
        />
      )}
    </ul>
  )
}

export default Notes