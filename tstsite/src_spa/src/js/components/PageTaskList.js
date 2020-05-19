import React, {Component, useState, useEffect} from 'react'
import {
  Link
} from "react-router-dom";
import { useStoreState, useStoreActions } from "easy-peasy"
import { format, formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'
import * as _ from "lodash"

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
import tagIconTaskType from '../../img/icon-filter-task-list.svg'
import tagIconAuthorType from '../../img/icon-people.svg'
import iconApproved from '../../img/icon-all-done.svg'
import tagIconReward from '../../img/icon-gift-box.svg'
import metaIconCalendar from '../../img/icon-calc.svg'
import metaIconShare from '../../img/icon-share.svg'
import ratingStarEmptyGray from '../../img/icon-star-empty-gray.svg'
import ratingStarFilled from '../../img/icon-star-filled.svg'
import ratingStarEmptyWhite from '../../img/icon-star-empty-white.svg'

import {TaskMetaInfo, TaskMetaTerms} from './Task'
import {UserSmallView} from './User'

const filterSectionIcons = {
    tags: tagIconTags,
    ngo_tags: tagIconThemes,
    task_type: tagIconTaskType,
    author_type: tagIconAuthorType,
}

const filterTips = {
    newTaskNotif: 'newTaskNotif',
    subscribeAndEarnPoints: 'subscribeAndEarnPoints',
}

const statusFilterTitle = {
    publish: "Ожидают волонтеров",
    in_work: "В работе",
    closed: "Решено",
}

export function PageTaskList(props) {
    const user = useStoreState(store => store.user.data)

    const statusStats = useStoreState(store => store.taskListFilter.statusStats)
    const setStatusStats = useStoreActions(actions => actions.taskListFilter.setStatusStats)
    const loadStatusStats = useStoreActions(actions => actions.taskListFilter.loadStatusStats)

    // option check state
    const optionCheck = useStoreState(store => store.taskListFilter.optionCheck)
    const setOptionCheck = useStoreActions(actions => actions.taskListFilter.setOptionCheck)
    const saveOptionCheck = useStoreActions(actions => actions.taskListFilter.saveOptionCheck)

    useEffect(() => {
        if(optionCheck === null) {
            return
        }

        let formData = new FormData()
        formData.append('filter', JSON.stringify(optionCheck))

        let action = 'get-task-status-stats'
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

                setStatusStats(result.stats)
            },
            (error) => {
                utils.itvShowAjaxError({action, error})
            }
        )
    }, [optionCheck])

    function statusFilterClickHandler(e, status) {
        e.preventDefault()
        setOptionCheck({...optionCheck, status: status})
        saveOptionCheck()
    }

    return (<main id="site-main" className="site-main page-task-list" role="main">
        <section className="page-header">
            <h1>Задачи</h1>
            {statusStats !== null &&
            <div className="stats">
                {["publish", "in_work", "closed"].map((status, index) => {
                    return (
                        <span 
                            className={(optionCheck.status ===  status || (!optionCheck.status && status === "publish")) ? "active" : ""} 
                            key={`StatusFilterItem${index}`} 
                            onClick={(e) => {statusFilterClickHandler(e, status)}}
                        >
                            {`${statusFilterTitle[status]}: ${_.get(statusStats, status, "")}`}
                        </span>
                    )
                })}
            </div>
            }
        </section>
        <div className="page-sections">
            <TaskListFilter />
            <TaskList />
        </div>
    </main>)
}

