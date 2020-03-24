import React, {Component} from 'react'
import { useQuery } from '@apollo/react-hooks'
import { useStoreState, useStoreActions } from "easy-peasy"

import iconApproved from '../../img/icon-all-done.svg'
import metaIconPaseka from '../../img/icon-paseka.svg'

import * as utils from "../utils"

export function UserSmallView({user}) {
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

export function TaskAuthor({author}) {
    const user = useStoreState(store => store.user.data)

    return author.id ? (
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
                        <img src={iconApproved} className="itv-approved" />
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
    ) : null
}

export function TaskDoers({task, author, doers}) {
    const user = useStoreState(store => store.user.data)

    return (
        <div className="user-cards-list">
            {doers.map((doer, key) =>
            <div className="user-card" key={key}>
                <div className="user-card-inner">
                    <div className="avatar-wrapper" style={{
                        backgroundImage: doer.itvAvatar ? `url(${doer.itvAvatar})` : "none",
                    }}>
                        {(() => {
                            return (key == 1 ? <img src={metaIconPaseka} className="itv-approved" /> : null);
                        })()}
                    </div>
                    <div className="details">
                        <a className="name" href={doer.profileURL}>{doer.fullName}</a>
                        <span className="reviews">{`${doer.doerReviewsCount} отзывов`}</span>
                        <span className="status">{`Выполнено ${doer.solvedTasksCount} задач`}</span>
                    </div>
                </div>
                {!!user.id && user.id == author.id &&
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
                }
            </div>
            )}
        </div>
    )
}
