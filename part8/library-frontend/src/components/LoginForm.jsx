import { useMutation } from '@apollo/client/react'
import PropTypes from 'prop-types'
import { useState } from 'react'

import { LOGIN } from '../queries'
import { saveUserToStorage } from '../utils/storage'

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [login, { loading, error }] = useMutation(LOGIN)

  const handleSubmit = async event => {
    event.preventDefault()
    try {
      const result = await login({ variables: { username, password } })
      if (result.data?.login?.value) {
        const user = { username, token: result.data.login.value }
        onLogin(user)
        saveUserToStorage(user)
      }
    } catch (error) {
      console.error('Login failed:', error.message)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
        {loading && <div>Logging in...</div>}
        {error && <div>Error: {error.message}</div>}
      </form>
    </>
  )
}

LoginForm.propTypes = {
  onLogin: PropTypes.func.isRequired
}

export default LoginForm
