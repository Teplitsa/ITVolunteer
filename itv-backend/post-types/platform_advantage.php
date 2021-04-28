<?php

/**
 * Registers the `platform_advantage` post type.
 */
function platform_advantage_init() {
	register_post_type( 'platform_advantage', array(
		'labels'                => array(
			'name'                  => __( 'Advantages', 'itv-backend' ),
			'singular_name'         => __( 'Advantage', 'itv-backend' ),
			'all_items'             => __( 'All Advantages', 'itv-backend' ),
			'archives'              => __( 'Advantage Archives', 'itv-backend' ),
			'attributes'            => __( 'Advantage Attributes', 'itv-backend' ),
			'insert_into_item'      => __( 'Insert into Advantage', 'itv-backend' ),
			'uploaded_to_this_item' => __( 'Uploaded to this Advantage', 'itv-backend' ),
			'featured_image'        => _x( 'Featured Image', 'platform_advantage', 'itv-backend' ),
			'set_featured_image'    => _x( 'Set featured image', 'platform_advantage', 'itv-backend' ),
			'remove_featured_image' => _x( 'Remove featured image', 'platform_advantage', 'itv-backend' ),
			'use_featured_image'    => _x( 'Use as featured image', 'platform_advantage', 'itv-backend' ),
			'filter_items_list'     => __( 'Filter Advantages list', 'itv-backend' ),
			'items_list_navigation' => __( 'Advantages list navigation', 'itv-backend' ),
			'items_list'            => __( 'Advantages list', 'itv-backend' ),
			'new_item'              => __( 'New Advantage', 'itv-backend' ),
			'add_new'               => __( 'Add New', 'itv-backend' ),
			'add_new_item'          => __( 'Add New Advantage', 'itv-backend' ),
			'edit_item'             => __( 'Edit Advantage', 'itv-backend' ),
			'view_item'             => __( 'View Advantage', 'itv-backend' ),
			'view_items'            => __( 'View Advantages', 'itv-backend' ),
			'search_items'          => __( 'Search Advantages', 'itv-backend' ),
			'not_found'             => __( 'No Advantages found', 'itv-backend' ),
			'not_found_in_trash'    => __( 'No Advantages found in trash', 'itv-backend' ),
			'parent_item_colon'     => __( 'Parent Advantage:', 'itv-backend' ),
			'menu_name'             => __( 'Advantages', 'itv-backend' ),
		),
		'public'                => false,
		'hierarchical'          => false,
		'show_ui'               => true,
		'show_in_nav_menus'     => false,
		'supports'              => array( 'title', 'editor', 'thumbnail' ),
		'has_archive'           => false,
		'rewrite'               => false,
		'query_var'             => true,
		'menu_position'         => null,
		'menu_icon'             => 'dashicons-admin-post',
		'show_in_rest'          => true,
		'rest_base'             => 'platform-advantage',
		'rest_controller_class' => 'WP_REST_Posts_Controller',
	) );

}
add_action( 'init', 'platform_advantage_init' );

/**
 * Sets the post updated messages for the `platform_advantage` post type.
 *
 * @param  array $messages Post updated messages.
 * @return array Messages for the `platform_advantage` post type.
 */
function platform_advantage_updated_messages( $messages ) {
	global $post;

	$permalink = get_permalink( $post );

	$messages['platform_advantage'] = array(
		0  => '', // Unused. Messages start at index 1.
		/* translators: %s: post permalink */
		1  => sprintf( __( 'Advantage updated. <a target="_blank" href="%s">View Advantage</a>', 'itv-backend' ), esc_url( $permalink ) ),
		2  => __( 'Custom field updated.', 'itv-backend' ),
		3  => __( 'Custom field deleted.', 'itv-backend' ),
		4  => __( 'Advantage updated.', 'itv-backend' ),
		/* translators: %s: date and time of the revision */
		5  => isset( $_GET['revision'] ) ? sprintf( __( 'Advantage restored to revision from %s', 'itv-backend' ), wp_post_revision_title( (int) $_GET['revision'], false ) ) : false,
		/* translators: %s: post permalink */
		6  => sprintf( __( 'Advantage published. <a href="%s">View Advantage</a>', 'itv-backend' ), esc_url( $permalink ) ),
		7  => __( 'Advantage saved.', 'itv-backend' ),
		/* translators: %s: post permalink */
		8  => sprintf( __( 'Advantage submitted. <a target="_blank" href="%s">Preview Advantage</a>', 'itv-backend' ), esc_url( add_query_arg( 'preview', 'true', $permalink ) ) ),
		/* translators: 1: Publish box date format, see https://secure.php.net/date 2: Post permalink */
		9  => sprintf( __( 'Advantage scheduled for: <strong>%1$s</strong>. <a target="_blank" href="%2$s">Preview Advantage</a>', 'itv-backend' ),
		date_i18n( __( 'M j, Y @ G:i', 'itv-backend' ), strtotime( $post->post_date ) ), esc_url( $permalink ) ),
		/* translators: %s: post permalink */
		10 => sprintf( __( 'Advantage draft updated. <a target="_blank" href="%s">Preview Advantage</a>', 'itv-backend' ), esc_url( add_query_arg( 'preview', 'true', $permalink ) ) ),
	);

	return $messages;
}
add_filter( 'post_updated_messages', 'platform_advantage_updated_messages' );
