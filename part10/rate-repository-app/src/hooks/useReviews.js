import { useQuery } from '@apollo/client/react'

import { GET_REVIEWS } from '../graphql/resolvers/queries'

const useReviews = (repositoryId) => {
    const { data, loading, error } = useQuery(GET_REVIEWS, {
        variables: { repositoryId },
        fetchPolicy: 'cache-and-network',
        skip: !repositoryId,
    })

    const reviews = (data?.repository?.reviews?.edges ?? []).map(edge => edge.node)

    return {
        reviews,
        loading,
        error,
    }
}

export default useReviews