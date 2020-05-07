import React, {Component, useState, useEffect} from 'react'
import {
  Link
} from "react-router-dom";
import { useStoreState, useStoreActions } from "easy-peasy"
import { format, formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'

import logo from '../../img/pic-logo-itv.svg'
import logoNoText from '../../img/pic-logo-itv-notext.svg'
import bell from '../../img/icon-bell.svg'
import arrowDown from '../../img/icon-arrow-down.svg'
import iconNotifRock from '../../img/icon-filter-mood-rock.svg'
import iconNotifTask from '../../img/icon-task-dark.svg'
import iconNotifComment from '../../img/icon-message-dark.svg'
// import iconArrowRight from '../../img/icon-arrow-right.svg'

import { ITV_URLS } from '../const'
import * as utils from "../utils"
import {UserSmallPicView} from './User'

const ITV_USER_NOTIF_TEXT = {
    task_published: 'Вы опубликовали новую задачу',
    post_comment_taskauthor: 'прокомментировал(а) вашу задачу',
    post_comment_user: 'Вы прокомментировали задачу',
    reaction_to_task_user: 'Вы откликнулись на задачу',
    reaction_to_task_taskauthor: 'откликнулся на задачу',
    task_approved_taskauthor: 'Модератор одобрил вашу задачу',
    task_disapproved_taskauthor: 'Вы выбрали волонтёра для задачи',
    choose_taskdoer_to_taskdoer: 'выбрал(а) вас на задачу',
    choose_taskdoer_to_taskauthor: 'Вы выбрали волонтёра для задачи',
    choose_other_taskdoer: 'выбрал(а) другого исполнителя на задачу',
    deadline_update_taskauthor: 'Вы изменили дедлайн задачи',
    deadline_update_taskdoer: 'изменил(а) дедлайн задачи',
    suggest_new_deadline_to_taskauthor: 'предложил(а) новый дедлайн задачи',
    suggest_new_deadline_to_taskdoer: 'Вы предложили новый дедлайн задачи',
    task_closing_taskauthor: 'Вы закрыли задачу',
    task_closing_taskdoer: 'закрыл(а) задачу',
    post_feedback_taskauthor_to_taskdoer: 'Вы оставили отзыв волонтёру по задаче',
    post_feedback_taskdoer_to_taskdoer: 'оставил(а) вам отзыв по задаче',
    post_feedback_taskauthor_to_taskauthor: 'оставил(а) вам отзыв по задаче',
    post_feedback_taskdoer_to_taskauthor: 'Вы оставили отзыв автору задачи',
}

function AccountInHeader({userId}) {
    const user = useStoreState(store => store.user.data)

    // notif
    const [isShowNotif, setIsShowNotif] = useState(false)
    const notifList = useStoreState(store => store.userNotif.notifList)
    const loadNotifList = useStoreActions(actions => actions.userNotif.loadNotifList)

    useEffect(() => {
        if(!user.id) {
            return
        }

        loadNotifList()
    }, [user])

    function handleNotifClick(e) {
        e.preventDefault()

        setIsShowNotif(!isShowNotif)
    }

    return (
        <div className="account-col">
            <a href="#" className="go-old">Старый дизайн</a>
            {!!user.id &&
            <div className="account-symbols">
                <div className="open-notif" onClick={handleNotifClick}>
                    <img src={bell} alt="Сообщения" />

                    {!_.isEmpty(notifList) && 
                    <span className="new-notif"></span>
                    }

                    {!!isShowNotif && !_.isEmpty(notifList) && 
                    <NotifList />
                    }
                </div>
                <a href={user.profileURL} className="open-account-menu" target="_blank">
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
            }
            {!user.id &&
            <div className="account-enter-links">
                <a href="/registration" className="account-enter-link account-login">Вход</a>
                <a href="/registration" className="account-enter-link account-registration">Регистрация</a>
            </div>
            }
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
                    <Link to="/tasks/publish/">Задачи</Link>
                    <a href={ITV_URLS.volunteers} target="_blank">Волонтеры</a>
                    <a href="#" className="drop-menu">О проекте</a>
                </div>
                <AccountInHeader />
            </nav>
        </header>
    )
}

function NotifList(props) {
    const notifList = useStoreState(store => store.userNotif.notifList)

    return (
        <div className={`notif-list`}>
            <div className={`notif-list__container`}>
            {notifList.map((item, index) => {
                return <NotifItem key={`NotifListItem${index}`} notif={item} />
            })}
            </div>
            <div className="notif-list__view-all">
                <a href="#">Все оповещения</a>
            </div>
        </div>
    )
}

function NotifItem({notif,}) {
    const user = useStoreState(store => store.user.data)

    console.log("notif.dateGmt:", notif.dateGmt)
    console.log("now:", new Date())

    return (
        <div className={`notif-list__item ${notif.is_read ? 'notif-list__item__read' : ''}`}>
            <div className="notif-list__item-icon">
                {(!notif.from_user || notif.from_user.id === user.id) &&
                <img src={logoNoText} alt="" />
                }
                {!!notif.from_user && notif.from_user.id !== user.id &&
                <UserSmallPicView user={notif.from_user} />
                }
            </div>
            <div className="notif-list__item-body">
                <div className="notif-list__item-title">
                    {!!notif.from_user && notif.from_user.id !== user.id &&
                    <b>{notif.from_user.fullName}</b>
                    }
                    <span>{_.get(ITV_USER_NOTIF_TEXT, notif.type, "")}</span>
                </div>

                {!!notif.task &&
                <div className="notif-list__item-task">{notif.task.title}</div>
                }
                
                <div className="notif-list__item-time">
                    <img src={iconNotifRock} alt="" />
                    <span>{`${formatDistanceToNow(new Date(notif.dateGmt + "Z"), {locale: ru, addSuffix: true})}`}</span>
                </div>
            </div>
        </div>
    )
}