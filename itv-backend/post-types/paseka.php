<?php

function itv_paseka_custom_content()
{
    /** Post types: */
    register_post_type('member', array(
        'labels' => array(
            'name'               => 'Участники',
            'singular_name'      => 'Участник',
            'menu_name'          => 'Реестр участников',
            'name_admin_bar'     => 'Добавить участника',
            'add_new'            => 'Добавить нового',
            'add_new_item'       => 'Добавить участника',
            'new_item'           => 'Новый участник',
            'edit_item'          => 'Редактировать участника',
            'view_item'          => 'Просмотр участника',
            'all_items'          => 'Все участники',
            'search_items'       => 'Искать участников',
            'parent_item_colon'  => 'Родительский участник:',
            'not_found'          => 'Участники не найдены',
            'not_found_in_trash' => 'В Корзине участники не найдены'
       ),
        'public'              => true,
        'exclude_from_search' => false,
        'publicly_queryable'  => true,
        'show_ui'             => true,
        'show_in_nav_menus'   => false,
        'show_in_menu'        => true,
        'show_in_admin_bar'   => true,
        //'query_var'           => true,
        'capability_type'     => 'post',
        'has_archive'         => 'registry',
        'rewrite'             => array('slug' => 'member', 'with_front' => false),
        'hierarchical'        => false,
        'menu_position'       => 5,
		'menu_icon'           => 'dashicons-admin-users',
        'supports'            => array('title', 'editor', 'thumbnail'),
        'taxonomies'          => array('member_cat', 'member_status'),
    ));
}
add_action('init', 'itv_paseka_custom_content', 20);

function itv_paseka_connection_types()
{
	p2p_register_connection_type( array(
		'name' => 'user_member',
		'from' => 'member',
		'to'   => 'user',
		'sortable'   => false,
		'reciprocal' => false,
		'prevent_duplicates' => true,
		'cardinality' => 'one-to-one',
		'to_query_vars' => array( 'role' => 'contributor' ),
		'admin_box' => array(
			'show' => 'any',
			'context' => 'normal',
			'can_create_post' => true
		),
		'admin_column' => 'to'
	) );
	
}
add_action( 'p2p_init', 'itv_paseka_connection_types' );
