<?php

namespace ITV\models;

class Faq extends Cacheable
{
    public static string $post_type = 'faq';
    public static string $collection_name = 'faqs';

    public static function filter_fields(\WP_Post $faq): array
    {
        ['ID' => $ID, 'post_title' => $post_title, 'post_content' => $post_content] = (array) $faq;

        $user_role = \wp_get_object_terms($ID, 'platform_user_role',  array('fields' => 'slugs'));

        $user_role = $user_role ? array_shift($user_role) : "";

        return [
            'externalId' => $ID,
            'title'      => $post_title,
            'content'    => $post_content,
            'userRole'   => $user_role
        ];
    }
}
