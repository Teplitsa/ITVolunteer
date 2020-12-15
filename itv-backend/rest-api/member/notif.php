<?php

function notif_api_add_routes($server) {

    register_rest_route( 'itv/v1', '/user-notif/(?P<slug>[- _0-9a-zA-Z]+)', [
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

            $q = $wpdb->prepare("SELECT * FROM {$wpdb->prefix}itv_user_notif WHERE user_id = %d ORDER BY created_at DESC LIMIT %d, %d", [$user->ID, $offset, $per_page ]);
            $notif_list = $wpdb->get_results($q, ARRAY_A);

            return $notif_list;
        },
    ] );

}
add_action( 'rest_api_init', 'notif_api_add_routes' );
