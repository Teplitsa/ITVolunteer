<?php

require_once('inc/itv_notificator.php');

try {
	include('cli_common.php');
	
	$itv_notificator = new ItvNotificator();
	$itv_notificator->notify_about_tomorrow_archive();
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