function TaskListFilter(props) {
    const user = useStoreState(store => store.user.data)
    const tipClose = useStoreState(store => store.taskListFilter.tipClose)
    const setTipClose = useStoreActions(actions => actions.taskListFilter.setTipClose)
    const saveTipClose = useStoreActions(actions => actions.taskListFilter.saveTipClose)
    const loadTipClose = useStoreActions(actions => actions.taskListFilter.loadTipClose)    

    // sections close state
    const sectionClose = useStoreState(store => store.taskListFilter.sectionClose)
    const setSectionClose = useStoreActions(actions => actions.taskListFilter.setSectionClose)
    const saveSectionClose = useStoreActions(actions => actions.taskListFilter.saveSectionClose)
    const loadSectionClose = useStoreActions(actions => actions.taskListFilter.loadSectionClose)    

    // option check state
    const optionCheck = useStoreState(store => store.taskListFilter.optionCheck)
    const setOptionCheck = useStoreActions(actions => actions.taskListFilter.setOptionCheck)
    const saveOptionCheck = useStoreActions(actions => actions.taskListFilter.saveOptionCheck)
    const loadOptionCheck = useStoreActions(actions => actions.taskListFilter.loadOptionCheck)    

    // filter data
    const filterData = useStoreState(store => store.taskListFilter.filterData)
    const isFilterDataLoaded = useStoreState(store => store.taskListFilter.isFilterDataLoaded)
    const loadFilterData = useStoreActions(actions => actions.taskListFilter.loadFilterData)        

    // subscription
    const subscribeTaskList = useStoreState(store => store.user.subscribeTaskList)
    const setSubscribeTaskList = useStoreActions(actions => actions.user.setSubscribeTaskList)
    const loadSubscribeTaskList = useStoreActions(actions => actions.user.loadSubscribeTaskList)

    useEffect(() => {
        loadFilterData()
        loadTipClose()
        loadOptionCheck()
    }, [])

    useEffect(() => {
        if(!user.id) {
            return
        }

        loadSubscribeTaskList()
    }, [user])

    function handleCloseTip(e, tipId) {
        e.preventDefault()
        setTipClose({...tipClose, [tipId]: true})
        saveTipClose()
    }

    function handleFilterOptionClick(e, optionId) {
        e.preventDefault()

        let newCheckValue = !_.get(optionCheck, optionId, false)

        if(newCheckValue) {
            setOptionCheck({...optionCheck, [optionId]: true})            
        }
        else {
            let optionCheckNew = {...optionCheck}
            delete optionCheckNew[optionId]
            setOptionCheck({...optionCheckNew})
        }
        
        saveOptionCheck()
    }

    function handleSubscribe(e) {
        e.preventDefault()

        let formData = new FormData()
        formData.append('filter', JSON.stringify(optionCheck))

        let action = 'subscribe-task-list'
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

                setSubscribeTaskList(optionCheck)
            },
            (error) => {
                utils.itvShowAjaxError({action, error})
            }
        )
    }

    function handleUnsubscribe(e) {
        e.preventDefault()

        let formData = new FormData()

        let action = 'unsubscribe-task-list'
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

                setSubscribeTaskList(null)
            },
            (error) => {
                utils.itvShowAjaxError({action, error})
            }
        )
    }

    function handleResetFilter(e) {
        e.preventDefault()

        setOptionCheck({})
        saveOptionCheck()
    }

    if(!isFilterDataLoaded) {
        return (
            <section className="task-list-filter">
            {utils.loadingWait()}
            </section>
        )   
    }

    return (
        <section className="task-list-filter">
            <div className="filter-explain">Выберите категории задач, которые вам подоходят</div>

            {!tipClose[filterTips.newTaskNotif] &&
            <div className="filter-tip">
                <div className="filter-tip-header">
                    <span className="filter-tip-title">
                        <img src={imgFilterMoodRock}/>
                        <span>Подсказка</span>
                    </span>
                    <a href="#" className="filter-tip-close" onClick={(e) => {handleCloseTip(e, filterTips.newTaskNotif)}}> </a>
                </div>
                Вы сможете получать уведомления о новых задачах
            </div>
            }

            <div className="filter-sections">
                {filterData.map((item, index) => {
                    return <FilterSection key={`filterSection${index}`} 
                        sectionData={item} 
                        optionCheck={optionCheck} 
                        optionClickHandler={handleFilterOptionClick}
                    />
                })}

                {/* markup example for options with folding */}
                <div className="filter-section d-none">
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
                                    <span className="check-title">
                                        <img src={_.get(optionCheck, "tags.banners", false) ? imgFilterCheckOn : imgFilterCheckOff}/>
                                        <span>Баннеры</span>
                                    </span>
                                    <span className="stats">28</span>
                                </div>
                                <div className="filter-section-option-list-item active">
                                    <span className="check-title">
                                        <img src={imgFilterCheckOn}/>
                                        <span>Веб-дизайн</span>
                                    </span>
                                    <span className="stats">28</span>
                                </div>
                            </div>
                        </div>

                        <div className="filter-section-option-list expand">
                            <div className="filter-section-option-list-header">
                                <span className="check-title">
                                    <img src={imgFilterGalkaDown}/>
                                    <span>Веб-сайты и разработка</span>
                                </span>
                                <span className="stats">33</span>
                            </div>
                            <div className="filter-section-option-list-items">
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {!tipClose[filterTips.subscribeAndEarnPoints] && 
            <div className="filter-tip after-filter">
                <div className="filter-tip-header">
                    <span className="filter-tip-title">
                        <img src={imgFilterAward}/>
                        <span>Награда</span>
                    </span>
                    <a href="#" className="filter-tip-close" onClick={(e) => {handleCloseTip(e, filterTips.subscribeAndEarnPoints)}}> </a>
                </div>
                Подпишитесь на уведомления и получите 500 баллов
            </div>
            }

            <div className="filter-actions">
                {subscribeTaskList === null && 
                <a href="#" className="filter-subscribe" onClick={(e) => {handleSubscribe(e)}}>Подписаться на уведомления</a>
                }
                <a href="#" className="filter-reset" onClick={(e) => {handleResetFilter(e)}}>Сбросить фильтры</a>
                {subscribeTaskList !== null && 
                <div className="already-subscribed">
                    <a href="#" className="filter-unsubscribe" onClick={(e) => {handleUnsubscribe(e)}}>Отменить подписку</a>
                    <span>У вас настроена рассылка на выбранные категории задач</span>
                </div>
                }
            </div>
        </section>
    )
}

