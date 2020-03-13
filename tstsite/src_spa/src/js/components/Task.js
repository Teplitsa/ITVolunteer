import React, {Component} from 'react'
import { useQuery } from '@apollo/react-hooks'
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

import * as utils from "../utils"
import { TASK_QUERY } from '../network'

import {UserSmallView} from './User'

var ITV_TMP_TASK = {
    post_title: "Нужен сайт на Word Press для нашей организации",
    date_created_str: "12  Января 2020",
    date_open_str: "Открыто 4 дня назад",
    reposnses_count_str: "1 отклик",
    views_count_str: "234 просмотра",
    post_content: "Алгебра, очевидно, очевидна не для всех. Однако не все знают, что ротор векторного поля специфицирует бином Ньютона. Криволинейный интеграл, общеизвестно, иррационален. График функции многих переменных, как следует из вышесказанного, в принципе накладывает лист Мёбиуса. Однако не все знают, что окрестность точки однородно обуславливает скачок функции. Интеграл Фурье нейтрализует возрастающий математический анализ.",
    post_tags: [{name: "Wordpress", term_id: 1}, {term_id: 2, name: "Создание сайта"}],
    post_themes: [{name: "Устойчивое развитие", term_id: 1}, {term_id: 2, name: "Экоактивизм"}],
    post_rewards: [{name: "Есть бюджет", term_id: 1}],
}

var ITV_TMP_USER = {
    avatar_url: "https://itv.te-st.ru/wp-content/itv/tstsite/assets/img/temp-avatar.png",
    status_str: "Заказчик",
    name: "Александр Токарев",
    reviews_str: "20 отзывов",
    org_status_str: "Представитель организации/проекта",
    org_name: 'НКО "Леопарды Дальнего Востока"',
    org_description: "Дальневосточный леопард, или амурский леопард, или амурский барс, или восточносибирский леопард, или устар. маньчжурский леопард — хищное млекопитающее из семейства кошачьих, один из подвидов леопарда. Длина тела составляет 107—136 см. Вес самцов — до 50 кг, самок — до 42,5 кг.",
}

export function TaskBody({taskId, userId}) {
    const { loading: taskDataLoading, error: taskDataError, data: taskData } = useQuery(TASK_QUERY, {variables: { taskId: taskId }},);

    const state = {
        task: ITV_TMP_TASK,
        author: ITV_TMP_USER,
    }

    if (taskDataLoading) return utils.loadingWait()
    if (taskDataError) return utils.loadingError(taskDataError)

    // console.log("task data: ", taskData)
    
    return (<div className="task-body">                    
            <header>
                <h1  dangerouslySetInnerHTML={{__html: taskData.task.title}}/>
                <div className="meta-info">
                    <img src={iconApproved} className="itv-approved" />
                    <TaskMetaInfo icon={metaIconCalendar} title={format(new Date(taskData.task.date), 'do MMMM Y', {locale: ru})}/>
                    <TaskMetaInfo icon={metaIconCalendar} title={`Открыто ${formatDistanceToNow(new Date(taskData.task.date), {locale: ru, addSuffix: true})}`}/>
                    <TaskMetaInfo icon={metaIconCalendar} title={`${taskData.task.doerCandidatesCount} откликов`}/>
                    <TaskMetaInfo icon={metaIconCalendar} title={`${taskData.task.viewsCount} просмотров`}/>
                    <a href="javascript:void(0)" className="share-task">
                        <TaskMetaInfo icon={metaIconShare} title="Поделиться"/>
                    </a>
                </div>
                { taskData.task.featuredImage &&
                    <div className="cover" />
                }
                <div className="meta-terms">
                    <TaskMetaTerms icon={tagIconTags} tags={taskData.task.tags.nodes}/>
                    <TaskMetaTerms icon={tagIconThemes} tags={taskData.task.ngoTaskTags.nodes}/>
                    <TaskMetaTerms icon={tagIconReward} tags={taskData.task.rewardTags.nodes}/>
                </div>
            </header>
            <article dangerouslySetInnerHTML={{__html: taskData.task.content}} />
            <div className="stages">
                <h3>Этапы</h3>
                <div className="stages-list">
                    <div className="stage done"><i>1</i>Публикация</div>
                    <div className="stage active"><i>2</i>Поиск</div>
                    <div className="stage"><i>3</i>В работе</div>
                    <div className="stage"><i>4</i>Закрытие</div>
                    <div className="stage last"><i>5</i>Отзывы<b className="finish-flag"/></div>
                </div>
            </div>
            <div className="timeline">
                <h3>Календарь задачи</h3>
                <div className="timeline-list">
                    {['next', 'next', 'active', 'done'].map((item, key) => <div className={`checkpoint ${item}`} key={key}>
                            <div className="date">
                                <span className="date-num">16</span>
                                фев
                            </div>
                            {(() => {
                                if(item == 'next' && key == 1) {
                                    return (
                                        <div className="info">
                                            <i className="point-circle"> </i>
                                            <h4>Завершение задачи</h4>
                                            <div className="details">Ожидаемый срок</div>
                                            <div className="details actions">
                                                <a href="#" className="action suggest-date">Предложить новую дату</a>
                                                <a href="#" className="action close-task">Закрыть задачу</a>
                                            </div>
                                        </div>
                                    )
                                }
                                else if(item == 'done') {
                                    return (
                                        <div className="info">
                                            <i className="point-circle"> </i>
                                            <h4>Публикация задачи</h4>
                                            <div className="details">
                                                <UserSmallView user={state.author} />
                                                <div className="comment">Задача оказалась сложнее, чем я думал, надо будет привлечь ещё троих, чтобы сделать в новый срок</div>
                                                <div className="comment">
                                                    Задача оказалась сложнее, чем я думал, надо будет привлечь ещё троих, чтобы сделать в новый срок
                                                    <div className="rating-bar">
                                                        <div className="stars">
                                                            <img src={ratingStarFilled} />
                                                            <img src={ratingStarFilled} />
                                                            <img src={ratingStarFilled} />
                                                            <img src={ratingStarEmptyGray} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="comment-actions">
                                                    <a href="#" className="action add-review">Написать отзыв</a>
                                                </div>
                                                <div className="timeline-comment-form">
                                                    <h4>Ваш отзыв о работе над задачей</h4>
                                                    <textarea></textarea>
                                                    <div className="rating-bar">
                                                        <h4 className="title">Оценка задачи:</h4>
                                                        <div className="stars">
                                                            <img src={ratingStarFilled} />
                                                            <img src={ratingStarFilled} />
                                                            <img src={ratingStarFilled} />
                                                            <img src={ratingStarEmptyWhite} />
                                                        </div>
                                                    </div>
                                                    <div className="comment-action">
                                                        <a href="#" className="submit-comment">Отправить</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                                else {
                                    return (
                                        <div className="info">
                                            <i className="point-circle"> </i>
                                            <h4>Отзывы о работе над задачей</h4>
                                            <div className="details">Ожидаемый срок</div>
                                        </div>
                                    )
                                }
                            })()}
                        </div>
                    )}
                </div>
            </div>
            <div className="task-publication-actions">
                <a href="#" className="accept-task">Одобрить задачу</a>
                <a href="#" className="reject-task danger">Отклонить задачу</a>
            </div>
            <div className="task-author-actions">
                <span className="status publish">Опубликовано</span>
                <a href="#" className="edit">Редактировать</a>
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
            { this.state.icon &&
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
            { this.state.icon &&
                <img src={this.state.icon} />
            }
            { this.state.title &&
                <span>{this.state.title}</span>
            }
        </span>
    }
}
