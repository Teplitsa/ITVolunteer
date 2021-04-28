<?php

namespace ITV\models;

class Advantage extends Cacheable
{
    public static string $post_type = 'platform_advantage';
    public static string $collection_name = 'advantages';

    public static function filter_fields(\WP_Post $advantage): array
    {
        ['ID' => $ID, 'post_title' => $post_title, 'post_content' => $post_content] = (array) $advantage;

        $thumbnail = \get_the_post_thumbnail_url($ID, 'thumbnail');

        $user_role = \wp_get_object_terms($ID, 'platform_user_role',  array('fields' => 'slugs'));

        $user_role = $user_role ? array_shift($user_role) : "";

        return [
            'externalId' => $ID,
            'title'      => $post_title,
            'content'    => $post_content,
            'thumbnail'  => $thumbnail,
            'userRole'   => $user_role
        ];
    }
}
