<?php

require_once('inc/itv_user_report_generator.php');

try {
	include('cli_common.php');

	$options = getopt("", array('file:'));
	$to_file = isset($options['file']) ? $options['file'] : '';
	
	$reg_report_generator = new ItvUserReportGenerator();
	echo "creating report...\n";
	$reg_report_generator->run($wpdb);
	
	if(!empty($to_file)) {
	    $to_file = getcwd() . "/" . $to_file;
	    echo "export to file: ".$to_file . "\n";
	    $reg_report_generator->export_csv($wpdb, $to_file);
	}
	echo "done\n";
	
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
