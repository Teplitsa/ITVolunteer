<?php

include(dirname(__FILE__) . '/../inc/itv_exceptions.php');
include('utils.php');
include('ItvCliApp.php');

use ITV\cli\ItvCliApp;

$ITV_CLI_APP = null;
if(isset($ITV_APP_FILE)) {
    $ITV_CLI_APP = new ItvCliApp($ITV_APP_FILE);
}

define('BASE_PATH', find_wordpress_base_path()."/");
define('WP_USE_THEMES', false);
define('WP_CURRENT_THEME', 'tstsite');

if(php_sapi_name() !== 'cli') {
	throw new ItvNotCLIRunException("Should be run from command line!");
}

$options = getopt("", array('host:'));
$host = isset($options['host']) ? $options['host'] : '';

echo "=======start=======\n";

if(empty($host)) {
// 	throw new ItvNotCLIRunException("Host must be defined!");
}
else {
	echo "HOST: " . $host . "\n";
}

echo_start_text();

$_SERVER = array(
	"HTTP_HOST" => $host,
	"SERVER_NAME" => $host,
	"REQUEST_URI" => "/",
	"REQUEST_METHOD" => "GET",
);

global $wp, $wp_query, $wp_the_query, $wp_rewrite, $wp_did_header;
require_once(BASE_PATH . 'wp-load.php');
