import { useQuery } from '@apollo/client/react'

import { GET_REPOSITORY } from '../graphql/resolvers/queries'

const useRepository = (id) => {
    const { data, loading, error } = useQuery(GET_REPOSITORY, {
        variables: { id },
        fetchPolicy: 'cache-and-network',
    })

    return {
        repository: data?.repository,
        loading,
        error,
    }
}

export default useRepository