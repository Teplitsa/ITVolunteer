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

function echo_start_text() {
    date_default_timezone_set('Europe/Moscow');
    echo "datetime: " . date('Y-m-d H:i:s'). "\n";
}

function echo_end_text() {
    date_default_timezone_set('Europe/Moscow');
    echo "done: " . date('Y-m-d H:i:s'). "\n";
}
