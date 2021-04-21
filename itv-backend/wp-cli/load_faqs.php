<?php

use ITV\models\Faq;

if (!class_exists('\WP_CLI')) {
    return;
}

function load_faqs(): void
{
    $source_file_name = 'faqs.json';

    $source = file_get_contents(get_theme_file_path() . '/init/home/' . $source_file_name);

    if (!$source) {
        \WP_CLI::error(sprintf(__('Failed to get the source file: %s.', 'itv-backend'), $source_file_name));
    }

    $faqs = json_decode($source, true);

    if (is_null($faqs)) {
        \WP_CLI::error(sprintf(__('Failed to decode the %s data.', 'itv-backend'), Faq::$post_type));
    }

    $inserted_item_count = 0;

    foreach ($faqs as ['title' => $title, 'content' => $content, 'tax_input' => $tax_input]) {
        if (!term_exists($tax_input['platform_user_role'], 'platform_user_role')) {
            \WP_CLI::error(sprintf(__('The term with the slug %s does not exist.', 'itv-backend'), $tax_input['platform_user_role']));
        }

        $faq_data = [
            'post_type'    => Faq::$post_type,
            'post_title'   => $title,
            'post_content' => $content,
            'post_status'  => 'publish',
            'post_author'  => 3442, // admin
        ];

        $faq_id = wp_insert_post($faq_data, true);

        if (is_wp_error($faq_id)) {
            \WP_CLI::error($faq_id->get_error_message());
        }

        if (!wp_set_object_terms($faq_id, $tax_input['platform_user_role'], 'platform_user_role')) {
            \WP_CLI::error(sprintf(__('Failed to assign a term to the %s with the ID #%d.', 'itv-backend'), Faq::$post_type, $faq_id));
        }

        $inserted_item_count++;
    }


    \WP_CLI::success(sprintf(__('%d %s(s) has been successfully loaded.', 'itv-backend'), $inserted_item_count, Faq::$post_type));
}

\WP_CLI::add_command('load_faqs', 'load_faqs');
