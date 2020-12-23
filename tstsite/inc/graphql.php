<?php

require_once dirname(__FILE__) . '/../vendor/autoload.php';
require_once(dirname(__FILE__) . '/../inc/models/TimelineModel.php');

use \WPGraphQL\AppContext;
use \WPGraphQL\Data\DataSource;
use \ITV\models\TimelineModel;
use \ITV\models\CommentsLikeModel;
use \ITV\models\UserXPModel;
use \ITV\models\ThankyouModel;
use \ITV\dao\ReviewAuthor;
use \ITV\dao\Review;

// from itv-backend
use \ITV\models\MemberManager;
use \ITV\models\MemberTasks;

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
            'approvedDoer' => [
                'type'        => 'User',
                'description' => __( 'Task doer candidates count', 'tst' ),
                'resolve'     => function( $task, $args, $context ) {
                    $task_doers = tst_get_task_doers($task->ID, true);
                    return count($task_doers) ? \WPGraphQL\Data\DataSource::resolve_user( $task_doers[0]->ID, $context ) : null;
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
                                'before'     => $task->date,
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
            'cover' => [
                'type'        => 'MediaItem',
                'resolve'     => function( $task, $args, $context ) {
                    $file_id = intval(get_post_thumbnail_id($task->ID));
                    if($file_id) {
                        return \WPGraphQL\Data\DataSource::resolve_post_object( intval($file_id), $context );
                    }
                    return null;                    
                },
            ],
            'coverImgSrcLong' => [
                'type'        => 'String',
                'resolve'     => function( $task, $args, $context ) {
                    return itv_get_task_cover_image_src($task->ID, 'medium_large');
                },
            ],
            'files' => [
                'type'        => [ 'list_of' => 'MediaItem' ],
                'resolve'     => function( $task, $args, $context ) {
                    $file_id_list = get_post_meta($task->ID, 'files', true);
                    if(!is_array($file_id_list)) {
                        $file_id_list = $file_id_list ? [$file_id_list] : [];
                    }

                    $files = [];
                    foreach ($file_id_list as $key => $file_id) {
                        if($file_id) {
                            $files[] = \WPGraphQL\Data\DataSource::resolve_post_object( intval($file_id), $context );
                        }
                    }
                    return $files;
                },
            ],
            'deadline' => [
                'type'        => 'String',
                'resolve'     => function( $task, $args, $context ) {
                    return itv_get_task_deadline_date($task->ID, $task->date);
                },
            ],
        ]
    );
}

add_filter('graphql_data_is_private', "itv_graphql_task_private_filter", 10, 6);
function itv_graphql_task_private_filter($is_private, $model_name, $data, $visibility, $owner, $current_user) {
    if($model_name !== 'PostObject'
        || $data->post_type != 'tasks'
        || $is_private === false
    ) {
        return $is_private;
    }
    
    return !(in_array($data->post_status, ['in_work', 'closed', 'archived', 'draft']) || current_user_can("manage_options"));
}

