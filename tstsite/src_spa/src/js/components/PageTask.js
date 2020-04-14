import React, {Component, useState, useEffect} from 'react'
import { useStoreState, useStoreActions } from "easy-peasy"

import * as utils from "../utils"
import { getTaskAuthorQuery, getTaskQuery, getTaskDoersQuery, getTaskBySlugQuery } from '../network'

import {TaskBody, TaskDoersBlock} from './Task'
import {TaskComments} from './Comments'
import {UserSmallView, TaskAuthor, TaskDoers, DoerCard} from './User'

export function PageTask(props) {
    const user = useStoreState(store => store.user.data)
    const doers = useStoreState(store => store.task.doers)
    const task = useStoreState(store => store.task.data)
    const author = useStoreState(store => store.task.author)
    const approvedDoer = useStoreState(store => store.task.approvedDoer)
    const isUserCandidate = useStoreState(store => store.task.isUserCandidate(user))
    
    const [taskGqlId, setTaskGqlId] = useState("")
    const [taskAuthorGqlId, setTaskAuthorGqlId] = useState("")
    const taskSlug = props.match && props.match.params && props.match.params.taskSlug ? props.match.params.taskSlug : ITV_CURRENT_TASK_SLUG

    const setTaskDoers = useStoreActions(actions => actions.task.setDoers)
    const setTaskData = useStoreActions(actions => actions.task.setData)
    const setTaskAuthor = useStoreActions(actions => actions.task.setAuthor)
    const addDoer = useStoreActions(actions => actions.task.addDoer)

    // const { 
    //     loading: taskLoading, 
    //     error: taskLoadError, 
    //     data: taskData
    // } = getTaskQuery(taskGqlId)

    const { 
        loading: taskLoading, 
        error: taskLoadError, 
        data: taskData
    } = taskSlug ? getTaskBySlugQuery(taskSlug) : getTaskQuery(ITV_CURRENT_TASK_GQLID)
    
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

        if(taskData.task) {
            setTaskGqlId(taskData.task.id)
            setTaskAuthorGqlId(taskData.task.author.id)
        }
        
    }, [taskData])

    useEffect(() => {
        if(!taskAuthorData) {
            return
        }

        setTaskAuthor(taskAuthorData.user)
    }, [taskAuthorData])

    const handleAddCandidate = (e) => {
        e.preventDefault()

        let formData = new FormData()
        formData.append('task_gql_id', task.id)

        let action = 'add-candidate'
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
                if(result.status == 'fail') {
                    return utils.itvShowAjaxError({message: result.message})
                }

                addDoer(user)
            },
            (error) => {
                utils.itvShowAjaxError({action, error})
            }
        )

    }

    return (
        <main id="site-main" className="site-main page-task" role="main">
            <section className="content">
                <h2>Задача</h2>

                <TaskBody task={task} author={author} />
                <TaskComments task={task} author={author} />

                {!approvedDoer && !!user.id && user.id != author.id && !isUserCandidate && 
                <div className="task-give-response">                    
                    <p>Кликнув на кнопку, вы попадете в список волонтёров откликнувшихся на задачу. Заказчик задачи выберет подходящего из списка.</p>
                    <a href="#" className="button-give-response" onClick={handleAddCandidate}>Откликнуться на задачу</a>
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

                {!approvedDoer && !!user.id && user.id != author.id && !isUserCandidate && 
                <div className="action-block">
                    <a href="#" className="action-button" onClick={handleAddCandidate}>Откликнуться на задачу</a>
                </div>
                }

                {!approvedDoer && !doers.length &&
                <h2>Откликов пока нет</h2>
                }

                {!approvedDoer && !doers.length && !!user.id && user.id != author.id && 
                <div className="sidebar-users-block no-responses">
                    <p>Откликов пока нет. Воспользуйся возможностью получить задачу</p>
                </div>
                }

                {!approvedDoer && !!user.id && user.id == author.id && doers.length < 2 &&
                <div className="sidebar-users-block no-responses">
                    <p>Мало просмотров и откликов на задачу? Возможно, <a href="/sovety-dlya-nko-uspeshnye-zadachi/" target="_blank">наши советы помогут вам</a></p>
                </div>
                }

                {!!approvedDoer &&
                <h2>Над задачей работает</h2>
                }

                {!!approvedDoer &&
                <div className="sidebar-users-block responses approved-doer">
                    <div className="user-cards-list">
                        <DoerCard doer={approvedDoer} user={user} author={author} task={task} />
                    </div>
                </div>                    
                }

                {!approvedDoer && doers.length > 0 &&
                <h2>Отклики на задачу</h2>
                }

                {!approvedDoer && doers.length > 0 &&
                <TaskDoersBlock task={task} author={author} />
                }

                <div className="something-wrong-with-task d-none">
                    <a href="#" className="contact-admin">Что-то не так с задачей? Напиши администратору</a>
                </div>

            </section>
        </main>
    )
}
