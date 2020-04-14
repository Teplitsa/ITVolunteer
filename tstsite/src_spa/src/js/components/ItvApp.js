import React, {Component, useState, useEffect} from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { useStoreState, useStoreActions } from "easy-peasy"

import * as utils from "../utils"

import {SiteHeader} from './SiteHeader'
import SiteFooter from './SiteFooter'
import {PageTask} from './PageTask'
import {PageTaskList} from './PageTaskList'

function ItvApp(props) {
    const user = useStoreState(store => store.user.data)

    return (
        <div className="itv-app">
            <Router>
                <SiteHeader userId={user.userId} />
                <Switch>
                    <Route path="/tasks/publish/">
                        <PageTaskList />
                    </Route>
                    <Route path="/tasks/:taskSlug" component={PageTask} />
                    <Route path="/" component={PageTask} />
                </Switch>            
                <SiteFooter/>
            </Router>
        </div>
    )
}

export default ItvApp