add_filter('graphql_object_visibility', "itv_graphql_task_visibility_filter", 10, 6);
function itv_graphql_task_visibility_filter($visibility, $model_name, $data, $owner, $current_user) {
    if($model_name !== 'PostObject'
        || $data->post_type != 'tasks'
        || $visibility === 'public'
    ) {
        return $visibility;
    }
    
    if(in_array($data->post_status, ['in_work', 'closed', 'archived', 'draft'])) {
        return 'public';
    }
    // elseif(in_array($data->post_status, ['draft'])) {
    //     return 'restricted';
    // }

    return $visibility;
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
                'description' => __( 'User avatar URL', 'tst' ),
                'resolve' => function ($user) {
                    return itv_avatar_url( $user->userId );
                }
            ],
            'itvAvatarFile' => [
                'type'        => 'MediaItem',
                'description' => __( 'User organization avatar file', 'tst' ),
                'resolve'     => function( $user, $args, $context ) {
                    $file_id = intval(get_user_meta($user->userId, 'user_avatart', true));
                    if($file_id) {
                        return \WPGraphQL\Data\DataSource::resolve_post_object( intval($file_id), $context );
                    }
                    return null;                    
                },
            ],
            'cover' => [
                'type' => 'String',
                'description' => __( 'User cover URL', 'tst' ),
                'resolve' => function ($user) {
                    return itv_member_cover_url( $user->userId );
                }
            ],
            'coverFile' => [
                'type'        => 'MediaItem',
                'description' => __( 'User organization cover file', 'tst' ),
                'resolve'     => function( $user, $args, $context ) {
                    $file_id = intval(get_user_meta($user->userId, 'user_cover', true));
                    if($file_id) {
                        return \WPGraphQL\Data\DataSource::resolve_post_object( intval($file_id), $context );
                    }
                    return null;                    
                },
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
            'totalReviewsCount' => [
                'type' => 'Int',
                'description' => __( 'Total user reviews count', 'tst' ),
                'resolve' => function ($user) {
                    return ItvReviews::instance()->count_doer_reviews( $user->userId ) + ItvReviewsAuthor::instance()->count_author_reviews( $user->userId );
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
                'description' => __( 'User organization logo src', 'tst' ),
                'resolve' => function ($user) {
                    return tst_get_member_user_company_logo_src( $user->userId );
                }
            ],
            'organizationLogoFile' => [
                'type'        => 'MediaItem',
                'description' => __( 'User organization logo file', 'tst' ),
                'resolve'     => function( $user, $args, $context ) {
                    $file_id = intval(get_user_meta($user->userId, 'user_company_logo', true));
                    if($file_id) {
                        return \WPGraphQL\Data\DataSource::resolve_post_object( intval($file_id), $context );
                    }
                    return null;                    
                },
            ],
            'isPasekaMember' => [
                'type' => 'Boolean',
                'resolve' => function ($user) {
                    return itv_is_user_paseka_member($user->userId);
                }
            ],
            'isPartner' => [
                'type' => 'Bool',
                'resolve' => function ($user) {
                    return itv_is_user_partner($user->userId);
                }
            ],
            'isAdmin' => [
                'type' => 'Bool',
                'resolve' => function ($user) {
                    return user_can($user->userId, 'manage_options');
                }
            ],
            'skype' => [
                'type' => 'String',
                'description' => __( 'User skype', 'tst' ),
                'resolve' => function ($user) {
                    return tst_get_member_field( 'user_skype', $user->userId );
                }
            ],
            'twitter' => [
                'type' => 'String',
                'description' => __( 'User twitter', 'tst' ),
                'resolve' => function ($user) {
                    return get_user_meta($user->userId, 'twitter', true);
                }
            ],
            'facebook' => [
                'type' => 'String',
                'description' => __( 'User facebook', 'tst' ),
                'resolve' => function ($user) {
                    return get_user_meta($user->userId, 'facebook', true);
                }
            ],
            'vk' => [
                'type' => 'String',
                'description' => __( 'User vk', 'tst' ),
                'resolve' => function ($user) {
                    return get_user_meta($user->userId, 'vk', true);
                }
            ],
            'instagram' => [
                'type' => 'String',
                'description' => __( 'User instagram', 'tst' ),
                'resolve' => function ($user) {
                    return get_user_meta($user->userId, 'instagram', true);
                }
            ],
            'telegram' => [
                'type' => 'String',
                'description' => __( 'User telegram', 'tst' ),
                'resolve' => function ($user) {
                    return get_user_meta($user->userId, 'telegram', true);
                }
            ],
            'phone' => [
                'type' => 'String',
                'description' => __( 'User phone', 'tst' ),
                'resolve' => function ($user) {
                    return get_user_meta($user->userId, 'user_contacts', true);
                }
            ],
            'rating' => [
                'type' => 'Float',
                'description' => __( 'User rating', 'tst' ),
                'resolve' => function ($user) {
                    $ratings = [];

                    $reviews_as_author = ReviewAuthor::where(['author_id' => $user->userId])->get();
                    foreach($reviews_as_author as $review) {
                        if($review['rating']) {
                            $ratings[] = $review['rating'];
                        }

                        if($review['communication_rating']) {
                            $ratings[] = $review['communication_rating'];
                        }
                    }

                    $reviews_as_doer = Review::where(['doer_id' => $user->userId])->get();
                    foreach($reviews_as_doer as $review) {
                        if($review['rating']) {
                            $ratings[] = $review['rating'];
                        }

                        if($review['communication_rating']) {
                            $ratings[] = $review['communication_rating'];
                        }
                    }
                    
                    return !empty($ratings) ? array_sum($ratings) / count($ratings) : 0;
                }
            ],
            'reviewsCount' => [
                'type' => 'Int',
                'description' => __( 'User reviewsCount', 'tst' ),
                'resolve' => function ($user) {
                    $as_author = ReviewAuthor::where(['author_id' => $user->userId])->count();
                    $as_doer = Review::where(['doer_id' => $user->userId])->count();
                    return $as_author + $as_doer;
                }
            ],
            'thankyouCount' => [
                'type' => 'Int',
                'description' => __( 'User thankyouCount', 'tst' ),
                'resolve' => function ($user) {
                    return ThankyouModel::instance()->get_user_thankyou_count($user->userId);
                }
            ],
            'xp' => [
                'type' => 'Int',
                'description' => __( 'User xp', 'tst' ),
                'resolve' => function ($user) {
                    return UserXPModel::instance()->get_user_xp($user->userId);
                }
            ],
            'registrationDate' => [
                'type' => 'Int',
                'description' => __( 'User registration date', 'tst' ),
                'resolve' => function ($user) {
                    return strtotime(tst_get_member_field( 'user_date', $user->userId ));
                }
            ],
            'organizationSite' => [
                'type' => 'String',
                'description' => __( 'User organization site', 'tst' ),
                'resolve' => function ($user) {
                    return tst_get_member_field( 'user_website', $user->userId );
                }
            ],
            'solvedProblems' => [
                'type' => 'Int',
                'description' => __( 'User solved problems', 'tst' ),
                'resolve' => function ($user) {
                    $activity = tst_calculate_member_activity($user->userId, "solved");

                    return (int) $activity["solved"];
                }
            ],
            'isEmptyProfile' => [
                'type' => 'Bool',
                'description' => __( 'User has no created or connected tasks', 'tst' ),
                'resolve' => function ($user) {
                    return itv_is_empty_user_profile($user->userId);
                }
            ],
            'isEmptyProfileAsAuthor' => [
                'type' => 'Bool',
                'description' => __( 'User has no created tasks', 'tst' ),
                'resolve' => function ($user) {
                    return itv_is_empty_user_profile_as_author($user->userId);
                }
            ],
            'isEmptyProfileAsDoer' => [
                'type' => 'Bool',
                'description' => __( 'User has no connected tasks', 'tst' ),
                'resolve' => function ($user) {
                    return itv_is_empty_user_profile_as_doer($user->userId);
                }
            ],
            'itvRole' => [
                'type' => 'String',
                'description' => __( 'User itvRole', 'tst' ),
                'resolve' => function ($user) {
                    $members = new MemberManager();
                    return $members->get_member_itv_role($user->userId);
                }
            ],
            'isHybrid' => [
                'type' => 'Bool',
                'description' => __( 'User is doer and author', 'tst' ),
                'resolve' => function ($user) {
                    $member_tasks = new MemberTasks($user->userId);
                    return $member_tasks->has_member_created_and_completed_tasks();
                }
            ],
        ]
    );

}

