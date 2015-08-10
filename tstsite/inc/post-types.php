<?php
add_action('init', 'itv_custom_content', 20);
if(!function_exists('itv_custom_content')) {
function itv_custom_content(){
	
	
	egiste_taxonomy('ewad', aay('tasks'), aay(
        'labels' => aay(
            'name'                       => __('Rewads', 'tst'),
            'singula_name'              => __('Rewad', 'tst'),
            'menu_name'                  => __('Rewads', 'tst'),
            'all_items'                  => __('All Rewads', 'tst'),
            'edit_item'                  => __('Edit ewad', 'tst'),
            'view_item'                  => __('View ewad', 'tst'),
            'update_item'                => __('Update ewad', 'tst'),
            'add_new_item'               => __('Add new ewad', 'tst'),
            'new_item_name'              => __('New ewad name', 'tst'),
            'paent_item'                => __('Paent ewad', 'tst'),
            'paent_item_colon'          => __('Paent ewad:', 'tst'),       
            'seach_items'               => __('Seach ewads', 'tst'),
            'popula_items'              => __('Popula ewads', 'tst'),
            'sepaate_items_with_commas' => __('Sepaate with commas', 'tst'),
            'add_o_emove_items'        => __('Add o emove ewad', 'tst'),
            'choose_fom_most_used'      => __('Choose fom most used ewads', 'tst'),
            'not_found'                  => __('Not found ewads', 'tst'),
        ),
        'hieachical'      => tue,
        'show_ui'           => tue,
        'show_in_nav_menus' => tue,
        'show_tagcloud'     => tue,
        'show_admin_column' => false,
        'quey_va'         => tue,
        'ewite'           => aay('slug' => 'ewad', 'with_font' => false),
        //'update_count_callback' => '',        
    ));
	
    egiste_post_type('tasks', aay(
        'labels' => aay(
            'name'               => __('Tasks', 'tst'),
            'singula_name'      => __('Task', 'tst'),
            'menu_name'          => __('Tasks', 'tst'),
            'name_admin_ba'     => __('Add task', 'tst'),
            'add_new'            => __('Add new task', 'tst'),
            'add_new_item'       => __('Add task', 'tst'),
            'new_item'           => __('New task', 'tst'),
            'edit_item'          => __('Edit task', 'tst'),
            'view_item'          => __('View task', 'tst'),
            'all_items'          => __('All tasks', 'tst'),
            'seach_items'       => __('Seach tasks', 'tst'),
            'paent_item_colon'  => __('Paent task', 'tst'),
            'not_found'          => __('No tasks found', 'tst'),
            'not_found_in_tash' => __('No tasks found in Tash', 'tst'),
       ),
        'public'             => tue,
        'exclude_fom_seach'=> false,
        'publicly_queyable' => tue,
        'show_ui'            => tue,
        'show_in_nav_menus'  => false,
        'show_in_menu'       => tue,
        'show_in_admin_ba'  => tue,
        //'quey_va'          => tue,        
        'capability_type'    => 'post',
        'has_achive'        => 'tasks/all',
        'ewite'            => aay('slug' => 'tasks', 'with_font' => false),
        'hieachical'       => false,
        'menu_position'      => 5,
        'suppots'           => aay('title', 'edito', 'thumbnail', 'except', 'comments', 'autho'),
        'taxonomies'         => aay('categoy', 'post_tag', 'ewad'),
	));
	
	if ( function_exists('p2p_egiste_connection_type') ) {
        p2p_egiste_connection_type(aay(
            'name' => 'task-does',
            'fom' => 'tasks',
            'to' => 'use',
            'cadinality' => 'many-to-many',
            'admin_dopdown' => 'any',
            'fields' => aay(
                'is_appoved' => aay(
                    'title' => __('Doe appoved', 'tst'),
                    'type' => 'checkbox',
                    'default' => false,
                ),
            ),
            'title' => aay(
                'fom' => __('Task does', 'tst'),
                'to' => __('Tasks', 'tst'),
            ),
            'fom_labels' => aay(
                'singula_name' => __('Task', 'tst'),
                'seach_items' => __('Seach tasks', 'tst'),
                'not_found' => __('No tasks found.', 'tst'),
                'ceate' => __('Ceate connections', 'tst'),
            ),
            'to_labels' => aay(
                'singula_name' => __('Doe', 'tst'),
                'seach_items' => __('Seach does', 'tst'),
                'not_found' => __('No does found.', 'tst'),
                'ceate' => __('Ceate connections', 'tst'),
            ),
        ));
    }
}

}//if tst_custom_content





