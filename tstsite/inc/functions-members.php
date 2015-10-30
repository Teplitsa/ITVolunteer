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
    return (isset($active['solved'])) ? (int)$active['solved'] : 0;
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

function tst_register_user($user_params) {
	$error_message = '';
	$is_error = false;
	$error_sub_code = '';
	$result = false;
	
	if(tst_is_valid_register_user_params($user_params)) {
		if(!isset($user_params['login']) || username_exists($user_params['login'])) {
			$user_params['login'] = itv_get_unique_user_login(itv_translit_sanitize($user_params['first_name']), itv_translit_sanitize($user_params['last_name']));
		}
		
		if(username_exists($user_params['login'])) {
			$is_error = true;
			$error_message = __('Username already exists!', 'tst');
		} else if(email_exists($user_params['email'])) {
			$is_error = true;
			$error_message = __('Email already exists!', 'tst');
		}
		
		if(!$is_error) {
			$insert_user_params = array(
					'user_login' => $user_params['login'],
					'user_email' => $user_params['email'],
					'user_pass' => $user_params['pass'],
					'first_name' => $user_params['first_name'],
					'last_name' => $user_params['last_name'],
					'role' => 'author',
			);
			
			// process extra params
			if(isset($user_params['website']) && trim($user_params['website'])) {
				$insert_user_params['user_url'] = $user_params['website'];
			}
			elseif(isset($user_params['user_url']) && trim($user_params['user_url'])) {
				$insert_user_params['user_url'] = $user_params['user_url'];
			}
			
			$user_id = wp_insert_user($insert_user_params);
		
			if(is_wp_error($user_id)) {
				$is_error = true;
				$error_message = __('We are very sorry :( Some error occured while registering your account.', 'tst');
			}
			elseif($user_id) {
				$result = $user_id;
			}
			else {
				$is_error = true;
				$error_message = __('We are very sorry :( Some error occured while registering your account.', 'tst');
			}
		}
	}
	else {
		$is_error = true;
		$error_sub_code = 'invalid_params';
		$error_message = __('We are very sorry :( Some error occured while registering your account.', 'tst');
	}
	
	if($is_error) {
		$error_code = 'user_reg_failed';
		if($error_sub_code) {
			$error_code .= '-' . $error_sub_code;
		}
		$result = new WP_Error( $error_code, $error_message );
	}
	
	return $result;	 
}

function tst_is_valid_register_user_params($user_params) {
	$is_valid = true;
	if(!isset($user_params['email']) || !trim($user_params['email'])) {
		$is_valid = false;
	}
	elseif(!isset($user_params['pass']) || !trim($user_params['pass'])) {
		$is_valid = false;
	}
	elseif(!isset($user_params['first_name']) || !trim($user_params['first_name'])) {
		$is_valid = false;
	}
	elseif(!isset($user_params['last_name']) || !trim($user_params['last_name'])) {
		$is_valid = false;
	}
	
	return $is_valid;
}