add_filter('graphql_data_is_private', "itv_graphql_user_private_filter", 10, 6);
function itv_graphql_user_private_filter($is_private, $model_name, $data, $visibility, $owner, $current_user) {

    if($model_name !== 'UserObject'
        || $is_private === false
    ) {
        return $is_private;
    }
    
    return boolval($data->data->deleted); // data located in .data prop for users
}

add_filter('graphql_object_visibility', "itv_graphql_user_visibility_filter", 10, 6);
function itv_graphql_user_visibility_filter($visibility, $model_name, $data, $owner, $current_user) {

    if($model_name !== 'UserObject'
        || $visibility === 'public'
    ) {
        return $visibility;
    }
    
     // data located in .data prop for users
    if(!boolval($data->data->deleted)) {
        return 'public';
    }

    return $visibility;
}

add_filter( 'user_has_cap', 'itv_allow_everyone_to_list_users', 10, 4 );
function itv_allow_everyone_to_list_users($allcaps, $caps, $args, $user) {
    $allcaps['list_users'] = 1;
    return $allcaps;
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
                'taskGqlId'     => [
                    'type' => [
                        'non_null' => 'ID',
                    ],
                ],
            ],
            'resolve' => function($source, array $args, AppContext $context) {
                $post_identity = \GraphQLRelay\Relay::fromGlobalId( $args['taskGqlId'] );
                
                if(empty($post_identity['id'])) {
                    error_log("invalid task id in taskDoers: " . print_r($args, true));
                    return [];
                }
                
                $task_post_id = $post_identity['id'];
                
                $doers = tst_get_task_doers($task_post_id, false);
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

// comments

add_action('graphql_register_types', 'register_liker_type');

function register_liker_type()
{
    register_graphql_object_type('Liker', [
        'description' => __('Comment liker', 'tst'),
        'fields' => [
            'userId' => [
                'type' => 'String',
                'description' => __('The id of the liker', 'tst'),
            ],
            'userName' => [
                'type' => 'String',
                'description' => __('The name of the liker', 'tst'),
            ],
            'userFullName' => [
                'type' => 'String',
                'description' => __('The full name of the liker', 'tst'),
            ],
        ],
    ]);
}

add_action('graphql_register_types', 'itv_register_comment_graphql_fields');

function itv_register_comment_graphql_fields()
{
    register_graphql_fields(
        'Comment',
        [
            'likesCount' => [
                'type'        => 'Int',
                'description' => __('Comment likes count', 'tst'),
                'resolve'     => function ($comment) {
                    $like = get_comment_meta($comment->commentId, 'itv_likes_count', true);

                    if (!$like) {
                        $like = 0;
                    }
                    return $like;
                },
            ],
            'likeGiven' => [
                'type' => 'Boolean',
                'description' => __('Comment likes count', 'tst'),
                'resolve'     => function ($comment) {
                    if (is_user_logged_in()) {
                        $comments_like = ITV\models\CommentsLikeModel::instance();
                        return !!$comments_like->is_user_comment_like(get_current_user_id(), $comment->commentId);
                    } else {
                        return false;
                    }
                },
            ],
            'likers' => [
                'type' => ['list_of' => 'Liker'],
                'description' => __('Comment likers', 'tst'),
                'resolve'     => fn ($comment) => get_likers($comment->commentId),
            ],
        ]
    );
}

add_filter('graphql_data_is_private', "itv_graphql_comment_private_filter", 10, 6);
function itv_graphql_comment_private_filter($is_private, $model_name, $data, $visibility, $owner, $current_user) {
    if(!in_array($model_name, ['CommentObject', 'CommentAuthorObject'])
        || $is_private === false
    ) {
        return $is_private;
    }
    
    return false;
}

add_filter('graphql_object_visibility', "itv_graphql_comment_visibility_filter", 10, 6);
function itv_graphql_comment_visibility_filter($visibility, $model_name, $data, $owner, $current_user) {
    if(!in_array($model_name, ['CommentObject', 'CommentAuthorObject'])
        || $visibility === 'public'
    ) {
        return $visibility;
    }
    
    return 'public';
}

add_action( 'graphql_register_types', 'itv_register_member_tasks_graphql_query' );
function itv_register_member_tasks_graphql_query() {
    register_graphql_field(
        'RootQuery',
        'memberTasks',
        [
            'description' => __( 'Member tasks', 'tst' ),
            'type' => [ 'list_of' => 'Task' ],
            'args'        => [
                'username'     => [
                    'type' => [
                        'non_null' => 'USERNAME',
                    ],
                ],
                'page' => [
                    'type' => 'Int',
                ],
            ],
            'resolve' => function($source, array $args, AppContext $context) {
                $user = get_user_by( 'login', $args['username'] );
                $page = !empty($args['page']) ? intval( $args['page'] ) : 0;
                $posts_per_page = 3;

                if(!$user) {
                    error_log("invalid username: " . print_r($args, true));
                    return [];
                }

                $params = array(
                    'post_type' => 'tasks',
                    'connected_type' => 'task-doers',
                    'connected_items' => $user->ID,
                    'suppress_filters' => true,
                    'nopaging' => true,
                    'post_status' => ['publish', 'in_work', 'closed', 'draft'],
                );
                $posts_where_doer = get_posts($params);

                $params = array(
                    'post_type' => 'tasks',
                    'author'        =>  $user->ID,
                    'suppress_filters' => true,
                    'nopaging' => true,
                    'post_status' => ['publish', 'in_work', 'closed', 'draft'],
                );
                $posts_where_author = get_posts($params);

                // error_log("count: " . (count($posts_where_doer) + count($posts_where_author)) );

                $posts = array_merge($posts_where_author, $posts_where_doer);
                // error_log("count posts: " . count($posts) );

                $open_posts = itv_get_members_tasks_portion(array_filter($posts, function($post) {
                    return in_array($post->post_status, ['publish', 'in_work']);
                }), $page, $posts_per_page);
                $closed_posts = itv_get_members_tasks_portion(array_filter($posts, function($post) {
                    return in_array($post->post_status, ['closed']);
                }), $page, $posts_per_page);
                $draft_posts = itv_get_members_tasks_portion(array_filter($posts, function($post) {
                    return in_array($post->post_status, ['draft']);
                }), $page, $posts_per_page);

                foreach(array_merge($open_posts, $draft_posts, $closed_posts) as $k => $post) {
                    $deferred_posts[] = \WPGraphQL\Data\DataSource::resolve_post_object( $post->ID, $context );
                }

                return $deferred_posts;
            },
        ]
    );
}

// Volunteer rating

add_action('graphql_register_types', 'itv_register_user_list_stats_type');

function itv_register_user_list_stats_type()
{
    register_graphql_object_type(
        'UserListStatsType',
        [
            'description' => __("User list statistics", 'tst'),
            'fields' => [
                'total' => [
                    'type' => 'Integer',
                    'description' => __('Total user count', 'tst'),
                ],
            ],
        ]
    );
}

add_action('graphql_register_types', 'itv_register_user_list_stats_field');

function itv_register_user_list_stats_field()
{

    register_graphql_field(
        'RootQuery',
        'userListStats',
        [
            'description' => __('Get user list statistics', 'tst'),
            'type' => 'UserListStatsType',
            'resolve' => function () {

                global $wpdb;

                $total_user_count = $wpdb->get_var(
                    $wpdb->prepare(
                        "
                        SELECT COUNT(*)
                        FROM {$wpdb->prefix}itv_user_xp
                        WHERE user_id <> %s
                    ",
                        ACCOUNT_DELETED_ID
                    )
                );

                return [
                    'total' => $total_user_count,
                ];
            }
        ]
    );
}

add_action('graphql_register_types', 'itv_register_user_list_type');

function itv_register_user_list_type()
{
    register_graphql_field(
        'RootQuery',
        'userList',
        [
            'description' => __('User list', 'tst'),
            'type' => ['list_of' => 'User'],
            'args'        => [
                'userPerPage' => [
                    'type' => 'Int',
                ],
                'paged' => [
                    'type' => 'Int',
                ],
            ],
            'resolve' => function ($source, array $args, AppContext $context) {

                global $wpdb;

                ["userPerPage" => $user_per_page, "paged" => $paged] = $args;

                $limit_start = (int) $user_per_page * (int) $paged - (int) $user_per_page;
                $limit_end = $user_per_page;

                $deferred_users = [];

                $users = $wpdb->get_results(
                    $wpdb->prepare(
                        "
                            SELECT user_id, xp
                            FROM {$wpdb->prefix}itv_user_xp
                            WHERE user_id <> %s
                            ORDER BY xp
                            DESC
                            LIMIT {$limit_start}, {$limit_end}
                        ",
                        ACCOUNT_DELETED_ID
                    )
                );

                foreach ($users as $user) {
                    $deferred_users[] = \WPGraphQL\Data\DataSource::resolve_user((int) $user->user_id, $context);
                }

                return $deferred_users;
            },
        ]
    );
}

// Add total field in PageInfo qraphql query block
// Source: https://github.com/builtbycactus/total-counts-for-wp-graphql

add_filter('graphql_connection_query_args', function ($args) {
    $args['no_found_rows'] = false;
    $args['count_total']   = true;

    return $args;
});

add_filter('graphql_connection_page_info', function ($page_info, $connection) {
    $page_info['total'] = null;

    if ($connection->get_query() instanceof \WP_Query) {
        if (isset($connection->get_query()->found_posts)) {
            $page_info['total'] = (int) $connection->get_query()->found_posts;
        }
    } elseif ($connection->get_query() instanceof \WP_User_Query) {
        if (isset($connection->get_query()->total_users)) {
            $page_info['total'] = (int) $connection->get_query()->total_users;
        }
    }

    return $page_info;
}, 10, 2);

add_action('graphql_register_types', function () {
    register_graphql_field('WPPageInfo', 'total', [
        'type' => 'Int',
    ]);
});