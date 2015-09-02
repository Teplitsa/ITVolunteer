<?php

require_once('inc/itv_notificator.php');

try {
	include('cli_common.php');
	
	$itv_notificator = new ItvNotificator();
	$itv_notificator->notif_archive_soon_tasks();
	$itv_notificator->notif_no_tasks_doer_yet();
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
