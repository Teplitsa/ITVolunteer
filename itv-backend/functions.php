<?php

load_theme_textdomain('itv-backend', get_theme_file_path() . '/lang');

add_filter('use_block_editor_for_post_type', 'itv_prefix_disable_gutenberg', 10, 2);
function itv_prefix_disable_gutenberg($current_status, $post_type)
{
    if ($post_type === 'tasks') return false;
    return $current_status;
}

// models
require_once(get_theme_file_path() . '/models/member/portfolio.php');
require_once(get_theme_file_path() . '/models/member/member.php');
require_once(get_theme_file_path() . '/models/task/task.php');
require_once(get_theme_file_path() . '/models/member/member-tasks.php');
require_once(get_theme_file_path() . '/models/member/notif.php');

// post-types
require_once(get_theme_file_path() . '/post-types/portfolio_work.php');

// rest-api
require_once(get_theme_file_path() . '/rest-api/auth.php');
require_once(get_theme_file_path() . '/rest-api/member/portfolio.php');
require_once(get_theme_file_path() . '/rest-api/member/role.php');
require_once(get_theme_file_path() . '/rest-api/member/member.php');
require_once(get_theme_file_path() . '/rest-api/member/review.php');
require_once(get_theme_file_path() . '/rest-api/member/notif.php');
require_once(get_theme_file_path() . '/rest-api/task/task.php');

// wp-cli
require_once(get_theme_file_path() . '/wp-cli/set_members_itv_role.php');

// filters
add_filter('xmlrpc_enabled', '__return_false');
add_filter('embed_oembed_discover', '__return_false');
add_filter('wp_image_editors', function ($editors) {
    $gd_editor = 'WP_Image_Editor_GD';
    $editors = array_diff($editors, array($gd_editor));
    array_unshift($editors, $gd_editor);
    return $editors;
});
