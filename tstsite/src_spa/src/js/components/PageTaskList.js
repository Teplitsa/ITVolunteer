import React, {Component, useState, useEffect} from 'react'
import {
  Link
} from "react-router-dom";
import { useStoreState, useStoreActions } from "easy-peasy"
import { format, formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'

import * as utils from "../utils"
import { getTaskAuthorQuery, getTaskQuery, getTaskDoersQuery } from '../network'

import imgFilterMoodRock from '../../img/icon-filter-mood-rock.svg'
import imgFilterAward from '../../img/icon-filter-award.svg'
import imgFilterTags from '../../img/icon-color-picker.svg'
import imgFilterPeople from '../../img/icon-people.svg'
import imgFilterTaskList from '../../img/icon-filter-task-list.svg'
import imgFilterGalkaDown from '../../img/icon-filter-galka-down.svg'
import imgFilterGalkaUp from '../../img/icon-filter-galka-up.svg'
import imgFilterCheckOn from '../../img/icon-filter-check-on.svg'
import imgFilterCheckOff from '../../img/icon-filter-check-off.svg'

import tagIconTags from '../../img/icon-color-picker.svg'
import tagIconThemes from '../../img/icon-people.svg'
import iconApproved from '../../img/icon-all-done.svg'
import tagIconReward from '../../img/icon-gift-box.svg'
import metaIconCalendar from '../../img/icon-calc.svg'
import metaIconShare from '../../img/icon-share.svg'
import ratingStarEmptyGray from '../../img/icon-star-empty-gray.svg'
import ratingStarFilled from '../../img/icon-star-filled.svg'
import ratingStarEmptyWhite from '../../img/icon-star-empty-white.svg'

import {TaskMetaInfo, TaskMetaTerms} from './Task'
import {UserSmallView} from './User'

export function PageTaskList(props) {
    const user = useStoreState(store => store.user.data)

    return (<main id="site-main" className="site-main page-task-list" role="main">
        <section className="page-header">
            <h1>Задачи</h1>
            <div className="stats">
                <span className="active">Ожидают волонтеров: 53</span>
                <span>В работе: 83</span>
                <span>Решено: 975</span>
            </div>
        </section>
        <div className="page-sections">
            <TaskListFilter />
            <TaskList />
        </div>
    </main>)
}

function TaskListFilter(props) {
    return (
        <section className="task-list-filter">
            <div className="filter-explain">Выберите категории задач, которые вам подоходят</div>
            <div className="filter-tip">
                <div className="filter-tip-header">
                    <span className="filter-tip-title">
                        <img src={imgFilterMoodRock}/>
                        <span>Подсказка</span>
                    </span>
                    <a href="#" className="filter-tip-close"> </a>
                </div>
                Вы сможете получать уведомления о новых задачах
            </div>
            <div className="filter-sections">
                <div className="filter-section">
                    <div className="filter-section-title">
                        <img src={imgFilterTags}/>
                        <span>Категории</span>
                    </div>

                    <div className="filter-section-option-groups">
                        <div className="filter-section-option-list expand active">
                            <div className="filter-section-option-list-header">
                                <img src={imgFilterGalkaUp}/>
                                <span>Веб-сайты и разработка</span>
                            </div>
                            <div className="filter-section-option-list-items">
                                <div className="filter-section-option-list-item">
                                    <img src={imgFilterCheckOff}/>
                                    <span>Баннеры</span>
                                </div>
                                <div className="filter-section-option-list-item active">
                                    <img src={imgFilterCheckOn}/>
                                    <span>Веб-дизайн</span>
                                </div>
                            </div>
                        </div>

                        <div className="filter-section-option-list expand">
                            <div className="filter-section-option-list-header">
                                <img src={imgFilterGalkaDown}/>
                                <span>Веб-сайты и разработка</span>
                            </div>
                            <div className="filter-section-option-list-items">
                                <div className="filter-section-option-list-item">
                                    <img src={imgFilterCheckOff}/>
                                    <span>Баннеры</span>
                                </div>
                                <div className="filter-section-option-list-item active">
                                    <img src={imgFilterCheckOn}/>
                                    <span>Веб-дизайн</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div className="filter-sections">
                <div className="filter-section">
                    <div className="filter-section-title">
                        <img src={imgFilterTaskList}/>
                        <span>Тип задачи</span>
                    </div>

                    <div className="filter-section-option-groups">
                        <div className="filter-section-option-list">
                            <div className="filter-section-option-list-items">
                                <div className="filter-section-option-list-item">
                                    <img src={imgFilterCheckOff}/>
                                    <span>Баннеры</span>
                                </div>
                                <div className="filter-section-option-list-item">
                                    <img src={imgFilterCheckOff}/>
                                    <span>Баннеры</span>
                                </div>
                                <div className="filter-section-option-list-item active">
                                    <img src={imgFilterCheckOn}/>
                                    <span>Веб-дизайн</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="filter-tip after-filter">
                <div className="filter-tip-header">
                    <span className="filter-tip-title">
                        <img src={imgFilterAward}/>
                        <span>Награда</span>
                    </span>
                    <a href="#" className="filter-tip-close"> </a>
                </div>
                Подпишитесь на уведомления и получите 500 баллов
            </div>
            <div className="filter-actions">
                <a href="#" className="filter-subscribe">Подписаться на уведомления</a>
                <a href="#" className="filter-reset">Сбросить фильтры</a>
            </div>
        </section>
    )
}

function TaskList(props) {
    const taskList = useStoreState(store => store.taskList.taskList)
    const setTaskList = useStoreActions(actions => actions.taskList.setTaskList)


    useEffect(() => {
        let action = 'get-task-list'
        fetch(utils.itvAjaxUrl(action))
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

                setTaskList(result.taskList)
            },
            (error) => {
                utils.itvShowAjaxError({action, error})
            }
        )
    }, [])

    return (
        <section className="task-list">
            {taskList && taskList.map((task, key) => <TaskListItem task={task} key={key} />)}
        </section>
    )
}

