<?php

require_once('inc/functions-tasks.php');

try {
	include('cli_common.php');
	
	tst_archive_tasks();
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
