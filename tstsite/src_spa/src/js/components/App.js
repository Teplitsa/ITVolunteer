import React, {Component} from 'react'
import { useQuery } from '@apollo/react-hooks'
import { format, formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'

import tagIconTags from '../../img/icon-color-picker.svg'
import tagIconThemes from '../../img/icon-people.svg'
import tagIconReward from '../../img/icon-gift-box.svg'
import metaIconCalendar from '../../img/icon-calc.svg'
import iconApproved from '../../img/icon-all-done.svg'
import metaIconShare from '../../img/icon-share.svg'
import metaIconPaseka from '../../img/icon-paseka.svg'
import ratingStarEmptyWhite from '../../img/icon-star-empty-white.svg'
import ratingStarEmptyGray from '../../img/icon-star-empty-gray.svg'
import ratingStarFilled from '../../img/icon-star-filled.svg'

import * as utils from "../utils"
import { TASK_QUERY } from '../network'

import SiteHeader from './SiteHeader'
import SiteFooter from './SiteFooter'
import {TaskMetaTerms, TaskMetaInfo} from './TaskMeta'
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

function TaskBody({taskId, userId}) {
    const { loading: taskDataLoading, error: taskDataError, data: taskData } = useQuery(TASK_QUERY, {variables: { taskId: taskId }},);

    const state = {
        task: ITV_TMP_TASK,
        author: ITV_TMP_USER,
    }

    if (taskDataLoading) return utils.loadingWait()
    if (taskDataError) return utils.loadingError(taskDataError)

    console.log("task data: ", taskData)
    
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

class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            taskId: ITV_CURRENT_TASK_ID,
            userId: frontend.user_id,
            task: ITV_TMP_TASK,
            author: ITV_TMP_USER,
        }
    }

    // componentDidMount = () => {

    // }

    render() {
        return <div>
            <SiteHeader userId={this.state.userId} />
            <main id="site-main" className="site-main" role="main">
                <section className="content">
                    <h2>Задача</h2>
                    <TaskBody taskId={this.state.taskId} userId={this.state.userId} />
                    <div className="task-give-response">                    
                        <p>Кликнув на кнопку, вы попадете в список волонтёров откликнувшихся на задачу. Заказчик задачи выберет подходящего из списка.</p>
                        <a href="#" className="button-give-response">Откликнуться на задачу</a>
                    </div>
                    <div className="task-comments">
                        <h3>Комментарии</h3>
                        <p className="comments-intro">Александр Токарев будет рад услышать ваш совет, вопрос или предложение.</p>
                        <div className="comments-list">
                            {[1, 2, 3].map((key) => <div className="comment" key={key}>
                                <div className="comment-author">
                                    <UserSmallView user={this.state.author} />
                                </div>
                                <div className="comment-body">
                                    <time>08.12.2019 в 17:42</time>
                                    <div className="text">Позвоните мне на ватсап 79605352425</div>
                                    <div className="meta-bar">
                                        <div className="like">2</div>
                                        <div className="actions">
                                            <a href="#" className="report">Пожаловаться</a>
                                            <a href="#" className="edit">Ответить</a>
                                        </div>
                                    </div>
                                </div>
                            </div>)}
                            <div className="comment reply">
                                <div className="comment-body">
                                    <time>08.12.2019 в 17:42</time>
                                    <textarea></textarea>
                                </div>
                                <a className="send-button"></a>
                            </div>
                        </div>
                    </div>
                    <div className="task-get-next">
                        <p>Хочешь посмотреть ещё подходящих для тебя задач?</p>
                        <a href="#" className="get-next-task">Следующая задача</a>
                    </div>
                </section>
                <section className="sidebar">
                    <h2>Помощь нужна</h2>

                    <div className="sidebar-users-block">
                        <div className="user-card">
                            <div className="user-card-inner">
                                <div className="avatar-wrapper" style={{
                                    backgroundImage: this.state.author.avatar_url ? `url(${this.state.author.avatar_url})` : "none",
                                }}/>
                                <div className="details">
                                    <span className="status">{this.state.author.status_str}</span>
                                    <span className="name">{this.state.author.name}</span>
                                    <span className="reviews">{this.state.author.reviews_str}</span>
                                </div>
                            </div>
                        </div>
                        <div className="user-org-separator"></div>
                        <div className="user-card">
                            <div className="avatar-wrapper" style={{
                                backgroundImage: this.state.author.avatar_url ? `url(${this.state.author.avatar_url})` : "none",
                            }}>
                                <img src={iconApproved} className="itv-approved" />
                            </div>
                            <div className="details">
                                <span className="status">{this.state.author.org_status_str}</span>
                                <span className="name">{this.state.author.org_name}</span>
                            </div>
                        </div>
                        <p className="org-description">{this.state.author.org_description}</p>
                    </div>

                    <div className="action-block">
                        <a href="#" className="action-button">Откликнуться на задачу</a>
                    </div>

                    <h2>Откликов пока нет</h2>

                    <div className="sidebar-users-block no-responses">
                        <p>Откликов пока нет. Воспользуйся возможностью получить задачу</p>
                    </div>

                    <div className="sidebar-users-block no-responses">
                        <p>Мало просмотров и откликов на задачу? Возможно, <a href="#">наши советы помогут вам</a></p>
                    </div>

                    <div className="something-wrong-with-task">
                        <a href="#" className="contact-admin">Что-то не так с задачей? Напиши администратору</a>
                    </div>

                    <h2>Отклики на задачу</h2>

                    <div className="sidebar-users-block responses">
                        <div className="choose-doer-explanation">
                            У вас есть 3 дня на одобрение/отклонение кандидата. После прохождения 3-х дней мы снимаем баллы.
                        </div>
                        <div className="user-cards-list">
                            {[1, 2, 3].map((item, key) =>
                            <div className="user-card" key={key}>
                                <div className="user-card-inner">
                                    <div className="avatar-wrapper" style={{
                                        backgroundImage: this.state.author.avatar_url ? `url(${this.state.author.avatar_url})` : "none",
                                    }}>
                                        {(() => {
                                            return (item == 3 ? <img src={metaIconPaseka} className="itv-approved" /> : null);
                                        })()}
                                    </div>
                                    <div className="details">
                                        <span className="name">{this.state.author.name}</span>
                                        <span className="reviews">{this.state.author.reviews_str}</span>
                                        <span className="status">{this.state.author.status_str}</span>
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
                    </div>

                    <div className="sidebar-users-block responses approved-doer">
                        <div className="user-cards-list">
                            {[1].map((item, key) =>
                            <div className="user-card" key={key}>
                                <div className="user-card-inner">
                                    <div className="avatar-wrapper" style={{
                                        backgroundImage: this.state.author.avatar_url ? `url(${this.state.author.avatar_url})` : "none",
                                    }}>
                                        {(() => {
                                            return (item == 3 ? <img src={metaIconPaseka} className="itv-approved" /> : null);
                                        })()}
                                    </div>
                                    <div className="details">
                                        <span className="name">{this.state.author.name}</span>
                                        <span className="reviews">{this.state.author.reviews_str}</span>
                                        <span className="status">Выполнено 120 задач</span>
                                    </div>
                                </div>
                            </div>
                            )}
                        </div>
                    </div>                    

                </section>
            </main>
            <SiteFooter/>
        </div>
    }
}

export default App