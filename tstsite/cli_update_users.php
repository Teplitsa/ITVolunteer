<?php

require_once('inc/itv_user_batch_updater.php');

try {
	include('cli_common.php');
	
	$users_updater = new ItvUserBatchUpdater();
	$users_updater->run($wpdb);
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
