<?php

/**
 * Registers the `review` post type.
 */
function review_init() {
	register_post_type( 'review', array(
		'labels'                => array(
			'name'                  => __( 'Reviews', 'itv-backend' ),
			'singular_name'         => __( 'Review', 'itv-backend' ),
			'all_items'             => __( 'All Reviews', 'itv-backend' ),
			'archives'              => __( 'Review Archives', 'itv-backend' ),
			'attributes'            => __( 'Review Attributes', 'itv-backend' ),
			'insert_into_item'      => __( 'Insert into Review', 'itv-backend' ),
			'uploaded_to_this_item' => __( 'Uploaded to this Review', 'itv-backend' ),
			'featured_image'        => _x( 'Featured Image', 'review', 'itv-backend' ),
			'set_featured_image'    => _x( 'Set featured image', 'review', 'itv-backend' ),
			'remove_featured_image' => _x( 'Remove featured image', 'review', 'itv-backend' ),
			'use_featured_image'    => _x( 'Use as featured image', 'review', 'itv-backend' ),
			'filter_items_list'     => __( 'Filter Reviews list', 'itv-backend' ),
			'items_list_navigation' => __( 'Reviews list navigation', 'itv-backend' ),
			'items_list'            => __( 'Reviews list', 'itv-backend' ),
			'new_item'              => __( 'New Review', 'itv-backend' ),
			'add_new'               => __( 'Add New', 'itv-backend' ),
			'add_new_item'          => __( 'Add New Review', 'itv-backend' ),
			'edit_item'             => __( 'Edit Review', 'itv-backend' ),
			'view_item'             => __( 'View Review', 'itv-backend' ),
			'view_items'            => __( 'View Reviews', 'itv-backend' ),
			'search_items'          => __( 'Search Reviews', 'itv-backend' ),
			'not_found'             => __( 'No Reviews found', 'itv-backend' ),
			'not_found_in_trash'    => __( 'No Reviews found in trash', 'itv-backend' ),
			'parent_item_colon'     => __( 'Parent Review:', 'itv-backend' ),
			'menu_name'             => __( 'Reviews', 'itv-backend' ),
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
		'rest_base'             => 'review',
		'rest_controller_class' => 'WP_REST_Posts_Controller',
	) );

}
add_action( 'init', 'review_init' );

/**
 * Sets the post updated messages for the `review` post type.
 *
 * @param  array $messages Post updated messages.
 * @return array Messages for the `review` post type.
 */
function review_updated_messages( $messages ) {
	global $post;

	$permalink = get_permalink( $post );

	$messages['review'] = array(
		0  => '', // Unused. Messages start at index 1.
		/* translators: %s: post permalink */
		1  => sprintf( __( 'Review updated. <a target="_blank" href="%s">View Review</a>', 'itv-backend' ), esc_url( $permalink ) ),
		2  => __( 'Custom field updated.', 'itv-backend' ),
		3  => __( 'Custom field deleted.', 'itv-backend' ),
		4  => __( 'Review updated.', 'itv-backend' ),
		/* translators: %s: date and time of the revision */
		5  => isset( $_GET['revision'] ) ? sprintf( __( 'Review restored to revision from %s', 'itv-backend' ), wp_post_revision_title( (int) $_GET['revision'], false ) ) : false,
		/* translators: %s: post permalink */
		6  => sprintf( __( 'Review published. <a href="%s">View Review</a>', 'itv-backend' ), esc_url( $permalink ) ),
		7  => __( 'Review saved.', 'itv-backend' ),
		/* translators: %s: post permalink */
		8  => sprintf( __( 'Review submitted. <a target="_blank" href="%s">Preview Review</a>', 'itv-backend' ), esc_url( add_query_arg( 'preview', 'true', $permalink ) ) ),
		/* translators: 1: Publish box date format, see https://secure.php.net/date 2: Post permalink */
		9  => sprintf( __( 'Review scheduled for: <strong>%1$s</strong>. <a target="_blank" href="%2$s">Preview Review</a>', 'itv-backend' ),
		date_i18n( __( 'M j, Y @ G:i', 'itv-backend' ), strtotime( $post->post_date ) ), esc_url( $permalink ) ),
		/* translators: %s: post permalink */
		10 => sprintf( __( 'Review draft updated. <a target="_blank" href="%s">Preview Review</a>', 'itv-backend' ), esc_url( add_query_arg( 'preview', 'true', $permalink ) ) ),
	);

	return $messages;
}
add_filter( 'post_updated_messages', 'review_updated_messages' );
