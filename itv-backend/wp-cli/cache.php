<?php

use ITV\models\Task;

if (!class_exists('WP_CLI')) {
    return;
}

/**
 * Manage mongodb cache
 */

class Cache
{

    const STORAGE_NAME = 'itv_cache';

    public function update_task_list()
    {
        $task_list = Task::get_list();

        if (!$task_list) {

            WP_CLI::warning(__('No task found.', 'itv-backend'));

            return;
        }

        try {
            $client = new MongoDB\Client("mongodb://localhost:27017");
        } catch (Exception $e) {
            WP_CLI::warning($e->getMessage());
        }

        $collection = $client->{self::STORAGE_NAME}->tasks;

        $updateCacheResult = $collection->insertMany($task_list);

        WP_CLI::success(sprintf(__('%d task(s) successfully updated.', 'itv-backend'), $updateCacheResult->getInsertedCount()));
    }
}

WP_CLI::add_command('itv_cache', 'Cache');
