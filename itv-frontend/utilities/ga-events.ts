const gaEventsData = {};

/* General events */
gaEventsData["ge_show_new_desing"] = {
  ga_category: "Дизайн",
  ga_action: "Показ сайта в новом дизайне",
};

gaEventsData["ge_switch_desing_to_old"] = {
  ga_category: "Дизайн",
  ga_action: "Смена дизайна на старый",
};

/* Task card */
gaEventsData["tc_title"] = {
  ga_category: "Просмотр задачи",
  ga_action: "Заголовок в карточке задачи",
};

gaEventsData["tc_more"] = {
  ga_category: "Просмотр задачи",
  ga_action: "Ссылка подробнее в карточке задачи",
};

/* Registration page */
gaEventsData["reg_login"] = {
  ga_category: "Логин (попытка)",
  ga_action: "Кнопка логина в форме",
};
gaEventsData["reg_reg"] = {
  ga_category: "Регистрация (попытка)",
  ga_action: "Кнопка регистрации в форме",
};

/* Home page */
gaEventsData["hp_video_mobile"] = {
  ga_category: "Просмотр видео",
  ga_action: "Ссылка просмотра видео на главной (моб.)",
};

gaEventsData["hp_video"] = {
  ga_category: "Просмотр видео",
  ga_action: "Ссылка просмотра видео на главной",
};

gaEventsData["hp_new_task"] = {
  ga_category: "Создать задачу",
  ga_action: "Кнопка создать задачу на главной (верх)",
};

gaEventsData["hp_tf_open"] = {
  ga_category: "Фильтр задач - открытые",
  ga_action: "Ссылка открытых задач на главной",
};

gaEventsData["hp_tf_work"] = {
  ga_category: "Фильтр задач - в работе",
  ga_action: "Ссылка  задач в работе на главной",
};

gaEventsData["hp_tf_close"] = {
  ga_category: "Фильтр задач - закрытые",
  ga_action: "Ссылка закрытых задач на главной",
};

gaEventsData["hp_tf_tags"] = {
  ga_category: "Фильтр задач - по тегам",
  ga_action: "Ссылка по тегам на главной",
};

gaEventsData["hp_tf_nko_tags"] = {
  ga_category: "Фильтр задач - по тегам НКО",
  ga_action: "Ссылка по тегам НКО на главной",
};

gaEventsData["hp_ntask_bottom"] = {
  ga_category: "Создать задачу",
  ga_action: "Кнопка создать задачу на главной (низ)",
};

gaEventsData["hp_reg_bottom"] = {
  ga_category: "Переход к регистрации",
  ga_action: "Кнопка регистрации на главной (низ)",
};

gaEventsData["hp_more_nav"] = {
  ga_category: "Пейджинг задач",
  ga_action: "Ссылка Больше задач на главной",
};

/** Tasks Lists **/
gaEventsData["tl_tf_open"] = {
  ga_category: "Фильтр задач - открытые",
  ga_action: "Фильтр открытых задач",
};
gaEventsData["tl_tf_work"] = {
  ga_category: "Фильтр задач - в работе",
  ga_action: "Фильтр задач в работе",
};
gaEventsData["tl_tf_close"] = {
  ga_category: "Фильтр задач - закрытые",
  ga_action: "Фильтр закрытых задач",
};
gaEventsData["tl_tf_archive"] = {
  ga_category: "Фильтр задач - архивные",
  ga_action: "Фильтр архивных задач",
};
gaEventsData["tl_tf_tags"] = {
  ga_category: "Фильтр задач - теги",
  ga_action: "Ссылка на страницу тегов - в заголовке",
};
gaEventsData["tl_tf_nko_tags"] = {
  ga_category: "Фильтр задач - теги НКО",
  ga_action: "Ссылка на страницу тегов НКО - в заголовке",
};

/** Menu **/
gaEventsData["m_tf_list"] = {
  ga_category: "Фильтр задач - открытые",
  ga_action: "Задачи - Ссылка в меню",
};

gaEventsData["m_mb_list"] = {
  ga_category: "Список участников",
  ga_action: "Участники - Ссылка в меню",
};

