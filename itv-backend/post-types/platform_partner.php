<?php

/**
 * Registers the `platform_partner` post type.
 */
function platform_partner_init() {
	register_post_type( 'platform_partner', array(
		'labels'                => array(
			'name'                  => __( 'Partners', 'itv-backend' ),
			'singular_name'         => __( 'Partners', 'itv-backend' ),
			'all_items'             => __( 'All Partners', 'itv-backend' ),
			'archives'              => __( 'Partners Archives', 'itv-backend' ),
			'attributes'            => __( 'Partners Attributes', 'itv-backend' ),
			'insert_into_item'      => __( 'Insert into Partners', 'itv-backend' ),
			'uploaded_to_this_item' => __( 'Uploaded to this Partners', 'itv-backend' ),
			'featured_image'        => _x( 'Featured Image', 'platform_partner', 'itv-backend' ),
			'set_featured_image'    => _x( 'Set featured image', 'platform_partner', 'itv-backend' ),
			'remove_featured_image' => _x( 'Remove featured image', 'platform_partner', 'itv-backend' ),
			'use_featured_image'    => _x( 'Use as featured image', 'platform_partner', 'itv-backend' ),
			'filter_items_list'     => __( 'Filter Partners list', 'itv-backend' ),
			'items_list_navigation' => __( 'Partners list navigation', 'itv-backend' ),
			'items_list'            => __( 'Partners list', 'itv-backend' ),
			'new_item'              => __( 'New Partners', 'itv-backend' ),
			'add_new'               => __( 'Add New', 'itv-backend' ),
			'add_new_item'          => __( 'Add New Partners', 'itv-backend' ),
			'edit_item'             => __( 'Edit Partners', 'itv-backend' ),
			'view_item'             => __( 'View Partners', 'itv-backend' ),
			'view_items'            => __( 'View Partners', 'itv-backend' ),
			'search_items'          => __( 'Search Partners', 'itv-backend' ),
			'not_found'             => __( 'No Partners found', 'itv-backend' ),
			'not_found_in_trash'    => __( 'No Partners found in trash', 'itv-backend' ),
			'parent_item_colon'     => __( 'Parent Partners:', 'itv-backend' ),
			'menu_name'             => __( 'Partners', 'itv-backend' ),
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
		'rest_base'             => 'platform_partner',
		'rest_controller_class' => 'WP_REST_Posts_Controller',
	) );

}
add_action( 'init', 'platform_partner_init' );

/**
 * Sets the post updated messages for the `platform_partner` post type.
 *
 * @param  array $messages Post updated messages.
 * @return array Messages for the `platform_partner` post type.
 */
function platform_partner_updated_messages( $messages ) {
	global $post;

	$permalink = get_permalink( $post );

	$messages['platform_partner'] = array(
		0  => '', // Unused. Messages start at index 1.
		/* translators: %s: post permalink */
		1  => sprintf( __( 'Partners updated. <a target="_blank" href="%s">View Partners</a>', 'itv-backend' ), esc_url( $permalink ) ),
		2  => __( 'Custom field updated.', 'itv-backend' ),
		3  => __( 'Custom field deleted.', 'itv-backend' ),
		4  => __( 'Partners updated.', 'itv-backend' ),
		/* translators: %s: date and time of the revision */
		5  => isset( $_GET['revision'] ) ? sprintf( __( 'Partners restored to revision from %s', 'itv-backend' ), wp_post_revision_title( (int) $_GET['revision'], false ) ) : false,
		/* translators: %s: post permalink */
		6  => sprintf( __( 'Partners published. <a href="%s">View Partners</a>', 'itv-backend' ), esc_url( $permalink ) ),
		7  => __( 'Partners saved.', 'itv-backend' ),
		/* translators: %s: post permalink */
		8  => sprintf( __( 'Partners submitted. <a target="_blank" href="%s">Preview Partners</a>', 'itv-backend' ), esc_url( add_query_arg( 'preview', 'true', $permalink ) ) ),
		/* translators: 1: Publish box date format, see https://secure.php.net/date 2: Post permalink */
		9  => sprintf( __( 'Partners scheduled for: <strong>%1$s</strong>. <a target="_blank" href="%2$s">Preview Partners</a>', 'itv-backend' ),
		date_i18n( __( 'M j, Y @ G:i', 'itv-backend' ), strtotime( $post->post_date ) ), esc_url( $permalink ) ),
		/* translators: %s: post permalink */
		10 => sprintf( __( 'Partners draft updated. <a target="_blank" href="%s">Preview Partners</a>', 'itv-backend' ), esc_url( add_query_arg( 'preview', 'true', $permalink ) ) ),
	);

	return $messages;
}
add_filter( 'post_updated_messages', 'platform_partner_updated_messages' );
