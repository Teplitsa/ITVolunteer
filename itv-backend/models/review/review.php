<?php

namespace ITV\models;

class Review extends Cacheable
{
    public static string $post_type = 'review';
    public static string $collection_name = 'reviews';

    public static function filter_fields(\WP_Post $review): array
    {
        ['ID' => $ID, 'post_title' => $post_title, 'post_content' => $post_content] = (array) $review;

        $thumbnail = \get_the_post_thumbnail_url($ID, [311, 256]);

        return [
            'externalId' => $ID,
            'title'      => $post_title,
            'content'    => $post_content,
            'thumbnail'  => $thumbnail,
        ];
    }
}
