<?php

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
        $tasks = itv_get_new_tasks_for_email($filter);
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
            'user_first_name' => $user->first_name,
            'task_list_url' => site_url("/tasks"),
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
