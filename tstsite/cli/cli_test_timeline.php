<?php

set_time_limit (0);
ini_set('memory_limit','256M');

require_once(dirname(__FILE__) . '/../inc/models/TimelineModel.php');

use ITV\models\TimelineModel;

try {
	$time_start = microtime(true);
	include('cli_common.php');
	echo 'Memory before anything: '.memory_get_usage(true).chr(10).chr(10);
	
// 	ITV\models\TimelineModel::instance()->create_task_timeline(483);
//     print_r(ITV\models\TimelineModel::instance()->get_task_timeline(483));	
	
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
