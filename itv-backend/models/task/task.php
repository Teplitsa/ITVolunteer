<?php

namespace ITV\models;

class Task extends Cacheable
{
    public static string $post_type = 'tasks';
    public static string $collection_name = 'tasks';

    public static function filter_fields(\WP_Post $task): array
    {
        return \itv_get_ajax_task_short($task);
    }

    public static function get_filter_sections(): array
    {
        $task_list_filter = new \TaskListFilter();
        $sections = $task_list_filter->create_filter_with_stats();

        return $sections;
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
