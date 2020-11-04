<?php

set_time_limit (0);
ini_set('memory_limit','256M');

use ITV\models\UserNotifModel;
use \WeDevs\ORM\WP\User as User; 

global $wpdb;

try {
	$time_start = microtime(true);
	include('cli_common.php');
	echo 'Memory before anything: '.memory_get_usage(true).chr(10).chr(10);

    $message = "<a href=\"https://itv.te-st.ru/blog/ngolike-thinking\">Онлайн-курс для волонтёров</a>: что стоит за задачей НКО, и как её решить.<br />Дата – 10-13 ноября 2020";

    User::chunk(100, function($users) use($message) {
        foreach ($users as $user) {
            UserNotifModel::instance()->push_notif($user->ID, UserNotifModel::$TYPE_GENERAL_NOTIF, ['content' => $message]);            
        }
    });
    
	echo 'DONE'.chr(10);

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
