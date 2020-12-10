<?php

use \ITV\models\MemberManager;

function member_role_api_init($server) {

    register_rest_route( 'itv/v1', '/member/(?P<slug>[- _0-9a-zA-Z]+)/itvRole', [
        'methods'   => WP_REST_Server::READABLE,
        'callback'  => function($request) {

            $slug = $request->get_param('slug');
            $user = get_user_by('slug', $slug);

            $members = new MemberManager();
            $role = $user ? $members->get_member_role($user->ID) : "";

            return ['role' => $role];
        },
    ] );

    register_rest_route( 'itv/v1', '/member/(?P<slug>[- _0-9a-zA-Z]+)/itvRole', [
        'methods'   => WP_REST_Server::EDITABLE,
        'callback'  => function($request) {

            $slug = $request->get_param('slug');
            $user = get_user_by('slug', $slug);

            $role = $request['itv_role'];
            $members = new MemberManager();
            if($user) {
                if($members->validate_role($role)) {
                    update_user_meta($user->ID, MemberManager::$meta_role, $role);
                }
                else {
                    $role = get_user_meta($user->ID, MemberManager::$meta_role, true);
                }
            }

            return ['role' => $role];
        },
    ] );
}
add_action( 'rest_api_init', 'member_role_api_init' );
