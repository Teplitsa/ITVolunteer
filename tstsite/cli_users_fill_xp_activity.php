<?php

require_once dirname(__FILE__) . '/vendor/autoload.php';
require_once 'inc/models/UserXPModel.php';

use ITV\models\UserXPModel;

try {
	include('cli_common.php');
	
	$uxp_model = UserXPModel::instance();
	
	$options = getopt("", array('user_id:'));
	$user_id = isset($options['user_id']) ? $options['user_id'] : '';
	
	$uxp_model->fill_users_activity($user_id);
	
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
