import React, {Component, useState, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { useStoreState, useStoreActions } from "easy-peasy"
import { format, formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'

import tagIconTags from '../../img/icon-color-picker.svg'
import tagIconThemes from '../../img/icon-people.svg'
import iconApproved from '../../img/icon-all-done.svg'
import tagIconReward from '../../img/icon-gift-box.svg'
import metaIconCalendar from '../../img/icon-calc.svg'
import metaIconShare from '../../img/icon-share.svg'
import ratingStarEmptyGray from '../../img/icon-star-empty-gray.svg'
import ratingStarFilled from '../../img/icon-star-filled.svg'
import ratingStarEmptyWhite from '../../img/icon-star-empty-white.svg'

import { getTaskLazyQuery } from '../network'
import * as utils from "../utils"

import {UserSmallView, TaskDoers} from './User'

export function TaskBody({task, author}) {
    const user = useStoreState(store => store.user.data)
    const approvedDoer = useStoreState(store => store.task.approvedDoer)

    const [getTaskLazy, { 
        loading: taskLoading, 
        error: taskLoadError, 
        data: taskData
    }] = getTaskLazyQuery(task.id)

    function handleUnpublishTask(e) {
        e.preventDefault()

        let $ = jQuery

        if(user.id !== author.id) {
            console.log('not author')
            return
        }

        let formData = new FormData()
        formData.append('task-id', task.databaseId)

        let action = 'unpublish-task'
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

                getTaskLazy()
            },
            (error) => {
                utils.itvShowAjaxError({action, error})
            }
        )              
    }

    function handlePublishTask(e) {
        e.preventDefault()

        let $ = jQuery

        if(user.id !== author.id) {
            console.log('not author')
            return
        }

        let formData = new FormData()
        formData.append('task-id', task.databaseId)

        let action = 'publish-task'
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

                getTaskLazy()
            },
            (error) => {
                utils.itvShowAjaxError({action, error})
            }
        )              
    }

    if(!task.id) {
        return null
    }

    return (<div className="task-body">                    
            <header>
                <h1  dangerouslySetInnerHTML={{__html: task.title}}/>
                <div className="meta-info">
                    <img src={iconApproved} className="itv-approved" />
                    
                    <TaskMetaInfo icon={metaIconCalendar} title={format(new Date(task.dateGmt), 'do MMMM Y', {locale: ru})}/>
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
            </header>
            <article dangerouslySetInnerHTML={{__html: task.content}} />
            { !!user.id &&
            <TaskStages task={task}/>
            }

            { !!user.id &&
            <TaskTimeline task={task} author={author} />
            }

            <div className="task-basic-actions-bar">
                <div>
                {!!user.id && user.id === author.id && ['draft', 'publish'].find(status => task.status === status) &&
                <div className="task-publication-actions">
                    {task.status == 'draft' &&
                    <a href="#" className="accept-task" onClick={handlePublishTask}>Опубликовать</a>    
                    }
                    {task.status == 'publish' &&
                    <a href="#" className="reject-task danger" onClick={handleUnpublishTask}>Снять с публикации</a>    
                    }
                    
                </div>
                }
                </div>

                <div className="task-author-actions">
                    {[
                        ['draft', 'Черновик'], 
                        ['publish', 'Опубликовано'],
                        ['in_work', 'В работе'],
                        ['closed', 'Закрыто'],
                    ].map((item, key) => {
                        return task.status == item[0] ? (
                            <span className={`status ${item[0]}`} key={key}>{item[1]}</span>
                        ) : null
                    })}
                    

                    { !!user.id && user.id === author.id &&
                    <a href={`/task-actions/?task=${task.databaseId}`} className="edit" target="_blank">Редактировать</a>
                    }

                </div>
            </div>
        </div>        
    )
}

export class TaskMetaTerms extends Component {

    constructor(props) {
        super(props)
        this.state = {
            icon: props.icon,
            tags: props.tags,
        }
    }

