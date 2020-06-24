<?php

require_once(dirname(__FILE__) . '/../inc/itv_user_report_generator.php');
require_once(dirname(__FILE__) . '/../inc/itv_task_queue.php');

try {
	include('cli_common.php');
	
	$tasq = new ItvTaskQueue($wpdb);
	$task = $tasq->fetch_next(ItvTaskQueue::$TYPE_USER_REPORT);
	
	if($task) {
	    $reg_report_generator = new ItvUserReportGenerator();
	    $reg_report_generator->run($wpdb);
	    $reg_report_generator->export_csv();
	}
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
