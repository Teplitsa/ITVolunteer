<?php

use ITV\models\UserBlockModel;

require_once dirname(__FILE__) . '/../inc/models/UserBlockModel.php';

try {
	include('cli_common.php');
	
	UserBlockModel::instance()->unblock_users_when_block_expired( $wpdb );
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
