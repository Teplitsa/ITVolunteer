import React, { useState, useEffect } from 'react';
import {render} from 'react-dom'
import { ApolloProvider } from '@apollo/react-hooks'
import ApolloClient from "apollo-boost"
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory'
import { createStore, StoreProvider, useStoreState, useStoreActions } from "easy-peasy"

import introspectionQueryResultData from '../fragmentTypes.json'
import '../sass/front-main.scss'
import '../../node_modules/air-datepicker/dist/css/datepicker.css'

import { storeModel } from "./store-model"
import * as utils from "./utils"

import ItvApp from './components/ItvApp'

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData
});

const cache = new InMemoryCache({ fragmentMatcher });

const client = new ApolloClient({
    uri: utils.itvSiteUrl('/graphql'),
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

        let action = 'load-current-user'
        fetch(utils.itvAjaxUrl(action))
        .then(res => {
            try {
                return res.json()
            } catch(ex) {
                utils.itvShowAjaxError({action, error: ex})
                return {}
            }
        })
        .then(
            (result) => {
                setUserData(result)
            },
            (error) => {
                utils.itvShowAjaxError({action, error})
                setUserData({id: null})
            }
        )
    })

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