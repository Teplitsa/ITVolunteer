<?php

// filters
function itv_prefix_disable_gutenberg(bool $current_status, string $post_type) {
    return ($post_type === ITV\models\Task::POST_TYPE) ? false : $current_status;
}
add_filter('use_block_editor_for_post_type', 'itv_prefix_disable_gutenberg', 10, 2);

add_filter( 'xmlrpc_enabled', '__return_false' );