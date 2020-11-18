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

    $message = get_option( 'itv-mass-push-message' );
    $need_do_mass_push = boolval(get_option( 'itv-do-mass-push' ));

    if($need_do_mass_push) {
        echo "DO MASS PUSH\n";
        echo "MESSAGE:\n" . $message . "\n\n";

        User::chunk(100, function($users) use($message) {
            foreach ($users as $user) {
                UserNotifModel::instance()->push_notif($user->ID, UserNotifModel::$TYPE_GENERAL_NOTIF, ['content' => $message]);            
            }
        });

        update_option( 'itv-do-mass-push', '');
    }

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
