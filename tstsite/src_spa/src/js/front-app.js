import React, { useState, useEffect } from 'react';
import {render} from 'react-dom'
import { ApolloProvider } from '@apollo/react-hooks'
import ApolloClient from "apollo-boost"
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory'
import { createStore, StoreProvider, useStoreState, useStoreActions } from "easy-peasy"

import introspectionQueryResultData from '../fragmentTypes.json';
import '../sass/front-main.scss'

import { storeModel } from "./store-model"
import { itvSiteUrl, itvAjaxUrl } from "./utils"

import ItvApp from './components/ItvApp'

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData
});

const cache = new InMemoryCache({ fragmentMatcher });

const client = new ApolloClient({
    uri: itvSiteUrl('/graphql'),
    cache: cache,
});

const itvStore = createStore(storeModel)

function App(props) {
    const user = useStoreState(store => store.user.data)
    const isUserLoaded = useStoreState(store => store.user.isLoaded)
    const setUserData = useStoreActions(actions => actions.user.setUserData)

    useEffect(() => {
        if(isUserLoaded) {
            return
        }

        fetch(itvAjaxUrl('load-current-user'))
        .then(res => {
            try {
                return res.json()
            } catch(ex) {
                console.log(ex)
                return {}
            }
        })
        .then(
            (result) => {
                console.log(result)
                setUserData(result)
            },
            (error) => {
                console.log("load user failed", error)
                setUserData({userId: 0})
            }
        )
    });

    return (
        <ItvApp />
    )
}

render(
    <ApolloProvider client={client}>
        <StoreProvider store={itvStore}>
            <App />
        </StoreProvider>
    </ApolloProvider>,
    document.querySelector('#itv-spa-container')
);