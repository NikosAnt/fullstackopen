import PropTypes from 'prop-types'
import { useReducer } from 'react'

import { UserContext } from './UserContext'

const userReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return action.payload
    case 'LOGOUT':
      return null
    default:
      return state
  }
}

export const UserProvider = ({ children }) => {
  const [user, dispatch] = useReducer(userReducer, null)
  return (
    <UserContext.Provider value={{ user, dispatch }}>
      {children}
    </UserContext.Provider>
  )
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired
}