    render() {
        return <div className="terms">
            { !!this.state.icon &&
                <img src={this.state.icon} />
            }
            {this.state.tags.map((item, key) =>
                <span key={key}>{item.name}</span>
            )}
        </div>
    }
}

export class TaskMetaInfo extends Component {

    constructor(props) {
        super(props)
        this.state = {
            icon: props.icon,
            title: props.title,
        }
    }

    render() {
        return <span className="meta-info">
            { !!this.state.icon &&
                <img src={this.state.icon} />
            }
            { !!this.state.title &&
                <span>{this.state.title}</span>
            }
        </span>
    }
}

export function TaskStages(props) {
    const task = props.task

    return (
         <div className="stages">
            <h3>Этапы</h3>
            <div className="stages-list">
                <div className={`stage ${task.status == 'draft' ? 'active' : 'done'}`}><i>1</i>Публикация</div>
                <div className={`stage ${task.status == 'publish' ? 'active' : (['draft'].find(s => s == task.status) ? '' : 'done')}`}><i>2</i>Поиск</div>
                <div className={`stage ${task.status == 'in_work' ? 'active' : (['draft', 'publish'].find(s => s == task.status) ? '' : 'done')}`}><i>3</i>В работе</div>
                <div className={`stage ${task.status == 'closed' ? 'done' : ''}`}><i>4</i>Закрытие</div>
                <div className={`stage last ${task.status == 'closed' && (!task.reviewsDone ? 'active' : 'done')}`}><i>5</i>Отзывы<b className="finish-flag"/></div>
            </div>
        </div>
   )
}