function TaskListItem(props) {
    const task = props.task

    return (<div className="task-body">                    
                <div class="task-author-meta">
                    <UserSmallView user={task.author} />
                    {!!task.author.organizationName &&
                    <UserSmallView user={{
                        itvAvatar: task.author.organizationLogo,
                        fullName: task.author.organizationName,
                        memberRole: "Организация",
                    }} />
                    }
                </div>                
                <Link to={task.pemalinkPath}>
                    <h1 dangerouslySetInnerHTML={{__html: task.title}}/>
                </Link>
                <div className="meta-info">
                    <img src={iconApproved} className="itv-approved" />
                    
                    <TaskMetaInfo icon={metaIconCalendar} title={format(new Date(task.date), 'do MMMM Y', {locale: ru})}/>
                    <TaskMetaInfo icon={metaIconCalendar} title={`Открыто ${formatDistanceToNow(new Date(task.date), {locale: ru, addSuffix: true})}`}/>
                    <TaskMetaInfo icon={metaIconCalendar} title={`${task.doerCandidatesCount} откликов`}/>
                    <TaskMetaInfo icon={metaIconCalendar} title={`${task.viewsCount} просмотров`}/>

                    <a href="#" className="share-task">
                        <TaskMetaInfo icon={metaIconShare} title="Поделиться"/>
                    </a>
                </div>
                { !!task.featuredImage &&
                    <div className="cover" />
                }
                { !!task.content &&
                    <div className="task-content" dangerouslySetInnerHTML={{__html: task.content}} />
                }
                {(!!task.tags.nodes.length || !!task.ngoTaskTags.nodes || !!task.rewardTags.nodes) &&
                <div className="meta-terms">

                    {!!task.tags.nodes.length &&
                    <TaskMetaTerms icon={tagIconTags} tags={task.tags.nodes}/>
                    }

                    {!!task.ngoTaskTags.nodes.length &&
                    <TaskMetaTerms icon={tagIconThemes} tags={task.ngoTaskTags.nodes}/>
                    }
                    
                    {!!task.rewardTags.nodes.length &&
                    <TaskMetaTerms icon={tagIconReward} tags={task.rewardTags.nodes}/>
                    }
                </div>
                }
    </div>)
}