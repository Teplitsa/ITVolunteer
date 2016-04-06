<?php

try {
	include('cli_common.php');
	
	$itv_tasks_stats = ItvTasksStats::instance();
	$itv_tasks_stats->refresh_tasks_stats_by_tags(100);
	
	echo "done: " . date('Y-m-d H:i:s'). "\n";
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
