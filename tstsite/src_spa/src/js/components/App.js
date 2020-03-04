import React, {Component} from 'react'

import tagIconTags from '../../img/icon-color-picker.svg'
import tagIconThemes from '../../img/icon-people.svg'
import tagIconReward from '../../img/icon-gift-box.svg'
import metaIconCalendar from '../../img/icon-calc.svg'
import iconApproved from '../../img/icon-all-done.svg'
import metaIconShare from '../../img/icon-share.svg'

import { TASK_QUERY } from '../network'
import { useQuery } from '@apollo/react-hooks'

import SiteHeader from './SiteHeader'
import SiteFooter from './SiteFooter'
import {TaskMetaTerms, TaskMetaInfo} from './TaskMeta'

function TaskBody({taskId, userId}) {
    const { loading, error, data } = useQuery(TASK_QUERY, {variables: { taskId: taskId }},);

    const state = {
        task: {
            post_title: "Нужен сайт на Word Press для нашей организации",
            date_created_str: "12  Января 2020",
            date_open_str: "Открыто 4 дня назад",
            reposnses_count_str: "1 отклик",
            views_count_str: "234 просмотра",
            post_content: "Алгебра, очевидно, очевидна не для всех. Однако не все знают, что ротор векторного поля специфицирует бином Ньютона. Криволинейный интеграл, общеизвестно, иррационален. График функции многих переменных, как следует из вышесказанного, в принципе накладывает лист Мёбиуса. Однако не все знают, что окрестность точки однородно обуславливает скачок функции. Интеграл Фурье нейтрализует возрастающий математический анализ.",
            post_tags: [{name: "Wordpress", term_id: 1}, {term_id: 2, name: "Создание сайта"}],
            post_themes: [{name: "Устойчивое развитие", term_id: 1}, {term_id: 2, name: "Экоактивизм"}],
            post_rewards: [{name: "Есть бюджет", term_id: 1}],
        },
    }

    if (loading) return 'Loading...'
    if (error) return `Error! ${error.message}`

    console.log("task data: ", data)
    
    return (<div className="task-body">                    
            <header>
                <h1  dangerouslySetInnerHTML={{__html: data.task.title}}/>
                <div className="meta-info">
                    <img src={iconApproved} className="task-approved" />
                    <TaskMetaInfo icon={metaIconCalendar} title={state.task.date_created_str}/>
                    <TaskMetaInfo icon={metaIconCalendar} title={state.task.date_open_str}/>
                    <TaskMetaInfo icon={metaIconCalendar} title={state.task.reposnses_count_str}/>
                    <TaskMetaInfo icon={metaIconCalendar} title={state.task.views_count_str}/>
                    <a href="#" className="share-task">
                        <TaskMetaInfo icon={metaIconShare} title={state.task.views_count_str}/>
                    </a>
                </div>
                <div className="cover">
                </div>
                <div className="meta-terms">
                    <TaskMetaTerms icon={tagIconTags} tags={state.task.post_tags}/>
                    <TaskMetaTerms icon={tagIconThemes} tags={state.task.post_themes}/>
                    <TaskMetaTerms icon={tagIconReward} tags={state.task.post_rewards}/>
                </div>
            </header>
            <article dangerouslySetInnerHTML={{__html: data.task.content}} />
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
                            <div className="info">
                                <i className="point-circle"> </i>
                                <h4>Отзывы о работе над задачей</h4>
                                <p>Ожидаемый срок</p>
                            </div>
                        </div>
                    )}
                </div>
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
            task: {
                post_title: "Нужен сайт на Word Press для нашей организации",
                date_created_str: "12  Января 2020",
                date_open_str: "Открыто 4 дня назад",
                reposnses_count_str: "1 отклик",
                views_count_str: "234 просмотра",
                post_content: "Алгебра, очевидно, очевидна не для всех. Однако не все знают, что ротор векторного поля специфицирует бином Ньютона. Криволинейный интеграл, общеизвестно, иррационален. График функции многих переменных, как следует из вышесказанного, в принципе накладывает лист Мёбиуса. Однако не все знают, что окрестность точки однородно обуславливает скачок функции. Интеграл Фурье нейтрализует возрастающий математический анализ.",
                post_tags: [{name: "Wordpress", term_id: 1}, {term_id: 2, name: "Создание сайта"}],
                post_themes: [{name: "Устойчивое развитие", term_id: 1}, {term_id: 2, name: "Экоактивизм"}],
                post_rewards: [{name: "Есть бюджет", term_id: 1}],
            },
            author: {
                avatar_url: "https://itv.te-st.ru/wp-content/itv/tstsite/assets/img/temp-avatar.png",
                status_str: "Заказчик",
                name: "Александр Токарев",
                reviews_str: "20 отзывов",
                org_status_str: "Представитель организации/проекта",
                org_name: 'НКО "Леопарды Дальнего Востока"',
                org_description: "Дальневосточный леопард, или амурский леопард, или амурский барс, или восточносибирский леопард, или устар. маньчжурский леопард — хищное млекопитающее из семейства кошачьих, один из подвидов леопарда. Длина тела составляет 107—136 см. Вес самцов — до 50 кг, самок — до 42,5 кг.",
            }
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
                                    <span className="avatar-wrapper" style={{
                                        backgroundImage: this.state.author.avatar_url ? `url(${this.state.author.avatar_url})` : "none",
                                    }}/>

                                    <span className="name">
                                        <span>Александр Гусев</span>/Волонтер
                                    </span>
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

                    <div className="user-card-list">
                        <div className="user-card">
                            <div className="avatar-wrapper" style={{
                                backgroundImage: this.state.author.avatar_url ? `url(${this.state.author.avatar_url})` : "none",
                            }}/>
                            <div className="details">
                                <span className="status">{this.state.author.status_str}</span>
                                <span className="name">{this.state.author.name}</span>
                                <span className="reviews">{this.state.author.reviews_str}</span>
                            </div>
                        </div>
                        <div className="user-org-separator"></div>
                        <div className="user-card">
                            <div className="avatar-wrapper" style={{
                                backgroundImage: this.state.author.avatar_url ? `url(${this.state.author.avatar_url})` : "none",
                            }}/>
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

                    <h2>Отклики на задачу</h2>

                    <div className="user-card-list responses">
                        {[1, 2, 3].map((item, key) =>
                        <div className="user-card" key={key}>
                            <div className="avatar-wrapper" style={{
                                backgroundImage: this.state.author.avatar_url ? `url(${this.state.author.avatar_url})` : "none",
                            }}/>
                            <div className="details">
                                <span className="name">{this.state.author.name}</span>
                                <span className="reviews">{this.state.author.reviews_str}</span>
                                <span className="status">{this.state.author.status_str}</span>
                            </div>
                        </div>
                        )}
                    </div>

                </section>
            </main>
            <SiteFooter/>
        </div>
    }
}

export default App