import React, {Component, useState, useEffect} from 'react'
import logo from '../../img/pic-logo-itv.svg'
import logoTeplitsa from '../../img/pic-logo-teplitsa.svg'

import { ITV_URLS } from '../const'

function SiteFooter(props) {
    const basicStats = ITV_BASIC_STATS;

    return (
        <footer className="site-footer" role="contentinfo"><div className="site-footer-inner">
            <div className="header">
                <a href="#" className="logo-col">
                    <img src={logo} className="logo" alt="IT-волонтер" />
                </a>
                <ul className="links-col">
                    <li><a href="/tasks/publish/">Задачи</a></li>
                    <li><a href={ITV_URLS.volunteers} target="_blank">Волонтеры</a></li>
                    <li className="drop-menu">
                      <a href="#">О проекте</a>
                      <ul className="submenu">
                        <li><a href="/about">О проекте</a></li>
                        <li><a href="/conditions">Правила участия</a></li>
                        <li><a href="/news">Новости</a></li>
                        <li><a href="/sovety-dlya-nko-uspeshnye-zadachi">Советы НКО</a></li>
                        <li><a href="/contacts">Контакты</a></li>
                      </ul>                    
                    </li>
                </ul>
            </div>
            <div className="info">
                <div className="col-stats">
                    <h3>Статистика проекта</h3>
                    <div className="stats">
                        <p>{`Всего участников: ${basicStats.activeMemebersCount}`}</p>
                        <p>{`Всего задач: ${basicStats.closedTasksCount + basicStats.workTasksCount + basicStats.newTasksCount}`}</p>
                        <p>{`Задач решено: ${basicStats.closedTasksCount}`}</p>
                    </div>
                </div>
                <div className="col-projects">
                    <h3>Проекты Теплицы</h3>
                    <div className="projects">
                        <div className="project">
                            <a href="https://knd.te-st.ru" target="_blank">Кандинский</a>
                            <p>Сайт-конструктор для НКО</p>
                        </div>
                        <div className="project">
                            <a href="https://audit.te-st.ru" target="_blank">Аудит</a>
                            <p>Интерактивная система аудита сайта НКО</p>
                        </div>
                        <div className="project">
                            <a href="https://leyka.te-st.ru" target="_blank">Лейка</a>
                            <p>Сбор пожертвований на сайте</p>
                        </div>
                        <div className="project">
                            <a href="https://teplo.social" target="_blank">Онлайн курс</a>
                            <p>Как создать, развивать и продвигать сайт НКО</p>
                        </div>
                    </div>
                </div>
                <div className="col-social">
                    <h3>Соцсети</h3>
                    <div className="social-links">
                        <a href="https://www.facebook.com/TeplitsaST" target="_blank">Facebook</a>
                        <a href="https://teleg.run/teplitsa" target="_blank">Телеграм</a>
                        <a href="https://vk.com/teplitsast" target="_blank">Вконтакте</a>
                        <a href="https://itv.te-st.ru/feed/" target="_blank">RSS-канал</a>
                    </div>
                </div>
            </div>
            <div className="owner">
                <div className="col-text">
                    <p>Теплица социальных технологий.</p>
                    <p>Материалы сайта доступны по лицензии Creative Commons СС-BY-SA. 3.0</p>
                </div>
                <a className="col-logo" href="https://te-st.ru">
                    <img src={logoTeplitsa} className="logo" alt="Теплица социальных технологий" />
                </a>
            </div>
        </div></footer>
    )
}

export default SiteFooter