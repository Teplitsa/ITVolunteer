<?php

namespace ITV\api\Member;

use \ITV\models\MemberManager;

class RatingLIst {
    private static $query_id = 'ratingList';

    public static function add_routes($server) {
        error_log('register_rest_route...');

        register_rest_route( 'itv/v1', '/member/' . self::$query_id . '/(?P<role>[a-z]+)', [
            'methods' => \WP_REST_Server::READABLE,
            'callback' => function($request) {
                $role = $request->get_param('role');

                $request->set_param('query_id', self::$query_id);
                $request->set_param('role', $role);

                $request->set_route('/wp/v2/users');
                return rest_do_request( $request );
            },
        ] );
    
    }

    public static function customize_query($args, $request) {
        $role = $request->get_param('role');
        $query_id = $request->get_param('query_id');
        error_log("query_id: " . $query_id );
        error_log("role: " . $role );

        if($query_id !== self::$query_id) {
            return $args;
        }

        if(in_array($role, [MemberManager::$ROLE_DOER, MemberManager::$ROLE_AUTHOR])) {
            $args = array_merge($args, [
                'meta_query' => [
                    [
                        'key' => MemberManager::$meta_role,
                        'value' => $role,
                    ],
                ],
            ]);
        }
        
        // if(in_array('any', $status) || $request->get_param('slug')) {
        //     $args = array_merge($args, [
        //         'post_status'       => ['publish', 'in_work', 'closed', 'draft', 'archived'],
        //         'suppress_filters'  => true,
        //     ]);
        // }
    
        // // filter by doer
        // $doer_id = $request->get_param('doer');
        // // error_log("doer_id: " . $doer_id);
    
        // if($doer_id) {
        //     $args = array_merge($args, [
        //         'connected_type'    => 'task-doers',
        //         'connected_items'   => $doer_id,
        //         'connected_meta'    => array(
        //             array(
        //                 'key'       =>'is_approved',
        //                 'value'     => 1,
        //                 'compare'   => '='
        //             )
        //         ),
        //     ]);
        // }
    
        error_log("task args: " . print_r($args, true) );
    
        return $args;
    }
}

add_action( 'rest_api_init', '\ITV\api\Member\RatingLIst::add_routes' );
add_filter( 'rest_user_query', '\ITV\api\Member\RatingLIst::customize_query', 10, 2 );
