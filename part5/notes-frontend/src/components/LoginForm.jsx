import PropTypes from 'prop-types'

const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">
          username
          <input
            id="username"
            type="text"
            value={username}
            name="username"
            autoComplete="username"
            onChange={handleUsernameChange}
          />
        </label>
      </div>
      <div>
        <label htmlFor="password">
          password
          <input
            id="password"
            type="password"
            value={password}
            name="password"
            autoComplete="current-password"
            onChange={handlePasswordChange}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
}

export default LoginForm
