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

  // $user_params = array(
  //     'ID' => 75,
  //     'user_email' => "test4@ngo2.ru",
  //     #'user_login' => "denis005",
  //     #'user_pass' => "123123",
  // );

  // $result = wp_update_user($user_params);
  // print_r($result);


    // $params = [
    //     'post_type' => 'tasks',
    //     'post_status' => array_keys(tst_get_task_status_list()),
    //     'nopaging' => true,
    //     'suppress_filters' => true,
    // ];
    // $query = new WP_Query( $params );
    // $post_count = $query->post_count;
    // $posts = $query->posts;
    // echo "post_count: " . $post_count . "\n";
    // echo "count(posts): " . count($posts) . "\n";

    $tax = 'post_tag';
    $parent_id = 187;
    // $tax = 'category';
    // $parent_id = 59;

    $term = get_term_by('id', $parent_id, $tax);
    print_r($term);

    // $terms = get_terms([
    //     'taxonomy' => $tax,
    //     'hide_empty' => false,
    //     'hierarchical' => true,
    //     'parent' => $parent_id, 
    // ]);
    $terms = get_terms([
        'taxonomy' => 'post_tag',
        'hide_empty' => false,
    ]);
    print_r($terms);
    print_r(count($terms));

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
