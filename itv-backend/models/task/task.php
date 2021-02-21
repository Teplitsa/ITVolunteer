<?php

namespace ITV\models;

class Task
{

    const POST_TYPE = 'tasks';

    public function update_item_cache(int $task_id)
    {
        if (!is_numeric($task_id)) {

            throw new \Exception(__('A valid task ID is required.', 'itv-backend'));

            return;
        }

        $task_id = (int) $task_id;

        $task = Task::get_item($task_id);

        if (is_null($task)) {

            throw new \Exception(__('No task found for the given ID.', 'itv-backend'));

            return;
        }

        if ($task["status"] !== "publish") {

            throw new \Exception(__('The task is not a public.', 'itv-backend'));

            return;
        }

        $mongo_client = MongoClient::getInstance();

        $collection = $mongo_client->{\Cache::STORAGE_NAME}->tasks;

        $updateCacheResult = $collection->findOneAndUpdate(['databaseId' => $task_id], ['$set' => $task]);

        // No task found to update.

        if (is_null($updateCacheResult)) {

            $collection->insertOne($task);
        }
    }

    public static function get_item(int $task_id): ?array
    {
        $task = \get_post($task_id);

        if (!is_null($task)) {
            $task = \itv_get_ajax_task_short($task);
        }

        return $task;
    }

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
