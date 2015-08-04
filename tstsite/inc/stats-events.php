<?php
/**
 * Params for GA events
 **/

function tst_detect_page_type($type = null) {
	global $post;
	
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
			$type = 'red';
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
add_action('wp_enqueue_scripts', function(){
	
$events_data = array();

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

	
	wp_localize_script('front', 'ga_events', $events_data);
	
}, 20);

