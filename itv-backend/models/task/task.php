<?php

namespace ITV\models;

class Task
{

    const POST_TYPE = 'tasks';

    public static function get_list(): array
    {
        $tasks = [];

        $query_args = [
            'post_type' => self::POST_TYPE,
            'post_status' => 'publish',
            'author__not_in' => [ACCOUNT_DELETED_ID],
            'posts_per_page' => -1,
        ];

        $task_list = new \WP_Query($query_args);

        if ($task_list->found_posts === 0) return null;



        foreach ($task_list->posts as $task) {
            $tasks[] = \itv_get_ajax_task_short($task);
        }

        return $tasks;
    }
}

class TaskManager
{
    public static $post_type = 'tasks';

    public function get_latest_user_created_task($user_id)
    {
        $args = array(
            'post_type'         => self::$post_type,
            'author'            => $user_id,
            'suppress_filters'  => true,
            'post_status'       => ['publish', 'closed', 'in_work', 'archived'],
            'posts_per_page'    => 1,
        );

        $posts = get_posts($args);

        return $posts[0] ?? null;
    }

    public function get_latest_user_completed_task($user_id)
    {
        $args = array(
            'post_type'         => self::$post_type,
            'post_status'       => ['publish', 'closed', 'in_work', 'archived'],
            'connected_type'    => 'task-doers',
            'suppress_filters'  => true,
            'posts_per_page'    => 1,
            'connected_items'   => $user_id,
            'connected_meta'    => array(
                array(
                    'key'       => 'is_approved',
                    'value'     => 1,
                    'compare'   => '='
                )
            ),
        );

        $posts = get_posts($args);

        return $posts[0] ?? null;
    }
}
