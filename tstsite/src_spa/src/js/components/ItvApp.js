import React, {Component} from 'react'
// import { useQuery } from '@apollo/react-hooks'
import { useStoreState, useStoreActions } from "easy-peasy"

import * as utils from "../utils"
import { getTaskAuthorQuery, getTaskQuery } from '../network'

import SiteHeader from './SiteHeader'
import SiteFooter from './SiteFooter'
import {TaskBody} from './Task'
import {TaskComments} from './Comments'
import {UserSmallView, TaskAuthor, TaskDoers} from './User'

function ItvApp(props) {
    const user = useStoreState(store => store.user.data)
    const taskId = ITV_CURRENT_TASK_ID
    const taskAuthorId = ITV_CURRENT_TASK_AUTHOR_ID

    const { 
        loading: taskLoading, 
        error: taskLoadError, 
        data: taskData
    } = getTaskQuery(taskId)
    
    const {
        loading: taskAuthorLoading,
        error: taskAuthorLoadError,
        data: taskAuthorData
    } = getTaskAuthorQuery(taskAuthorId)

    if (taskLoading) return utils.loadingWait()
    if (taskLoadError) return utils.loadingError(taskLoadError)

    if (taskAuthorLoading) return utils.loadingWait()
    if (taskAuthorLoadError) return utils.loadingError(taskAuthorLoadError)

    return (
        <div>
            <SiteHeader userId={user.userId} />
            <main id="site-main" className="site-main" role="main">
                <section className="content">
                    <h2>Задача</h2>

                    <TaskBody taskId={taskData.task.databaseId} userId={user.userId} author={taskAuthorData.user} />
                    <TaskComments taskId={taskData.task.databaseId} author={taskAuthorData.user} />

                    <div className="task-give-response">                    
                        <p>Кликнув на кнопку, вы попадете в список волонтёров откликнувшихся на задачу. Заказчик задачи выберет подходящего из списка.</p>
                        <a href="#" className="button-give-response">Откликнуться на задачу</a>
                    </div>
                    <div className="task-get-next">
                        <p>Хочешь посмотреть ещё подходящих для тебя задач?</p>
                        <a href="#" className="get-next-task">Следующая задача</a>
                    </div>
                </section>
                <section className="sidebar">
                    <h2>Помощь нужна</h2>

                    <TaskAuthor taskAuthorId={taskAuthorData.user.userId} />

                    <div className="action-block">
                        <a href="#" className="action-button">Откликнуться на задачу</a>
                    </div>

                    <h2>Откликов пока нет</h2>

                    <div className="sidebar-users-block no-responses">
                        <p>Откликов пока нет. Воспользуйся возможностью получить задачу</p>
                    </div>

                    <div className="sidebar-users-block no-responses">
                        <p>Мало просмотров и откликов на задачу? Возможно, <a href="#">наши советы помогут вам</a></p>
                    </div>

                    <div className="something-wrong-with-task">
                        <a href="#" className="contact-admin">Что-то не так с задачей? Напиши администратору</a>
                    </div>

                    <h2>Отклики на задачу</h2>

                    <div className="sidebar-users-block responses">
                        <div className="choose-doer-explanation">
                            У вас есть 3 дня на одобрение/отклонение кандидата. После прохождения 3-х дней мы снимаем баллы.
                        </div>
                        <TaskDoers taskId={taskData.task.databaseId} />
                    </div>

                    <div className="sidebar-users-block responses approved-doer d-none">
                        <div className="user-cards-list">
                            {[1].map((item, key) =>
                            <div className="user-card" key={key}>
                                <div className="user-card-inner">
                                    <div className="avatar-wrapper" style={{
                                        backgroundImage: taskAuthorData.user.avatar_url ? `url(${taskAuthorData.user.avatar_url})` : "none",
                                    }}>
                                        {(() => {
                                            return (item == 3 ? <img src={metaIconPaseka} className="itv-approved" /> : null);
                                        })()}
                                    </div>
                                    <div className="details">
                                        <span className="name">{taskAuthorData.user.fullName}</span>
                                        <span className="reviews">{`${taskAuthorData.user.doerReviewsCount} отзывов`}</span>
                                        <span className="status">{`Выполнено ${taskAuthorData.user.solvedTasksCount} задач`}</span>
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