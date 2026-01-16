import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink
} from '@apollo/client'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { ApolloProvider } from '@apollo/client/react'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'

const httpLink = new HttpLink({ uri: import.meta.env.VITE_CORS_ORIGIN })

const wsLink = new GraphQLWsLink(
  createClient({
    url: import.meta.env.VITE_WS_ORIGIN,
    connectionParams: () => {
      const token = localStorage.getItem('phonebook-user-token')
      return token ? { authorization: `Bearer ${token}` } : {}
    }
  })
)

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('phonebook-user-token')
  const { headers = {} } = operation.getContext()
  operation.setContext({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  })
  return forward(operation)
})

const link = ApolloLink.split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  authLink.concat(httpLink)
)

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
  connectToDevTools: true
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>
)
