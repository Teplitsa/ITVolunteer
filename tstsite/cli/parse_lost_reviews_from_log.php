<?php

set_time_limit (0);
ini_set('memory_limit','256M');

try {
	$time_start = microtime(true);
	include('cli_common.php');
	echo 'Memory before anything: '.memory_get_usage(true).chr(10);

	global $wpdb;
    
    
	//Homepage & Archive
	echo 'START'.chr(10).chr(10);

    $upload_dir = wp_upload_dir();
    $fpath = $upload_dir['basedir'] . "/debug-with-reviews.log";

    $all_q_list = [];
    $fh = fopen($fpath, "r") or die("Open file error");
    if ($fh) {
        $qs_lines = [];
        $start_qs_read = false;

        while (!feof($fh)) {
            $str = fgets($fh, 4096);

            if(!$start_qs_read && strstr($str, "Unknown column 'communication_rating' in 'field list'") !== false) {
                $start_qs_read = true;
            }

            if($start_qs_read) {
                $qs_lines[] = trim($str);
            }

            if($start_qs_read && (strstr($str, "do_action('wp_ajax_leave-review')") !== false || strstr($str, "do_action('wp_ajax_leave-review-author')") !== false)) {

                $all_q_list[] = implode(" ", array_splice($qs_lines, 1, -1));

                $start_qs_read = false;
                $qs_lines = [];
            }
        }
        fclose($fh);
    }

    echo "found: " . count($all_q_list) . "\n";
    // print_r($all_q_list[59]);
    foreach($all_q_list as $i => $q) {
        echo "$i - " . strlen($q) . "\n";
        $wpdb->query($q);
    }

	echo chr(10) . chr(10);
    echo 'DONE'.chr(10);

	//Final
	echo 'Memory '.memory_get_usage(true).chr(10);
	echo 'Total execution time in sec: ' . (microtime(true) - $time_start).chr(10).chr(10);
    
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
