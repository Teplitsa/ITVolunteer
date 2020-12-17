<?php

use \ITV\models\MemberManager;

function member_role_api_init($server) {

    register_rest_route( 'itv/v1', '/member/(?P<slug>[- _0-9a-zA-Z]+)/itv_role', [
        'methods'   => WP_REST_Server::READABLE,
        'callback'  => function($request) {

            $slug = $request->get_param('slug');
            $user = get_user_by('slug', $slug);

            if(!$user) {
                return new WP_Error(
                    'rest_itv_member_not_found',
                    __( 'Member not found', 'itv-backend' ),
                    array( 'status' => 404 )
                );
            }

            $members = new MemberManager();
            $role = $user ? $members->get_member_itv_role($user->ID) : "";

            return ['itvRole' => $role];
        },
    ] );

    register_rest_route( 'itv/v1', '/member/(?P<slug>[- _0-9a-zA-Z]+)/itv_role', [
        'methods'   => WP_REST_Server::EDITABLE,
        'callback'  => function($request) {

            $slug = $request->get_param('slug');
            $user = get_user_by('slug', $slug);

            if(!$user) {
                return new WP_Error(
                    'rest_itv_member_not_found',
                    __( 'Member not found', 'itv-backend' ),
                    array( 'status' => 404 )
                );
            }

            $role = $request['itv_role'];
            $members = new MemberManager();
            if($user) {
                if($members->validate_itv_role($role)) {
                    $members->set_member_itv_role($user->ID, $role);
                }
                else {
                    $role = get_user_meta($user->ID, MemberManager::$meta_role, true);
                }
            }

            return ['itvRole' => $role];
        },
    ] );
}
add_action( 'rest_api_init', 'member_role_api_init' );
