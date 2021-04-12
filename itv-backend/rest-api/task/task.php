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


function task_api_register_fields($server) {
    $task_fields = [
        'viewsCount' => [
            'type'        => 'Int',
            'description' => __( 'Task views count', 'tst' ),
            'resolve'     => function( $task ) {
                return pvc_get_post_views($task->ID);
            },
        ],
        'doerCandidatesCount' => [
            'type'        => 'Int',
            'description' => __( 'Task doer candidates count', 'tst' ),
            'resolve'     => function( $task ) {
                return tst_get_task_doers_count($task->ID);
            },
        ],
        'reviewsDone' => [
            'type'        => 'Bool',
            'description' => __( 'Author and doer left reviews', 'tst' ),
            'resolve'     => function( $task, $args, $context ) {
                $task_doers = tst_get_task_doers($task->ID, true);
                $reviewForAuthor = ItvReviewsAuthor::instance()->get_review_for_author_and_task($task->post_author, $task->ID);
                $reviewForDoer = count($task_doers) > 0 ? ItvReviews::instance()->get_review_for_doer_and_task($task_doers[0]->ID, $task->ID) : null;
                return !!$reviewForAuthor && !!$reviewForDoer;
            },
        ],
        'nextTaskSlug' => [
            'type'        => 'String',
            'description' => __( 'Next task slug', 'tst' ),
            'resolve'     => function( $task, $args, $context ) {
                $tasks_query = new WP_Query(array(
                    'post_type'      => 'tasks',
                    'post_status'    => array('publish'),
                    'posts_per_page' => 1,
                    'author__not_in' => array(ACCOUNT_DELETED_ID),
                    'post__not_in' => array($task->ID),
                    'date_query' => array(
                        array(
                            'before'     => $task->post_date,
                        ),
                    ),
                ));
                
                $posts = $tasks_query->get_posts();
                $nextPost = !empty($posts) ? $posts[0] : null;
                
                return $nextPost ? $nextPost->post_name : "";
            },
        ],
        'isApproved' => [
            'type'        => 'Bool',
            'description' => __( 'Is approved by admin', 'tst' ),
            'resolve'     => function( $task, $args, $context ) {
                return boolval(get_post_meta($task->ID, 'itv-approved', true));
            },
        ],
        'pemalinkPath' => [
            'type'        => 'String',
            'resolve'     => function( $task, $args, $context ) {
                return str_replace(site_url(), "", get_permalink($task->ID));
            },
        ],
        'nonceContactForm' => [
            'type'        => 'String',
            'description' => __( 'Contact form nonce', 'tst' ),
            'resolve'     => function( $task, $args, $context ) {
                return wp_create_nonce('we-are-receiving-a-letter-goshujin-sama');
            },
        ],
        'hasCloseSuggestion' => [
            'type'        => 'String',
            'resolve'     => function( $task, $args, $context ) {
                return false;
            },
        ],
        'result' => [
            'type'        => 'String',
            'resolve'     => function( $task, $args, $context ) {
                return get_post_meta($task->ID, 'result', true);
            },
        ],
        'resultHtml' => [
            'type'        => 'String',
            'resolve'     => function( $task, $args, $context ) {
                $text = get_post_meta($task->ID, 'result', true);
                $text = itv_urls2links($text);
                return $text;
            },
        ],
        'impact' => [
            'type'        => 'String',
            'resolve'     => function( $task, $args, $context ) {
                return get_post_meta($task->ID, 'impact', true);
            },
        ],
        'impactHtml' => [
            'type'        => 'String',
            'resolve'     => function( $task, $args, $context ) {
                $text = get_post_meta($task->ID, 'impact', true);
                $text = itv_urls2links($text);
                return $text;
            },
        ],
        'contentHtml' => [
            'type'        => 'String',
            'resolve'     => function( $task, $args, $context ) {
                $text = $task->body;
                $text = itv_urls2links($text);
                return $text;
            },
        ],
        'references' => [
            'type'        => 'String',
            'resolve'     => function( $task, $args, $context ) {
                return get_post_meta($task->ID, 'references', true);
            },
        ],
        'referencesHtml' => [
            'type'        => 'String',
            'resolve'     => function( $task, $args, $context ) {
                $refs = get_post_meta($task->ID, 'references', true);
                $refs = itv_urls2links($refs);
                return $refs;
            },
        ],
        'referencesList' => [
            'type'        => [ 'list_of' => 'String' ],
            'resolve'     => function( $task, $args, $context ) {
                $refs = get_post_meta($task->ID, 'references', true);
                preg_match_all("/(http[s]?:\/\/\S*)/", $refs, $matches);
                return $matches[1];
            },
        ],
        'externalFileLinks' => [
            'type'        => 'String',
            'resolve'     => function( $task, $args, $context ) {
                return get_post_meta($task->ID, 'externalFileLinks', true);
            },
        ],
        'externalFileLinksList' => [
            'type'        => [ 'list_of' => 'String' ],
            'resolve'     => function( $task, $args, $context ) {
                $links = get_post_meta($task->ID, 'externalFileLinks', true);
                preg_match_all("/(http[s]?:\/\/\S*)/", $links, $matches);
                return $matches[1];
            },
        ],
        'preferredDoers' => [
            'type'        => 'String',
            'resolve'     => function( $task, $args, $context ) {
                return get_post_meta($task->ID, 'preferredDoers', true);
            },
        ],
        'preferredDuration' => [
            'type'        => 'String',
            'resolve'     => function( $task, $args, $context ) {
                return get_post_meta($task->ID, 'preferredDuration', true);
            },
        ],
        'coverImgSrcLong' => [
            'type'        => 'String',
            'resolve'     => function( $task, $args, $context ) {
                return itv_get_task_cover_image_src($task->ID, 'medium_large');
            },
        ],
        'deadline' => [
            'type'        => 'String',
            'resolve'     => function( $task, $args, $context ) {
                return itv_get_task_deadline_date($task->ID, $task->post_date);
            },
        ],
        'files' => [
            'type'        => [ 'list_of' => 'String' ],
            'resolve'     => function( $task, $args, $context ) {
                return get_post_meta($task->ID, 'files', true);
            },
        ],
        'authorSlug' => [
            'type'        => 'String',
            'resolve'     => function( $task, $args, $context ) {
                return get_the_author_meta('nicename', $task->author);
            },
        ],
    ];

    foreach ($task_fields as $field_name => $field) {

        register_rest_field( TaskManager::$post_type, $field_name, [ 
            'get_callback' => function($response_data, $property_name, $request) use ($field) {
                $task = get_post($response_data['id']);
                return $field['resolve']($task, [], null);
            }, 
            'context' => [ 'view', 'edit', 'embed' ],
        ] );
    }
    
}
add_action( 'rest_api_init', 'task_api_register_fields', 11 );

function task_api_fix_seo_integration($server) {

    global $wp_rest_additional_fields;

    // remove yoast fields for portfolio_action
    $wp_rest_additional_fields[ TaskManager::$post_type ][ 'yoast_head' ]['context'] = [ 'edit', 'embed' ];
}
add_action( 'rest_api_init', 'task_api_fix_seo_integration', 11 );
