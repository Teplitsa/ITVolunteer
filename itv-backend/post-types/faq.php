<?php

/**
 * Registers the `faq` post type.
 */
function faq_init() {
	register_post_type( 'faq', array(
		'labels'                => array(
			'name'                  => __( 'FAQs', 'itv-backend' ),
			'singular_name'         => __( 'FAQ', 'itv-backend' ),
			'all_items'             => __( 'All FAQs', 'itv-backend' ),
			'archives'              => __( 'FAQ Archives', 'itv-backend' ),
			'attributes'            => __( 'FAQ Attributes', 'itv-backend' ),
			'insert_into_item'      => __( 'Insert into FAQ', 'itv-backend' ),
			'uploaded_to_this_item' => __( 'Uploaded to this FAQ', 'itv-backend' ),
			'featured_image'        => _x( 'Featured Image', 'faq', 'itv-backend' ),
			'set_featured_image'    => _x( 'Set featured image', 'faq', 'itv-backend' ),
			'remove_featured_image' => _x( 'Remove featured image', 'faq', 'itv-backend' ),
			'use_featured_image'    => _x( 'Use as featured image', 'faq', 'itv-backend' ),
			'filter_items_list'     => __( 'Filter FAQs list', 'itv-backend' ),
			'items_list_navigation' => __( 'FAQs list navigation', 'itv-backend' ),
			'items_list'            => __( 'FAQs list', 'itv-backend' ),
			'new_item'              => __( 'New FAQ', 'itv-backend' ),
			'add_new'               => __( 'Add New', 'itv-backend' ),
			'add_new_item'          => __( 'Add New FAQ', 'itv-backend' ),
			'edit_item'             => __( 'Edit FAQ', 'itv-backend' ),
			'view_item'             => __( 'View FAQ', 'itv-backend' ),
			'view_items'            => __( 'View FAQs', 'itv-backend' ),
			'search_items'          => __( 'Search FAQs', 'itv-backend' ),
			'not_found'             => __( 'No FAQs found', 'itv-backend' ),
			'not_found_in_trash'    => __( 'No FAQs found in trash', 'itv-backend' ),
			'parent_item_colon'     => __( 'Parent FAQ:', 'itv-backend' ),
			'menu_name'             => __( 'FAQs', 'itv-backend' ),
		),
		'public'                => false,
		'hierarchical'          => false,
		'show_ui'               => true,
		'show_in_nav_menus'     => false,
		'supports'              => array( 'title', 'editor' ),
		'has_archive'           => false,
		'rewrite'               => false,
		'query_var'             => true,
		'menu_position'         => null,
		'menu_icon'             => 'dashicons-admin-post',
		'show_in_rest'          => true,
		'rest_base'             => 'faq',
		'rest_controller_class' => 'WP_REST_Posts_Controller',
	) );

}
add_action( 'init', 'faq_init' );

/**
 * Sets the post updated messages for the `faq` post type.
 *
 * @param  array $messages Post updated messages.
 * @return array Messages for the `faq` post type.
 */
function faq_updated_messages( $messages ) {
	global $post;

	$permalink = get_permalink( $post );

	$messages['faq'] = array(
		0  => '', // Unused. Messages start at index 1.
		/* translators: %s: post permalink */
		1  => sprintf( __( 'FAQ updated. <a target="_blank" href="%s">View FAQ</a>', 'itv-backend' ), esc_url( $permalink ) ),
		2  => __( 'Custom field updated.', 'itv-backend' ),
		3  => __( 'Custom field deleted.', 'itv-backend' ),
		4  => __( 'FAQ updated.', 'itv-backend' ),
		/* translators: %s: date and time of the revision */
		5  => isset( $_GET['revision'] ) ? sprintf( __( 'FAQ restored to revision from %s', 'itv-backend' ), wp_post_revision_title( (int) $_GET['revision'], false ) ) : false,
		/* translators: %s: post permalink */
		6  => sprintf( __( 'FAQ published. <a href="%s">View FAQ</a>', 'itv-backend' ), esc_url( $permalink ) ),
		7  => __( 'FAQ saved.', 'itv-backend' ),
		/* translators: %s: post permalink */
		8  => sprintf( __( 'FAQ submitted. <a target="_blank" href="%s">Preview FAQ</a>', 'itv-backend' ), esc_url( add_query_arg( 'preview', 'true', $permalink ) ) ),
		/* translators: 1: Publish box date format, see https://secure.php.net/date 2: Post permalink */
		9  => sprintf( __( 'FAQ scheduled for: <strong>%1$s</strong>. <a target="_blank" href="%2$s">Preview FAQ</a>', 'itv-backend' ),
		date_i18n( __( 'M j, Y @ G:i', 'itv-backend' ), strtotime( $post->post_date ) ), esc_url( $permalink ) ),
		/* translators: %s: post permalink */
		10 => sprintf( __( 'FAQ draft updated. <a target="_blank" href="%s">Preview FAQ</a>', 'itv-backend' ), esc_url( add_query_arg( 'preview', 'true', $permalink ) ) ),
	);

	return $messages;
}
add_filter( 'post_updated_messages', 'faq_updated_messages' );
