import React, {Component} from 'react'

import logo from '../../img/pic-logo-itv.svg'
import bell from '../../img/icon-bell.svg'
import arrowDown from '../../img/icon-arrow-down.svg'

import { ITV_URLS } from '../const'
import * as utils from "../utils"

import { USER_QUERY } from '../network'
import { useQuery } from '@apollo/react-hooks'

function AccountInHeader({userId}) {
    const { loading, error, data } = userId ? useQuery(USER_QUERY, {variables: { userId: userId }},) : {loading: null, error: null, data: {}};

    if (loading) return utils.loadingWait()
    if (error) return utils.loadingError(error)

    return (
        <div className="account-col">
            <a href="#" className="go-old">Старый дизайн</a>
            <a href="#" className="open-notif">
                <img src={bell} alt="Сообщения" />
                { true && 
                    <span className="new-notif"></span>
                }
            </a>
            <a href={data.user.profileURL} className="open-account-menu">
                <span 
                    className="avatar-wrapper"
                    style={{
                        backgroundImage: data.user.itvAvatar ? `url(${data.user.itvAvatar})` : "none",
                    }}
                    title={data.user && `Привет, ${data.user.fullName}!`}
                />
                <img src={arrowDown} className="arrow-down" alt="arrowDown" />
            </a>
        </div>
    )
}

class SiteHeader extends Component {

    constructor(props) {
        super(props)
        this.state = {
            userId: props.userId,
            is_logged_in: props.userId > 0,
        }

        console.log("this.state.is_logged_in: ", this.state.is_logged_in)
    }

    render() {
        return <header id="site-header" className="site-header">
            <nav>
                <a href={ITV_URLS.home} className="logo-col">
                    <img src={logo} className="logo" alt="IT-волонтер" />
                </a>
                <div className="main-menu-col">
                    <a href={ITV_URLS.tasks}>Задачи</a>
                    <a href={ITV_URLS.volunteers}>Волонтеры</a>
                    <a href="#" className="drop-menu">О проекте</a>
                </div>
                {this.state.is_logged_in && 
                    <AccountInHeader userId={this.state.userId} />
                }
            </nav>
        </header>
    }
}

export default SiteHeader