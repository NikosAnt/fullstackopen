import { useApolloClient } from '@apollo/client/react'

import useAuthStorage from './useAuthStorage'

const useSignOut = () => {
  const authStorage = useAuthStorage()
  const client = useApolloClient()

  const signOut = async () => {
    await authStorage.removeAccessToken()
    await client.resetStore()
  }

  return { signOut }
}

export default useSignOut
