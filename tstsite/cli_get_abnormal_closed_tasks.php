<?php

require_once('inc/itv_user_reg_source_detector.php');

try {
	include('cli_common.php');
	
	$query_params = array(
		'post_type' => 'tasks',
		'nopaging' => true,
		'post_status' => 'closed',
	);
	
	$query = new WP_Query($query_params);
	
	$no_doer_tasks = array();
	$several_doers_tasks = array();
	
	$counter = 0;
	while($query->have_posts()) {
		$query->the_post();
	
		# get doers count
		$params = array(
				'post_type' => 'tasks',
				'connected_type'   => 'task-doers',
				'connected_items'  => $user->ID,
				'suppress_filters' => false,
				'nopaging'         => true,
				'connected_meta'  => array(
					 array(
					 		'key'     =>'is_approved',
					 		'value'   => 1,
					 		'compare' => '='
					 )
				),
				'post__in'     => array(get_the_ID()),
		);
		$doers_count_query = new WP_Query($params);
		
		$doers_count = $doers_count_query->found_posts;
		
		if(!$doers_count) {
			$no_doer_tasks[] = get_post_permalink(get_the_ID());
		}
		elseif($doers_count > 1) {
			$several_doers_tasks[] = get_post_permalink(get_the_ID());
		}
		$counter += 1;
	}
	
	echo "\nPROCESSED: " . $counter . "\n";
	
	echo "\nNO_DOERS_TASKS: " . count($no_doer_tasks) . "\n";
	foreach($no_doer_tasks as $link) {
		echo $link . "\n";
	}

	echo "\nSEVERAL_DOERS_TASKS: " . count($several_doers_tasks) . "\n";
	foreach($several_doers_tasks as $link) {
		echo $link . "\n";
	}
	echo "\n\n";
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
