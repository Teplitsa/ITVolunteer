<?php

function deregister_taxonomy_for_object_type( $taxonomy, $object_type) {
	global $wp_taxonomies;

	if ( !isset($wp_taxonomies[$taxonomy]) )
		return false;

	if ( ! get_post_type_object($object_type) )
		return false;
	
	foreach($wp_taxonomies[$taxonomy]->object_type as $index => $object){
		
		if($object == $object_type)
			unset($wp_taxonomies[$taxonomy]->object_type[$index]);
	}
	
	return true;
}

add_action('init', 'itv_custom_content', 20);
if(!function_exists('itv_custom_content')) {
function itv_custom_content(){
    global $wp_rewrite;
	
	deregister_taxonomy_for_object_type('post_tag', 'post');
	add_post_type_support('page', 'excerpt');

    $labels = array(
        'name'                       => __( 'Tags'),
        'singular_name'              => __( 'Tag' ),
        'menu_name'                  => __( 'Tags' ),
        'all_items'                  => __( 'All Tags' ),
        'parent_item'                => __( 'Parent' ),
        'parent_item_colon'          => __( 'Parent:' ),
        'new_item_name'              => __( 'New Tag Name' ),
        'add_new_item'               => __( 'Add New Tag' ),
        'edit_item'                  => __( 'Edit Tag' ),
        'update_item'                => __( 'Update Tag' ),
        'view_item'                  => __( 'View Tag' ),
        'separate_items_with_commas' => __( 'Separate tags with commas' ),
        'add_or_remove_items'        => __( 'Add or remove tags' ),
        'choose_from_most_used'      => __( 'Choose from the most used' ),
        'popular_items'              => __( 'Tags' ),
        'search_items'               => __( 'Search Tags' ),
        'not_found'                  => __( 'Not Found' ),
    );

    register_taxonomy( 'post_tag', 'post', array(
        'hierarchical'              => true,
        'query_var'                 => 'tag',
        'labels'                    => $labels,
        'rewrite'                   => array(
                                            'hierarchical' => false,
                                            'slug'         => get_option( 'tag_base' ) ? get_option( 'tag_base' ) : 'tag',
                                            'with_front'   => ! get_option( 'tag_base' ) || $wp_rewrite->using_index_permalinks(),
                                            'ep_mask'      => EP_TAGS,
                                        ),
        'public'                    => true,
        'show_ui'                   => true,
        'show_admin_column'         => true,
        '_builtin'                  => true,

        'show_in_rest' => true,
        'rest_base' => 'tags',
        
        'show_in_graphql' => true,
        'graphql_single_name' => 'tag',
        'graphql_plural_name' => 'tags'
    ) );

	
	register_taxonomy('reward', array('tasks'), array(
        'labels' => array(
            'name'                       => __('Rewards', 'tst'),
            'singular_name'              => __('Reward', 'tst'),
            'menu_name'                  => __('Rewards', 'tst'),
            'all_items'                  => __('All Rewards', 'tst'),
            'edit_item'                  => __('Edit reward', 'tst'),
            'view_item'                  => __('View reward', 'tst'),
            'update_item'                => __('Update reward', 'tst'),
            'add_new_item'               => __('Add new reward', 'tst'),
            'new_item_name'              => __('New reward name', 'tst'),
            'parent_item'                => __('Parent reward', 'tst'),
            'parent_item_colon'          => __('Parent reward:', 'tst'),       
            'search_items'               => __('Search rewards', 'tst'),
            'popular_items'              => __('Popular rewards', 'tst'),
            'separate_items_with_commas' => __('Separate with commas', 'tst'),
            'add_or_remove_items'        => __('Add or remove reward', 'tst'),
            'choose_from_most_used'      => __('Choose from most used rewards', 'tst'),
            'not_found'                  => __('Not found rewards', 'tst'),
        ),
        'hierarchical'      => true,
        'show_ui'           => true,
        'show_in_nav_menus' => true,
        'show_tagcloud'     => true,
        'show_admin_column' => false,
        'query_var'         => true,
        'rewrite'           => array('slug' => 'reward', 'with_front' => false),
        //'update_count_callback' => '', 

        'show_in_rest' => true,
        'rest_base' => 'rewards',
        
	    'show_in_graphql' => true,
	    'graphql_single_name' => 'RewardTag',
	    'graphql_plural_name' => 'RewardTags'
    ));
    
    register_taxonomy('nko_task_tag', array('tasks'), array(
        'labels' => array(
            'name'                       => __('NPO Tags', 'tst'),
            'singular_name'              => __('NPO Tag', 'tst'),
            'menu_name'                  => __('NPO Tags', 'tst'),
            'all_items'                  => __('All NPO Tags', 'tst'),
            'edit_item'                  => __('Edit NPO Tag', 'tst'),
            'view_item'                  => __('View NPO Tag', 'tst'),
            'update_item'                => __('Update NPO Tag', 'tst'),
            'add_new_item'               => __('Add new NPO Tag', 'tst'),
            'new_item_name'              => __('New NPO Tag name', 'tst'),
            'parent_item'                => __('Parent NPO Tag', 'tst'),
            'parent_item_colon'          => __('Parent NPO Tag:', 'tst'),
            'search_items'               => __('Search NPO Tags', 'tst'),
            'popular_items'              => __('Popular NPO Tags', 'tst'),
            'separate_items_with_commas' => __('Separate with commas', 'tst'),
            'add_or_remove_items'        => __('Add or remove NPO Tag', 'tst'),
            'choose_from_most_used'      => __('Choose from most used NPO Tags', 'tst'),
            'not_found'                  => __('Not found NPO Tags', 'tst'),
        ),
        'hierarchical'      => true,
        'show_ui'           => true,
        'show_in_nav_menus' => true,
        'show_tagcloud'     => true,
        'show_admin_column' => false,
        'query_var'         => true,
        'rewrite'           => array('slug' => 'nko_task_tag'),

        'show_in_rest' => true,
        'rest_base' => 'ngo-tags',
        
        'show_in_graphql' => true,
        'graphql_single_name' => 'NgoTaskTag',
        'graphql_plural_name' => 'NgoTaskTags'
    ));
	
    register_post_type('tasks', array(
        'labels' => array(
            'name'               => __('Tasks', 'tst'),
            'singular_name'      => __('Task', 'tst'),
            'menu_name'          => __('Tasks', 'tst'),
            'name_admin_bar'     => __('Add task', 'tst'),
            'add_new'            => __('Add new task', 'tst'),
            'add_new_item'       => __('Add task', 'tst'),
            'new_item'           => __('New task', 'tst'),
            'edit_item'          => __('Edit task', 'tst'),
            'view_item'          => __('View task', 'tst'),
            'all_items'          => __('All tasks', 'tst'),
            'search_items'       => __('Search tasks', 'tst'),
            'parent_item_colon'  => __('Parent task', 'tst'),
            'not_found'          => __('No tasks found', 'tst'),
            'not_found_in_trash' => __('No tasks found in Trash', 'tst'),
       ),
        'public'             => true,
        'exclude_from_search'=> false,
        'publicly_queryable' => true,
        'show_ui'            => true,
        'show_in_nav_menus'  => false,
        'show_in_menu'       => true,
        'show_in_admin_bar'  => true,
        //'query_var'          => true,        
        'capability_type'    => 'post',
        'has_archive'        => 'tasks/all',
        'rewrite'            => array('slug' => 'tasks', 'with_front' => false),
        'hierarchical'       => false,
        'menu_position'      => 5,
		'menu_icon'          => 'dashicons-welcome-write-blog',
        'show_in_rest'       => true,
        'supports'           => array('title', 'editor', 'thumbnail', 'excerpt', 'comments', 'author'),
        'taxonomies'         => array('category', 'post_tag', 'reward'),
        
        'show_in_rest' => true,
        'rest_base' => 'tasks',

        'show_in_graphql'    =>  true,
        'graphql_single_name' => 'task',
        'graphql_plural_name' => 'tasks',
	));

    register_taxonomy('help_category', array('help'), array(
        'labels' => array(
            'name'                       => __('Help Categories', 'tst'),
            'singular_name'              => __('Help Category', 'tst'),
            'menu_name'                  => __('Help Categories', 'tst'),
            'all_items'                  => __('All Help Categories', 'tst'),
            'edit_item'                  => __('Edit Help Category', 'tst'),
            'view_item'                  => __('View Help Category', 'tst'),
            'update_item'                => __('Update Help Category', 'tst'),
            'add_new_item'               => __('Add new Help Category', 'tst'),
            'new_item_name'              => __('New Help Category name', 'tst'),
            'parent_item'                => __('Parent Help Category', 'tst'),
            'parent_item_colon'          => __('Parent Help Category:', 'tst'),
            'search_items'               => __('Search Help Categories', 'tst'),
            'popular_items'              => __('Popular Help Categories', 'tst'),
            'separate_items_with_commas' => __('Separate with commas', 'tst'),
            'add_or_remove_items'        => __('Add or remove Help Category', 'tst'),
            'choose_from_most_used'      => __('Choose from most used Help Categories', 'tst'),
            'not_found'                  => __('Not found Help Categories', 'tst'),
        ),
        'hierarchical'      => true,
        'show_ui'           => true,
        'show_in_nav_menus' => true,
        'show_tagcloud'     => true,
        'show_admin_column' => false,
        'query_var'         => true,
        'rewrite'           => array('slug' => 'help_category'),
        
        'show_in_graphql' => true,
        'graphql_single_name' => 'HelpCategory',
        'graphql_plural_name' => 'HelpCategories'
    ));
  
    register_post_type('help', array(
        'labels' => array(
            'name'               => __('Help', 'tst'),
            'singular_name'      => __('Help', 'tst'),
            'menu_name'          => __('Help', 'tst'),
            'name_admin_bar'     => __('Add help', 'tst'),
            'add_new'            => __('Add new', 'tst'),
            'add_new_item'       => __('Add help', 'tst'),
            'new_item'           => __('New help', 'tst'),
            'edit_item'          => __('Edit help', 'tst'),
            'view_item'          => __('View help', 'tst'),
            'all_items'          => __('All help', 'tst'),
            'search_items'       => __('Search help', 'tst'),
            'parent_item_colon'  => __('Parent help', 'tst'),
            'not_found'          => __('No help found', 'tst'),
            'not_found_in_trash' => __('No help found in Trash', 'tst'),
       ),
        'public'             => true,
        'exclude_from_search'=> false,
        'publicly_queryable' => true,
        'show_ui'            => true,
        'show_in_nav_menus'  => false,
        'show_in_menu'       => true,
        'show_in_admin_bar'  => true,
        //'query_var'          => true,        
        'capability_type'    => 'post',
        'has_archive'        => 'tasks/all',
        'rewrite'            => array('slug' => 'helpList', 'with_front' => false),
        'hierarchical'       => false,
        'menu_position'      => 5,
    'menu_icon'          => 'dashicons-welcome-write-blog',
        'supports'           => array('title', 'editor', 'thumbnail', 'excerpt', 'comments', 'author'),
        'taxonomies'         => array('help_category'),
        
        'show_in_graphql'    =>  true,
        'graphql_single_name' => 'help',
        'graphql_plural_name' => 'helpList',
  ));

	if ( function_exists('p2p_register_connection_type') ) {
        p2p_register_connection_type(array(
            'name' => 'task-doers',
            'from' => 'tasks',
            'to' => 'user',
            'cardinality' => 'many-to-many',
            'admin_dropdown' => 'any',
            'fields' => array(
                'is_approved' => array(
                    'title' => __('Doer approved', 'tst'),
                    'type' => 'checkbox',
                    'default' => false,
                ),
            ),
            'title' => array(
                'from' => __('Task doers', 'tst'),
                'to' => __('Tasks', 'tst'),
            ),
            'from_labels' => array(
                'singular_name' => __('Task', 'tst'),
                'search_items' => __('Search tasks', 'tst'),
                'not_found' => __('No tasks found.', 'tst'),
                'create' => __('Create connections', 'tst'),
            ),
            'to_labels' => array(
                'singular_name' => __('Doer', 'tst'),
                'search_items' => __('Search doers', 'tst'),
                'not_found' => __('No doers found.', 'tst'),
                'create' => __('Create connections', 'tst'),
            ),
			'admin_column' => false,
        ));
    }
}

}//if tst_custom_content
 
 