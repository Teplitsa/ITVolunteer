<?php

use ITV\models\{MongoClient, Task, Advantage, Faq, Partner, Review, News, Stats, MemberStats, TaskStats};

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

    public function update_advantage_list(): void
    {
        $advantage_list = Advantage::get_list();

        if (!$advantage_list) {

            WP_CLI::warning(sprintf(__('No %s found.', 'itv-backend'), Advantage::$post_type));

            return;
        }

        $mongo_client = MongoClient::getInstance();

        $collection = $mongo_client->{self::STORAGE_NAME}->{Advantage::$collection_name};

        $collection->drop();

        $updateCacheResult = $collection->insertMany($advantage_list);

        WP_CLI::success(sprintf(__('%d %s(s) successfully updated.', 'itv-backend'), $updateCacheResult->getInsertedCount(), Advantage::$post_type));
    }

    public function update_faq_list(): void
    {
        $faq_list = Faq::get_list();

        if (!$faq_list) {

            WP_CLI::warning(sprintf(__('No %s found.', 'itv-backend'), Faq::$post_type));

            return;
        }

        $mongo_client = MongoClient::getInstance();

        $collection = $mongo_client->{self::STORAGE_NAME}->{Faq::$collection_name};

        $collection->drop();

        $updateCacheResult = $collection->insertMany($faq_list);

        WP_CLI::success(sprintf(__('%d %s(s) successfully updated.', 'itv-backend'), $updateCacheResult->getInsertedCount(), Faq::$post_type));
    }

    public function update_partner_list(): void
    {
        $partner_list = Partner::get_list();

        if (!$partner_list) {

            WP_CLI::warning(sprintf(__('No %s found.', 'itv-backend'), Partner::$post_type));

            return;
        }

        $mongo_client = MongoClient::getInstance();

        $collection = $mongo_client->{self::STORAGE_NAME}->{Partner::$collection_name};

        $collection->drop();

        $updateCacheResult = $collection->insertMany($partner_list);

        WP_CLI::success(sprintf(__('%d %s(s) successfully updated.', 'itv-backend'), $updateCacheResult->getInsertedCount(), Partner::$post_type));
    }
    public function update_review_list(): void
    {
        $review_list = Review::get_list();

        if (!$review_list) {

            WP_CLI::warning(sprintf(__('No %s found.', 'itv-backend'), Review::$post_type));

            return;
        }

        $mongo_client = MongoClient::getInstance();

        $collection = $mongo_client->{self::STORAGE_NAME}->{Review::$collection_name};

        $collection->drop();

        $updateCacheResult = $collection->insertMany($review_list);

        WP_CLI::success(sprintf(__('%d %s(s) successfully updated.', 'itv-backend'), $updateCacheResult->getInsertedCount(), Review::$post_type));
    }
    public function update_news_list(): void
    {
        $news_list = News::get_list();

        if (!$news_list) {

            WP_CLI::warning(sprintf(__('No %s found.', 'itv-backend'), News::$post_type));

            return;
        }

        $mongo_client = MongoClient::getInstance();

        $collection = $mongo_client->{self::STORAGE_NAME}->{News::$collection_name};

        $collection->drop();

        $updateCacheResult = $collection->insertMany($news_list);

        WP_CLI::success(sprintf(__('%d %s(s) successfully updated.', 'itv-backend'), $updateCacheResult->getInsertedCount(), News::$post_type));
    }

    public function update_stats(): void
    {
        $task_stats_list = TaskStats::get_list();

        if (!$task_stats_list) {

            WP_CLI::warning(__('No task stats items found.', 'itv-backend'));

            return;
        }

        $task_stats_featured_categories = TaskStats::get_featured_categories();

        if (!$task_stats_featured_categories) {

            WP_CLI::warning(__('No task stats categories found.', 'itv-backend'));

            return;
        }

        $member_stats_count = MemberStats::get_count();

        if (!$member_stats_count) {

            WP_CLI::warning(__('No members found.', 'itv-backend'));

            return;
        }

        $mongo_client = MongoClient::getInstance();

        $collection = $mongo_client->{self::STORAGE_NAME}->{Stats::$collection_name};

        $collection->drop();

        $member_collection_name = MemberStats::$child_collection_name;
        $task_collection_name = TaskStats::$child_collection_name;

        $updateCacheResult = $collection->insertOne([
            "{$member_collection_name}" => [
                'total' => $member_stats_count
            ],
            "{$task_collection_name}" => [
                'featuredCategories' => $task_stats_featured_categories,
                'total'              => $task_stats_list
            ],
        ]);

        if (!$updateCacheResult->getInsertedCount()) {
            WP_CLI::error(__('Failted to update stats.', 'itv-backend'));
        }

        WP_CLI::success(__('Stats successfully updated.', 'itv-backend'));
    }
}

WP_CLI::add_command('itv_cache', 'Cache');
