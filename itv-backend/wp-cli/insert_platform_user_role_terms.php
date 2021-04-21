<?php

if (!class_exists('WP_CLI')) {
    return;
}

function insert_platform_user_role_term(string $term_slug, string $term_name): void
{
    $the_term = term_exists($term_slug, 'platform_user_role');

    if (!$the_term) {

        $the_term = wp_insert_term(
            $term_name,
            'platform_user_role',
            ['slug' => $term_slug]
        );

        if (is_wp_error($the_term)) {

            WP_CLI::error(sprintf(__('Failed to insert the %s term.'), $term_slug));
        }

        WP_CLI::log(sprintf(__('The %s term has been inserted with the term_id: %d.', 'itv-backend'), $term_slug, $the_term['term_id']));
    }
}

function insert_platform_user_role_terms(): void
{
    insert_platform_user_role_term('volunteer', __('Волонтёр', 'itv-backend'));
    insert_platform_user_role_term('author', __('Автор', 'itv-backend'));

    WP_CLI::success('Platform user role terms has been successfully inserted.');
}

WP_CLI::add_command('insert-platform-user-role-terms', 'insert_platform_user_role_terms');