function FilterSection(props) {
    const sectionId = _.get(props, "sectionData.id", "")
    const sectionTitle = _.get(props, "sectionData.title", "")
    const sectionIcon = _.get(filterSectionIcons, sectionId, "")
    const sectionItems = _.get(props, "sectionData.items", "")
    const optionClickHandler = props.optionClickHandler
    const optionCheck = props.optionCheck

    if(!sectionId) {
        return null
    }

    return (
        <div className="filter-section">
            <div className="filter-section-title">
                <img src={sectionIcon ? sectionIcon : imgFilterTaskList}/>
                <span>{sectionTitle}</span>
            </div>

            <div className="filter-section-option-groups">
                <div className="filter-section-option-list">
                    <div className="filter-section-option-list-items">
                        {sectionItems.map((item, index) => {
                            const optionId = sectionId + "." + item.id
                            return (
                                <div className={`filter-section-option-list-item ${_.get(optionCheck, optionId, false) ? "active" : ""}`} key={`filterSectionItem${sectionId}-${index}`}>
                                    <span className="check-title" onClick={(e) => {optionClickHandler(e, optionId)}}>
                                        <img src={_.get(optionCheck, optionId, false) ? imgFilterCheckOn : imgFilterCheckOff}/>
                                        <span>{item.title}</span>
                                    </span>
                                    <span className="stats">{item.task_count}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

function TaskList(props) {
    const taskList = useStoreState(store => store.taskList.taskList)
    const isTaskListLoaded = useStoreState(store => store.taskList.isTaskListLoaded)
    const resetTaskListLoaded = useStoreActions(actions => actions.taskList.resetTaskListLoaded)
    const setTaskList = useStoreActions(actions => actions.taskList.setTaskList)

    // load more
    const [page, setPage] = useState(1)
    const [isLoadMoreTaskCount, setIsLoadMoreTaskCount] = useState(true)
    const appendTaskList = useStoreActions(actions => actions.taskList.appendTaskList)

    // filter
    const optionCheck = useStoreState(store => store.taskListFilter.optionCheck)    
    const statusStats = useStoreState(store => store.taskListFilter.statusStats)

    async function loadFilteredTaskList(optionCheck, page) {
        let isLoadMore = page > 1

        if(!isLoadMore) {
            resetTaskListLoaded()
        }

        let formData = new FormData()
        formData.append('page', page)
        formData.append('filter', JSON.stringify(optionCheck))

        let action = 'get-task-list'
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

                setIsLoadMoreTaskCount(result.taskList.length > 0)

                if(isLoadMore) {
                    appendTaskList(result.taskList)
                }
                else {
                    setTaskList(result.taskList)
                }
            },
            (error) => {
                utils.itvShowAjaxError({action, error})
            }
        )
    }

    useEffect(() => {
        if(optionCheck === null) {
            return
        }

        loadFilteredTaskList(optionCheck, page)
    }, [page, optionCheck])

    useEffect(() => {
        if(optionCheck === null) {
            return
        }

        resetTaskListLoaded()
        setPage(1)
    }, [optionCheck])

    useEffect(() => {
        if(optionCheck === null) {
            return
        }

        if(statusStats === null) {
            return
        }

        let totalTasksCount = _.get(statusStats, optionCheck ? optionCheck.status : "publish", 0)
        // console.log("totalTasksCount:", totalTasksCount)
        // console.log("taskList.length:", taskList.length)
        setIsLoadMoreTaskCount(totalTasksCount > taskList.length)

    }, [statusStats, optionCheck, taskList])

    function handleLoadMoreTasks(e) {
        e.preventDefault()
        setPage(page + 1)
    }

    if(!isTaskListLoaded) {
        return (
            <section className="task-list">
            {utils.loadingWait()}
            </section>
        )
    }

    return (
        <section className="task-list">
            {taskList && taskList.map((task, key) => <TaskListItem task={task} key={`taskListItem${key}`} />)}
            {isLoadMoreTaskCount &&
            <div className="load-more-tasks">
                <a href="#" className="btn btn-load-more" onClick={handleLoadMoreTasks}>Загрузить ещё</a>
            </div>
            }
        </section>
    )
}

function TaskListItem(props) {
    const task = props.task

    if(!task) {
        return null
    }

    return (<div className="task-body">                    
                <div className="task-author-meta">
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
                    <div className="tooltip itv-approved">
                        <div className="tooltip-buble">
                            Мы проверили, задача хорошая
                        </div>
                        <img src={iconApproved} className="tooltip-actor itv-approved" />
                    </div>                    
                    <TaskMetaInfo icon={metaIconCalendar} title={format(utils.itvWpDateTimeToDate(task.dateGmt), 'do MMMM Y', {locale: ru})}/>
                    <TaskMetaInfo icon={metaIconCalendar} title={`Открыто ${formatDistanceToNow(utils.itvWpDateTimeToDate(task.dateGmt), {locale: ru, addSuffix: true})}`}/>
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