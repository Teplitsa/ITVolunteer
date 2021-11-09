<?php

use ITV\models\{PartnerIcon};

/**
 * Registers the `partner_icon` post type.
 */
function partner_icon_init() {
	register_post_type( PartnerIcon::$post_type, array(
		'labels'                => array(
			'name'                  => __( 'Partner Icons', 'itv-backend' ),
			'singular_name'         => __( 'Partner Icons', 'itv-backend' ),
			'all_items'             => __( 'All Partner Icons', 'itv-backend' ),
			'archives'              => __( 'Partner Icons Archives', 'itv-backend' ),
			'attributes'            => __( 'Partner Icons Attributes', 'itv-backend' ),
			'insert_into_item'      => __( 'Insert into Partner Icons', 'itv-backend' ),
			'uploaded_to_this_item' => __( 'Uploaded to this Partners', 'itv-backend' ),
			'featured_image'        => _x( 'Featured Image', 'platform_partner', 'itv-backend' ),
			'set_featured_image'    => _x( 'Set featured image', 'platform_partner', 'itv-backend' ),
			'remove_featured_image' => _x( 'Remove featured image', 'platform_partner', 'itv-backend' ),
			'use_featured_image'    => _x( 'Use as featured image', 'platform_partner', 'itv-backend' ),
			'filter_items_list'     => __( 'Filter Partner Icons list', 'itv-backend' ),
			'items_list_navigation' => __( 'Partner Icons list navigation', 'itv-backend' ),
			'items_list'            => __( 'Partner Icons list', 'itv-backend' ),
			'new_item'              => __( 'New Partner Icons', 'itv-backend' ),
			'add_new'               => __( 'Add New', 'itv-backend' ),
			'add_new_item'          => __( 'Add New Partner Icons', 'itv-backend' ),
			'edit_item'             => __( 'Edit Partner Icons', 'itv-backend' ),
			'view_item'             => __( 'View Partner Icons', 'itv-backend' ),
			'view_items'            => __( 'View Partner Icons', 'itv-backend' ),
			'search_items'          => __( 'Search Partner Icons', 'itv-backend' ),
			'not_found'             => __( 'No Partner Icons found', 'itv-backend' ),
			'not_found_in_trash'    => __( 'No Partner Icons found in trash', 'itv-backend' ),
			'parent_item_colon'     => __( 'Parent Partner Icons:', 'itv-backend' ),
			'menu_name'             => __( 'Partner Icons', 'itv-backend' ),
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
		'menu_icon'             => 'dashicons-money',
		'show_in_rest'          => true,
		'rest_base'             => PartnerIcon::$post_type,
		'rest_controller_class' => 'WP_REST_Posts_Controller',
	) );

}
add_action( 'init', 'partner_icon_init' );

/**
 * Sets the post updated messages for the `partner_icon` post type.
 *
 * @param  array $messages Post updated messages.
 * @return array Messages for the `partner_icon` post type.
 */
function partner_icon_updated_messages( $messages ) {
	global $post;

	$permalink = get_permalink( $post );

	$messages[PartnerIcon::$post_type] = array(
		0  => '', // Unused. Messages start at index 1.
		/* translators: %s: post permalink */
		1  => sprintf( __( 'Partner Icon updated. <a target="_blank" href="%s">View Partner Icons</a>', 'itv-backend' ), esc_url( $permalink ) ),
		2  => __( 'Custom field updated.', 'itv-backend' ),
		3  => __( 'Custom field deleted.', 'itv-backend' ),
		4  => __( 'Partner Icons updated.', 'itv-backend' ),
		/* translators: %s: date and time of the revision */
		5  => isset( $_GET['revision'] ) ? sprintf( __( 'Partner Icons restored to revision from %s', 'itv-backend' ), wp_post_revision_title( (int) $_GET['revision'], false ) ) : false,
		/* translators: %s: post permalink */
		6  => sprintf( __( 'Partner Icons published. <a href="%s">View Partner Icons</a>', 'itv-backend' ), esc_url( $permalink ) ),
		7  => __( 'Partner Icons saved.', 'itv-backend' ),
		/* translators: %s: post permalink */
		8  => sprintf( __( 'Partner Icons submitted. <a target="_blank" href="%s">Preview Partner Icons</a>', 'itv-backend' ), esc_url( add_query_arg( 'preview', 'true', $permalink ) ) ),
		/* translators: 1: Publish box date format, see https://secure.php.net/date 2: Post permalink */
		9  => sprintf( __( 'Partner Icons scheduled for: <strong>%1$s</strong>. <a target="_blank" href="%2$s">Preview Partner Icons</a>', 'itv-backend' ),
		date_i18n( __( 'M j, Y @ G:i', 'itv-backend' ), strtotime( $post->post_date ) ), esc_url( $permalink ) ),
		/* translators: %s: post permalink */
		10 => sprintf( __( 'Partner Icons draft updated. <a target="_blank" href="%s">Preview Partner Icons</a>', 'itv-backend' ), esc_url( add_query_arg( 'preview', 'true', $permalink ) ) ),
	);

	return $messages;
}
add_filter( 'post_updated_messages', 'partner_icon_updated_messages' );
