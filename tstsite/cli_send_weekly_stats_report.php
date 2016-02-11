<?php

try {
	include('cli_common.php');
	require_once('inc/itv_log.php');
	
	$itv_log = new ItvLog();
	$itv_log->send_weekly_stats_email();
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
