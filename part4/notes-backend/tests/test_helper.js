import Note from '../models/note.js'
import User from '../models/user.js'

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false,
    // _id: 'unique_id_1', // Optionally add unique IDs if needed
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true,
    // _id: 'unique_id_2', // Optionally add unique IDs if needed
  },
]

const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon' })
  await note.save()
  await note.deleteOne()

  return note._id.toString()
}

const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const getTokenFromResponse = response => {
  const token = response.body.token
  if (!token) {
    throw new Error('Token not found in response')
  }
  return token
}

export {
  initialNotes,
  nonExistingId,
  notesInDb,
  usersInDb,
  getTokenFromResponse,
}
