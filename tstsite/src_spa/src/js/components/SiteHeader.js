import React, {Component} from 'react'

import logo from '../../img/pic-logo-itv.svg'
import bell from '../../img/icon-bell.svg'
import arrowDown from '../../img/icon-arrow-down.svg'

import { USER_QUERY } from '../network'
import { useQuery } from '@apollo/react-hooks'

function AccountInHeader({userId}) {
    const { loading, error, data } = useQuery(USER_QUERY, {variables: { userId: userId }},);

    if (loading) return 'Loading...'
    if (error) return `Error! ${error.message}`

    console.log("user data", data)

    return (
        <div className="account-col">
            <a href="#" className="go-old">Старый дизайн</a>
            <a href="#" className="open-notif">
                <img src={bell} alt="Сообщения" />
                { true && 
                    <span className="new-notif"></span>
                }
            </a>
            <a href="#" className="open-account-menu">
                <span 
                    className="avatar-wrapper"
                    style={{
                        backgroundImage: data.user.avatar ? `url(${data.user.avatar.url})` : "none",
                    }}
                    title={`Привет, ${data.user.username}!`}
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
        }
    }

    render() {
        return <header id="site-header" className="site-header">
            <nav>
                <a href="#" className="logo-col">
                    <img src={logo} className="logo" alt="IT-волонтер" />
                </a>
                <div className="main-menu-col">
                    <a href="#">Задачи</a>
                    <a href="#">Волонтеры</a>
                    <a href="#" className="drop-menu">О проекте</a>
                </div>
                <AccountInHeader userId={this.state.userId} />
            </nav>
        </header>
    }
}

export default SiteHeader