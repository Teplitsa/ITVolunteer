<?php
/**
 * Members related functions after review
 **/

 
/* Define  roles */
function tst_get_roles_list() {
	
	return array(
		'donee'     => __('Beneficiary', 'tst'),
		'activist'  => __('Activist', 'tst'),
		'volunteer' => __('Volunteer', 'tst'),
		'hero'      => __('Superhero', 'tst'),
		'user'      => __('User', 'tst')
	);
}

function tst_get_role_name($role) {
	
	$roles = tst_get_roles_list(); 
	return ($roles[$role]) ? $roles[$role] : $roles['user'];
}


/* Role  */
function tst_user_object($user){
	
	if(is_object($user))
		return $user;
	
	if((int)$user > 0) {
		$user = get_user_by('id', $user);
	}
	elseif(is_string($user)){
		$user = get_user_by('login', $user);
	}
		
	return $user;
}

function tst_update_member_stat($user){ //everything
	
	$user = tst_user_object($user);
	
	tst_set_member_activity($user);
	tst_set_member_role($user);
}


// update data on hooks
add_action('update_member_stats', 'tst_update_data_for_users');
function tst_update_data_for_users($users = array()){
	
	if(empty($users)){
		$users[] = get_current_user_id();
	}
	
	foreach($users as $user){
		tst_update_member_stat($user);
	}
	
}


/* Role actions */
function tst_calculate_member_role($user) {
	
	//user object
	$user = tst_user_object($user);
	
	$role = 'user';
	$activity =  tst_calculate_member_activity($user);
	
	if($activity['solved'] > 0){
		$role = 'hero';
	}
	elseif($activity['created_closed'] > 0){
		$role = 'donee';
	}
	elseif($activity['joined'] > 0 && $activity['joined'] >= $activity['created']) {
		$role = 'volunteer';
	}
	elseif($activity['created'] > 0){
		$role = 'activist';
	}
	
	return $role;
}

function tst_get_member_role_key($user){
	
	$user = tst_user_object($user);
	return get_user_meta($user->ID, 'tst_member_role', true);
}

function tst_get_member_role_name($user){
	
	$user = tst_user_object($user);
	$key = get_user_meta($user->ID, 'tst_member_role', true);
	return tst_get_role_name($key);
}

function tst_set_member_role($user) {
	
	$user = tst_user_object($user);
	$role = tst_calculate_member_role($user);
	
	update_user_meta($user->ID, 'tst_member_role', $role);
}


/* Activity stats */
function tst_calculate_member_activity($user, $type = 'all') {
	
	//user object
	$user = tst_user_object($user);
		
	$activity = array(
		'created'        => 0,
		'created_closed' => 0,
		'joined'         => 0,
		'solved'         => 0
	);	
	
	if($type = 'all'){
		$activity['created'] = tst_query_member_tasks_created($user, null, null, true);
		$activity['created_closed'] = tst_query_member_tasks_created($user, array('closed'), null, true);
		$activity['joined'] = tst_calculate_member_tasks_joined($user, null, null, true);
		$activity['solved'] = tst_calculate_member_tasks_solved($user, null, true);
		
	}
	elseif($type == 'created') {
		$activity['created'] = tst_query_member_tasks_created($user, null, null, true);
	}
	elseif($type == 'created_closed') {
		$activity['created_closed'] = tst_query_member_tasks_created($user, array('closed'), null, true);
	}
	elseif($type == 'joined') {
		$activity['joined'] = tst_calculate_member_tasks_joined($user, null, null, true);
	}
	elseif($type == 'solved') {
		$activity['solved'] = tst_calculate_member_tasks_solved($user, null, true);
	}
	
	return $activity;
}

function tst_get_member_activity($user, $type = 'all'){
	
	$user = tst_user_object($user);
	$keys = ($type == 'all') ? array('created', 'created_closed', 'joined', 'solved') : array($type);
	$activity = array();
	
	foreach($keys as $key) {		
		$activity[$key] = get_user_meta($user->ID, 'tst_member_tasks_'.$key, true);
	}
	
	return $activity;
}

function tst_set_member_activity($user, $type = 'all') {
	
	$user = tst_user_object($user);
	$keys = ($type == 'all') ? array('created', 'created_closed', 'joined', 'solved') : array($type);
	$activity = tst_calculate_member_activity($user, $type);
	
	foreach($keys as $key) {		
		update_user_meta($user->ID, 'tst_member_tasks_'.$key, $activity[$key]);
	}	
}

function tst_get_user_rating($user) {
	
    $user = tst_user_object($user);
	$activ = tst_get_member_activity($user, 'solved');	
    return (int)$active['solved'];
}


/* Related tasks queries */
function tst_query_member_tasks_created($user, $status = null, $num = null, $only_count = false) {
	
	$params = array(
        'post_type' => 'tasks',
        'author' => $user->ID,
        'nopaging' => true,
		'post_status' => ($status) ? $status : array('publish', 'in_work', 'closed'),
		'posts_per_page' => ($num) ? (int)$num : -1
    );
  
	$query = new WP_Query($params);
	return ($only_count) ? $query->found_posts : $query;	
}

function tst_calculate_member_tasks_joined($user, $status = null, $num = null, $only_count = false) {
	
	$params = array(
		'post_type' => 'tasks',
        'connected_type' => 'task-doers',
        'connected_items' => $user->ID,
        'suppress_filters' => false,
        'nopaging' => true,
		'post_status' => ($status) ? $status : array('publish', 'in_work', 'closed'),
		'posts_per_page' => ($num) ? (int)$num : -1
    );

    $query = new WP_Query($params);
	return ($only_count) ? $query->found_posts : $query;	
}

function tst_calculate_member_tasks_solved($user, $num = null, $only_count = false) {
	
	$params = array(
		'post_type' => 'tasks',
		'connected_type'   => 'task-doers',
		'connected_items'  => $user->ID,
		'suppress_filters' => false,
		'nopaging'         => true,
		'connected_meta'  => array(
			 array(
				 'key'     =>'is_approved',
				 'value'   => 1,
				 'compare' => '='
			 )
		),
		'post_status'     => array('closed'),
		'posts_per_page' => ($num) ? (int)$num : -1,		
    );

    $query = new WP_Query($params);
	return ($only_count) ? $query->found_posts : $query;	
}


/* Last login data */
function save_user_last_login_time($user) {
	update_user_meta($user->ID, 'itv_last_login_time', date('Y-m-d H:i:s'));
}

function get_user_last_login_time($user) {
	return $user ? get_user_meta($user->ID, 'itv_last_login_time', true) : null;
}


/* No admin bar for non-editors */
add_filter('show_admin_bar', 'tst_remove_admin_bar');
function tst_remove_admin_bar($show){
	
	if(!current_user_can('edit_others_posts'))
		return false;
	
	return $show;
}
