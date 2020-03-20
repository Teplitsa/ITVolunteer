<?php

use \WPGraphQL\AppContext;
use \WPGraphQL\Data\DataSource;

add_filter('graphql_app_context_config', 'itv_graphql_app_context_config');
function itv_graphql_app_context_config($config) {
    return $config;
}

add_filter('graphql_data_loaders', 'itv_graphql_data_loaders', 10, 2);
function itv_graphql_data_loaders($loaders, $context) {
    return $loaders;
}

// tasks
add_action( 'graphql_register_types', 'itv_register_task_graphql_fields' );
function itv_register_task_graphql_fields() {
    register_graphql_fields(
        'Task',
        [
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
        ]
    );
}

// users
add_action( 'graphql_register_types', 'itv_register_user_graphql_fields' );
function itv_register_user_graphql_fields() {
    register_graphql_fields(
        'User',
        [
            'profileURL' => [
                'type' => 'String',
                'description' => __( 'User profile URL', 'tst' ),
                'resolve' => function ($user) {
                    return tst_get_member_url( $user->userId );
                }
            ],
            'fullName' => [
                'type' => 'String',
                'description' => __( 'User profile URL', 'tst' ),
                'resolve' => function ($user) {
                    return tst_get_member_name( $user->userId );
                }
            ],
            'itvAvatar' => [
                'type' => 'String',
                'description' => __( 'User profile URL', 'tst' ),
                'resolve' => function ($user) {
                    return itv_avatar_url( $user->userId );
                }
            ],
            'memberRole' => [
                'type' => 'String',
                'description' => __( 'User role (hero, volunteer, donee or activist)', 'tst' ),
                'resolve' => function ($user) {
                    return tst_get_member_role_name( $user->userId );
                }
            ],
            'solvedTasksCount' => [
                'type' => 'Int',
                'description' => __( 'Number of tasks user solved as DOER', 'tst' ),
                'resolve' => function ($user) {
                    $key = 'solved';
                    $activity = tst_get_member_activity( $user->userId, $key );
                    return $activity[$key];
                }
            ],
            'authorReviewsCount' => [
                'type' => 'Int',
                'description' => __( 'User author reviews count', 'tst' ),
                'resolve' => function ($user) {
                    return ItvReviewsAuthor::instance()->count_author_reviews( $user->userId );
                }
            ],
            'doerReviewsCount' => [
                'type' => 'Int',
                'description' => __( 'User doer reviews count', 'tst' ),
                'resolve' => function ($user) {
                    return ItvReviews::instance()->count_doer_reviews( $user->userId );
                }
            ],
            'organizationName' => [
                'type' => 'String',
                'description' => __( 'User organization', 'tst' ),
                'resolve' => function ($user) {
                    return tst_get_member_field( 'user_workplace', $user->userId );
                }
            ],
            'organizationDescription' => [
                'type' => 'String',
                'description' => __( 'User organization description', 'tst' ),
                'resolve' => function ($user) {
                    return tst_get_member_field( 'user_workplace_desc', $user->userId );
                }
            ],
            'organizationLogo' => [
                'type' => 'String',
                'description' => __( 'User organization logo', 'tst' ),
                'resolve' => function ($user) {
                    return tst_get_member_user_company_logo_src( $user->userId );
                }
            ]
        ]
    );
}

add_action( 'graphql_register_types', 'itv_register_doers_graphql_query' );
function itv_register_doers_graphql_query() {
    register_graphql_field(
        'RootQuery',
        'taskDoers',
        [
            'description' => __( 'Task doers', 'tst' ),
            'type' => [ 'list_of' => 'User' ],
            'args'        => [
                'taskId'     => [
                    'type' => [
                        'non_null' => 'ID',
                    ],
                ],
            ],
            'resolve' => function($source, array $args, AppContext $context) {
                $doers = tst_get_task_doers($args['taskId'], false);
                $users = [];
                foreach($doers as $doer) {
                    $users[] = \WPGraphQL\Data\DataSource::resolve_user( $doer->ID, $context );
                }
                return $users;
            },
        ]
    );
}

add_action( 'graphql_register_types', 'itv_register_comment_author_graphql_fields' );
function itv_register_comment_author_graphql_fields() {
    register_graphql_fields(
        'commentAuthor',
        [
            'itvAvatar' => [
                'type'        => 'String',
                'description' => __( 'ITV avatar', 'tst' ),
                'resolve'     => function( $commentAuthor ) {
                    #return get_template_directory_uri() . '/assets/img/temp-avatar.png';
                    return "https://www.gravatar.com/avatar/".md5(strtolower(trim($commentAuthor->email)))."?s=180&d=404";
                },
            ],
            'fullName' => [
                'type'        => 'String',
                'description' => __( 'Full name', 'tst' ),
                'resolve'     => function( $commentAuthor ) {
                    return $commentAuthor->name;
                },
            ],
        ]
    );
}
