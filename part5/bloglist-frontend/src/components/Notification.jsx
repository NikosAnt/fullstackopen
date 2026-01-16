import PropTypes from 'prop-types'

const Notification = ({ message }) => {
  if (!message) return null

  const style = message.type === 'error' ? 'error' : 'notification'
  return <div className={style}>{message.text}</div>
}

Notification.propTypes = {
  message: PropTypes.shape({
    type: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  })
}

export default Notification
