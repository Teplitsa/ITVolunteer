<?php

require_once('inc/itv_user_reg_source_detector.php');

try {
	include('cli_common.php');
	
	$itv_site_stats = ItvSiteStats::instance();
	$itv_site_stats->refresh_users_role_stats(100);
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
