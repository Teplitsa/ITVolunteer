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
        $website = \get_post_meta($ID, PartnerAdminUI::$field_name, true);

        return [
            'externalId' => $ID,
            'title'      => $post_title,
            'content'    => $post_content,
            'thumbnail'  => $thumbnail,
            'website'    => $website
        ];
    }
}

class PartnerAdminUI
{
    public static string $field_name = 'platform_partner_link';

    public static function add_metabox(): void
    {
        \add_meta_box(
            self::$field_name,
            \__('Website', 'itv-backend'),
            [__CLASS__, 'add_control'],
            Partner::$post_type,
            'side',
            'default'
        );
    }

    public static function  add_control(): void
    {
        global $post;

        \wp_nonce_field(basename(__FILE__), self::$field_name . '_nonce');

        $link = \esc_textarea(\get_post_meta($post->ID, self::$field_name, true));

        $input_name = self::$field_name;
        $input_placeholder = \__('https://example.org', 'itv-backend');

        echo <<<HTML
            <input 
                type="url"
                name="{$input_name}"
                value="{$link}"
                placeholder="{$input_placeholder}"
                class="components-text-control__input"
            />
        HTML;
    }

    public static function save_meta_data(int $post_id, \WP_Post $post): ?int
    {

        if (!\current_user_can('edit_post', $post_id)) {

            return null;
        }

        if (!isset($_POST[self::$field_name . '_nonce']) || !\wp_verify_nonce($_POST[self::$field_name . '_nonce'], basename(__FILE__))) {

            return null;
        }

        if ($post->post_type === 'revision') {

            return null;
        }

        $link = \esc_textarea($_POST[self::$field_name]);

        if (!filter_var($link, FILTER_VALIDATE_URL)) {

            return null;
        }

        $meta_data[self::$field_name] = $link;

        foreach ($meta_data as $key => $value) {

            if ($value) {

                return \update_post_meta($post_id, $key, $value) ? $post_id : null;
            } else {

                return \delete_post_meta($post_id, $key) ? $post_id : null;
            }
        }
    }
}
