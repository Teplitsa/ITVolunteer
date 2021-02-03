<?php

use ITV\models\{Task, MongoClient};

if (!class_exists('WP_CLI')) {
    return;
}

/**
 * Manage mongodb cache
 */

class Cache
{

    const STORAGE_NAME = 'itv_cache';

    public function update_task($args, $assoc_args)
    {
        ["task_id" => $task_id] = $assoc_args;

        if (!is_numeric($task_id)) {

            \WP_CLI::warning(__('A valid task ID is required.', 'itv-backend'));

            return;
        }

        $task_id = (int) $task_id;

        $task = Task::get_item($task_id);

        if (is_null($task)) {

            \WP_CLI::warning(__('No task found for the given ID.', 'itv-backend'));

            return;
        }

        if ($task["status"] !== "publish") {

            \WP_CLI::warning(__('The task is not a public.', 'itv-backend'));

            return;
        }

        $mongo_client = MongoClient::getInstance();

        $collection = $mongo_client->{self::STORAGE_NAME}->tasks;

        $updateCacheResult = $collection->findOneAndUpdate(['databaseId' => $task_id], ['$set' => $task]);

        if (is_null($updateCacheResult)) {

            \WP_CLI::error(__('No task found to update.', 'itv-backend'));
        } else {

            \WP_CLI::success(__('The task is successfully updated.', 'itv-backend'));
        }
    }

    public function update_task_list()
    {
        $task_list = Task::get_list();

        if (!$task_list) {

            WP_CLI::warning(__('No task found.', 'itv-backend'));

            return;
        }

        $mongo_client = MongoClient::getInstance();

        $collection = $mongo_client->{self::STORAGE_NAME}->tasks;

        $collection->drop();

        $updateCacheResult = $collection->insertMany($task_list);

        WP_CLI::success(sprintf(__('%d task(s) successfully updated.', 'itv-backend'), $updateCacheResult->getInsertedCount()));
    }

    public function update_task_list_filter()
    {
        $filter_sections = Task::get_filter_sections();

        if (!$filter_sections) {

            WP_CLI::warning(__('No filter sections found.', 'itv-backend'));

            return;
        }

        $mongo_client = MongoClient::getInstance();

        $collection = $mongo_client->{self::STORAGE_NAME}->task_list_filter;

        $collection->drop();

        $updateCacheResult = $collection->insertMany($filter_sections);

        WP_CLI::success(sprintf(__('%d filter section(s) successfully updated.', 'itv-backend'), $updateCacheResult->getInsertedCount()));
    }
}

WP_CLI::add_command('itv_cache', 'Cache');
