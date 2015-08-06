<?php

if(php_sapi_name() !== 'cli') {
	die("Should to be run from command line");
}

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

global $wp, $wp_query, $wp_the_query, $wp_rewrite, $wp_did_header;

if(!@$argv[1]) {
	die("host must be defined!\n");
}

echo "HOST: " . @$argv[1] . "\n";

$_SERVER = array(
	"HTTP_HOST" => $argv[1],
	"SERVER_NAME" => $argv[1],
	"REQUEST_URI" => "/",
	"REQUEST_METHOD" => "GET",
);
require_once(BASE_PATH . 'wp-load.php');
