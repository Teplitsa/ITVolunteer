import React, {Component, useState, useEffect} from 'react'
import { useStoreState, useStoreActions } from "easy-peasy"

import * as utils from "../utils"

import {SiteHeader} from './SiteHeaderWpPages'
import SiteFooter from './SiteFooterWpPages'

function WpPagesApp(props) {
    const user = useStoreState(store => store.user.data)

    return (
        <div className="itv-app">
            <SiteHeader userId={user.userId} />
            <SiteFooter/>
        </div>
    )
}

export default WpPagesApp