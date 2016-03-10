<?php

require_once dirname(__FILE__) . '/vendor/autoload.php';
require_once 'inc/models/BigDataGenerator.php';

use ITV\models\BigDataGenerator;

try {
	include('cli_common.php');
	
	$big_data_model = BigDataGenerator::instance();
	$big_data_model->generate_data();
	
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