gaEventsData["m_about"] = {
  ga_category: "О нас",
  ga_action: "О нас - Ссылка в меню",
};

gaEventsData["m_profile"] = {
  ga_category: "Профиль",
  ga_action: "Профиль - Ссылка в меню",
};

gaEventsData["m_login"] = {
  ga_category: "Логин (переход)",
  ga_action: "Логин - Ссылка в меню",
};

gaEventsData["m_reg"] = {
  ga_category: "Регистрация (переход)",
  ga_action: "Регистрация - Ссылка в меню",
};

gaEventsData["m_ntask"] = {
  ga_category: "Создать задачу",
  ga_action: "Новая задача - Ссылка в меню",
};

/** Members Lists **/
gaEventsData["ml_mf_all"] = {
  ga_category: "Фильтр участников - Все",
  ga_action: "Ссылка на всех участников - в заголовке",
};
gaEventsData["ml_mf_donee"] = {
  ga_category: "Фильтр участников - Бенефициар",
  ga_action: "Ссылка на бенефициаров - в заголовке",
};
gaEventsData["ml_mf_activist"] = {
  ga_category: "Фильтр участников - Активист",
  ga_action: "Ссылка на активистов - в заголовке",
};
gaEventsData["ml_mf_hero"] = {
  ga_category: "Фильтр участников - Супергерой",
  ga_action: "Ссылка на супергероев - в заголовке",
};
gaEventsData["ml_mf_volunteer"] = {
  ga_category: "Фильтр участников - Волонтер",
  ga_action: "Ссылка на волонтеров - в заголовке",
};

const pageTypeList = {
  tasks_list: "Список задач",
  tag: "Список задач по тегу",
  nko_tag: "Список задач по НКО",
  reg: "Страница регистрации",
  login: "Страница входа",
  home: "Главная",
  task_page: "Страница задачи - просмотр",
  page: "Статичная страница",
  post: "Новость",
  news: "Список новостей",
  default: "Неизвестный тип страницы",
};

function detectPageType(router, pageType = null) {
  if (!pageType) {
    if (router.pathname === "/") {
      pageType = "home";
    } else if (router.pathname.match(/\/tasks(\/(publish|in_work|closed|archived|all))?\/?$/)) {
      pageType = "tasks_list";
    } else if (router.pathname.match(/\/tasks\/[^/]+?\/?$/)) {
      pageType = "task_page";
    } else if (router.pathname.match(/\/registration\/?$/)) {
      pageType = "reg";
    } else if (router.pathname.match(/\/login\/?$/)) {
      pageType = "login";
    } else if (
      router.pathname.match(
        /\/(about-paseka|nagrady|about|conditions|sovety-dlya-nko-uspeshnye-zadachi|contacts)\/?$/
      )
    ) {
      pageType = "page";
    } else if (router.pathname.match(/\/blog\/[^/]+?\/?$/)) {
      pageType = "post";
    } else if (router.pathname.match(/\/news\/?$/)) {
      pageType = "news";
    } else if (router.pathname.match(/\/tasks\/tag\/[^/]+?\/?$/)) {
      pageType = "tag";
    } else if (router.pathname.match(/\/tasks\/nko-tag\/[^/]+?\/?$/)) {
      pageType = "nko_tag";
    } else {
      pageType = "default";
    }
  }

  return pageTypeList[pageType];
}

export const regEvent = (triggerId, router): void => {
  // console.log("reg ga event triggerId:", triggerId);
  // console.log("router:", router);
  // console.log("ga:", window['ga']);

  if (typeof window["ga"] != "function") {
    return;
  }

  const itvGa = window["ga"];

  //to_do check for the correct value
  if (gaEventsData[triggerId]) {
    const pageType = detectPageType(router);

    //debug
    // console.log("ga_category:", gaEventsData[triggerId].ga_category);
    // console.log("ga_action:", gaEventsData[triggerId].ga_action);
    // console.log("pageType:", pageType);

    itvGa(
      "send",
      "event",
      gaEventsData[triggerId].ga_category,
      gaEventsData[triggerId].ga_action,
      pageType,
      1
    );
  }
};
