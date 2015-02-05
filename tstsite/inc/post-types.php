<?php
add_action('init', 'itv_custom_content', 20);
if(!function_exists('itv_custom_content')) {
function itv_custom_content(){
	
	
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
        'show_admin_column' => true,
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
        'has_archive'        => 'tasks',
        'rewrite'            => array('slug' => 'tasks', 'with_front' => false),
        'hierarchical'       => false,
        'menu_position'      => 5,
        'supports'           => array('title', 'editor', 'thumbnail', 'excerpt', 'comments', 'author'),
        'taxonomies'         => array('category', 'post_tag', 'reward'),
	));
}

}//if tst_custom_content





