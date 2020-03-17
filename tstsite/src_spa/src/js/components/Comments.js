import React, {Component} from 'react'
import { useQuery } from '@apollo/react-hooks'

import * as utils from "../utils"
import { TASK_COMMENTS_QUERY } from '../network'

import {UserSmallView} from './User'

var ITV_TMP_USER = {
    avatar_url: "https://itv.te-st.ru/wp-content/itv/tstsite/assets/img/temp-avatar.png",
    status_str: "Заказчик",
    name: "Александр Токарев",
    reviews_str: "20 отзывов",
    org_status_str: "Представитель организации/проекта",
    org_name: 'НКО "Леопарды Дальнего Востока"',
    org_description: "Дальневосточный леопард, или амурский леопард, или амурский барс, или восточносибирский леопард, или устар. маньчжурский леопард — хищное млекопитающее из семейства кошачьих, один из подвидов леопарда. Длина тела составляет 107—136 см. Вес самцов — до 50 кг, самок — до 42,5 кг.",
}

export function TaskComments({taskId, userId}) {
    console.log("taskId:", taskId)
    console.log("userId:", userId)

    const { loading: loading, error: error, data: commentsData } = useQuery(TASK_COMMENTS_QUERY, {variables: { taskId: taskId }},);

    if (loading) return utils.loadingWait()
    if (error) return utils.loadingError(error)

    console.log("commentsData:", commentsData)

    return (
        <div className="task-comments">
            <h3>Комментарии</h3>
            <p className="comments-intro">Александр Токарев будет рад услышать ваш совет, вопрос или предложение.</p>
            <div className="comments-list">
                {commentsData.itvComments.nodes.map((comment, key) => <Comment comment={comment} key={key} />)}
                <div className="comment-wrapper">
                    <div className="comment reply">
                        <div className="comment-body">
                            <time>08.12.2019 в 17:42</time>
                            <textarea></textarea>
                        </div>
                        <a className="send-button"></a>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Comment({comment}) {
    console.log("comment.author", comment.author)

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
                            <a href="#" className="edit">Ответить</a>
                        </div>
                    </div>
                </div>
            </div>
            {comment.replies.nodes.map((comment, key) => <Comment comment={comment} key={key} />)}
        </div>
    )
}
