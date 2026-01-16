import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const Navigation = ({ user, onLogout }) => (
  <AppBar position="static" color="primary" sx={{ mb: 3 }}>
    <Toolbar>
      <Button color="inherit" component={Link} to="/">
        Blogs
      </Button>
      <Button color="inherit" component={Link} to="/users">
        Users
      </Button>
      <Box sx={{ flexGrow: 1 }} />
      {user ? (
        <>
          <Typography variant="body1" sx={{ mr: 2 }}>
            {user.name} logged in
          </Typography>
          <Button color="inherit" onClick={onLogout}>
            Logout
          </Button>
        </>
      ) : null}
    </Toolbar>
  </AppBar>
)

Navigation.propTypes = {
  user: PropTypes.object,
  onLogout: PropTypes.func.isRequired
}

export default Navigation
