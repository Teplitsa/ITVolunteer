import React, {Component, useState, useEffect} from 'react'
import logo from '../../img/pic-logo-itv.svg'
import logoTeplitsa from '../../img/pic-logo-teplitsa.svg'

import { ITV_URLS } from '../const'

function SiteFooter(props) {
    const basicStats = ITV_BASIC_STATS;

    const links = [
      [
        "https://teplo.social/",
        { title: "Теплосеть", description: "Платформа непрерывного образования" },
      ],
      [
        "https://leyka.org",
        { title: "Лейка", description: "Сбор пожертвований на сайте" },
      ],
      [
        "https://kndwp.org",
        { title: "Кандинский", description: "Сайт-конструктор для НКО" },
      ],
    ];

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
                        <li><a href="/about-paseka">Пасека</a></li>
                        <li><a href="/nagrady">Награды</a></li>                    
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
                        {links.map(
                          ([url, { title, description }], i) => {
                            return (
                              <div className="project" key={i}>
                                <a href={url} target="_blank">
                                  {title}
                                </a>
                                <p>{description}</p>
                              </div>
                            );
                          }
                        )}
                    </div>
                </div>
                <div className="col-social">
                    <h3>Соцсети</h3>
                    <div className="social-links">
                        <a href="https://www.facebook.com/TeplitsaST" target="_blank">Facebook</a>
                        <a href="https://t.me/itvolunteers" target="_blank">Телеграм</a>
                        <a href="https://vk.com/teplitsast" target="_blank">Вконтакте</a>
                        <a href="https://itvist.org/feed/" target="_blank">RSS-канал</a>
                    </div>
                </div>
            </div>
            <div className="owner">
                <div className="col-text">
                    <p>Платформа «IT-волонтер» – проект <a href="https://te-st.org" target="_blank">Теплицы социальных технологий</a></p>
                    <p>
                      Материалы сайта доступны по лицензии <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.ru" target="_blank">Creative Commons СС-BY-SA. 4.0</a>
                    </p>
                </div>
                <a className="col-logo" href="https://te-st.org">
                    <img src={logoTeplitsa} className="logo" alt="Теплица социальных технологий" />
                </a>
            </div>
        </div></footer>
    )
}

export default SiteFooter