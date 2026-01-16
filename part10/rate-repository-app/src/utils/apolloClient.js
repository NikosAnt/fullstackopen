import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  Observable
} from '@apollo/client'
import { API_BASE_URL } from '../config'

const createApolloClient = authStorage => {
  const httpLink = new HttpLink({ uri: `${API_BASE_URL}:4000/graphql` })

  const authLink = new ApolloLink(
    (operation, forward) =>
      new Observable(observer => {
        let subscription

        Promise.resolve(authStorage.getAccessToken())
          .then(accessToken => {
            operation.setContext(({ headers = {} }) => ({
              headers: {
                ...headers,
                authorization: accessToken ? `Bearer ${accessToken}` : ''
              }
            }))

            subscription = forward(operation).subscribe({
              next: value => observer.next(value),
              error: err => observer.error(err),
              complete: () => observer.complete()
            })
          })
          .catch(err => observer.error(err))

        return () => subscription?.unsubscribe()
      })
  )

  return new ApolloClient({
    link: ApolloLink.from([authLink, httpLink]),
    cache: new InMemoryCache()
  })
}

export default createApolloClient
