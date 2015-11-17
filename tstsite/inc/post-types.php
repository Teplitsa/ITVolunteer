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
	
	deregister_taxonomy_for_object_type('post_tag', 'post');
	add_post_type_support('page', 'excerpt');
	
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
        'supports'           => array('title', 'editor', 'thumbnail', 'excerpt', 'comments', 'author'),
        'taxonomies'         => array('category', 'post_tag', 'reward'),
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
			'admin_column' => true
        ));
    }
    
    // consults
    register_taxonomy('consult_source', array('consult'), array(
        'labels' => array(
            'name'                       => __('Consult sources', 'tst'),
            'singular_name'              => __('Consult source', 'tst'),
            'menu_name'                  => __('Consult sources', 'tst'),
            'all_items'                  => __('All consult sources', 'tst'),
            'edit_item'                  => __('Edit consult source', 'tst'),
            'view_item'                  => __('View consult source', 'tst'),
            'update_item'                => __('Update consult source', 'tst'),
            'add_new_item'               => __('Add new consult source', 'tst'),
            'new_item_name'              => __('New consult source name', 'tst'),
            'parent_item'                => __('Parent consult source', 'tst'),
            'parent_item_colon'          => __('Parent consult source:', 'tst'),
            'search_items'               => __('Search consult sources', 'tst'),
            'popular_items'              => __('Popular consult sources', 'tst'),
            'separate_items_with_commas' => __('Separate with commas', 'tst'),
            'add_or_remove_items'        => __('Add or remove consult source', 'tst'),
            'choose_from_most_used'      => __('Choose from most used consult sources', 'tst'),
            'not_found'                  => __('Not found consult sources', 'tst'),
        ),
        'hierarchical'      => true,
        'show_ui'           => true,
        'show_in_nav_menus' => true,
        'show_admin_column' => true,
        'query_var'         => true,
        'rewrite'           => array('slug' => 'consult_source', 'with_front' => false),
    ));
    
    register_taxonomy('consult_state', array('consult'), array(
        'labels' => array(
            'name'                       => __('Consult states', 'tst'),
            'singular_name'              => __('Consult state', 'tst'),
            'menu_name'                  => __('Consult states', 'tst'),
            'all_items'                  => __('All consult states', 'tst'),
            'edit_item'                  => __('Edit consult state', 'tst'),
            'view_item'                  => __('View consult state', 'tst'),
            'update_item'                => __('Update consult state', 'tst'),
            'add_new_item'               => __('Add new consult state', 'tst'),
            'new_item_name'              => __('New consult state name', 'tst'),
            'parent_item'                => __('Parent consult state', 'tst'),
            'parent_item_colon'          => __('Parent consult state:', 'tst'),
            'search_items'               => __('Search consult states', 'tst'),
            'popular_items'              => __('Popular consult states', 'tst'),
            'separate_items_with_commas' => __('Separate with commas', 'tst'),
            'add_or_remove_items'        => __('Add or remove consult state', 'tst'),
            'choose_from_most_used'      => __('Choose from most used consult states', 'tst'),
            'not_found'                  => __('Not found consult states', 'tst'),
        ),
        'hierarchical'      => true,
        'show_ui'           => true,
        'show_in_nav_menus' => true,
        'show_admin_column' => true,
        'query_var'         => true,
        'rewrite'           => array('slug' => 'consult_state', 'with_front' => false),
    ));
    
    register_post_type('consult', array(
        'labels' => array(
            'name'               => __('Consults', 'tst'),
            'singular_name'      => __('Consult', 'tst'),
            'menu_name'          => __('Consult', 'tst'),
            'name_admin_bar'     => __('Add consult', 'tst'),
            'add_new'            => __('Add new consult', 'tst'),
            'add_new_item'       => __('Add consult', 'tst'),
            'new_item'           => __('New consult', 'tst'),
            'edit_item'          => __('Edit consult', 'tst'),
            'view_item'          => __('View consult', 'tst'),
            'all_items'          => __('All consults', 'tst'),
            'search_items'       => __('Search consults', 'tst'),
            'parent_item_colon'  => __('Parent consult', 'tst'),
            'not_found'          => __('No consults found', 'tst'),
            'not_found_in_trash' => __('No consults found in Trash', 'tst'),
        ),
        'public'             => true,
        'exclude_from_search'=> true,
        'publicly_queryable' => false,
        'show_ui'            => true,
        'show_in_nav_menus'  => false,
        'show_in_menu'       => true,
        'show_in_admin_bar'  => true,
        'capability_type'    => 'post',
        'hierarchical'       => false,
        'menu_position'      => 6,
        'menu_icon'          => 'dashicons-editor-help',
        'supports'           => array('title', 'editor', 'author'),
        'taxonomies'         => array('consult_type'),
    ));
    
    if ( function_exists('p2p_register_connection_type') ) {
        p2p_register_connection_type(array(
            'name' => 'task-consult',
            'from' => 'tasks',
            'to' => 'consult',
            'cardinality' => 'many-to-many',
            'admin_column' => false,
            'title' => array(
                'from' => __('Consult', 'tst'),
                'to' => __('Task', 'tst'),
            ),
            'from_labels' => array(
                'singular_name' => __('Task', 'tst'),
                'search_items' => __('Search tasks', 'tst'),
                'not_found' => __('No tasks found', 'tst'),
                'create' => __('Create connections', 'tst'),
            ),
            'to_labels' => array(
                'singular_name' => __('Consult', 'tst'),
                'search_items' => __('Search consults', 'tst'),
                'not_found' => __('No consults found', 'tst'),
                'create' => __('Create connections', 'tst'),
            ),
        ));
        
        p2p_register_connection_type(array(
            'name' => 'consult-consultant',
            'from' => 'consult',
            'to' => 'user',
            'cardinality' => 'many-to-many',
            'admin_column' => 'from',
            'title' => array(
                'from' => __('Consultant', 'tst'),
                'to' => __('Consult', 'tst'),
            ),
            'from_labels' => array(
                'singular_name' => __('Consult', 'tst'),
                'search_items' => __('Search consults', 'tst'),
                'not_found' => __('No consults found', 'tst'),
                'create' => __('Create connections', 'tst'),
            ),
            'to_labels' => array(
                'singular_name' => __('Consultant', 'tst'),
                'search_items' => __('Search consultants', 'tst'),
                'not_found' => __('No consultants found', 'tst'),
                'create' => __('Create connections', 'tst'),
            ),
        ));
    }
    // end consults
}

}//if tst_custom_content
    






