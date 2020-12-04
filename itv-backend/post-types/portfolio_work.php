<?php

require_once( get_theme_file_path() . '/post-types/portfolio_work_meta.php' );

use \ITV\models\PortfolioWorkManager;

/**
 * Registers the `portfolio_work` post type.
 */
function portfolio_work_init() {
	register_post_type( PortfolioWorkManager::$post_type, array(
		'labels'                => array(
			'name'                  => __( 'Portfolio works', 'itv-backend' ),
			'singular_name'         => __( 'Portfolio work', 'itv-backend' ),
			'all_items'             => __( 'All Portfolio works', 'itv-backend' ),
			'archives'              => __( 'Portfolio work Archives', 'itv-backend' ),
			'attributes'            => __( 'Portfolio work Attributes', 'itv-backend' ),
			'insert_into_item'      => __( 'Insert into portfolio work', 'itv-backend' ),
			'uploaded_to_this_item' => __( 'Uploaded to this portfolio work', 'itv-backend' ),
			'featured_image'        => _x( 'Featured Image', 'portfolio_work', 'itv-backend' ),
			'set_featured_image'    => _x( 'Set featured image', 'portfolio_work', 'itv-backend' ),
			'remove_featured_image' => _x( 'Remove featured image', 'portfolio_work', 'itv-backend' ),
			'use_featured_image'    => _x( 'Use as featured image', 'portfolio_work', 'itv-backend' ),
			'filter_items_list'     => __( 'Filter portfolio works list', 'itv-backend' ),
			'items_list_navigation' => __( 'Portfolio works list navigation', 'itv-backend' ),
			'items_list'            => __( 'Portfolio works list', 'itv-backend' ),
			'new_item'              => __( 'New Portfolio work', 'itv-backend' ),
			'add_new'               => __( 'Add New', 'itv-backend' ),
			'add_new_item'          => __( 'Add New Portfolio work', 'itv-backend' ),
			'edit_item'             => __( 'Edit Portfolio work', 'itv-backend' ),
			'view_item'             => __( 'View Portfolio work', 'itv-backend' ),
			'view_items'            => __( 'View Portfolio works', 'itv-backend' ),
			'search_items'          => __( 'Search portfolio works', 'itv-backend' ),
			'not_found'             => __( 'No portfolio works found', 'itv-backend' ),
			'not_found_in_trash'    => __( 'No portfolio works found in trash', 'itv-backend' ),
			'parent_item_colon'     => __( 'Parent Portfolio work:', 'itv-backend' ),
			'menu_name'             => __( 'Portfolio works', 'itv-backend' ),
		),
		'public'                => true,
		'hierarchical'          => false,
		'show_ui'               => true,
		'show_in_nav_menus'     => true,
		'supports'              => array( 'title', 'editor', 'thumbnail', 'custom-fields' ),
		'has_archive'           => true,
		'rewrite'               => true,
		'query_var'             => true,
		'menu_position'         => null,
		'menu_icon'             => 'dashicons-admin-post',
		'show_in_rest'          => true,
		'rest_base'             => PortfolioWorkManager::$post_type,
		'rest_controller_class' => 'WP_REST_Posts_Controller',
	) );

}
add_action( 'init', 'portfolio_work_init' );

/**
 * Sets the post updated messages for the `portfolio_work` post type.
 *
 * @param  array $messages Post updated messages.
 * @return array Messages for the `portfolio_work` post type.
 */
function portfolio_work_updated_messages( $messages ) {
	global $post;

	$permalink = get_permalink( $post );

	$messages['portfolio_work'] = array(
		0  => '', // Unused. Messages start at index 1.
		/* translators: %s: post permalink */
		1  => sprintf( __( 'Portfolio work updated. <a target="_blank" href="%s">View portfolio work</a>', 'itv-backend' ), esc_url( $permalink ) ),
		2  => __( 'Custom field updated.', 'itv-backend' ),
		3  => __( 'Custom field deleted.', 'itv-backend' ),
		4  => __( 'Portfolio work updated.', 'itv-backend' ),
		/* translators: %s: date and time of the revision */
		5  => isset( $_GET['revision'] ) ? sprintf( __( 'Portfolio work restored to revision from %s', 'itv-backend' ), wp_post_revision_title( (int) $_GET['revision'], false ) ) : false,
		/* translators: %s: post permalink */
		6  => sprintf( __( 'Portfolio work published. <a href="%s">View portfolio work</a>', 'itv-backend' ), esc_url( $permalink ) ),
		7  => __( 'Portfolio work saved.', 'itv-backend' ),
		/* translators: %s: post permalink */
		8  => sprintf( __( 'Portfolio work submitted. <a target="_blank" href="%s">Preview portfolio work</a>', 'itv-backend' ), esc_url( add_query_arg( 'preview', 'true', $permalink ) ) ),
		/* translators: 1: Publish box date format, see https://secure.php.net/date 2: Post permalink */
		9  => sprintf( __( 'Portfolio work scheduled for: <strong>%1$s</strong>. <a target="_blank" href="%2$s">Preview portfolio work</a>', 'itv-backend' ),
		date_i18n( __( 'M j, Y @ G:i', 'itv-backend' ), strtotime( $post->post_date ) ), esc_url( $permalink ) ),
		/* translators: %s: post permalink */
		10 => sprintf( __( 'Portfolio work draft updated. <a target="_blank" href="%s">Preview portfolio work</a>', 'itv-backend' ), esc_url( add_query_arg( 'preview', 'true', $permalink ) ) ),
	);

	return $messages;
}
add_filter( 'post_updated_messages', 'portfolio_work_updated_messages' );
