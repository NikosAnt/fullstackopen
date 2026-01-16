import { GraphQLError } from 'graphql'

const requireAuth = context => {
    if (!context.currentUser) {
        throw new GraphQLError('Authentication required', {
            extensions: { code: 'UNAUTHENTICATED'}
        })
    }
}

export default requireAuth