export function TaskTimeline({task, author}) {
    const user = useStoreState(store => store.user.data)
    const approvedDoer = useStoreState(store => store.task.approvedDoer)
    const timeline = useStoreState(store => store.timeline.timeline)
    const loadTimeline = useStoreActions(actions => actions.timeline.loadTimeline)
    const setTaskData = useStoreActions(actions => actions.task.setData)

    // suggest
    const [isOpenDateSuggest, setOpenDateSuggest] = useState(false)
    const [suggestedCloseDate, setSuggestedCloseDate] = useState(null)
    const [isOpenDateSuggestComment, setOpenDateSuggestComment] = useState(false)
    const [isOpenCloseSuggest, setOpenCloseSuggest] = useState(false)
    const [dateSuggestFormRef, setDateSuggestFormRef] = useState(null)

    // reviews
    const reviewForDoer = useStoreState(store => store.task.reviewForDoer)
    const setReviewForDoer = useStoreActions(actions => actions.task.setReviewForDoer)
    const reviewForAuthor = useStoreState(store => store.task.reviewForAuthor)
    const setReviewForAuthor = useStoreActions(actions => actions.task.setReviewForAuthor)
    const [isOpenReviewForm, setOpenReviewForm] = useState(false)
    const [newReviewRating, setNewReviewRating] = useState(0)

    const [getTaskLazy, { 
        loading: taskLoading, 
        error: taskLoadError, 
        data: taskData
    }] = getTaskLazyQuery(task.id)

    useEffect(() => {
        if(!task || !task.id) {
            return
        }

        loadTaskTimeline()
        loadTaskReviews()
    }, [task])

    useEffect(() => {
        if(!taskData) {
            return
        }

        setTaskData(taskData.task)
    }, [taskData])    

    useEffect(() => {
        if(!dateSuggestFormRef) {
            return
        }

        let $ = jQuery
        let $datepicker = $(dateSuggestFormRef).find('.date-suggest-datepicker').first()
        $datepicker.datepicker({
            minDate: new Date(),
        })

        if(suggestedCloseDate) {
            $datepicker.data('datepicker').selectDate(suggestedCloseDate)
        }
    }, [dateSuggestFormRef])

    // timeline
    async function loadTaskTimeline() {
        loadTimeline(task.id)
    }

    // suggest close date
    function handleSuggestCloseDate(e) {
        e.preventDefault()
        if(isOpenDateSuggestComment) {
            setOpenDateSuggestComment(false)
        }
        else if(isOpenDateSuggest) {
            setOpenDateSuggest(false)
        }
        else {
            setOpenCloseSuggest(false)
            setOpenDateSuggest(true)
        }
    }

    function handleCancelSuggestCloseDate(e) {
        e.preventDefault()
        setOpenDateSuggest(false)
    }

    function handleConfirmSuggestCloseDate(e) {
        e.preventDefault()
        let $ = jQuery
        let $datepicker = $(dateSuggestFormRef).find('.date-suggest-datepicker').first()
        console.log("selected date:", $datepicker.data('datepicker').selectedDates[0])
        setSuggestedCloseDate($datepicker.data('datepicker').selectedDates[0])
        setOpenDateSuggest(false)
        setOpenDateSuggestComment(true)
    }

    function handleCancelSuggestCloseDateComment(e) {
        e.preventDefault()
        setOpenDateSuggestComment(false)
        setOpenDateSuggest(true)
    }

    function handleSubmitSuggestCloseDate(e) {
        e.preventDefault()

        let $ = jQuery

        if(user.id === author.id) {
            console.log('author!!!')
            return
        }

        if(!approvedDoer || user.id !== approvedDoer.id) {
            console.log('not doer')
            return
        }

        let text = $('#date_suggest_comment').val().trim()
        if(!text) {
            console.log('text:', text)
            return
        }

        if(!suggestedCloseDate) {
            console.log('no suggestedCloseDate:', suggestedCloseDate)
            return
        }

        let formData = new FormData()
        formData.append('message', text)
        formData.append('due_date', (new Date(suggestedCloseDate - (new Date()).getTimezoneOffset() * 60000)).toISOString().slice(0, 19).replace('T', ' '))
        formData.append('task-id', task.databaseId)

        let action = 'suggest-close-date'
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

                setOpenDateSuggestComment(false)
                setOpenDateSuggest(false)
                loadTaskTimeline()
            },
            (error) => {
                utils.itvShowAjaxError({action, error})
            }
        )                
    }

    function handleAcceptSuggestedDate(e, timelineItemId) {
        e.preventDefault()

        let $ = jQuery

        if(user.id !== author.id) {
            console.log('not author')
            return
        }

        let formData = new FormData()
        formData.append('timeline-item-id', timelineItemId)
        formData.append('task-id', task.databaseId)

        let action = 'accept-close-date'
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

                loadTaskTimeline()
            },
            (error) => {
                utils.itvShowAjaxError({action, error})
            }
        )            
    }

    function handleRejectSuggestedDate(e, timelineItemId) {
        e.preventDefault()

        let $ = jQuery

        if(user.id !== author.id) {
            console.log('not author')
            return
        }

        let formData = new FormData()
        formData.append('timeline-item-id', timelineItemId)
        formData.append('task-id', task.databaseId)

        let action = 'reject-close-date'
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

                loadTaskTimeline()
            },
            (error) => {
                utils.itvShowAjaxError({action, error})
            }
        )            
    }

    // suggest close task
    function handleSuggestCloseTask(e) {
        e.preventDefault()
        if(isOpenCloseSuggest) {
            setOpenCloseSuggest(false)
        }
        else {
            setOpenDateSuggest(false)
            setOpenDateSuggestComment(false)
            setOpenCloseSuggest(true)
        }
    }

    function handleCancelSuggestCloseTask(e) {
        e.preventDefault()
        console.log("cancel")
        setOpenCloseSuggest(false)
    }

    function handleSubmitSuggestCloseTask(e) {
        e.preventDefault()
        console.log("submit")

        let $ = jQuery

        if(user.id === author.id) {
            return
        }

        if(!approvedDoer || user.id !== approvedDoer.id) {
            return
        }

        let text = $('#close_suggest_comment').val().trim()
        if(!text) {
            return
        }

        let formData = new FormData()
        formData.append('message', text)
        formData.append('task-id', task.databaseId)

        let action = 'suggest-close-task'
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

                setOpenCloseSuggest(false)
                loadTaskTimeline()
            },
            (error) => {
                utils.itvShowAjaxError({action, error})
            }
        )            
    }

    function handleAcceptSuggestedClose(e, timelineItemId) {
        e.preventDefault()

        let $ = jQuery

        if(user.id !== author.id) {
            console.log('not author')
            return
        }

        let formData = new FormData()
        formData.append('timeline-item-id', timelineItemId)
        formData.append('task-id', task.databaseId)

        let action = 'accept-close'
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

                getTaskLazy()
            },
            (error) => {
                utils.itvShowAjaxError({action, error})
            }
        )       
    }

    function handleRejectSuggestedClose(e, timelineItemId) {
        e.preventDefault()

        let $ = jQuery

        if(user.id !== author.id) {
            console.log('not author')
            return
        }

        let formData = new FormData()
        formData.append('timeline-item-id', timelineItemId)
        formData.append('task-id', task.databaseId)

        let action = 'reject-close'
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

                loadTaskTimeline()
            },
            (error) => {
                utils.itvShowAjaxError({action, error})
            }
        )       
    }

    // add review
    function handleOpenReview(e) {
        e.preventDefault()
        if(isOpenReviewForm) {
            setOpenReviewForm(false)
        }
        else {
            setOpenReviewForm(true)
        }
    }    

    function handleSetReviewRating(e, rating) {
        e.preventDefault()
        setNewReviewRating(rating)
    }

    function handleReviewFormSubmit(e) {
        e.preventDefault()

        let $ = jQuery

        if(!newReviewRating) {
            return
        }

        let text = $('#review_text').val().trim()
        if(!text) {
            return
        }

        let formData = new FormData()
        formData.append('review-rating', newReviewRating)
        formData.append('review-message', text)
        formData.append('task-id', task.databaseId)

        let action = ''

        if(user.id === author.id) {
            action = 'leave-review'
            formData.append('doer-id', approvedDoer.databaseId)
        }
        else {
            action = 'leave-review-author'
            formData.append('author-id', author.databaseId)
        }

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

                setOpenReviewForm(false)
                if(reviewForAuthor || reviewForDoer) {
                    getTaskLazy()
                }
                else {
                    loadTaskReviews()
                }
            },
            (error) => {
                utils.itvShowAjaxError({action, error})
            }
        )        
    }

    async function loadTaskReviews() {
        if(!task.databaseId) {
            return
        }

        let action = 'get-task-reviews'
        let formData = new FormData()
        formData.append('task-id', task.databaseId)

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

                setReviewForAuthor(result.reviews.reviewForAuthor)
                setReviewForDoer(result.reviews.reviewForDoer)
            },
            (error) => {
                utils.itvShowAjaxError({action, error})
            }
        )
    }

    return (
        <div className="timeline">
            <h3>Календарь задачи</h3>
            <div className="timeline-list">
                {timeline.map((item, key) => <div className={`checkpoint ${item.status} ${item.type} ${item.decision} ${item.isOverdue ? 'overdue' : ''}`} key={key}>
                        <div className="date">
                            <span className="date-num">{format(new Date(item.timeline_date), 'd')}</span>
                            {format(new Date(item.timeline_date), 'LLL', {locale: ru})}
                        </div>

                        <div className="info">
                            <i className="point-circle"> </i>
                            <h4>{item.title}{item.type == 'date_suggest' ? " " + format(new Date(item.timeline_date), 'dd.MM.yyyy') : ""}</h4>

                            { item.status == 'future' &&
                                <div className="details">Ожидаемый срок</div>}

                            {item.type == 'review' && approvedDoer && task.status === 'closed' &&
                                <div className="details actions">

                                    {!!approvedDoer && !!reviewForAuthor &&
                                    <div className="user-speach">
                                        <UserSmallView user={approvedDoer} />
                                        <div className="comment">
                                            {reviewForAuthor.message}
                                            <div className="rating-bar">
                                                <div className="stars">
                                                    {[1, 2, 3, 4, 5].map((i) => {
                                                        return reviewForAuthor.rating >= i ? (
                                                            <img src={ratingStarFilled} key={`Star${i}`} />
                                                        ) : (
                                                            <img src={ratingStarEmptyGray} key={`Star${i}`} />
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    }

                                    {!!reviewForDoer &&
                                    <div className="user-speach">
                                        <UserSmallView user={author} />
                                        <div className="comment">
                                            {reviewForDoer.message}
                                            <div className="rating-bar">
                                                <div className="stars">
                                                    {[1, 2, 3, 4, 5].map((i, key) => {
                                                        return reviewForDoer.rating >= i ? (
                                                            <img src={ratingStarFilled} key={`reviewForDoerRating${key}`}/>
                                                        ) : (
                                                            <img src={ratingStarEmptyGray} key={`reviewForDoerRating${key}`} />
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    }

                                    {((approvedDoer && user.id === approvedDoer.id && !reviewForAuthor) 
                                        || (user.id === author.id && !reviewForDoer)) &&
                                    <div className="comment-actions">
                                        {!reviewForDoer && !reviewForAuthor &&
                                        <div className="first-review-description">Оставьте свой отзыв. Он важен для получения обратной связи</div>
                                        }

                                        {!reviewForDoer && !reviewForAuthor &&
                                        <a href="#" className="action add-review first-review" onClick={handleOpenReview}>Написать отзыв</a>
                                        }

                                        {(reviewForDoer || reviewForAuthor) &&
                                        <a href="#" className="action add-review" onClick={handleOpenReview}>Написать отзыв</a>
                                        }
                                    </div>
                                    }

                                    {isOpenReviewForm &&
                                    <div className="timeline-form-wrapper">
                                        <div className="timeline-form timeline-form-review">
                                            <h4>Ваш отзыв о работе над задачей</h4>
                                            <textarea id="review_text"></textarea>
                                            <div className="rating-bar">
                                                <h4 className="title">Оценка задачи:</h4>
                                                <div className="stars">
                                                    <span className={newReviewRating >= 1 ? "on" : ""} onClick={(e) => {handleSetReviewRating(e, 1)}}/>
                                                    <span className={newReviewRating >= 2 ? "on" : ""} onClick={(e) => {handleSetReviewRating(e, 2)}}/>
                                                    <span className={newReviewRating >= 3 ? "on" : ""} onClick={(e) => {handleSetReviewRating(e, 3)}}/>
                                                    <span className={newReviewRating >= 4 ? "on" : ""} onClick={(e) => {handleSetReviewRating(e, 4)}}/>
                                                    <span className={newReviewRating >= 5 ? "on" : ""} onClick={(e) => {handleSetReviewRating(e, 5)}}/>
                                                </div>
                                            </div>
                                            <div className="comment-action">
                                                <a href="#" className="submit-comment" onClick={handleReviewFormSubmit}>Отправить</a>
                                            </div>
                                        </div>
                                    </div>
                                    }

                                </div>
                            }

                            {item.type == 'close' && approvedDoer && approvedDoer.id === user.id &&
                                <div className="details actions">
                                    <a href="#" className={`action suggest-date ${!!isOpenDateSuggest || !!isOpenDateSuggestComment ? "active" : ""}`} onClick={handleSuggestCloseDate}>Предложить новую дату</a>
                                    <a href="#" className={`action close-task ${!!isOpenCloseSuggest ? "active" : ""}`} onClick={handleSuggestCloseTask}>Закрыть задачу</a>

                                    {!!isOpenDateSuggest &&
                                    <div className="timeline-form-wrapper">
                                        <div ref={(ref) => setDateSuggestFormRef(ref)} className="timeline-form timeline-form-date-suggest">
                                            <div className="date-suggest-datepicker"></div>
                                            <div className="comment-action">
                                                <a href="#" className="cancel-comment" onClick={handleCancelSuggestCloseDate}>Отмена</a>
                                                <a href="#" className="submit-comment" onClick={handleConfirmSuggestCloseDate}>Подтвердить дату</a>
                                            </div>
                                        </div>
                                    </div>
                                    }

                                    {!!isOpenDateSuggestComment &&
                                    <div className="timeline-form-wrapper">
                                        <div className="timeline-form timeline-form-date-comment">
                                            <h4>Небольшое пояснение</h4>
                                            <textarea id="date_suggest_comment" placeholder="Например, задание оказалось сложнее, чем вы думали. Или появились новые обстоятельства."></textarea>
                                            <div className="comment-action">
                                                <a href="#" className="cancel-comment" onClick={handleCancelSuggestCloseDateComment}>Вернуться</a>
                                                <a href="#" className="submit-comment" onClick={handleSubmitSuggestCloseDate}>Отправить</a>
                                            </div>
                                        </div>
                                    </div>
                                    }

                                    {!!isOpenCloseSuggest && 
                                    <div className="timeline-form-wrapper">
                                        <div className="timeline-form timeline-form-close-suggest-comment">
                                            <h4>Небольшое пояснение</h4>
                                            <textarea  id="close_suggest_comment" placeholder="Если все сделано, то это отличный повод, завршить задачу"></textarea>
                                            <div className="comment-action">
                                                <a href="#" className="cancel-comment" onClick={handleCancelSuggestCloseTask}>Вернуться</a>
                                                <a href="#" className="submit-comment" onClick={handleSubmitSuggestCloseTask}>Отправить</a>
                                            </div>
                                        </div>
                                    </div>
                                    }

                                </div>
                            }

                            {item.type == 'close_suggest' && approvedDoer &&
                                <div className="details">
                                    <UserSmallView user={approvedDoer} />
                                    <div className="comment">{item.message}</div>

                                    {user.id == author.id && item.status != 'past' &&
                                    <div className="decision-action">
                                        <a href="#" className="accept" onClick={(e) => {
                                            handleAcceptSuggestedClose(e, item.id)
                                        }}>Принять</a>
                                        <a href="#" className="reject danger" onClick={(e) => {
                                            handleRejectSuggestedClose(e, item.id)
                                        }}>Отклонить</a>
                                    </div>}
                                </div>
                            }

                            {item.type == 'close_decision' && approvedDoer &&
                                <div className="details">
                                    <UserSmallView user={author} />
                                </div>
                            }

                            {item.type == 'date_suggest' && approvedDoer &&
                                <div className="details">
                                    <UserSmallView user={approvedDoer} />
                                    <div className="comment">{item.message}</div>

                                    {user.id == author.id && item.status === 'current' &&
                                    <div className="decision-action">
                                        <a href="#" className="accept" onClick={(e) => {
                                            handleAcceptSuggestedDate(e, item.id)
                                        }}>Принять</a>
                                        <a href="#" className="reject danger" onClick={(e) => {
                                            handleRejectSuggestedDate(e, item.id)
                                        }}>Отклонить</a>
                                    </div>}
                                </div>
                            }

                            {item.type == 'date_decision' && approvedDoer &&
                                <div className="details">
                                    <UserSmallView user={author} />
                                </div>
                            }

                            {item.type == 'work' && item.doer && approvedDoer &&
                                <div className="details">
                                    <UserSmallView user={item.doer} />
                                </div>
                            }

                            {(item.type == 'publication' || item.type == 'search_doer') && 
                                <div className="details">
                                    <UserSmallView user={author} />
                                </div>
                            }

                        </div>

                    </div>
                )}
            </div>
        </div>
    )
}

export function TaskDoersBlock({task, author}) {
    const user = useStoreState(store => store.user.data)
    const doers = useStoreState(store => store.task.doers)

    return doers.length > 0 ? (
        <div className="sidebar-users-block responses">
            {!!user.id && user.id == author.id &&
            <div className="choose-doer-explanation">
                У вас есть 3 дня на одобрение/отклонение кандидата. После прохождения 3-х дней мы снимаем баллы.
            </div>
            }
            <TaskDoers task={task} doers={doers} user={user} author={author} />
        </div>
    ) : null
}
