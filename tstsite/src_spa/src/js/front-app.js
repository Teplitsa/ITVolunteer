import React from 'react'
import {render} from 'react-dom'
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';

import '../sass/front-main.scss'

import App from './components/App'

const client = new ApolloClient({
  uri: '/graphql',
});

render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.querySelector('#itv-spa-container')
);