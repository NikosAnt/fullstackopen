import { useQuery } from '@apollo/client/react'
import { ME } from '../graphql/resolvers/queries'

const useMe = () => {
  const { data, loading, error, refetch } = useQuery(ME, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  })

  return { me: data?.me ?? null, loading, error, refetch }
}

export default useMe
