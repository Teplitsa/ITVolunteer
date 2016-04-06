<?php

require_once('inc/itv_notificator.php');

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
	
	echo "   notif_archive_soon_tasks\n";
	$itv_notificator->notify_about_tomorrow_archive();
	
	echo "   notif_no_tasks_doer_yet\n";
	$itv_notificator->notif_no_tasks_doer_yet();
	
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
