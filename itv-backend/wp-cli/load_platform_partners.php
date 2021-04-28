<?php

use ITV\models\Partner;
use function ITV\utils\upload_image;

if (!class_exists('\WP_CLI')) {
    return;
}

function load_platform_partners(): void
{
    $source_file_name = 'platform-partners.json';

    $source = file_get_contents(get_stylesheet_directory() . '/init/home/' . $source_file_name);

    if (!$source) {
        \WP_CLI::error(sprintf(__('Failed to get the source file: %s.', 'itv-backend'), $source_file_name));
    }

    $partners = json_decode($source, true);

    if (is_null($partners)) {
        \WP_CLI::error(sprintf(__('Failed to decode the %s data.', 'itv-backend'), Partner::$post_type));
    }

    $inserted_item_count = 0;

    foreach ($partners as ['title' => $title, 'content' => $content, 'thumbnail' => $thumbnail]) {
        $partner_data = [
            'post_type'    => Partner::$post_type,
            'post_title'   => $title,
            'post_content' => $content,
            'post_status'  => 'publish',
            'post_author'  => 3442, // admin
        ];

        $partner_id = wp_insert_post($partner_data, true);

        if (is_wp_error($partner_id)) {
            \WP_CLI::error($partner_id->get_error_message());
        }

        $thumbnail_id = upload_image(['url' => $thumbnail, 'attached_to' => $partner_id, 'desc' => $title]);

        if (is_null($thumbnail_id)) {
            \WP_CLI::error(sprintf(__('Failed to upload an image from url: %s.', 'itv-backend'), $thumbnail));
        }

        if (!set_post_thumbnail($partner_id, $thumbnail_id)) {
            \WP_CLI::error(sprintf(__('Failed to set a thumbnail to %s with the ID #%d.', 'itv-backend'), Partner::$post_type, $partner_id));
        }

        $inserted_item_count++;
    }


    \WP_CLI::success(sprintf(__('%d %s(s) has been successfully loaded.', 'itv-backend'), $inserted_item_count, Partner::$post_type));
}

\WP_CLI::add_command('load_platform_partners', 'load_platform_partners');
