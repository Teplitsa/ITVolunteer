<?php
require get_template_directory().'/graphql/ItvModel.php';
require get_template_directory().'/graphql/ItvConnection.php';
require get_template_directory().'/graphql/Loader.php';
require get_template_directory().'/graphql/ItvDataSource.php';

use \GraphQL\Type\Definition\ResolveInfo;
use GraphQLRelay\Relay;
use \WPGraphQL\AppContext;
use \WPGraphQL\Data\DataSource;

add_filter('graphql_app_context_config', 'itv_graphql_app_context_config');
function itv_graphql_app_context_config($config) {
    return $config;
}

add_filter('graphql_data_loaders', 'itv_graphql_data_loaders', 10, 2);
function itv_graphql_data_loaders($loaders, $context) {
    $loaders['itvComment'] = new \ITV\GraphQL\Data\Loader\ItvCommentLoader($context);
    $loaders['itvUser'] = new \ITV\GraphQL\Data\Loader\ItvUserLoader($context);
    return $loaders;
}

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

add_action( 'graphql_register_types', 'itv_register_itvComment_graphql_type' );
function itv_register_itvComment_graphql_type() {
    register_graphql_field(
        'RootQuery',
        'itvComment',
        [
            'description' => __( 'Task comment', 'tst' ),
            'type' => 'ItvComment',
            'args'        => [
                'id'     => [
                    'type' => [
                        'non_null' => 'ID',
                    ],
                ],
            ],
            'resolve' => function($source, array $args, AppContext $context) {
                $id_components = Relay::fromGlobalId( $args['id'] );
                return ITV\GraphQL\Data\ItvDataSource\ItvDataSource::resolve_comment( $id_components['id'], $context );
            },
        ]
    );
    
    \ITV\GraphQL\Connection\ItvComments::register_connections();
}

add_action( 'graphql_register_types', 'itv_register_comment_graphql_fields' );
function itv_register_comment_graphql_fields() {
    register_graphql_object_type(
        'ItvComment',
        [
            'description' => __( 'ITV Comment object', 'tst' ),
            'interfaces'  => [ 'Node' ],
            'fields'      => [
                'id'           => [
                    'description' => __( 'The globally unique identifier for the comment object', 'wp-graphql' ),
                ],
                'commentId'    => [
                    'type'        => 'Int',
                    'description' => __( 'ID for the comment, unique among comments.', 'wp-graphql' ),
                ],
                'commentedOn'  => [
                    'type'        => 'PostObjectUnion',
                    'description' => __( 'The object the comment was added to', 'wp-graphql' ),
                    'resolve'     => function( \ITV\GraphQL\Model\ItvComment $comment, $args, AppContext $context, ResolveInfo $info ) {
                    if ( empty( $comment->comment_post_ID ) || ! absint( $comment->comment_post_ID ) ) {
                        return null;
                    }
                    $id = absint( $comment->comment_post_ID );
                    
                    return DataSource::resolve_post_object( $id, $context );
                    },
                    ],
                    'author'       => [
                        'type'        => 'CommentAuthorUnion',
                        'description' => __( 'The author of the comment', 'wp-graphql' ),
                        'resolve'     => function( \ITV\GraphQL\Model\ItvComment $comment, $args, AppContext $context, ResolveInfo $info ) {
                        
                        /**
                         * If the comment has a user associated, use it to populate the author, otherwise return
                         * the $comment and the Union will use that to hydrate the CommentAuthor Type
                         */
//                     error_log("comment Id: " . $comment->id);
//                     error_log("comment commentId: " . $comment->commentId);
//                     error_log("***comment->userId: " . $comment->userId);
                    
                    if ( ! empty( $comment->userId ) ) {
                        if ( empty( $comment->userId ) || ! absint( $comment->userId ) ) {
                            return null;
                        }
                        
                        return \ITV\GraphQL\Data\ItvDataSource\ItvDataSource::resolve_user( $comment->userId, $context );
                        
                    } else {
                        return ! empty( $comment->commentId ) ? DataSource::resolve_comment_author( $comment->commentId ) : null;
                    }
                        },
                        ],
                        'authorIp'     => [
                            'type'        => 'String',
                            'description' => __( 'IP address for the author. This field is equivalent to WP_Comment->comment_author_IP and the value matching the "comment_author_IP" column in SQL.', 'wp-graphql' ),
                        ],
                        'date'         => [
                            'type'        => 'String',
                            'description' => __( 'Date the comment was posted in local time. This field is equivalent to WP_Comment->date and the value matching the "date" column in SQL.', 'wp-graphql' ),
                        ],
                        'dateGmt'      => [
                            'type'        => 'String',
                            'description' => __( 'Date the comment was posted in GMT. This field is equivalent to WP_Comment->date_gmt and the value matching the "date_gmt" column in SQL.', 'wp-graphql' ),
                        ],
                        'content'      => [
                            'type'        => 'String',
                            'description' => __( 'Content of the comment. This field is equivalent to WP_Comment->comment_content and the value matching the "comment_content" column in SQL.', 'wp-graphql' ),
                            'args'        => [
                                'format' => [
                                    'type'        => 'PostObjectFieldFormatEnum',
                                    'description' => __( 'Format of the field output', 'wp-graphql' ),
                                ],
                            ],
                            'resolve'     => function( \ITV\GraphQL\Model\ItvComment $comment, $args ) {
                            if ( isset( $args['format'] ) && 'raw' === $args['format'] ) {
                                return $comment->contentRaw;
                            } else {
                                return $comment->contentRendered;
                            }
                            },
                            ],
                            'karma'        => [
                                'type'        => 'Int',
                                'description' => __( 'Karma value for the comment. This field is equivalent to WP_Comment->comment_karma and the value matching the "comment_karma" column in SQL.', 'wp-graphql' ),
                            ],
                            'approved'     => [
                                'type'        => 'Boolean',
                                'description' => __( 'The approval status of the comment. This field is equivalent to WP_Comment->comment_approved and the value matching the "comment_approved" column in SQL.', 'wp-graphql' ),
                            ],
                            'agent'        => [
                                'type'        => 'String',
                                'description' => __( 'User agent used to post the comment. This field is equivalent to WP_Comment->comment_agent and the value matching the "comment_agent" column in SQL.', 'wp-graphql' ),
                            ],
                            'type'         => [
                                'type'        => 'String',
                                'description' => __( 'Type of comment. This field is equivalent to WP_Comment->comment_type and the value matching the "comment_type" column in SQL.', 'wp-graphql' ),
                            ],
                            'parent'       => [
                                'type'        => 'Comment',
                                'description' => __( 'Parent comment of current comment. This field is equivalent to the WP_Comment instance matching the WP_Comment->comment_parent ID.', 'wp-graphql' ),
                                'resolve'     => function( \ITV\GraphQL\Model\ItvComment $comment, $args, AppContext $context, ResolveInfo $info ) {
                                return ! empty( $comment->comment_parent_id ) ? ITV\GraphQL\Data\ItvDataSource\ItvDataSource::resolve_comment( $comment->comment_parent_id, $context ) : null;
                                },
                                ],
                                'isRestricted' => [
                                    'type'        => 'Boolean',
                                    'description' => __( 'Whether the object is restricted from the current viewer', 'wp-graphql' ),
                                ],
                                ],
                                ]
        );
}

