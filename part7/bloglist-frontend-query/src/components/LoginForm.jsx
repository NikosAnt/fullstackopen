import { Paper, Typography, Box, TextField, Button } from '@mui/material'
import PropTypes from 'prop-types'

const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password
}) => (
  <>
    <Paper elevation={2} sx={{ p: 3, mb: 2, maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Login
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        aria-label="login form"
      >
        <TextField
          id="username"
          label="Username"
          type="text"
          value={username}
          name="Username"
          onChange={handleUsernameChange}
          fullWidth
          required
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          value={password}
          name="Password"
          onChange={handlePasswordChange}
          fullWidth
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Login
        </Button>
      </Box>
    </Paper>
  </>
)

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}

export default LoginForm
