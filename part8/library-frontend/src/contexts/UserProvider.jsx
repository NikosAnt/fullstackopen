import PropTypes from 'prop-types'
import { useState } from 'react'

import { getUserFromStorage } from '../utils/storage'
import UserContext from './UserContext'

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    return getUserFromStorage()
  })
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export default UserProvider
