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
        'supports'           => array('title', 'editor', 'thumbnail', 'excerpt', 'comments', 'author'),
        'taxonomies'         => array('category', 'post_tag', 'reward'),
        
        'show_in_graphql'    =>  true,
        'graphql_single_name' => 'task',
        'graphql_plural_name' => 'tasks',
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
    
add_action( 'graphql_register_types', 'itv_register_task_graphql_fields' );
function itv_register_task_graphql_fields() {
    register_graphql_field(
        'Task',
        'viewsCount',
        [
            'type'        => 'Int',
            'description' => __( 'Task views count', 'tst' ),
            'resolve'     => function( $task ) {
                return pvc_get_post_views($task->ID);
            },
        ]
    );
    
    register_graphql_field(
        'Task',
        'doerCandidatesCount',
        [
            'type'        => 'Int',
            'description' => __( 'Task doer candidates count', 'tst' ),
            'resolve'     => function( $task ) {
            return tst_get_task_doers_count($task->ID);
            },
        ]
    );
    
}

add_action( 'graphql_register_types', 'itv_register_user_graphql_fields' );
function itv_register_user_graphql_fields() {
    register_graphql_fields(
        'User',
        [
            'profileURL' => [
                'type'        => 'String',
                'description' => __( 'User profile URL', 'tst' ),
                'resolve'     => function( $user ) {
                    return tst_get_member_url($user->userId);
                },
            ],
            'fullName' => [
                'type'        => 'String',
                'description' => __( 'User profile URL', 'tst' ),
                'resolve'     => function( $user ) {
                    return tst_get_member_name($user->userId);
                },
            ],
            'solvedTasksCount' => [
                'type'        => 'Int',
                'description' => __( 'Number of tasks user solved as DOER', 'tst' ),
                'resolve'     => function( $user ) {
                    $key = 'solved';
                    $activity = tst_get_member_activity($user->userId, $key);
                    return $activity[$key];
                },
            ],
            'authorReviewsCount' => [
                'type'        => 'Int',
                'description' => __( 'User author reviews count', 'tst' ),
                'resolve'     => function( $user ) {
                    return ItvReviewsAuthor::instance()->count_author_reviews($user->userId);
                },
            ],
            'doerReviewsCount' => [
                'type'        => 'Int',
                'description' => __( 'User doer reviews count', 'tst' ),
                'resolve'     => function( $user ) {
                    return ItvReviews::instance()->count_doer_reviews($user->userId);
                },
            ],
            'organizationName' => [
                'type'        => 'String',
                'description' => __( 'User organization', 'tst' ),
                'resolve'     => function( $user ) {
                    return tst_get_member_field('user_workplace', $user->userId);
                },
            ],
            'organizationDescription' => [
                'type'        => 'String',
                'description' => __( 'User organization description', 'tst' ),
                'resolve'     => function( $user ) {
                    return tst_get_member_field('user_workplace_desc', $user->userId);
                },
            ],
            'organizationLogo' => [
                'type'        => 'String',
                'description' => __( 'User organization logo', 'tst' ),
                'resolve'     => function( $user ) {
                    return tst_get_member_user_company_logo_src( $user->userId );
                },
            ]
        ]
    );
    
}

use WPGraphQL\Data\DataSource;
use WPGraphQL\AppContext;
add_action( 'graphql_register_types', 'itv_register_doers_graphql_query' );
function itv_register_doers_graphql_query() {
    register_graphql_field(
        'RootQuery', 
        'taskDoers',
        [
            'description' => __( 'Task doers', 'tst' ),
            'type' => [ 'list_of' => 'User' ],
            'args'        => [
                'taskId'     => [
                    'type' => [
                        'non_null' => 'ID',
                    ],
                ],
            ],
            'resolve' => function($source, array $args, AppContext $context) {
                $doers = tst_get_task_doers($args['taskId'], false);
                $users = [];
                foreach($doers as $doer) {
                    $users[] = DataSource::resolve_user( $doer->ID, $context );
                }
                return $users;
            },
        ]
    );
}
 