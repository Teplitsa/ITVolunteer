import React, {Component, useState, useEffect} from 'react'
import { useStoreState, useStoreActions } from "easy-peasy"
import { format, formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'
import * as _ from "lodash"
import Cookies from 'js-cookie'

import logo from '../../img/pic-logo-itv.svg'
import logoNoText from '../../img/pic-logo-itv-notext.svg'
import bell from '../../img/icon-bell.svg'
import arrowDown from '../../img/icon-arrow-down.svg'
import iconNotifRock from '../../img/icon-filter-mood-rock.svg'
import iconNotifTask from '../../img/icon-task-dark.svg'
import iconNotifComment from '../../img/icon-message-dark.svg'
import iconMobileMenu from "../../img/icon-mobile-menu.png";
// import iconArrowRight from '../../img/icon-arrow-right.svg'

import * as C from '../const'
import * as utils from "../utils"
import {UserSmallPicView} from './User'
import HeaderSearch from './HeaderSearch'

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
    post_feedback_taskauthor_to_taskdoer: "оставил(а) вам отзыв по задаче",
    post_feedback_taskdoer_to_taskdoer: "Вы оставили отзыв автору задачи",
    post_feedback_taskauthor_to_taskauthor: "Вы оставили отзыв волонтёру по задаче",
    post_feedback_taskdoer_to_taskauthor: "оставил(а) вам отзыв по задаче",
    reaction_to_task_back: "отозвал свой отклик на задачу",
}

function AccountInHeader({userId}) {
    const user = useStoreState(store => store.user.data)

    // notif
    const [isShowNotif, setIsShowNotif] = useState(false)
    const notifList = useStoreState(store => store.userNotif.notifList)
    const loadNotifList = useStoreActions(actions => actions.userNotif.loadNotifList)
    const loadFreshNotifList = useStoreActions(actions => actions.userNotif.loadFreshNotifList)

    useEffect(() => {
        if(!user.id) {
            return
        }

        loadNotifList()
    }, [user])

    useEffect(() => {
      let id = setInterval(loadFreshNotifList, 1000 * 20);
      return () => clearInterval(id);
    }, []);

    function handleOldDesignClick(e) {
        e.preventDefault();
        Cookies.set(C.ITV_COOKIE.OLD_DESIGN.name, C.ITV_COOKIE.OLD_DESIGN.value, { expires: C.ITV_COOKIE.OLD_DESIGN.period });
        document.location.reload();
    }

    function handleNotifClick(e) {
        e.preventDefault()

        setIsShowNotif(!isShowNotif)
    }

    return (
        <div className={`account-col ${!!user.id ? "logged-in" : ""}`}>
            <a href="#" className="go-old" onClick={handleOldDesignClick}>Старый дизайн</a>
            {!!user.id &&
            <div className="account-symbols">
                <div className="open-notif">

                    <div onClick={handleNotifClick} className="open-notif__action">
                        <img src={bell} alt="Сообщения" />

                        {!_.isEmpty(notifList) && 
                        <span className="new-notif"></span>
                        }
                    </div>

                    {!!isShowNotif && !_.isEmpty(notifList) && 
                    <NotifList clickOutsideHandler={() => {
                        setIsShowNotif(false)
                    }}/>
                    }
                </div>
                <div className="open-account-menu">
                  <a href={user.profileURL}>
                      <span 
                          className="avatar-wrapper"
                          style={{
                              backgroundImage: user.itvAvatar ? `url(${user.itvAvatar})` : "none",
                          }}
                          title={user && `Привет, ${user.fullName}!`}
                      />
                      <img src={arrowDown} className="arrow-down" alt="arrowDown" />
                  </a>

                  <ul className="submenu">
                    <li><a href="/member-actions/member-tasks/">Мои задачи</a></li>
                    <li><a href="/task-actions/">Новая задача</a></li>
                    <li><a href={`/members/${user.name}`}>Мой профиль</a></li>
                    <li><a href={utils.decodeHtmlEntities(user.logoutUrl)}>Выйти</a></li>
                  </ul>

                </div>
            </div>
            }

            {!!user.id &&
            <ul className="submenu account-submenu-mobile">
              <li><a href="/member-actions/member-tasks/">Мои задачи</a></li>
              <li><a href="/task-actions/">Новая задача</a></li>
              <li><a href={`/members/${user.username}`}>Мой профиль</a></li>
              <li><a href={utils.decodeHtmlEntities(user.logoutUrl)}>Выйти</a></li>
            </ul>
            }

            {!user.id &&
            <div className="account-enter-links">
                <a href="/login/" className="account-enter-link account-login">Вход</a>
                <a href="/registration/" className="account-enter-link account-registration">Регистрация</a>
            </div>
            }
        </div>
    )
}