function tst_send_activation_email($user, $email_subject, $email_body_template) {
	$user_id = $user->ID;
	$user_email = $user->user_email;
	$user_login = $user->user_login;
		
	$activation_code = sha1($user_id.'-activation-'.time());
	update_user_meta($user_id, 'activation_code', $activation_code);
	do_action('update_member_stats', array($user_id));
	
	$account_activation_url = "/account-activation/?uid=$user_id&code=$activation_code";
	$link = is_multisite() ? network_site_url($account_activation_url) : home_url($account_activation_url);
	
	wp_mail(
		$user_email,
		$email_subject,
		nl2br(sprintf($email_body_template, $link, $user_login))
	);
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


/** Leave a review for task doer */
function ajax_leave_review() {
	$_POST['nonce'] = empty($_POST['nonce']) ? '' : trim($_POST['nonce']);

	if(
			empty($_POST['task-id'])
			|| empty($_POST['doer-id'])
			|| empty($_POST['nonce'])
			|| !wp_verify_nonce($_POST['nonce'], 'task-leave-review')
	) {
		wp_die(json_encode(array(
		'status' => 'fail',
		'message' => __('<strong>Error:</strong> wrong data given.', 'tst'),
		)));
	}

	$task_id = $_POST['task-id'];
	$doer_id = $_POST['doer-id'];
	$task = get_post($task_id);
	$author_id = get_current_user_id();

	if(!$task) {
		wp_die(json_encode(array(
		'status' => 'fail',
		'message' => __('<strong>Error:</strong> task not found.', 'tst'),
		)));
	}

	if($author_id != $task->post_author) {
		wp_die(json_encode(array(
		'status' => 'fail',
		'message' => __('<strong>Error:</strong> operation not permitted.', 'tst'),
		)));
	}

	$task_doer = null;

	foreach(tst_get_task_doers($task->ID, true) as $doer) {
		if( !$doer ) // If doer deleted his account
			continue;
		if($doer_id == $doer->ID) {
			$task_doer = $doer;
			break;
		}
	}

	if(!$task_doer) {
		wp_die(json_encode(array(
		'status' => 'fail',
		'message' => __('<strong>Error:</strong> task doer not found.', 'tst'),
		)));
	}

	$message = htmlentities(trim(isset($_POST['review-message']) ? $_POST['review-message'] : ''), ENT_QUOTES, 'UTF-8');
	if(!$message) {
		wp_die(json_encode(array(
		'status' => 'fail',
		'message' => __('<strong>Error:</strong> empty message.', 'tst'),
		)));
	}

	$rating = (int)trim(isset($_POST['review-rating']) ? $_POST['review-rating'] : '');
	if(!$rating) {
		wp_die(json_encode(array(
		'status' => 'fail',
		'message' => __('Please rate doer work result', 'tst'),
		)));
	}

	if($task_doer) {
		$itv_reviews = ItvReviews::instance();
		if($itv_reviews->is_review_for_doer_and_task($task_doer->ID, $task->ID)) {
			wp_die(json_encode(array(
			'status' => 'fail',
			'message' => __('<strong>Error:</strong> review for the task already exists.', 'tst'),
			)));
		}
		$itv_reviews->add_review($author_id, $task_doer->ID, $task->ID, $message, $rating);
	}

	wp_die(json_encode(array(
	'status' => 'ok',
	'message' => __('Review saved', 'tst'),
	)));
}
add_action('wp_ajax_leave-review', 'ajax_leave_review');
add_action('wp_ajax_nopriv_leave-review', 'ajax_leave_review');


/** Leave a review for author */
function ajax_leave_review_author() {
	$_POST['nonce'] = empty($_POST['nonce']) ? '' : trim($_POST['nonce']);

	if(
			empty($_POST['task-id'])
			|| empty($_POST['author-id'])
			|| empty($_POST['nonce'])
			|| !wp_verify_nonce($_POST['nonce'], 'task-leave-review-author')
	) {
		wp_die(json_encode(array(
		'status' => 'fail',
		'message' => __('<strong>Error:</strong> wrong data given.', 'tst'),
		)));
	}

	$task_id = $_POST['task-id'];
	$author_id = $_POST['author-id'];
	$task = get_post($task_id);
	$doer_id = get_current_user_id();

	if(!$task) {
		wp_die(json_encode(array(
		'status' => 'fail',
		'message' => __('<strong>Error:</strong> task not found.', 'tst'),
		)));
	}

	if($author_id != $task->post_author) {
		wp_die(json_encode(array(
			'status' => 'fail',
			'message' => __('<strong>Error:</strong> operation not permitted.', 'tst'),
		)));
	}

	$task_doer = null;

	foreach(tst_get_task_doers($task->ID, true) as $doer) {
		if( !$doer ) // If doer deleted his account
			continue;
		if($doer_id == $doer->ID) {
			$task_doer = $doer;
			break;
		}
	}

	if(!$task_doer) {
		wp_die(json_encode(array(
			'status' => 'fail',
			'message' => __('<strong>Error:</strong> operation not permitted.', 'tst'),
		)));
	}

	$message = htmlentities(trim(isset($_POST['review-message']) ? $_POST['review-message'] : ''), ENT_QUOTES, 'UTF-8');
	if(!$message) {
		wp_die(json_encode(array(
			'status' => 'fail',
			'message' => __('<strong>Error:</strong> empty message.', 'tst'),
		)));
	}

	$rating = (int)trim(isset($_POST['review-rating']) ? $_POST['review-rating'] : '');
	if(!$rating) {
		wp_die(json_encode(array(
			'status' => 'fail',
			'message' => __('Please rate doer work result', 'tst'),
		)));
	}

	if($task_doer) {
		$itv_reviews = ItvReviewsAuthor::instance();
		if($itv_reviews->is_review_for_author_and_task($author_id, $task->ID)) {
			wp_die(json_encode(array(
				'status' => 'fail',
				'message' => __('<strong>Error:</strong> review for the task already exists.', 'tst'),
			)));
		}
		$itv_reviews->add_review($author_id, $task_doer->ID, $task->ID, $message, $rating);
	}

	wp_die(json_encode(array(
		'status' => 'ok',
		'message' => __('Review saved', 'tst'),
	)));
}
add_action('wp_ajax_leave-review-author', 'ajax_leave_review_author');
add_action('wp_ajax_nopriv_leave-review-author', 'ajax_leave_review_author');
