<?php

use \ITV\models\MemberManager;

function member_api_add_routes($server)
{

    register_rest_route('itv/v1', '/member/(?P<slug>[- _0-9a-zA-Z]+)', [
        'methods'   => WP_REST_Server::READABLE,
        'callback'  => function ($request) {

            $slug = $request->get_param('slug');
            $user = get_user_by('slug', $slug);

            $user_id = $user->ID ?? 0;

            $request->set_param('id', $user_id);
            $request->set_route('/wp/v2/users/' . $user_id);

            return rest_do_request($request);
        },
    ]);

    register_rest_route('itv/v1', '/member/(?P<slug>[- _0-9a-zA-Z]+)/telegram-chat-banner', [
        'methods'   => WP_REST_Server::CREATABLE,
        'callback'  => function ($request) {
            ['slug' => $slug, 'value' => $value] = $request->get_params();

            $user_id = get_current_user_id();
            $user = get_user_by('slug', $slug);

            if ($user_id !== $user->ID) {

                return new WP_Error('forbidden', __('You have no permissions to take the action', 'itv-backend'), array('status' => 403));
            }

            if (update_user_meta($user_id, MemberManager::$meta_telegram_chat_banner, $value) === false) {

                return new WP_Error('user_meta_error', __('Failed to save user meta', 'itv-backend'), array('status' => 500));
            }

            return new WP_REST_Response(['ok' => true], 200);
        },
        'permission_callback' => fn () => current_user_can(MemberManager::$ROLE_DOER),
        'args' => [
            'value' => array(
                'required' => true,
                'type' => 'boolean',
                'validate_callback' => fn ($param) => is_numeric($param),
                'sanitize_callback' => fn ($param) => (bool) $param,
            ),
        ],
    ]);
}
add_action('rest_api_init', 'member_api_add_routes');


function member_api_register_fields($server)
{
    $member_manager = new MemberManager();

    register_rest_field('user', MemberManager::$FIELD_FULL_NAME, [
        'get_callback' => [$member_manager, 'get_property'],
        'context' => ['view', MemberManager::$rest_context_view_card]
    ]);

    register_rest_field('user', MemberManager::$FIELD_AVATAR, [
        'get_callback' => [$member_manager, 'get_property'],
        'context' => ['view', MemberManager::$rest_context_view_card]
    ]);

    register_rest_field('user', MemberManager::$FIELD_AUTHOR_REVIEWS_COUNT, [
        'get_callback' => [$member_manager, 'get_property'],
        'context' => ['view', MemberManager::$rest_context_view_card]
    ]);

    register_rest_field('user', MemberManager::$FIELD_DOER_REVIEWS_COUNT, [
        'get_callback' => [$member_manager, 'get_property'],
        'context' => ['view', MemberManager::$rest_context_view_card]
    ]);

    register_rest_field('user', MemberManager::$FIELD_REVIEWS_COUNT, [
        'get_callback' => [$member_manager, 'get_property'],
        'context' => ['view', MemberManager::$rest_context_view_card]
    ]);

    register_rest_field('user', MemberManager::$FIELD_RATING, [
        'get_callback' => [$member_manager, 'get_property'],
        'context' => ['view', MemberManager::$rest_context_view_card]
    ]);

    register_rest_field('user', MemberManager::$FIELD_XP, [
        'get_callback' => [$member_manager, 'get_property'],
        'context' => ['view', MemberManager::$rest_context_view_card]
    ]);

    register_rest_field('user', MemberManager::$FIELD_ITV_ROLE, [
        'get_callback' => [$member_manager, 'get_property'],
        'context' => ['view', MemberManager::$rest_context_view_card]
    ]);

    register_rest_field('user', MemberManager::$FIELD_IS_PASEKA_MEMBER, [
        'get_callback' => [$member_manager, 'get_property'],
        'context' => ['view', MemberManager::$rest_context_view_card]
    ]);

    register_rest_field('user', MemberManager::$FIELD_ITV_ROLE_TITLE, [
        'get_callback' => [$member_manager, 'get_property'],
        'context' => ['view', MemberManager::$rest_context_view_card]
    ]);

    register_rest_field('user', MemberManager::$FIELD_IS_HYBRID, [
        'get_callback' => [$member_manager, 'get_property'],
        'context' => ['view', MemberManager::$rest_context_view_card]
    ]);

    register_rest_field('user', MemberManager::$FIELD_RATING_SOLVED_TASKS_COUNT, [
        'get_callback' => [$member_manager, 'get_property'],
        'context' => ['view', MemberManager::$rest_context_view_card]
    ]);
}
add_action('rest_api_init', 'member_api_register_fields', 11);


function member_api_fix_seo_integration($server)
{

    global $wp_rest_additional_fields;

    // remove yoast fields for portfolio_action
    $wp_rest_additional_fields['user']['yoast_head']['context'] = ['view', 'edit', 'embed'];
}
add_action('rest_api_init', 'member_api_fix_seo_integration', 11);


function member_api_prepare_response($response, $post, $request)
{

    // if( $request['context'] !== MemberManager::$rest_context_view_card ) {
    //     return $response;
    // }

    foreach ($response->get_links() as $rel => $link) {
        $response->remove_link($rel);
    }

    return $response;
}
add_filter('rest_prepare_user', 'member_api_prepare_response', 10, 3);
