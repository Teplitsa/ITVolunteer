import React, {Component, useState, useEffect} from 'react'
import { useStoreState, useStoreActions } from "easy-peasy"

import * as utils from "../utils"
import { getTaskAuthorQuery, getTaskQuery, getTaskDoersQuery } from '../network'

import {SiteHeader} from './SiteHeader'
import SiteFooter from './SiteFooter'
import {TaskBody, TaskDoersBlock} from './Task'
import {TaskComments} from './Comments'
import {UserSmallView, TaskAuthor, TaskDoers} from './User'

function ItvApp(props) {
    const user = useStoreState(store => store.user.data)
    const doers = useStoreState(store => store.task.doers)
    const task = useStoreState(store => store.task.data)
    const author = useStoreState(store => store.task.author)
    const taskGqlId = ITV_CURRENT_TASK_GQLID
    const taskAuthorGqlId = ITV_CURRENT_TASK_AUTHOR_GQLID

    const setTaskDoers = useStoreActions(actions => actions.task.setDoers)
    const setTaskData = useStoreActions(actions => actions.task.setData)
    const setTaskAuthor = useStoreActions(actions => actions.task.setAuthor)

    const { 
        loading: taskLoading, 
        error: taskLoadError, 
        data: taskData
    } = getTaskQuery(taskGqlId)
    
    const {
        loading: taskAuthorLoading,
        error: taskAuthorLoadError,
        data: taskAuthorData
    } = getTaskAuthorQuery(taskAuthorGqlId)

    const {
        loading: loading,
        error: error,
        data: doersData
    } = getTaskDoersQuery(taskGqlId)

    useEffect(() => {
        if(!doersData) {
            return
        }

        setTaskDoers(doersData.taskDoers)
    }, [doersData])

    useEffect(() => {
        if(!taskData) {
            return
        }

        setTaskData(taskData.task)
    }, [taskData])

    useEffect(() => {
        if(!taskAuthorData) {
            return
        }

        setTaskAuthor(taskAuthorData.user)
    }, [taskAuthorData])

    return (
        <div>
            <SiteHeader userId={user.userId} />
            <main id="site-main" className="site-main" role="main">
                <section className="content">
                    <h2>Задача</h2>

                    <TaskBody task={task} author={author} />
                    <TaskComments task={task} author={author} />

                    {!!user.id && user.id != author.id &&
                    <div className="task-give-response">                    
                        <p>Кликнув на кнопку, вы попадете в список волонтёров откликнувшихся на задачу. Заказчик задачи выберет подходящего из списка.</p>
                        <a href="#" className="button-give-response">Откликнуться на задачу</a>
                    </div>
                    }

                    {!!user.id && user.id != author.id &&
                    <div className="task-get-next">
                        <p>Хочешь посмотреть ещё подходящих для тебя задач?</p>
                        <a href="#" className="get-next-task">Следующая задача</a>
                    </div>
                    }

                </section>
                <section className="sidebar">
                    <h2>Помощь нужна</h2>

                    <TaskAuthor author={author} />

                    {!!user.id && user.id != author.id &&
                    <div className="action-block">
                        <a href="#" className="action-button">Откликнуться на задачу</a>
                    </div>
                    }

                    {!!doers.length &&
                    <h2>Откликов пока нет</h2>
                    }

                    {!!user.id && user.id != author.id &&
                    <div className="sidebar-users-block no-responses">
                        <p>Откликов пока нет. Воспользуйся возможностью получить задачу</p>
                    </div>
                    }

                    {!!user.id && user.id == author.id &&
                    <div className="sidebar-users-block no-responses">
                        <p>Мало просмотров и откликов на задачу? Возможно, <a href="#">наши советы помогут вам</a></p>
                    </div>
                    }

                    <div className="something-wrong-with-task">
                        <a href="#" className="contact-admin">Что-то не так с задачей? Напиши администратору</a>
                    </div>

                    <h2>Отклики на задачу</h2>

                    <TaskDoersBlock task={task} author={author} />

                    <div className="sidebar-users-block responses approved-doer d-none">
                        <div className="user-cards-list">
                            {[1].map((item, key) =>
                            <div className="user-card" key={key}>
                                <div className="user-card-inner">
                                    <div className="avatar-wrapper" style={{
                                        backgroundImage: author.itvAvatar ? `url(${author.itvAvatar})` : "none",
                                    }}>
                                        {(() => {
                                            return (item == 3 ? <img src={metaIconPaseka} className="itv-approved" /> : null);
                                        })()}
                                    </div>
                                    <div className="details">
                                        <span className="name">{author.fullName}</span>
                                        <span className="reviews">{`${author.doerReviewsCount} отзывов`}</span>
                                        <span className="status">{`Выполнено ${author.solvedTasksCount} задач`}</span>
                                    </div>
                                </div>
                            </div>
                            )}
                        </div>
                    </div>                    

                </section>
            </main>
            <SiteFooter/>
        </div>
    )
}

export default ItvApp