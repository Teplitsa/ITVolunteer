import React, {Component} from 'react'

import SiteHeader from './SiteHeader'
import SiteFooter from './SiteFooter'
import {TaskBody} from './Task'
import {TaskComments} from './Comments'
import {UserSmallView, TaskAuthor, TaskDoers} from './User'

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

class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            taskId: ITV_CURRENT_TASK_ID,
            taskAuthorId: ITV_CURRENT_TASK_AUTHOR_ID,
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
                    <TaskComments taskId={this.state.taskId} userId={this.state.userId} />

                    <div className="task-give-response">                    
                        <p>Кликнув на кнопку, вы попадете в список волонтёров откликнувшихся на задачу. Заказчик задачи выберет подходящего из списка.</p>
                        <a href="#" className="button-give-response">Откликнуться на задачу</a>
                    </div>
                    <div className="task-get-next">
                        <p>Хочешь посмотреть ещё подходящих для тебя задач?</p>
                        <a href="#" className="get-next-task">Следующая задача</a>
                    </div>
                </section>
                <section className="sidebar">
                    <h2>Помощь нужна</h2>

                    <TaskAuthor taskAuthorId={this.state.taskAuthorId} />
                    {/*
                    */}

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
                        <TaskDoers taskId={this.state.taskId} />
                    </div>

                    <div className="sidebar-users-block responses approved-doer d-none">
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