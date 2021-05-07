<?php

namespace ITV\models;

abstract class AbstractCacheable
{
    public static string $post_type = '';
    public static string $collection_name = '';

    abstract public static function update_item_cache(int $item_id): void;
    abstract public static function delete_item_cache(int $item_id): void;
    abstract protected static function check_validity(int $item_id): ?array;
    abstract protected static function filter_fields(\WP_Post $item): array;
    abstract public static function get_item(int $item_id): ?array;
    abstract public static function get_list(): ?array;
}

class Cacheable extends AbstractCacheable
{
    public static function update_item_cache(int $item_id): void
    {
        $item = self::check_validity($item_id);

        $mongo_client = MongoClient::getInstance();

        $collection = $mongo_client->{\ITV\models\CacheManager::STORAGE_NAME}->{static::$collection_name};

        if (is_null($item)) {

            $deleteCacheResult = $collection->findOneAndDelete(['externalId' => $item_id]);

            if (is_null($deleteCacheResult)) {

                trigger_error(sprintf(__('No %s found to delete.', 'itv-backend'), static::$post_type), E_USER_WARNING);
            }
        } else {

            $updateCacheResult = $collection->findOneAndUpdate(['externalId' => $item_id], ['$set' => $item]);

            // No item found to update.

            if (is_null($updateCacheResult)) {

                $collection->insertOne($item);
            }
        }
    }

    public static function delete_item_cache(int $item_id): void
    {
        if (\get_post_type($item_id) !== static::$post_type) return;

        $mongo_client = MongoClient::getInstance();

        $collection = $mongo_client->{\ITV\models\CacheManager::STORAGE_NAME}->{static::$collection_name};

        $deleteCacheResult = $collection->findOneAndDelete(['externalId' => $item_id]);

        // No item found to delete.

        if (is_null($deleteCacheResult)) {

            trigger_error(sprintf(__('No %s found to delete.', 'itv-backend'), static::$post_type), E_USER_WARNING);
        }
    }

    public static function check_validity(int $item_id): ?array
    {
        if (!is_numeric($item_id)) {

            trigger_error(sprintf(__('A valid %s ID is required.', 'itv-backend'), static::$post_type), E_USER_WARNING);

            return null;
        }

        $item_id = (int) $item_id;

        $item = self::get_item($item_id);

        if (is_null($item)) {

            trigger_error(sprintf(__('No %s found for the given ID.', 'itv-backend'), static::$post_type), E_USER_WARNING);

            return null;
        }

        if (\get_post_status($item_id) !== "publish") {

            trigger_error(sprintf(__('The %s is not a public.', 'itv-backend'), static::$post_type), E_USER_WARNING);

            return null;
        }

        return $item;
    }

    public static function filter_fields(\WP_Post $advantage): array
    {
        return [];
    }

    public static function get_item(int $item_id): ?array
    {
        $item = \get_post($item_id);

        if (!is_null($item)) {
            $item = static::filter_fields($item);
        }

        return $item;
    }

    public static function get_list(): ?array
    {
        $list = [];

        $query_args = [
            'post_type' => static::$post_type,
            'post_status' => 'publish',
            'posts_per_page' => -1,
        ];

        $items = new \WP_Query($query_args);

        if ($items->found_posts === 0) return null;

        foreach ($items->posts as $item) {
            $list[] = static::filter_fields($item);
        }

        return $list;
    }
}
