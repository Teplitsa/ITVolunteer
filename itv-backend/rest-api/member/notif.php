<?php

use ITV\models\MemberNotifManager;

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
            
            $on_task = $request->get_param('on_task');
            error_log('on_task:' . $on_task);
            
            $on_task_sql = "";
            if(!empty($on_task)) {
                $on_task = rest_sanitize_boolean( $on_task );
                if($on_task) {
                    $on_task_sql = " AND task_id IS NOT NULL ";
                }
                else {
                    $on_task_sql = " AND task_id IS NULL ";
                }
            }

            global $wpdb;

            $q = $wpdb->prepare("SELECT * FROM {$wpdb->prefix}" . MemberNotifManager::$table . " WHERE user_id = %d {$on_task_sql} ORDER BY created_at DESC LIMIT %d, %d", [$user->ID, $offset, $per_page ]);
            $notif_list = $wpdb->get_results($q);

            $member_notif_manager = new MemberNotifManager();
            $notif_list_count = count($notif_list);
            
            for($i = 0; $i < $notif_list_count; $i++) {
                $notif_list[$i] = MemberNotifManager::type_db_fields( $notif_list[$i] );
                $notif_list[$i] = $member_notif_manager->extend_with_connected_data( $notif_list[$i] );
            }

            return $notif_list;
        },
    ] );

}
add_action( 'rest_api_init', 'notif_api_add_routes' );
