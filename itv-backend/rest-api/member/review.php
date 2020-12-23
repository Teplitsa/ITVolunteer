<?php

function review_api_add_routes($server) {

    register_rest_route( 'itv/v1', '/reviews/for-author/(?P<slug>[- _0-9a-zA-Z]+)', [
        'methods' => WP_REST_Server::ALLMETHODS,
        'callback' => function($request) {
            $slug = $request->get_param('slug');
            $user = get_user_by('slug', $slug);

            if(!$user) {
                return new WP_Error(
                    'rest_itv_member_not_found',
                    __( 'Member not found', 'itv-backend' ),
                    array( 'status' => 404 )
                );
            }

            $page = (int) $request->get_param('page');

            $per_page = (int) $request->get_param('per_page');
            if(!$per_page) {
                $per_page = get_option( 'posts_per_page' );
            }

            $offset = ($page - 1) * $per_page;
            if($offset < 0) {
                $offset = 0;
            }

            global $wpdb;

            $q = $wpdb->prepare("SELECT * FROM {$wpdb->prefix}reviews_author WHERE author_id = %d ORDER BY time_add DESC LIMIT %d, %d", [$user->ID, $offset, $per_page ]);
            $reviews_as_author = $wpdb->get_results($q, ARRAY_A);
            $reviews = [];

            foreach($reviews_as_author as $review) {

                $review['type'] = 'as_author';

                $author = get_user_by( 'id', $review['author_id'] );
                $review['author'] = $author ? itv_get_user_in_gql_format($author) : null;

                $doer = get_user_by( 'id', $review['doer_id'] );
                $review['doer'] = $doer ? itv_get_user_in_gql_format($doer) : null;

                $task = get_post($review['task_id']);
                $review['task'] = $task ? itv_get_ajax_task_short($task) : null;

                $reviews[] = $review;
            }

            return $reviews;
        },
    ] );

    register_rest_route( 'itv/v1', '/reviews/for-doer/(?P<slug>[- _0-9a-zA-Z]+)', [
        'methods' => WP_REST_Server::ALLMETHODS,
        'callback' => function($request) {
            $slug = $request->get_param('slug');
            $user = get_user_by('slug', $slug);

            if(!$user) {
                return new WP_Error(
                    'rest_itv_member_not_found',
                    __( 'Member not found', 'itv-backend' ),
                    array( 'status' => 404 )
                );
            }

            $page = (int) $request->get_param('page');

            $per_page = (int) $request->get_param('per_page');
            if(!$per_page) {
                $per_page = get_option( 'posts_per_page' );
            }

            $offset = ($page - 1) * $per_page;
            if($offset < 0) {
                $offset = 0;
            }

            global $wpdb;

            $q = $wpdb->prepare("SELECT * FROM {$wpdb->prefix}reviews WHERE doer_id = %d ORDER BY time_add DESC LIMIT %d, %d", [$user->ID, $offset, $per_page ]);
            $reviews_as_doer = $wpdb->get_results($q, ARRAY_A);

            $reviews = [];

            foreach($reviews_as_doer as $review) {
                $review['type'] = 'as_doer';

                $author = get_user_by( 'id', $review['author_id'] );
                $review['author'] = $author ? itv_get_user_in_gql_format($author) : null;

                $doer = get_user_by( 'id', $review['doer_id'] );
                $review['doer'] = $doer ? itv_get_user_in_gql_format($doer) : null;

                $task = get_post($review['task_id']);
                $review['task'] = $task ? itv_get_ajax_task_short($task) : null;

                $reviews[] = $review;
            }

            return $reviews;
        },
    ] );

}
add_action( 'rest_api_init', 'review_api_add_routes' );
