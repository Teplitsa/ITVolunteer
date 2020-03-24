import React, {Component} from 'react'
import { useStoreState, useStoreActions } from "easy-peasy"

import logo from '../../img/pic-logo-itv.svg'
import bell from '../../img/icon-bell.svg'
import arrowDown from '../../img/icon-arrow-down.svg'

import { ITV_URLS } from '../const'
import * as utils from "../utils"

import { USER_QUERY } from '../network'
import { useQuery } from '@apollo/react-hooks'

function AccountInHeader({userId}) {
    const user = useStoreState(store => store.user.data)

    return (
        <div className="account-col">
            <a href="#" className="go-old">Старый дизайн</a>
            <a href="#" className="open-notif">
                <img src={bell} alt="Сообщения" />
                { true && 
                    <span className="new-notif"></span>
                }
            </a>
            <a href={user.profileURL} className="open-account-menu">
                <span 
                    className="avatar-wrapper"
                    style={{
                        backgroundImage: user.itvAvatar ? `url(${user.itvAvatar})` : "none",
                    }}
                    title={user && `Привет, ${user.fullName}!`}
                />
                <img src={arrowDown} className="arrow-down" alt="arrowDown" />
            </a>
        </div>
    )
}

export function SiteHeader(props) {
    const user = useStoreState(store => store.user.data)

    return (
        <header id="site-header" className="site-header">
            <nav>
                <a href={ITV_URLS.home} className="logo-col">
                    <img src={logo} className="logo" alt="IT-волонтер" />
                </a>
                <div className="main-menu-col">
                    <a href={ITV_URLS.tasks}>Задачи</a>
                    <a href={ITV_URLS.volunteers}>Волонтеры</a>
                    <a href="#" className="drop-menu">О проекте</a>
                </div>
                <AccountInHeader />
            </nav>
        </header>
    )
}
