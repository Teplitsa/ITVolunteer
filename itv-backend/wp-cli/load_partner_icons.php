<?php

use ITV\models\{PartnerIcon};
use function ITV\utils\upload_image;

if (!class_exists('\WP_CLI')) {
    return;
}

function load_partner_icons()
{
    $source = file_get_contents(get_stylesheet_directory() . '/init/partner_icons/partner_icons.json');

    if (!$source) {
        \WP_CLI::error(sprintf(__('Failed to get the source file: %s.', 'itv-backend'), $source));
    }

    $partners = json_decode($source, true);

    if (is_null($partners)) {
        \WP_CLI::error(sprintf(__('Failed to decode the %s data.', 'itv-backend'), Partner::$post_type));
    }

    $inserted_item_count = 0;

    foreach ($partners as ['title' => $title, 'content' => $content, 'thumbnail' => $thumbnail]) {
        $partner_data = [
            'post_type'    => PartnerIcon::$post_type,
            'post_title'   => $title,
            'post_content' => $content,
            'post_status'  => 'publish',
        ];

        $post_id = wp_insert_post($partner_data, true);

        if (is_wp_error($post_id)) {
            \WP_CLI::error($post_id->get_error_message());
        }

        if ($thumbnail) {

            $thumbnail_id = upload_image(['url' => $thumbnail, 'attached_to' => $post_id, 'desc' => $title]);

            if (is_null($thumbnail_id)) {
                \WP_CLI::error(sprintf(__('Failed to upload an image from url: %s.', 'itv-backend'), $thumbnail));
            }

            if (!set_post_thumbnail($post_id, $thumbnail_id)) {
                \WP_CLI::error(sprintf(__('Failed to set a thumbnail to %s with the ID #%d.', 'itv-backend'), PartnerIcon::$post_type, $post_id));
            }
        }

        $inserted_item_count++;
    }


    \WP_CLI::success(sprintf(__('%d %s(s) has been successfully loaded.', 'itv-backend'), $inserted_item_count, PartnerIcon::$post_type));
}

\WP_CLI::add_command('load_partner_icons', 'load_partner_icons');
