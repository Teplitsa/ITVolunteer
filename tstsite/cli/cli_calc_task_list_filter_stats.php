<?php

set_time_limit (0);
ini_set('memory_limit','256M');

include('cli_common.php');
require_once( get_template_directory().'/inc/data_cache.php' );
require_once( get_template_directory().'/inc/task_list_filter.php' );

try {
	$time_start = microtime(true);
	echo 'Memory before anything: '.memory_get_usage(true).chr(10).chr(10);
	
    $tlf = new TaskListFilter();
    
    $filter_data = $tlf->create_filter_with_stats();
    set_transient( DataCache::$DATA_TASK_LIST_FILTER, $filter_data, HOUR_IN_SECONDS );
	
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
