import { Paper, Button, Box } from '@mui/material'
import PropTypes from 'prop-types'
import { useState } from 'react'

const Togglable = props => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(v => !v)
  }

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 2 }} component="section">
      {!visible && (
        <Button
          variant="contained"
          color="primary"
          onClick={toggleVisibility}
          aria-expanded={visible}
          aria-controls="togglable-content"
        >
          {props.buttonLabel}
        </Button>
      )}
      {visible && (
        <Box id="togglable-content" sx={{ mt: 2 }}>
          {props.children}
          <Button
            variant="outlined"
            color="secondary"
            onClick={toggleVisibility}
            sx={{ mt: 2 }}
          >
            Cancel
          </Button>
        </Box>
      )}
    </Paper>
  )
}

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}

export default Togglable
