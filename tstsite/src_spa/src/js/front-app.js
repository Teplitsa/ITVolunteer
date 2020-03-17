import React from 'react'
import {render} from 'react-dom'
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory'
import introspectionQueryResultData from '../fragmentTypes.json';

import '../sass/front-main.scss'

import App from './components/App'

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData
});

const cache = new InMemoryCache({ fragmentMatcher });

const client = new ApolloClient({
    uri: '/graphql',
    cache: cache,
});

render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.querySelector('#itv-spa-container')
);