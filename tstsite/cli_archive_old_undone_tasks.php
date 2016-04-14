<?php

require_once('inc/itv_archiver.php');

try {
    date_default_timezone_set('Europe/Moscow');
	include('cli_common.php');
	
	$itv_archiver = new ItvArchiver();
	
	$options = getopt("", array("skip_sending", "skip_archiving"));
	if(isset($options['skip_archiving'])) {
		$itv_archiver->disable_archiving();
		echo "!!!skip archiving\n";
	}
	else {
		echo "!!!tasks will be moved to archive!\n";
	}
	
	$itv_config = ItvConfig::instance();
	
	/*
	 * move old public tasks to archive
	 */
	$task_status = 'publish';
	$is_check_doers = true;
	$action_key = 'old_public_archive';
	$task_archive_days = $itv_config->get('TASK_ARCHIVE_DAYS');
	
	$itv_archiver->archive_tasks($action_key, $task_status, $task_archive_days, ItvLog::$ACTION_TASK_ARCHIVE, $is_check_doers);
	
	
	/*
	 * move long work tasks to archive
	 */
	$task_status = 'in_work';
	$is_check_doers = false;
	$action_key = 'long_work_archive';
	$notif_key = 'long_work_task_archive_soon';
	$task_archive_days = $itv_config->get('TASK_LONG_WORK_ARCHIVE_DAYS');
	
	$sql = "SELECT time_add FROM str_sent_notifications WHERE notif_type = %s ORDER BY time_add ASC LIMIT 1";
	$first_notif_dt = $wpdb->get_var($wpdb->prepare($sql, $notif_key));
	if($first_notif_dt) {
	    $first_notif_time = strtotime($first_notif_dt);
	    $first_notif_time_start = $first_notif_time + 24 * 3600 * ($itv_config->get('TASK_LONG_WORK_ARCHIVE_DAYS') - $itv_config->get('TASK_LONG_WORK_NOTIF_DAYS'));
	    $now = time();
	    // wait sometime after first notifications sent
	    if($now > $first_notif_time_start) {
	        $itv_archiver->archive_tasks($action_key, $task_status, $task_archive_days, ItvLog::$ACTION_TASK_LONG_WORK_ARCHIVE, $is_check_doers);
	    }
	}
	
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