export function SiteHeader(props) {
    const user = useStoreState(store => store.user.data)
    const [headerRef, setHeaderRef] = useState(null)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [isHeaderSearchOpen, setHeaderSearchOpen] = useState(false);

    useEffect(() => {
        if(!headerRef) {
            return
        }

        document.querySelector('#itv-wp-pages-header-container').appendChild(headerRef);
        document.querySelector('body').appendChild(document.querySelector('#itv-wp-pages-footer-container'));
    }, [headerRef])
    
    return (
        <header id="site-header" className="site-header" ref={(ref) => setHeaderRef(ref)}>
            <nav>

              <div className="nav-mobile">
                <a href="/" className="logo-col">
                  <img src={logo} className="logo" alt="IT-волонтер" />
                </a>
                <a href="#" className="open-mobile-menu" onClick={(e) => {
                  e.preventDefault();
                  setMobileOpen(!mobileOpen)
                }}>
                  <img src={iconMobileMenu} alt="Меню" />
                </a>
              </div>

              <div className={`nav ${mobileOpen ? "mobile-open" : ""}`}>

                <a href={C.ITV_URLS.home} className="logo-col">
                    <img src={logo} className="logo" alt="IT-волонтер" />
                </a>
        {!isHeaderSearchOpen && (
                <ul className="main-menu-col">
                  <li>
                    <a href="/tasks/publish/">Задачи</a>
                  </li>
                  <li>
                    <a href={C.ITV_URLS.volunteers} className={window.location.href.match(/\/members\//) ? "main-menu__link_active" : ""}>Волонтеры</a>
                  </li>
                  <li className="drop-menu">
                    <a href="#" className={window.location.href.match(/\/(about|conditions|news|sovety-dlya-nko-uspeshnye-zadachi|contacts)\//) ? "main-menu__link_active" : ""}>О проекте</a>
                    <ul className="submenu">
                      <li><a href="/about">О проекте</a></li>
                      <li><a href="/conditions">Правила участия</a></li>
                      <li><a href="/paseka">Пасека</a></li>
                      <li><a href="/nagrady">Награды</a></li>		      		      
                      <li><a href="/news">Новости</a></li>
                      <li><a href="/sovety-dlya-nko-uspeshnye-zadachi">Советы НКО</a></li>
                      <li><a href="/contacts">Контакты</a></li>
                    </ul>                    
                  </li>
                </ul>
		)}
		
              <HeaderSearch
                {...{
                  isOpen: isHeaderSearchOpen,
                  setOpen: setHeaderSearchOpen,
                }}
              />
	      		
                <AccountInHeader />

              </div>

            </nav>
        </header>
    )
}

function NotifList(props) {
    const clickOutsideHandler = props.clickOutsideHandler
    const notifList = useStoreState(store => store.userNotif.notifList)
    const [notifListRef, setNotifListRef] = useState(null)

    function handleClickOutside(e) {
        if (notifListRef && !notifListRef.contains(e.target)) {
            if(clickOutsideHandler) {
                clickOutsideHandler()
            }
        }
    }    

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    })

    return (
        <div className={`notif-list`} ref={(ref) => setNotifListRef(ref)}>
            <div className={`notif-list__container`}>
        <div className="notif-list__title">Оповещения</div>
            {notifList.map((item, index) => {
                return <NotifItem key={`NotifListItem${index}`} notif={item} />
            })}
            </div>
            <div className="notif-list__view-all">
                {/*
                <a href="#">Все оповещения</a>
                */}
            </div>
        </div>
    )
}

function NotifItem({notif,}) {
    const user = useStoreState(store => store.user.data)
    const removeNotifFromList = useStoreActions(actions => actions.userNotif.removeNotifFromList)

    function handleNotifItemClick(e) {
        removeNotifFromList(notif)

        let formData = new FormData()
        formData.append('notifIdList[]', [notif.id])

        let action = 'set_user_notif_read'
        fetch(utils.itvAjaxUrl(action), {
            method: 'post',
            body: formData,
        })
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
                if(result.status == 'error') {
                    return utils.itvShowAjaxError({message: result.message})
                }
            },
            (error) => {
                utils.itvShowAjaxError({action, error})
            }
        )
    }

    return (
        <div className={`notif-list__item ${notif.is_read ? 'notif-list__item__read' : ''}`}>
            <div className="notif-list__item-content">
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
                        <a href={notif.from_user.pemalinkUrl}>
                            <b>{notif.from_user.fullName}</b>
                        </a>
                        }

                        <span>{_.get(ITV_USER_NOTIF_TEXT, notif.type, "")}</span>
                    </div>

                    {!!notif.task &&
                    <a href={notif.task.pemalinkPath} className="notif-list__item-task">
                        {notif.task.title}
                    </a>
                    }
                    
                    <div className="notif-list__item-time">
                        <img src={iconNotifRock} alt="" />
                        <span>{`${formatDistanceToNow(utils.itvWpDateTimeToDate(notif.dateGmt), {locale: ru, addSuffix: true})}`}</span>
                    </div>
                </div>
                <a href="#" className="notif-list__item-set-read" onClick={handleNotifItemClick}></a>
            </div>
        </div>
    )
}
