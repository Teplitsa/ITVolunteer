import React, {Component, useEffect} from 'react'
import { useQuery } from '@apollo/react-hooks'
import { useStoreState, useStoreActions } from "easy-peasy"

import iconApproved from '../../img/icon-all-done.svg'
import metaIconPaseka from '../../img/icon-paseka.svg'

import { getTaskLazyQuery } from '../network'
import * as utils from "../utils"

export function UserSmallView({user}) {
    if(!user) {
        return null
    }

    return (
        <div className="itv-user-small-view">
            <span className="avatar-wrapper" style={{
                backgroundImage: user.itvAvatar ? `url(${user.itvAvatar})` : "none",
            }}/>

            <span className="name">
                <span>{user.fullName}</span>/{user.memberRole}
            </span>
        </div>
    )
}

export function UserSmallPicView({user}) {
    if(!user) {
        return null
    }

    return (
        <div className="itv-user-small-view">
            <span className="avatar-wrapper" style={{
                backgroundImage: user.itvAvatar ? `url(${user.itvAvatar})` : "none",
            }}/>
        </div>
    )
}

export function TaskAuthor({author}) {
    const user = useStoreState(store => store.user.data)

    if(!author || !author.id) {
        return null
    }

    if(!user) {
        return null
    }

    return (
        <div className="sidebar-users-block">
            <div className="user-card">
                <div className="user-card-inner">
                    <div className="avatar-wrapper" style={{
                        backgroundImage: author.itvAvatar ? `url(${author.itvAvatar})` : "none",
                    }}/>
                    <div className="details">
                        <span className="status">Заказчик</span>
                        <span className="name">{author.fullName}</span>
                        <span className="reviews">{`${author.authorReviewsCount} отзывов`}</span>
                    </div>
                </div>
            </div>

            { !!author.organizationName &&
            <div className="user-org-separator"></div>
            }

            { !!author.organizationName &&
            <div className="user-card">
                <div className="user-card-inner">

                    { !!author.organizationLogo && 
                    <div className="avatar-wrapper" style={{
                        backgroundImage: author.organizationLogo ? `url(${author.organizationLogo})` : "none",
                    }}>
                        {!!author.isPartner &&
                        <img src={iconApproved} className="itv-approved" />
                        }
                    </div>
                    }

                    <div className="details">
                        <span className="status">Представитель организации/проекта</span>
                        <span className="name" dangerouslySetInnerHTML={{__html: author.organizationName}} />
                    </div>
                </div>
            </div>
            }

            <p className="org-description" dangerouslySetInnerHTML={{__html: author.organizationDescription}} />
        </div>
    )
}

export function TaskDoers({task, author, doers}) {
    const user = useStoreState(store => store.user.data)

    return (
        <div className="user-cards-list">
            {doers.map((doer, key) =>
                <DoerCard doer={doer} user={user} author={author} task={task} key={key} />
            )}
        </div>
    )
}

export function DoerCard({doer, user, author, task}) {
    const doers = useStoreState(store => store.task.doers)
    const approveDoer = useStoreActions(actions => actions.task.approveDoer)
    const declineDoer = useStoreActions(actions => actions.task.declineDoer)
    const setTaskData = useStoreActions(actions => actions.task.setData)
    const loadTimeline = useStoreActions(actions => actions.timeline.loadTimeline)

    const [getTaskLazy, { 
        loading: taskLoading, 
        error: taskLoadError, 
        data: taskData
    }] = getTaskLazyQuery(task.id)

    useEffect(() => {
        if(!taskData) {
            return
        }

        setTaskData(taskData.task)
    }, [taskData])    

    const handleApproveDoer = (e, doer) => {
        e.preventDefault()

        let formData = new FormData()
        formData.append('doer_gql_id', doer.id)
        formData.append('task_gql_id', task.id)

        let action = 'approve-candidate'
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

                approveDoer(doer)
                // getTaskLazy()
                loadTimeline(task.id)
            },
            (error) => {
                utils.itvShowAjaxError({action, error})
            }
        )
    }

    const handleDeclineDoer = (e, doer) => {
        e.preventDefault()

        let formData = new FormData()
        formData.append('doer_gql_id', doer.id)
        formData.append('task_gql_id', task.id)

        let action = 'decline-candidate'
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

                declineDoer({doers, doer})
            },
            (error) => {
                utils.itvShowAjaxError({action, error})
            }
        )
    }

    const handleCancelDoer = (e, doer) => {
        e.preventDefault()

        let formData = new FormData()
        formData.append('task_gql_id', task.id)

        let action = 'remove-candidate'
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

                declineDoer({doers, doer})
                approveDoer(null)
                loadTimeline(task.id)
            },
            (error) => {
                utils.itvShowAjaxError({action, error})
            }
        )
    }

    if(!doer) {
        return null
    }

    return (
        <div className="user-card">
            <div className="user-card-inner">
                <div className="avatar-wrapper" style={{
                    backgroundImage: doer.itvAvatar ? `url(${doer.itvAvatar})` : "none",
                }}>

                    {!!doer.isPasekaMember &&
                    <img src={metaIconPaseka} className="itv-approved" />
                    }

                </div>
                <div className="details">
                    <a className="name" href={doer.profileURL}>{doer.fullName}</a>
                    <span className="reviews">{`${doer.doerReviewsCount} отзывов`}</span>
                    <span className="status">{`Выполнено ${doer.solvedTasksCount} задач`}</span>
                </div>
            </div>
            {!!user.id && (user.id === author.id || user.id === doer.id) &&
            <div className={`author-actions-on-doer ${user.id === doer.id ? 'i-am-doer' : ''}`}>
                {user.id == author.id &&
                <a href="#" className="accept-doer" onClick={(e) => {handleApproveDoer(e, doer)}}>Выбрать</a>
                }

                {user.id == author.id &&
                <a href="#" className="reject-doer" onClick={(e) => {handleDeclineDoer(e, doer)}}>Отклонить</a>
                }

                {user.id === doer.id &&
                <a href="#" className="cancel-doer danger" onClick={(e) => {handleCancelDoer(e, doer)}}>Отказаться помогать</a>
                }

                {user.id == author.id &&
                <div className="tooltip">
                    <div className="tooltip-buble">
                        <h4>Как выбрать волонтёра?</h4>
                        <p>Посмотрите профиль, если вызывает доверие, нажмите кнопку выбрать. На почту придут способы как связаться</p>                                            
                    </div>
                    <div className="tooltip-actor">?</div>
                </div>
                }
            </div>
            }
        </div>
    )
}