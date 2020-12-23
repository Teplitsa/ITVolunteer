<?php

use ITV\models\MemberNotifManager;

function notif_api_add_routes($server) {

    register_rest_route( 'itv/v1', '/user-notif', [
        'methods' => WP_REST_Server::READABLE,
        'callback' => function($request) {
            global $wpdb;

            $user = wp_get_current_user();
            
            if(!$user->ID) {
                return new WP_Error(
                    'rest_forbidden_view_itv_notif',
                    __( 'Sorry, you are not allowed to view notifications.', 'itv-backend' ),
                    array( 'status' => rest_authorization_required_code() )
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
            
            $filter = $request->get_param('filter');
            $on_task_sql = "";
            if(!!$filter && $filter !== "all") {
                
                if($filter === "project") {
                    $on_task_sql = " AND task_id IS NOT NULL ";
                }
                else {
                    $on_task_sql = " AND task_id IS NULL ";
                }
            }

            $is_read = $request->get_param('is_read');
            $is_read_sql = "";
            if(strlen($is_read)) {
                $is_read = rest_sanitize_boolean( $is_read );
                $is_read_sql = $wpdb->prepare( " AND is_read = %d ", [ intval( $is_read ) ] );
            }
            
            $q = $wpdb->prepare("SELECT * FROM {$wpdb->prefix}" . MemberNotifManager::$table . " WHERE user_id = %d {$on_task_sql} {$is_read_sql} ORDER BY created_at DESC LIMIT %d, %d", [$user->ID, $offset, $per_page ]);
            $notif_list = $wpdb->get_results($q);

            $member_notif_manager = new MemberNotifManager();
            $notif_list_count = count($notif_list);
            
            for($i = 0; $i < $notif_list_count; $i++) {
                $notif_list[$i] = MemberNotifManager::type_db_fields( $notif_list[$i] );
                $notif_list[$i] = $member_notif_manager->extend_with_connected_data( $notif_list[$i] );
                $notif_list[$i] = $member_notif_manager->add_markup( $notif_list[$i], $user );
            }

            return $notif_list;
        },
    ] );

    register_rest_route( 'itv/v1', '/user-notif/stats', [
        'methods' => WP_REST_Server::READABLE,
        'callback' => function($request) {
            global $wpdb;

            $user = wp_get_current_user();
            
            if(!$user->ID) {
                return new WP_Error(
                    'rest_forbidden_view_itv_notif',
                    __( 'Sorry, you are not allowed to view notifications.', 'itv-backend' ),
                    array( 'status' => rest_authorization_required_code() )
                );                
            }

            $count_sql = "SELECT COUNT(*) FROM {$wpdb->prefix}" . MemberNotifManager::$table . " WHERE user_id = %d ";

            $q = $wpdb->prepare("{$count_sql} AND task_id IS NOT NULL ", [$user->ID]);
            $notif_count_on_task = intval($wpdb->get_var($q));

            $q = $wpdb->prepare("{$count_sql} AND task_id IS NULL ", [$user->ID]);
            $notif_count_info = intval($wpdb->get_var($q));

            return [
                'project'   => $notif_count_on_task,
                'info'      => $notif_count_info,
            ];
        },
    ] );

}
add_action( 'rest_api_init', 'notif_api_add_routes' );
