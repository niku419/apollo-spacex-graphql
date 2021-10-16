import React from 'react'
import NavBar from './components/NavBar'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client"

export default function Provider({children}) {
  const link = createHttpLink({
    uri: 'https://api.spacex.land/graphql/',
    credentials: 'same-origin'
  })
  const client = new ApolloClient({
    link,
    cache: new InMemoryCache()
  })

  return (
    <ApolloProvider client={client}>
        <NavBar/>
        {children}
    </ApolloProvider>
  )
}
