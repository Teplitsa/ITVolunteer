<?php

try {
	include('cli_common.php');
	
	$itv_tasks_stats = ItvTasksStats::instance();
	$itv_tasks_stats->refresh_tasks_stats_by_tags(100);
	$itv_tasks_stats->refresh_tasks_stats_by_nko_tags(100);
	
	echo_end_text();
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
