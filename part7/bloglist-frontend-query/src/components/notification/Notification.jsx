import { Alert, Box } from '@mui/material'
import PropTypes from 'prop-types'

const Notification = ({ message }) => {
  if (!message) return null
  return (
    <Box component="aside" role="alert" sx={{ mb: 2 }}>
      <Alert
        severity={message.type === 'error' ? 'error' : 'success'}
        variant="filled"
      >
        {message.text}
      </Alert>
    </Box>
  )
}

Notification.propTypes = {
  message: PropTypes.shape({
    type: PropTypes.string,
    text: PropTypes.string
  })
}

export default Notification
