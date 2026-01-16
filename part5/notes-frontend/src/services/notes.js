import axios from 'axios'

const baseUrl = '/api/notes'

let token = null

const setToken = (newToken) => {
  token = newToken ? `Bearer ${newToken}` : null
}

const getAll = () => {
  const config = token ? { headers: { Authorization: token } } : {}
  const request = axios.get(baseUrl, config)
  return request.then((response) => response.data)
}

const create = async (newObject) => {
  const config = token ? { headers: { Authorization: token } } : {}
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

function update(id, newObject) {
  const config = token ? { headers: { Authorization: token } } : {}
  const request = axios.put(`${baseUrl}/${id}`, newObject, config)
  return request.then((response) => response.data)
}

export default { getAll, create, update, setToken }
