<?php

set_time_limit (0);
ini_set('memory_limit','256M');

try {
	$time_start = microtime(true);
	include('cli_common.php');
	echo 'Memory before anything: '.memory_get_usage(true).chr(10).chr(10);

	global $wpdb;
    
    
	//Homepage & Archive
	echo 'Updating "What is user blocking" pages'.chr(10);

	$page = $wpdb->get_row($wpdb->prepare("SELECT * FROM $wpdb->posts WHERE post_status = 'publish' AND post_type = 'page' AND post_title = %s", 'Что такое блокировка'));
	$update = array(
		'ID' 			=> ($page) ? $page->ID : 0,
		'post_title' 	=> 'Что такое блокировка',
		'post_type' 	=> 'page',
		'post_name' 	=> 'about-user-blocking',
		'post_status'	=> 'publish',
		'meta_input'	=> array('_wp_page_template' => 'page-home.php'),
		'post_content'	=> "Блокировка - это временная деактивация профиля. Заблокированные пользователи не могут войти в свой аккаунт, и, поэтому, не могут проявлять активность на сайте.<h4>Причины блокировки пользователей</h4><p>Блокировке подвергаются пользователи, нарушающие правила пользования сайтом, например: рассылают спам, проявляют неуважение к другим участикам и т.д.</p>"
	);
	$page_id = wp_insert_post($update);

	unset($page);
	unset($update);
    
	echo 'Data structure update DONE'.chr(10);

	//Final
	echo 'Memory '.memory_get_usage(true).chr(10);
	echo 'Total execution time in sec: ' . (microtime(true) - $time_start).chr(10).chr(10);
    
}
catch (ItvNotCLIRunException $ex) {
	echo $ex->getMessage() . "\n";
}
catch (ItvCLIHostNotSetException $ex) {
	echo $ex->getMessage() . "\n";
}
catch (Exception $ex) {
	echo $ex;
}
