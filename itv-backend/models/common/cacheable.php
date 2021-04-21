<?php

namespace ITV\models;

abstract class AbstractCacheable
{
    public static string $post_type = '';
    public static string $collection_name = '';

    abstract public static function update_item_cache(int $item_id): void;
    abstract public static function delete_item_cache(int $item_id, \WP_Post $item): void;
    abstract protected static function check_validity(int $item_id): array;
    abstract protected static function filter_fields(\WP_Post $item): array;
    abstract public static function get_item(int $item_id): ?array;
    abstract public static function get_list(): ?array;
}

class Cacheable extends AbstractCacheable
{
    public static function update_item_cache(int $item_id): void
    {
        if (\get_post_status($item_id) === 'trash') return;

        $item = self::check_validity($item_id);

        $mongo_client = MongoClient::getInstance();

        $collection = $mongo_client->{\Cache::STORAGE_NAME}->{static::$collection_name};

        $updateCacheResult = $collection->findOneAndUpdate(['externalId' => $item_id], ['$set' => $item]);

        // No item found to update.

        if (is_null($updateCacheResult)) {

            $collection->insertOne($item);
        }
    }

    public static function delete_item_cache(int $item_id, \WP_Post $item): void
    {
        if ($item->post_type !== static::$post_type) return;

        $mongo_client = MongoClient::getInstance();

        $collection = $mongo_client->{\Cache::STORAGE_NAME}->{static::$collection_name};

        $deleteCacheResult = $collection->findOneAndDelete(['externalId' => $item_id]);

        // No item found to delete.

        if (is_null($deleteCacheResult)) {

            throw new \Exception(sprintf(__('No %s found to delete.', 'itv-backend'), static::$post_type));
        }
    }

    public static function check_validity(int $item_id): array
    {
        if (!is_numeric($item_id)) {

            throw new \Exception(sprintf(__('A valid %s ID is required.', 'itv-backend'), static::$post_type));
        }

        $item_id = (int) $item_id;

        $item = self::get_item($item_id);

        if (is_null($item)) {

            throw new \Exception(sprintf(__('No %s found for the given ID.', 'itv-backend'), static::$post_type));
        }

        if (\get_post_status($item_id) !== "publish") {

            throw new \Exception(sprintf(__('The %s is not a public.', 'itv-backend'), static::$post_type));
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
