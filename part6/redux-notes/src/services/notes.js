import axios from 'axios'

const baseUrl = 'http://localhost:3001/notes'

const getAll = async () => {
  const responce = await axios.get(baseUrl)
  return responce.data
}

const createNew = async (content) => {
  const object = { content, important: false }
  const responce = await axios.post(baseUrl, object)
  return responce.data
}

const changeImportance = async (note) => {
  const updatedNote = { ...note, important: !note.important }
  const response = await axios.put(`${baseUrl}/${note.id}`, updatedNote)
  return response.data
}

export default { 
  getAll,
  createNew,
  changeImportance 
}