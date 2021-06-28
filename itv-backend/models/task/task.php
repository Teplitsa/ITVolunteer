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

    public static $TERMS_TO_INFORM_PASEKA_MEMBERS = ['from-grant'];

    public static $OPTION_NEED_INFORM_PASEKA_MEMBERS_ABOUT_NEW_TASK = 'itv_need_inform_paseka_members_about_new_task';

    public static $META_IS_PASEKA_MEMBERS_INFORMED = 'itv_is_paseka_members_informed';

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

    public function setup_data_to_inform_about_task($task_id)
    {
        $rewards = wp_get_post_terms($task_id, 'reward');
        $reward = !empty($rewards) ? $rewards[0] : null;

        $is_inform_paseka_reward = in_array($reward->slug, self::$TERMS_TO_INFORM_PASEKA_MEMBERS);

        error_log("new reward: " . print_r($reward, true));
        error_log("is_inform_paseka_reward: " . $is_inform_paseka_reward);

        if($is_inform_paseka_reward) {
            update_option(self::$OPTION_NEED_INFORM_PASEKA_MEMBERS_ABOUT_NEW_TASK, true);
        }
    }

    public function get_tasks_to_inform_paseka_members_about() {

        $args = [
            'post_type' => self::$post_type,
            'post_status' => 'publish',
            'author__not_in' => [ACCOUNT_DELETED_ID],
            'posts_per_page' => -1,
            'fields' => 'ids',
            'meta_query' => [
                [
                    'key' => self::$META_IS_PASEKA_MEMBERS_INFORMED,
                    'compare' => 'NOT EXISTS',
                ]
            ],
        ];
    
        $q = new \WP_Query($args);
        return $q->get_posts();
    }

    public function mark_tasks_paseka_members_informed($task_id_list) {
        foreach($task_id_list as $task_id) {
            update_post_meta($task_id, self::$META_IS_PASEKA_MEMBERS_INFORMED, true);
        }
    }

    public function get_fresh_tasks_with_no_volunteers() {
        $args = array(
            'query_id' => "itv_filtered_task_list",
            'post_type' => 'tasks',
            'post_status' => 'publish',
            'author__not_in' => array(ACCOUNT_DELETED_ID),
            'posts_per_page' => -1,
            'fields' => 'ids',
            'date_query' => array(
                'after' => date('Y-m-d', strtotime('-2 days')),
                'before' => date('Y-m-d') 
            )        
        );    
    
        $q = new \WP_Query($args);
        $task_id_list = $q->get_posts();

        $res_task_id_list = [];

        foreach($task_id_list as $task_id) {
            if(count( \tst_get_task_doers($task_id) ) === 0) {
                $res_task_id_list[] = $task_id;
            }
        }

        return $res_task_id_list;        
    }
}
