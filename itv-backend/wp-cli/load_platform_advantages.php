<?php

use ITV\models\Advantage;
use function ITV\utils\upload_image;

if (!class_exists('\WP_CLI')) {
    return;
}

function load_platform_advantages(): void
{
    $source_file_name = 'platform-advantages.json';

    $source = file_get_contents(get_theme_file_path() . '/init/home/' . $source_file_name);

    if (!$source) {
        \WP_CLI::error(sprintf(__('Failed to get the source file: %s.', 'itv-backend'), $source_file_name));
    }

    $advantages = json_decode($source, true);

    if (is_null($advantages)) {
        \WP_CLI::error(sprintf(__('Failed to decode the %s data.', 'itv-backend'), Advantage::$post_type));
    }

    $inserted_item_count = 0;

    foreach ($advantages as ['title' => $title, 'content' => $content, 'thumbnail' => $thumbnail, 'tax_input' => $tax_input]) {
        if (!term_exists($tax_input['platform_user_role'], 'platform_user_role')) {
            \WP_CLI::error(sprintf(__('The term with the slug %s does not exist.', 'itv-backend'), $tax_input['platform_user_role']));
        }

        $advantage_data = [
            'post_type'    => Advantage::$post_type,
            'post_title'   => $title,
            'post_content' => $content,
            'post_status'  => 'publish',
            'post_author'  => 3442, // admin
        ];

        $advantage_id = wp_insert_post($advantage_data, true);

        if (is_wp_error($advantage_id)) {
            \WP_CLI::error($advantage_id->get_error_message());
        }

        $thumbnail_id = upload_image(['url' => $thumbnail, 'attached_to' => $advantage_id, 'desc' => $title]);

        if (is_null($thumbnail_id)) {
            \WP_CLI::error(sprintf(__('Failed to upload an image from url: %s.', 'itv-backend'), $thumbnail));
        }

        if (!set_post_thumbnail($advantage_id, $thumbnail_id)) {
            \WP_CLI::error(sprintf(__('Failed to set a thumbnail to %s with the ID #%d.', 'itv-backend'), Advantage::$post_type, $advantage_id));
        }

        if (!wp_set_object_terms($advantage_id, $tax_input['platform_user_role'], 'platform_user_role')) {
            \WP_CLI::error(sprintf(__('Failed to assign a term to the %s with the ID #%d.', 'itv-backend'), Advantage::$post_type, $advantage_id));
        }

        $inserted_item_count++;
    }


    \WP_CLI::success(sprintf(__('%d %s(s) has been successfully loaded.', 'itv-backend'), $inserted_item_count, Advantage::$post_type));
}

\WP_CLI::add_command('load_platform_advantages', 'load_platform_advantages');
