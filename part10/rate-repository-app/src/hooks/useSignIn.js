import { useApolloClient, useMutation } from '@apollo/client/react'

import { AUTHENTICATE } from '../graphql/resolvers/mutations'

import useAuthStorage from './useAuthStorage'

const useSignIn = () => {
  const authStorage = useAuthStorage()
  const client = useApolloClient()
  const [authenticate, { data, loading, error }] = useMutation(AUTHENTICATE)

  const signIn = async ({ username, password }) => {
    const result = await authenticate({
      variables: { credentials: { username, password } }
    })

    const accessToken = result?.data?.authenticate?.accessToken
    if (!accessToken) {
      throw new Error('Authentication failed: no access token returned')
    }

    await authStorage.setAccessToken(accessToken)
    await client.resetStore()

    return accessToken
  }

  return { signIn, data, loading, error }
}

export default useSignIn
