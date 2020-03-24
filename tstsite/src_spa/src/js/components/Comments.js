import React, {Component, useState} from 'react'
import { useQuery } from '@apollo/react-hooks'
import { useStoreState, useStoreActions } from "easy-peasy";

import * as utils from "../utils"
import { TASK_COMMENTS_QUERY } from '../network'

import {UserSmallView} from './User'

export function TaskComments({task, author}) {
    const { loading: loading, error: error, data: commentsData } = useQuery(TASK_COMMENTS_QUERY, {variables: { taskId: task.databaseId }},);

    if (loading) return utils.loadingWait()
    if (error) return utils.loadingError(error)

    if(commentsData && !commentsData.comments.nodes.length) {
        return null
    }

    return (
        <div className="task-comments">
            <h3>Комментарии</h3>
            <p className="comments-intro">{`${author.fullName} будет рад услышать ваш совет, вопрос или предложение.`}</p>
            <div className="comments-list">
                {commentsData.comments.nodes.map((comment, key) => <Comment comment={comment} key={key} />)}
                <AddCommentForm author={author} />
            </div>
        </div>
    )
}

function AddCommentForm({author}) {
    const user = useStoreState(store => store.user.data)
    const doers = useStoreState(store => store.task.doers)
    const mayAddComment = !!user.id && ( user.id == author.id || doers.find((doer) => doer.id == user.id) )

    function handleSubmitCommentClick(e) {
        e.preventDefault()

        console.log('submit comment...');

        let action = 'submit-comment'
        fetch(utils.itvAjaxUrl(action), {
            method: 'post'
        })
        .then(res => {
            try {
                return res.json()
            } catch(ex) {
                utils.itvShowAjaxError({action, error: ex})
                console.log(ex)
                return {}
            }
        })
        .then(
            (result) => {
                setUserData(result)
            },
            (error) => {
                utils.itvShowAjaxError({action, error})
                setUserData({id: null})
            }
        )
    }

    return mayAddComment ? (
        <div className="comment-wrapper add-comment-form-wrapper" id="add-comment-form-wrapper">
            <div className="comment reply">
                <div className="comment-body">
                    <time>08.12.2019 в 17:42</time>
                    <textarea></textarea>
                </div>
                <a href="#" className="send-button" onClick={handleSubmitCommentClick}></a>
            </div>
        </div>
    ) : null
}

function Comment({comment}) {
    const [replyLinkRef, setReplyLinkRef] = useState(null)

    function handleReplyComment(e) {
        e.preventDefault()
        
        let $ = jQuery        
        let $topCommentWrapper = $(replyLinkRef).closest('.comment-wrapper')
        let $commentForm = $('#add-comment-form-wrapper')
        $commentForm.insertAfter($topCommentWrapper)
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
                    <time>{comment.commentId}</time>
                    <div className="text" dangerouslySetInnerHTML={{__html: comment.content}} />
                    <div className="meta-bar">
                        <div className="like">2</div>
                        <div className="actions">
                            <a href="#" className="report">Пожаловаться</a>
                            <a href="#" ref={(ref) => setReplyLinkRef(ref)} className="reply-comment edit" onClick={handleReplyComment}>Ответить</a>
                        </div>
                    </div>
                </div>
            </div>
            {comment.replies.nodes.map((comment, key) => <Comment comment={comment} key={key} />)}
        </div>
    )
}
