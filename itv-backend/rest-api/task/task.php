<?php

use \ITV\models\TaskManager;

function task_api_add_routes($server) {

    register_rest_route( 'itv/v1', '/tasks/by-author/(?P<slug>[- _0-9a-zA-Z]+)', [
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

            $request->set_param('author', $user->ID);
            $request->set_route('/wp/v2/tasks');

            return rest_do_request( $request );
        },
    ] );

    register_rest_route( 'itv/v1', '/tasks/by-doer/(?P<slug>[- _0-9a-zA-Z]+)', [
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

            $request->set_param('doer', $user->ID);
            $request->set_route('/wp/v2/tasks');

            return rest_do_request( $request );
        },
    ] );

}
add_action( 'rest_api_init', 'task_api_add_routes' );

function task_api_post_query($args, $request) {
    // filter by status
    $status = $request->get_param('status');
    // error_log("status: " . print_r($status, true) );
    
    if(in_array('any', $status)) {
        $args = array_merge($args, [
            'post_status'       => ['publish', 'in_work', 'closed', 'draft', 'archived'],
            'suppress_filters'  => true,
        ]);
    }

    // filter by doer
    $doer_id = $request->get_param('doer');
    // error_log("doer_id: " . $doer_id);

    if($doer_id) {
        $args = array_merge($args, [
            'connected_type'    => 'task-doers',
            'connected_items'   => $doer_id,
            'connected_meta'    => array(
                array(
                    'key'       =>'is_approved',
                    'value'     => 1,
                    'compare'   => '='
                )
            ),
        ]);
    }

    // error_log("task args: " . print_r($args, true) );

    return $args;
}
add_filter( 'rest_' . TaskManager::$post_type . '_query', 'task_api_post_query', 10, 2 );
