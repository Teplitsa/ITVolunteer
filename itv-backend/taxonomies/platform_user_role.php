<?php

/**
 * Registers the `platform_user_role` taxonomy,
 * for use with 'platform_advantage'.
 */
function platform_user_role_init() {
	register_taxonomy( 'platform_user_role', array( 'platform_advantage', 'faq' ), array(
		'hierarchical'      => false,
		'public'            => false,
		'show_in_nav_menus' => false,
		'show_ui'           => true,
		'show_admin_column' => true,
		'query_var'         => true,
		'rewrite'           => false,
		'capabilities'      => array(
			'manage_terms'  => 'edit_posts',
			'edit_terms'    => 'edit_posts',
			'delete_terms'  => 'edit_posts',
			'assign_terms'  => 'edit_posts',
		),
		'labels'            => array(
			'name'                       => __( 'User roles', 'itv-backend' ),
			'singular_name'              => _x( 'User role', 'taxonomy general name', 'itv-backend' ),
			'search_items'               => __( 'Search User roles', 'itv-backend' ),
			'popular_items'              => __( 'Popular User roles', 'itv-backend' ),
			'all_items'                  => __( 'All User roles', 'itv-backend' ),
			'parent_item'                => __( 'Parent User role', 'itv-backend' ),
			'parent_item_colon'          => __( 'Parent User role:', 'itv-backend' ),
			'edit_item'                  => __( 'Edit User role', 'itv-backend' ),
			'update_item'                => __( 'Update User role', 'itv-backend' ),
			'view_item'                  => __( 'View User role', 'itv-backend' ),
			'add_new_item'               => __( 'Add New User role', 'itv-backend' ),
			'new_item_name'              => __( 'New User role', 'itv-backend' ),
			'separate_items_with_commas' => __( 'Separate User roles with commas', 'itv-backend' ),
			'add_or_remove_items'        => __( 'Add or remove User roles', 'itv-backend' ),
			'choose_from_most_used'      => __( 'Choose from the most used User roles', 'itv-backend' ),
			'not_found'                  => __( 'No User roles found.', 'itv-backend' ),
			'no_terms'                   => __( 'No User roles', 'itv-backend' ),
			'menu_name'                  => __( 'User roles', 'itv-backend' ),
			'items_list_navigation'      => __( 'User roles list navigation', 'itv-backend' ),
			'items_list'                 => __( 'User roles list', 'itv-backend' ),
			'most_used'                  => _x( 'Most Used', 'platform_user_role', 'itv-backend' ),
			'back_to_items'              => __( '&larr; Back to User roles', 'itv-backend' ),
		),
		'show_in_rest'      => true,
		'rest_base'         => 'platform-user-role',
		'rest_controller_class' => 'WP_REST_Terms_Controller',
	) );

}
add_action( 'init', 'platform_user_role_init' );

/**
 * Sets the post updated messages for the `platform_user_role` taxonomy.
 *
 * @param  array $messages Post updated messages.
 * @return array Messages for the `platform_user_role` taxonomy.
 */
function platform_user_role_updated_messages( $messages ) {

	$messages['platform_user_role'] = array(
		0 => '', // Unused. Messages start at index 1.
		1 => __( 'User role added.', 'itv-backend' ),
		2 => __( 'User role deleted.', 'itv-backend' ),
		3 => __( 'User role updated.', 'itv-backend' ),
		4 => __( 'User role not added.', 'itv-backend' ),
		5 => __( 'User role not updated.', 'itv-backend' ),
		6 => __( 'User roles deleted.', 'itv-backend' ),
	);

	return $messages;
}
add_filter( 'term_updated_messages', 'platform_user_role_updated_messages' );
