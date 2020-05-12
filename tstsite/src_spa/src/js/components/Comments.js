import React, {Component, useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import { useQuery } from '@apollo/react-hooks'
import { useStoreState, useStoreActions } from "easy-peasy";
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

import * as utils from "../utils"
import { getTaskCommentsQuery } from '../network'

import {UserSmallView} from './User'

export function TaskComments({task, author}) {
    const doers = useStoreState(store => store.task.doers)
    const user = useStoreState(store => store.user.data)
    const taskComments = useStoreState(store => store.task.comments)
    const setComments = useStoreActions(actions => actions.task.setComments)
    const commentToReply = useStoreState(store => store.task.commentToReply)
    const userMayAddComment = useStoreState(store => store.task.userMayAddComment(user))

    const {
        loading: loading, 
        error: error, 
        data: commentsData 
    } = getTaskCommentsQuery(task.databaseId)

    useEffect(() => {
        if(!commentsData) {
            return
        }

        setComments(commentsData.comments)
    }, [commentsData])

    useEffect(() => {
        console.log("taskComments changed")
    }, [taskComments])

    if(!author.id) {
        return null
    }

    return (
        <div className="task-comments">
            <h3>Комментарии</h3>
            <p className="comments-intro">{`${author.fullName} будет рад услышать ваш совет, вопрос или предложение.`}</p>
            <div className="comments-list">
                {taskComments && taskComments.nodes.map((comment, key) => <Comment comment={comment} task={task} key={key} />)}

                {!!userMayAddComment && !commentToReply &&
                <AddCommentForm task={task} />
                }

            </div>
        </div>
    )
}

function AddCommentForm(props) {
    const task = props.task
    const parentComment = props.parentComment

    const user = useStoreState(store => store.user.data)
    const [commentFormRef, setCommentFormRef] = useState(null)
    const taskComments = useStoreState(store => store.task.comments)
    const addComment = useStoreActions(actions => actions.task.addComment)
    const setAddCommentForm = useStoreActions(actions => actions.task.setAddCommentForm)    

    useEffect(() => {
        if(!commentFormRef) {
            return
        }

        if(!parentComment) {
            return
        }

        let $ = jQuery

        let $commentForm = $(ReactDOM.findDOMNode(commentFormRef))

        $([document.documentElement, document.body]).animate({
            scrollTop: $commentForm.offset().top - $(window).height() / 2
        }, 500)
        $commentForm.find('textarea').trigger('focus')

        setAddCommentForm(commentFormRef)
    }, [commentFormRef])

    const handleSubmitCommentClick = (e) => {
        e.preventDefault()

        let $ = jQuery

        let $textarea = $(commentFormRef).find('textarea');
        let commentBody = $textarea.val()
        let parentCommentId = $(commentFormRef).data('parent_comment_id')

        let formData = new FormData()
        formData.append('parent_comment_id', parentCommentId)
        formData.append('comment_body', commentBody)
        formData.append('task_gql_id', task.id)

        let action = 'submit-comment'
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

                addComment({
                    taskComments: taskComments,
                    parentCommentId: parentCommentId,
                    comment: {
                        ...result.comment,
                        author: user,
                    }
                })

                $textarea.val('')
            },
            (error) => {
                utils.itvShowAjaxError({action, error})
            }
        )
    }

    return (
        <div ref={(ref) => setCommentFormRef(ref)} className="comment-wrapper add-comment-form-wrapper" data-parent_comment_id={parentComment ? parentComment.id : ''}>
            <div className="comment reply">
                <div className="comment-body">
                    <time>{format(new Date(), 'dd.MM.yyyy в HH:mm')}</time>
                    <textarea></textarea>
                </div>
                <a href="#" className="send-button" onClick={handleSubmitCommentClick}></a>
            </div>
        </div>
    )
}

function Comment({comment, task, parentComment}) {
    const doers = useStoreState(store => store.task.doers)
    const user = useStoreState(store => store.user.data)
    const userMayAddComment = useStoreState(store => store.task.userMayAddComment(user))
    const commentToReply = useStoreState(store => store.task.commentToReply)
    const likesCount = useStoreState(store => store.task.commentsLikesCount)

    const setCommentToReply = useStoreActions(actions => actions.task.setCommentToReply)
    const setCommentLikesCount = useStoreActions(actions => actions.task.setCommentLikesCount)

    const handleReplyComment = (e) => {
        e.preventDefault()
        setCommentToReply(comment)
    }

    const handleLikeClick = (e) => {
        let $ = jQuery

        if(!user.id) {
            return
        }

        if(comment.likeGiven) {
            return
        }

        let formData = new FormData()
        formData.append('comment_gql_id', comment.id)

        let action = 'like-comment'
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

                setCommentLikesCount({likesCount: result.likesCount, commentId: comment.id})
            },
            (error) => {
                utils.itvShowAjaxError({action, error})
            }
        )  
        
    }

    if(!comment || !comment.id) {
        return null
    }

    return (
        <div className="comment-wrapper">
            <div className="comment">
                <div className="comment-author">
                    { comment.author &&
                        <UserSmallView user={comment.author} />
                    }
                </div>
                <div className="comment-body">
                    {comment.dateGmt &&
                    <time>{format(new Date(comment.dateGmt + "Z"), 'dd.MM.yyyy в HH:mm')}</time>
                    }
                    <div className="text" dangerouslySetInnerHTML={{__html: comment.content}} />
                    <div className="meta-bar">
                        <div className="like" onClick={(e) => {
                            handleLikeClick(e, comment.id)
                        }}>{likesCount[comment.id] ? likesCount[comment.id] : 0}</div>
                        <div className="actions">
                            <a href="#" className="report d-none">Пожаловаться</a>
                            <a href="#" className="reply-comment edit" onClick={handleReplyComment}>Ответить</a>
                        </div>
                    </div>
                </div>
            </div>
            {comment.replies.nodes.map((comment, key) => <Comment comment={comment} task={task} parentComment={comment} key={key} />)}

            {!!userMayAddComment && commentToReply && commentToReply.id == comment.id && 
            <AddCommentForm task={task} parentComment={comment} />
            }
        </div>
    )
}
