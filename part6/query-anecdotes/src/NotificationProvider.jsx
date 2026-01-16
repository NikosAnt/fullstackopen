import { useReducer } from 'react'
import { notificationReducer } from './notificationReducer'
import { NotificationContext } from './NotificationContext'

export const NotificationProvider = ({ children }) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    '',
  )
  return (
    <NotificationContext.Provider
      value={{ notification, notificationDispatch }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export default NotificationProvider
