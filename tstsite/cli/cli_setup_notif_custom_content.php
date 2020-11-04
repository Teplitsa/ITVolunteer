<?php

set_time_limit (0);
ini_set('memory_limit','256M');

global $wpdb;

try {
	$time_start = microtime(true);
	include('cli_common.php');
	echo 'Memory before anything: '.memory_get_usage(true).chr(10).chr(10);
	
	$sql = "ALTER TABLE {$wpdb->prefix}itv_user_notif 
ADD COLUMN content text DEFAULT NULL
";
	
	$res = $wpdb->query($sql);
	
	if(is_wp_error($res)) {
	    echo $res->get_message();
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
