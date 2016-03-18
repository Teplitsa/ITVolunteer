<?php

require_once('inc/itv_user_reg_source_detector.php');

try {
	include('cli_common.php');
	
	$itv_site_stats = ItvSiteStats::instance();
	
	$start002 = microtime(true);
	$itv_site_stats->refresh_users_role_stats(100);
	echo "process all users: ".(microtime(true) - $start002) . " sec.\n";
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
