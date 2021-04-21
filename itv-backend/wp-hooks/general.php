<?php

// filters
function itv_prefix_disable_gutenberg(bool $current_status, string $post_type)
{
    return ($post_type === ITV\models\Task::POST_TYPE) ? false : $current_status;
}
add_filter('use_block_editor_for_post_type', 'itv_prefix_disable_gutenberg', 10, 2);

add_filter('xmlrpc_enabled', '__return_false');

add_filter('embed_oembed_discover', '__return_false');

add_filter('wp_image_editors', function ($editors) {
    $gd_editor = 'WP_Image_Editor_GD';
    $editors = array_diff($editors, array($gd_editor));

    array_unshift($editors, $gd_editor);

    return $editors;
});

add_filter('image_sideload_extensions', fn ($allowed_extensions) => [...$allowed_extensions, 'svg']);
