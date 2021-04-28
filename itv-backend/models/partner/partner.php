<?php

namespace ITV\models;

class Partner extends Cacheable
{
    public static string $post_type = 'platform_partner';
    public static string $collection_name = 'partners';

    public static function filter_fields(\WP_Post $partner): array
    {
        ['ID' => $ID, 'post_title' => $post_title, 'post_content' => $post_content] = (array) $partner;

        $thumbnail = \get_the_post_thumbnail_url($ID, 'thumbnail');

        return [
            'externalId' => $ID,
            'title'      => $post_title,
            'content'    => $post_content,
            'thumbnail'  => $thumbnail,
        ];
    }
}
