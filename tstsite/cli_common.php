<?php

function find_wordpress_base_path() {
	$dir = dirname(__FILE__);
	do {
		if( file_exists($dir."/wp-config.php") ) {
			return $dir;
		}
	} while( $dir = realpath("$dir/..") );
	return null;
}

define('BASE_PATH', find_wordpress_base_path()."/");
define('WP_USE_THEMES', false);
define('WP_CURRENT_THEME', 'tstsite');

include('inc/itv_exceptions.php');

if(php_sapi_name() !== 'cli') {
	throw new ItvNotCLIRunException("Should be run from command line!");
}

$options = getopt("", array('host:'));
$host = isset($options['host']) ? $options['host'] : '';

if(empty($host)) {
	throw new ItvNotCLIRunException("Host must be defined!");
}
else {
	echo "HOST: " . $host . "\n";
}

$_SERVER = array(
	"HTTP_HOST" => $host,
	"SERVER_NAME" => $host,
	"REQUEST_URI" => "/",
	"REQUEST_METHOD" => "GET",
);

global $wp, $wp_query, $wp_the_query, $wp_rewrite, $wp_did_header;
require_once(BASE_PATH . 'wp-load.php');
