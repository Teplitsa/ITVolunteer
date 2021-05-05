<?php

use ITV\models\Review;
use function ITV\utils\upload_image;

if (!class_exists('\WP_CLI')) {
    return;
}

function load_reviews(): void
{
    $source_file_name = 'reviews.json';

    $source = file_get_contents(get_stylesheet_directory() . '/init/home/' . $source_file_name);

    if (!$source) {
        \WP_CLI::error(sprintf(__('Failed to get the source file: %s.', 'itv-backend'), $source_file_name));
    }

    $reviews = json_decode($source, true);

    if (is_null($reviews)) {
        \WP_CLI::error(sprintf(__('Failed to decode the %s data.', 'itv-backend'), Review::$post_type));
    }

    $inserted_item_count = 0;

    foreach ($reviews as ['title' => $title, 'content' => $content, 'thumbnail' => $thumbnail]) {
        $review_data = [
            'post_type'    => Review::$post_type,
            'post_title'   => $title,
            'post_content' => $content,
            'post_status'  => 'publish',
            'post_author'  => 3442, // admin
        ];

        $review_id = wp_insert_post($review_data, true);

        if (is_wp_error($review_id)) {
            \WP_CLI::error($review_id->get_error_message());
        }

        if ($thumbnail) {
            $thumbnail_id = upload_image(['url' => $thumbnail, 'attached_to' => $review_id, 'desc' => $title]);

            if (is_null($thumbnail_id)) {
                \WP_CLI::error(sprintf(__('Failed to upload an image from url: %s.', 'itv-backend'), $thumbnail));
            }

            if (!set_post_thumbnail($review_id, $thumbnail_id)) {
                \WP_CLI::error(sprintf(__('Failed to set a thumbnail to %s with the ID #%d.', 'itv-backend'), Review::$post_type, $review_id));
            }
        }

        $inserted_item_count++;
    }


    \WP_CLI::success(sprintf(__('%d %s(s) has been successfully loaded.', 'itv-backend'), $inserted_item_count, Review::$post_type));
}

\WP_CLI::add_command('load_reviews', 'load_reviews');
