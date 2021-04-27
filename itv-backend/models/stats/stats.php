<?php

namespace ITV\models;

class Stats
{
    public static string $collection_name = 'stats';
}

class MemberStats extends Stats
{
    public static string $child_collection_name = 'member';

    public static function get_count(): int
    {
        global $wpdb;

        $count = $wpdb->get_var(
            $wpdb->prepare(
                <<<SQL
                SELECT
                    COUNT(*)
                FROM
                    {$wpdb->prefix}itv_user_xp
                WHERE
                    user_id <> %s
                SQL,
                ACCOUNT_DELETED_ID
            )
        );

        return $count;
    }

    public static function update_cache(int $user_id = 0): void
    {

        $member_stats_count = self::get_count();

        if (!$member_stats_count) {

            return;
        }

        $mongo_client = MongoClient::getInstance();

        $collection = $mongo_client->{\Cache::STORAGE_NAME}->{Stats::$collection_name};

        $member_collection_name = self::$child_collection_name;

        $collection->updateOne([], [
            '$set' => [
                "{$member_collection_name}" => [
                    'total' => $member_stats_count,
                ]
            ],
        ]);
    }
}

class TaskStats extends Stats
{
    public static string $post_type = 'tasks';
    public static string $child_collection_name = 'task';

    public static function get_list(array $task_status = ['publish', 'closed']): ?array
    {
        global $wpdb;

        $select_columns = implode(',', array_map(fn ($status) => "SUM(post_status = '{$status}') as {$status}", $task_status));

        $where_post_type = "'" . self::$post_type . "'";

        $where_task_status_in = implode(',', array_map(fn ($status) => "'{$status}'", $task_status));

        $statuses = $wpdb->get_row(
            <<<SQL
            SELECT
                {$select_columns}
            FROM
                {$wpdb->posts}
            WHERE 
                post_type = {$where_post_type}
            AND
                post_status IN ({$where_task_status_in})
            SQL,
            \ARRAY_A
        );

        array_walk($statuses, function (&$status) {
            $status = (int) $status;
        });

        return $statuses;
    }

    public static function get_featured_categories(string $task_status = 'publish'): array
    {
        global $wpdb;

        $where_post_type = "'" . self::$post_type . "'";

        $where_task_status = "'" . $task_status . "'";;

        $featured_categories = $wpdb->get_results(
            <<<SQL
            SELECT
                terms.name as categoryName,
                terms.slug as categorySlug,
                COUNT(relationships.object_id) as taskCount
            FROM
                {$wpdb->term_relationships} as relationships
            INNER JOIN
                (SELECT
                    ID
                FROM
                    {$wpdb->posts}
                WHERE
                    post_type = {$where_post_type}
                AND
                    post_status = {$where_task_status}
                ) as tasks
            ON
                relationships.object_id = tasks.ID
            INNER JOIN
                (SELECT
                    term_id,
                    term_taxonomy_id,
                    taxonomy
                FROM
                    {$wpdb->term_taxonomy}
                WHERE
                    taxonomy = 'post_tag'
                ) as term_taxonomy
            ON
                relationships.term_taxonomy_id = term_taxonomy.term_taxonomy_id
            LEFT JOIN
                (SELECT
                    term_id,
                    name,
                    slug
                FROM
                    {$wpdb->terms}
                ) as terms
            ON
                term_taxonomy.term_id = terms.term_id
            GROUP BY
                terms.term_id
            ORDER BY
                taskCount
            DESC
            LIMIT
                5
            SQL,
            \ARRAY_A
        );

        array_walk($featured_categories, function (&$category) {
            $category['taskCount'] = (int) $category['taskCount'];
        });

        return $featured_categories;
    }

    public static function update_cache(string $new_status, string $old_status, \WP_Post $post): void
    {
        if ($post->post_type !== 'tasks' || $new_status !== 'publish' && $old_status !== 'publish') {

            return;
        }

        $task_stats_list = self::get_list();
        $task_stats_featured_categories = self::get_featured_categories();

        if (!$task_stats_list || !$task_stats_featured_categories) {

            return;
        }

        $mongo_client = MongoClient::getInstance();

        $collection = $mongo_client->{\Cache::STORAGE_NAME}->{Stats::$collection_name};

        $task_collection_name = self::$child_collection_name;

        $collection->updateOne([], [
            '$set' => [
                "{$task_collection_name}" => [
                    'featuredCategories' => $task_stats_featured_categories,
                    'total'              => $task_stats_list,
                ],
            ],
        ]);
    }
}
