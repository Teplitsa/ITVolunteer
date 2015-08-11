<?php

require_once('inc/itv_user_report_generator.php');

try {
	include('cli_common.php');
	
	$reg_report_generator = new ItvUserReportGenerator();
	$reg_report_generator->run($wpdb);
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
