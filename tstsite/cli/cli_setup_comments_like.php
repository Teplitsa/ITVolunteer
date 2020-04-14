<?php

set_time_limit (0);
ini_set('memory_limit','256M');

global $wpdb;

try {
	$time_start = microtime(true);
	include('cli_common.php');
	echo 'Memory before anything: '.memory_get_usage(true).chr(10).chr(10);
	
	$sql = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}itv_comment_like (
`id` bigint(20) NOT NULL AUTO_INCREMENT,
`user_id` bigint(20) NULL DEFAULT NULL,
`comment_id` bigint(20) NOT NULL,
`created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
`updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
PRIMARY KEY (`id`),
CONSTRAINT `user_comment` UNIQUE (`comment_id`, `user_id`),
KEY `comment_id` (`comment_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8
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
