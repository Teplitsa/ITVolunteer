<?php

namespace ITV\models;

class News extends Cacheable
{
    public static string $post_type = 'post';
    public static string $collection_name = 'news';

    public static function update_item_cache(int $item_id): void
    { 
        if (\in_category(\__('Материалы', 'itv-backend'), $item_id) === false) {

            return;
        }

        parent::update_item_cache($item_id);
    }

    public static function filter_fields(\WP_Post $news): array
    {
        ['ID' => $ID, 'post_title' => $post_title, 'post_date' => $post_date, 'post_name' => $post_name] = (array) $news;

        return [
            'externalId' => $ID,
            'title'      => $post_title,
            'date'       => \date_i18n('d.m.Y', strtotime($post_date)),
            'permalink'  => "/blog/{$post_name}"
        ];
    }
}
