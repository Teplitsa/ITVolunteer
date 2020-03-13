import React, {Component} from 'react'
import { useQuery } from '@apollo/react-hooks'

import iconApproved from '../../img/icon-all-done.svg'
import metaIconPaseka from '../../img/icon-paseka.svg'

import * as utils from "../utils"
import { TASK_AUTHOR_QUERY, TASK_DOERS_QUERY } from '../network'

export class UserSmallView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            user: props.user,
        }
    }

    render() {
        return <div className="itv-user-small-view">
            <span className="avatar-wrapper" style={{
                backgroundImage: this.state.user.avatar ? `url(${this.state.user.avatar.url})` : "none",
            }}/>

            <span className="name">
                <span>{this.state.user.fullName}</span>/{this.state.user.itvStatus}
            </span>
        </div>
    }
}

export function TaskAuthor({taskAuthorId}) {
    const { loading: authorDataLoading, error: authorDataError, data: authorData } = useQuery(TASK_AUTHOR_QUERY, {variables: { userId: taskAuthorId }},);

    if (authorDataLoading) return utils.loadingWait()
    if (authorDataError) return utils.loadingError(authorDataError)

    return (
        <div className="sidebar-users-block">
            <div className="user-card">
                <div className="user-card-inner">
                    <div className="avatar-wrapper" style={{
                        backgroundImage: authorData.user.avatar ? `url(${authorData.user.avatar.url})` : "none",
                    }}/>
                    <div className="details">
                        <span className="status">Заказчик</span>
                        <span className="name">{authorData.user.fullName}</span>
                        <span className="reviews">{`${authorData.user.authorReviewsCount} отзывов`}</span>
                    </div>
                </div>
            </div>
            <div className="user-org-separator"></div>
            <div className="user-card">
                <div className="user-card-inner">
                    <div className="avatar-wrapper" style={{
                        backgroundImage: authorData.user.organizationLogo ? `url(${authorData.user.organizationLogo})` : "none",
                    }}>
                        <img src={iconApproved} className="itv-approved" />
                    </div>
                    <div className="details">
                        <span className="status">Представитель организации/проекта</span>
                        <span className="name">{authorData.user.organizationName}</span>
                    </div>
                </div>
            </div>
            <p className="org-description">{authorData.user.organizationDescription}</p>
        </div>
    )
}

export function TaskDoers({taskId}) {
    const { loading: loading, error: error, data: doersData } = useQuery(TASK_DOERS_QUERY, {variables: { taskId: taskId }},);

    if (loading) return utils.loadingWait()
    if (error) return utils.loadingError(error)

    return (
        <div className="user-cards-list">
            {doersData.taskDoers.map((user, key) =>
            <div className="user-card" key={key}>
                <div className="user-card-inner">
                    <div className="avatar-wrapper" style={{
                        backgroundImage: user.avatar ? `url(${user.avatar.url})` : "none",
                    }}>
                        {(() => {
                            return (key == 1 ? <img src={metaIconPaseka} className="itv-approved" /> : null);
                        })()}
                    </div>
                    <div className="details">
                        <span className="name">{user.fullName}</span>
                        <span className="reviews">{`${user.doerReviewsCount} отзывов`}</span>
                        <span className="status">{`Выполнено ${user.solvedTasksCount} задач`}</span>
                    </div>
                </div>
                <div className="author-actions-on-doer">
                    <a href="#" className="accept-doer">Выбрать</a>
                    <a href="#" className="reject-doer">Отклонить</a>
                    <div className="tooltip">
                        <div className="tooltip-buble">
                            <h4>Как выбрать волонтёра?</h4>
                            <p>Посмотрите профиль, если вызывает доверие, нажмите кнопку выбрать. На почту придут способы как связаться</p>                                            
                        </div>
                        <div className="tooltip-actor">?</div>
                    </div>
                </div>
            </div>
            )}
        </div>
    )
}