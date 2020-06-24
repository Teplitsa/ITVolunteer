<?php

require_once(dirname(__FILE__) . '/../inc/itv_notificator.php');

try {
	include('cli_common.php');
	
	$itv_notificator = new ItvNotificator();
	
	$options = getopt("", array("skip_sending"));
	if(isset($options['skip_sending'])) {
		$itv_notificator->disable_sending();
		echo "!!!skip sending emails\n";
	}
	else {
		echo "!!!emails will be sent!\n";
	}
	
	$itv_config = ItvConfig::instance ();
	
	echo "   notif_no_tasks_doer_yet\n";
	$itv_notificator->notif_no_tasks_doer_yet();
	
	echo "   notif_archive_soon_tasks\n";
	$log_action = ItvLog::$ACTION_TASK_NOTIF_ARCHIVE_SOON;
	$notif_key = 'task_archive_soon_notif';
	$task_status = 'publish';
	$is_check_doers = true;
	$task_notif_days = $itv_config->get ( 'TASK_ARCHIVE_DAYS' );
	
	$itv_notificator->notif_tasks_soon_archive($notif_key, $task_status, $task_notif_days, $log_action, $is_check_doers);
	
	
	echo "   notif_long_work_tasks\n";
	$log_action = ItvLog::$ACTION_TASK_LONG_WORK_ARCHIVE_NOTIF;
	$notif_key = 'long_work_task_archive_soon';
	$task_status = 'in_work';
	$is_check_doers = false;
	$task_notif_days = $itv_config->get ( 'TASK_LONG_WORK_NOTIF_DAYS' );
	
	$itv_notificator->notif_tasks_soon_archive($notif_key, $task_status, $task_notif_days, $log_action, $is_check_doers);
	
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