add_action( 'graphql_register_types', 'itv_register_user_graphql_fields' );
function itv_register_user_graphql_fields() {
    register_graphql_fields(
        'User',
        itv_get_grapql_user_fields()
    );
    
    register_graphql_fields(
        'ItvUser',
        itv_get_grapql_user_fields()
    );
}

function itv_get_grapql_user_fields() {
    return [
    'profileURL' => [
        'type'        => 'String',
        'description' => __( 'User profile URL', 'tst' ),
        'resolve'     => function( $user ) {
        return tst_get_member_url($user->userId);
        },
        ],
        'fullName' => [
            'type'        => 'String',
            'description' => __( 'User profile URL', 'tst' ),
            'resolve'     => function( $user ) {
            return tst_get_member_name($user->userId);
            },
            ],
            'itvAvatar' => [
                'type'        => 'String',
                'description' => __( 'User profile URL', 'tst' ),
                'resolve'     => function( $user ) {
                return itv_avatar_url($user->userId);
                },
                ],
                'memberRole' => [
                    'type'        => 'String',
                    'description' => __( 'User role (hero, volunteer, donee or activist)', 'tst' ),
                    'resolve'     => function( $user ) {
                    return tst_get_member_role_name($user->userId);
                    },
                    ],
                    'solvedTasksCount' => [
                        'type'        => 'Int',
                        'description' => __( 'Number of tasks user solved as DOER', 'tst' ),
                        'resolve'     => function( $user ) {
                        $key = 'solved';
                        $activity = tst_get_member_activity($user->userId, $key);
                        return $activity[$key];
                        },
                        ],
                        'authorReviewsCount' => [
                            'type'        => 'Int',
                            'description' => __( 'User author reviews count', 'tst' ),
                            'resolve'     => function( $user ) {
                            return ItvReviewsAuthor::instance()->count_author_reviews($user->userId);
                            },
                            ],
                            'doerReviewsCount' => [
                                'type'        => 'Int',
                                'description' => __( 'User doer reviews count', 'tst' ),
                                'resolve'     => function( $user ) {
                                return ItvReviews::instance()->count_doer_reviews($user->userId);
                                },
                                ],
                                'organizationName' => [
                                    'type'        => 'String',
                                    'description' => __( 'User organization', 'tst' ),
                                    'resolve'     => function( $user ) {
                                    return tst_get_member_field('user_workplace', $user->userId);
                                    },
                                    ],
                                    'organizationDescription' => [
                                        'type'        => 'String',
                                        'description' => __( 'User organization description', 'tst' ),
                                        'resolve'     => function( $user ) {
                                        return tst_get_member_field('user_workplace_desc', $user->userId);
                                        },
                                        ],
                                        'organizationLogo' => [
                                            'type'        => 'String',
                                            'description' => __( 'User organization logo', 'tst' ),
                                            'resolve'     => function( $user ) {
                                            return tst_get_member_user_company_logo_src( $user->userId );
                                            },
                                            ]
                                            ];
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
                    $users[] = \ITV\GraphQL\Data\ItvDataSource\ItvDataSource::resolve_user( $doer->ID, $context );
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
