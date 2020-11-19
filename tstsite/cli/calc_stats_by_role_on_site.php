<?php

set_time_limit (0);
ini_set('memory_limit','256M');

use ITV\models\UserNotifModel;
use \WeDevs\ORM\WP\User as User; 

global $wpdb;

try {
	$time_start = microtime(true);
	include('cli_common.php');
	echo 'Memory before anything: '.memory_get_usage(true).chr(10).chr(10);

    $users_roles_stats = [
        'doer' => 0,
        'author' => 0,
        'mixed' => 0,
        'inactive' => 0,
    ];

    User::chunk(100, function($users) use (&$users_roles_stats) {
        foreach ($users as $user) {
            // if($user->ID != 75) {
            //     continue;
            // }

            $user_stats = [];

            $args = [
                'post_type' => 'tasks',
                'suppress_filters' => true,
                'posts_per_page' => -1,
                'post_status' => ['publish', 'in_work', 'closed', 'archived'],
                'author' => $user->ID,
            ];
            $query = new WP_Query($args);
            $user_stats['created_tasks'] = $query->found_posts;

            $args = [
                'post_type' => 'tasks',
                'suppress_filters' => true,
                'posts_per_page' => -1,
                'post_status' => ['publish', 'in_work', 'closed', 'archived'],
                'connected_type' => 'task-doers',
                'connected_items' => $user->ID,
            ];
            $query = new WP_Query($args);
            $user_stats['doer_tasks'] = $query->found_posts;

            // print_r($user_stats);

            if($user_stats['created_tasks'] === 0 && $user_stats['doer_tasks'] === 0) {
                $users_roles_stats['inactive'] += 1;
            }
            elseif($user_stats['created_tasks'] > 0 && $user_stats['doer_tasks'] > 0) {
                $users_roles_stats['mixed'] += 1;
            }
            elseif($user_stats['created_tasks'] > 0) {
                $users_roles_stats['author'] += 1;
            }
            elseif($user_stats['doer_tasks'] > 0) {
                $users_roles_stats['doer'] += 1;
            }
            
        }
    });

    echo "TOTAL STATS:\n";
    print_r($users_roles_stats);
    echo "\n\n";

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
