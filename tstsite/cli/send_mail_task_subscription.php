<?php

use ITV\models\UserBlockModel;

require_once dirname(__FILE__) . '/../inc/models/UserBlockModel.php';

function get_tasks($filter) {
    $args = array(
        'query_id' => "itv_filtered_task_list",
        'post_type' => 'tasks',
        'post_status' => 'publish',
        'author__not_in' => array(ACCOUNT_DELETED_ID),
        'paged' => 1,
        'posts_per_page' => 5,
        'date_query' => array(
            'after' => date('Y-m-d', strtotime('-7 days')) 
        )        
    );

    if(!empty($filter)) {
        $tlf = new TaskListFilter();
        $filter_options = $tlf->get_task_list_filter_options();
        foreach($filter_options as $key => $section) {
            if(!empty($section['items'])) {
                foreach($section['items'] as $ik => $item) {
                    foreach($filter as $fk => $fv) {
                        if($fv && $fk === $section['id'] . "." . $item['id']) {
                            $args = add_task_list_filter_param($args, $section['id'], $item['id'], $fv);
                        }
                    }
                }
            }
            elseif(!empty($filter[$section['id']])) {
                $args = add_task_list_filter_param($args, $section['id'], null, $filter[$section['id']]);                
            }
        }
    }

    $task_list = [];
    $GLOBALS['wp_query'] = new WP_Query($args);
    
    while ( $GLOBALS['wp_query']->have_posts() ) {
        $GLOBALS['wp_query']->the_post();
        $post = get_post();
        
        if($post) {
            $task_list[] = $post;
        }
    }

    return  $task_list;
}

try {
    $time_start = microtime(true);
    include('cli_common.php');
    echo 'Memory before anything: '.memory_get_usage(true).chr(10).chr(10);

    $args = array(
        'meta_query' => array(
            array(
                'key' => 'itv_subscribe_task_list',
                'compare' => 'EXISTS',
            )
        )
    );

    $users = get_users($args);

    foreach ($users as $user) {
        echo "user: {$user->ID} - {$user->user_login}\n";
        try {
            $filter = get_user_meta($user->ID, 'itv_subscribe_task_list', true);
            print_r($filter);
            $tasks = get_tasks($filter);
            if(!count($tasks)) {
                echo "no tasks\n";
                continue;
            }

            $task_list = [];
            foreach ($tasks as $task) {
                echo "task: {$task->ID} - {$task->post_title}\n";
                $task_list[] = "<a href=\"" . get_permalink($task) . "\">{$task->post_title}</a><br /><br />";
            }

            ItvAtvetka::instance()->mail('new_tasks_subscription', [
                'mailto' => $user->user_email,
                'username' => $user->first_name,
                'task_list_url' => site_url("/tasks/"),
                'task_list' => implode("\n", $task_list),
            ]);
            echo "mail sent\n";

        }
        catch(Exception $ex) {
            echo $e->getMessage() . "\n";
        }
    }

  	
    echo chr(10);
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
