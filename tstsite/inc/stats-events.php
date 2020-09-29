<?php
/**
 * Params for GA events
 **/

function tst_detect_page_type($type = null) {	
	
	$page_type = array(
		'tasks_list'   => 'Список задач',
		'tag'          => 'Список задач по тегу',
		'reg'          => 'Страница регистрации',
		'login'        => 'Страница регистрации',
		'home'         => 'Главная',
		'task_page'    => 'Страница задачи - просмотр',
		'page'         => 'Статичная страница',
		'post'         => 'Новость',
		'news'         => 'Список новостей',
		'default'      => 'Неизвестный тип страницы'
	);
	
	if(!$type){
		
		if(is_front_page()){
			$type = 'home';
		}
		elseif(is_singular('tasks')) {
			$type = 'task_page';
		}
		elseif(is_page('registration')) {
			$type = 'reg';
		}
		elseif(is_page()) {
			$type = 'page';
		}
		elseif(is_single()) {
			$type = 'post';
		}
		elseif(is_home()) {
			$type = 'news';
		}
		elseif(is_tag()) {
			$type = 'tag';
		}
		elseif(is_post_type_archive('tasks')){
			$type = 'tasks_list';
		}
		else {
			$type = 'default';
		}
	}
		
	return $page_type[$type];
}



