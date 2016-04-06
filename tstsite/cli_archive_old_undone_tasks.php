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
	
	$itv_archiver->archive_tasks();
	
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
