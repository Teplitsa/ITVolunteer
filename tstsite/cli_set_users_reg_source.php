<?php

require_once('inc/itv_user_reg_source_detector.php');

try {
	include('cli_common.php');
	
	$reg_source_detector = new ItvUserRegSourceDetector();
	$reg_source_detector->run($wpdb);
}
catch (ItvNotCLIRunException $ex) {
	echo $ex->getMessage()."\n";
}
catch (ItvCLIHostNotSetException $ex) {
	echo $ex->getMessage()."\n";
}
catch (Exception $ex) {
	echo $ex;
}