//prepare data for JS
function itv_get_ga_events() {
	
    $events_data = array();
    
    /* General events */
    $events_data['ge_show_old_desing'] = array(
      'ga_category' => 'Дизайн',
      'ga_action' => 'Показ сайта в старом дизайне',
      'ga_label' => tst_detect_page_type()
    );
    
    $events_data['ge_switch_desing_to_new'] = array(
      'ga_category' => 'Дизайн',
      'ga_action' => 'Смена дизайна на новый',
      'ga_label' => tst_detect_page_type()
    );

    /* Task card */
    $events_data['tc_title'] = array(
    	'ga_category' => 'Просмотр задачи',
    	'ga_action' => 'Заголовок в карточке задачи',
    	'ga_label' => tst_detect_page_type()
    );
    
    $events_data['tc_more'] = array(
    	'ga_category' => 'Просмотр задачи',
    	'ga_action' => 'Ссылка подробнее в карточке задачи',
    	'ga_label' => tst_detect_page_type()
    );
    
    
    /* Registration page */
    $events_data['reg_login'] = array(
    	'ga_category' => 'Логин (попытка)',
    	'ga_action' => 'Кнопка логина в форме',
    	'ga_label' => tst_detect_page_type()
    );
    $events_data['reg_reg'] = array(
    	'ga_category' => 'Регистрация (попытка)',
    	'ga_action' => 'Кнопка регистрации в форме',
    	'ga_label' => tst_detect_page_type()
    );
    
    
    /* Home page */
    $events_data['hp_video_mobile'] = array(
    	'ga_category' => 'Просмотр видео',
    	'ga_action' => 'Ссылка просмотра видео на главной (моб.)',
    	'ga_label' => tst_detect_page_type()
    );
    
    $events_data['hp_video'] = array(
    	'ga_category' => 'Просмотр видео',
    	'ga_action' => 'Ссылка просмотра видео на главной',
    	'ga_label' => tst_detect_page_type()
    );
    
    $events_data['hp_new_task'] = array(
    	'ga_category' => 'Создать задачу',
    	'ga_action' => 'Кнопка создать задачу на главной (верх)',
    	'ga_label' => tst_detect_page_type()
    );
    
    $events_data['hp_tf_open'] = array(
    	'ga_category' => 'Фильтр задач - открытые',
    	'ga_action' => 'Ссылка открытых задач на главной',
    	'ga_label' => tst_detect_page_type()
    );
    
    $events_data['hp_tf_work'] = array(
    	'ga_category' => 'Фильтр задач - в работе',
    	'ga_action' => 'Ссылка  задач в работе на главной',
    	'ga_label' => tst_detect_page_type()
    );
    
    $events_data['hp_tf_close'] = array(
    	'ga_category' => 'Фильтр задач - закрытые',
    	'ga_action' => 'Ссылка закрытых задач на главной',
    	'ga_label' => tst_detect_page_type()
    );
    
    $events_data['hp_tf_tags'] = array(
    	'ga_category' => 'Фильтр задач - по тегам',
    	'ga_action' => 'Ссылка по тегам на главной',
    	'ga_label' => tst_detect_page_type()
    );
    
    $events_data['hp_tf_nko_tags'] = array(
        'ga_category' => 'Фильтр задач - по тегам НКО',
        'ga_action' => 'Ссылка по тегам НКО на главной',
        'ga_label' => tst_detect_page_type()
    );
    
    $events_data['hp_ntask_bottom'] = array(
    	'ga_category' => 'Создать задачу',
    	'ga_action' => 'Кнопка создать задачу на главной (низ)',
    	'ga_label' =>  tst_detect_page_type()
    );
    
    $events_data['hp_reg_bottom'] = array(
    	'ga_category' => 'Переход к регистрации',
    	'ga_action' => 'Кнопка регистрации на главной (низ)',
    	'ga_label' => tst_detect_page_type()
    );
    
    $events_data['hp_more_nav'] = array(
    	'ga_category' => 'Пейджинг задач',
    	'ga_action' => 'Ссылка Больше задач на главной',
    	'ga_label' => tst_detect_page_type()
    );
    
    
    /** Tasks Lists **/
    $events_data['tl_tf_open'] = array(
    	'ga_category' => 'Фильтр задач - открытые',
    	'ga_action' => 'Ссылка открытых задач - в заголовке',
    	'ga_label' => tst_detect_page_type()
    );
    $events_data['tl_tf_work'] = array(
    	'ga_category' => 'Фильтр задач - в работе',
    	'ga_action' => 'Ссылка задач в работе - в заголовке',
    	'ga_label' => tst_detect_page_type()
    );
    $events_data['tl_tf_close'] = array(
    	'ga_category' => 'Фильтр задач - закрытые',
    	'ga_action' => 'Ссылка закрытых задач - в заголовке',
    	'ga_label' => tst_detect_page_type()
    );
    $events_data['tl_tf_archive'] = array(
    	'ga_category' => 'Фильтр задач - архивные',
    	'ga_action' => 'Ссылка архивных задач - в заголовке',
    	'ga_label' => tst_detect_page_type()
    );
    $events_data['tl_tf_tags'] = array(
    	'ga_category' => 'Фильтр задач - теги',
    	'ga_action' => 'Ссылка на страницу тегов - в заголовке',
    	'ga_label' => tst_detect_page_type()
    );
    $events_data['tl_tf_nko_tags'] = array(
        'ga_category' => 'Фильтр задач - теги НКО',
        'ga_action' => 'Ссылка на страницу тегов НКО - в заголовке',
        'ga_label' => tst_detect_page_type()
    );
    
    
    /** Menu **/
    $events_data['m_tf_list'] = array(
    	'ga_category' => 'Фильтр задач - открытые',
    	'ga_action' => 'Задачи - Ссылка в меню',
    	'ga_label' => tst_detect_page_type()
    );
    
    $events_data['m_mb_list'] = array(
    	'ga_category' => 'Список участников',
    	'ga_action' => 'Участники - Ссылка в меню',
    	'ga_label' => tst_detect_page_type()
    );
    
    $events_data['m_about'] = array(
    	'ga_category' => 'О нас',
    	'ga_action' => 'О нас - Ссылка в меню',
    	'ga_label' => tst_detect_page_type()
    );
    
    $events_data['m_profile'] = array(
    	'ga_category' => 'Профиль',
    	'ga_action' => 'Профиль - Ссылка в меню',
    	'ga_label' => tst_detect_page_type()
    );
    
    $events_data['m_login'] = array(
    	'ga_category' => 'Логин (переход)',
    	'ga_action' => 'Логин - Ссылка в меню',
    	'ga_label' => tst_detect_page_type()
    );
    
    $events_data['m_ntask'] = array(
    	'ga_category' => 'Создать задачу',
    	'ga_action' => 'Новая задача - Ссылка в меню',
    	'ga_label' => tst_detect_page_type()
    );
    
    
    
    /** Members Lists **/ 
    $events_data['ml_mf_all'] = array(
    	'ga_category' => 'Фильтр участников - Все',
    	'ga_action' => 'Ссылка на всех участников - в заголовке',
    	'ga_label' => tst_detect_page_type()
    );
    $events_data['ml_mf_donee'] = array(
    	'ga_category' => 'Фильтр участников - Бенефициар',
    	'ga_action' => 'Ссылка на бенефициаров - в заголовке',
    	'ga_label' => tst_detect_page_type()
    );
    $events_data['ml_mf_activist'] = array(
    	'ga_category' => 'Фильтр участников - Активист',
    	'ga_action' => 'Ссылка на активистов - в заголовке',
    	'ga_label' => tst_detect_page_type()
    );
    $events_data['ml_mf_hero'] = array(
    	'ga_category' => 'Фильтр участников - Супергерой',
    	'ga_action' => 'Ссылка на супергероев - в заголовке',
    	'ga_label' => tst_detect_page_type()
    );
    $events_data['ml_mf_volunteer'] = array(
    	'ga_category' => 'Фильтр участников - Волонтер',
    	'ga_action' => 'Ссылка на волонтеров - в заголовке',
    	'ga_label' => tst_detect_page_type()
    );
    
    return $events_data;
}
