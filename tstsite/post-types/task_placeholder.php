<?php

/**
 * Registers the `task_placeholder` post type.
 */
function task_placeholder_init() {
    register_post_type( 'task_placeholder', array(
        'labels'                => array(
            'name'                  => __( 'Task placeholders', 'tst' ),
            'singular_name'         => __( 'Task placeholder', 'tst' ),
            'all_items'             => __( 'All Task placeholders', 'tst' ),
            'archives'              => __( 'Task placeholder Archives', 'tst' ),
            'attributes'            => __( 'Task placeholder Attributes', 'tst' ),
            'insert_into_item'      => __( 'Insert into task placeholder', 'tst' ),
            'uploaded_to_this_item' => __( 'Uploaded to this task placeholder', 'tst' ),
            'featured_image'        => _x( 'Featured Image', 'task_placeholder', 'tst' ),
            'set_featured_image'    => _x( 'Set featured image', 'task_placeholder', 'tst' ),
            'remove_featured_image' => _x( 'Remove featured image', 'task_placeholder', 'tst' ),
            'use_featured_image'    => _x( 'Use as featured image', 'task_placeholder', 'tst' ),
            'filter_items_list'     => __( 'Filter task placeholders list', 'tst' ),
            'items_list_navigation' => __( 'Task placeholders list navigation', 'tst' ),
            'items_list'            => __( 'Task placeholders list', 'tst' ),
            'new_item'              => __( 'New Task placeholder', 'tst' ),
            'add_new'               => __( 'Add New', 'tst' ),
            'add_new_item'          => __( 'Add New Task placeholder', 'tst' ),
            'edit_item'             => __( 'Edit Task placeholder', 'tst' ),
            'view_item'             => __( 'View Task placeholder', 'tst' ),
            'view_items'            => __( 'View Task placeholders', 'tst' ),
            'search_items'          => __( 'Search task placeholders', 'tst' ),
            'not_found'             => __( 'No task placeholders found', 'tst' ),
            'not_found_in_trash'    => __( 'No task placeholders found in trash', 'tst' ),
            'parent_item_colon'     => __( 'Parent Task placeholder:', 'tst' ),
            'menu_name'             => __( 'Task placeholders', 'tst' ),
        ),
        'public'                => true,
        'hierarchical'          => false,
        'show_ui'               => true,
        'show_in_nav_menus'     => true,
        'supports'              => array( 'title', 'editor' ),
        'has_archive'           => true,
        'rewrite'               => true,
        'query_var'             => true,
        'menu_position'         => null,
        'menu_icon'             => 'dashicons-admin-post',
        'show_in_rest'          => true,
        'rest_base'             => 'task_placeholder',
        'rest_controller_class' => 'WP_REST_Posts_Controller',
    ) );

}
add_action( 'init', 'task_placeholder_init' );

/**
 * Sets the post updated messages for the `task_placeholder` post type.
 *
 * @param  array $messages Post updated messages.
 * @return array Messages for the `task_placeholder` post type.
 */
function task_placeholder_updated_messages( $messages ) {
    global $post;

    $permalink = get_permalink( $post );

    $messages['task_placeholder'] = array(
        0  => '', // Unused. Messages start at index 1.
        /* translators: %s: post permalink */
        1  => sprintf( __( 'Task placeholder updated. <a target="_blank" href="%s">View task placeholder</a>', 'tst' ), esc_url( $permalink ) ),
        2  => __( 'Custom field updated.', 'tst' ),
        3  => __( 'Custom field deleted.', 'tst' ),
        4  => __( 'Task placeholder updated.', 'tst' ),
        /* translators: %s: date and time of the revision */
        5  => isset( $_GET['revision'] ) ? sprintf( __( 'Task placeholder restored to revision from %s', 'tst' ), wp_post_revision_title( (int) $_GET['revision'], false ) ) : false,
        /* translators: %s: post permalink */
        6  => sprintf( __( 'Task placeholder published. <a href="%s">View task placeholder</a>', 'tst' ), esc_url( $permalink ) ),
        7  => __( 'Task placeholder saved.', 'tst' ),
        /* translators: %s: post permalink */
        8  => sprintf( __( 'Task placeholder submitted. <a target="_blank" href="%s">Preview task placeholder</a>', 'tst' ), esc_url( add_query_arg( 'preview', 'true', $permalink ) ) ),
        /* translators: 1: Publish box date format, see https://secure.php.net/date 2: Post permalink */
        9  => sprintf( __( 'Task placeholder scheduled for: <strong>%1$s</strong>. <a target="_blank" href="%2$s">Preview task placeholder</a>', 'tst' ),
        date_i18n( __( 'M j, Y @ G:i', 'tst' ), strtotime( $post->post_date ) ), esc_url( $permalink ) ),
        /* translators: %s: post permalink */
        10 => sprintf( __( 'Task placeholder draft updated. <a target="_blank" href="%s">Preview task placeholder</a>', 'tst' ), esc_url( add_query_arg( 'preview', 'true', $permalink ) ) ),
    );

    return $messages;
}
add_filter( 'post_updated_messages', 'task_placeholder_updated_messages' );
