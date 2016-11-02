<?php
/**
 * Members related functions after review
 **/

use ITV\models\UserXPModel;
use ITV\models\ThankyouModel;
use ITV\models\ItvThankyouRecentlySaidException;
use ITV\dao\ThankYou;
use \WeDevs\ORM\WP\User as User;
use \WeDevs\ORM\WP\UserMeta as UserMeta;

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
	return isset($roles[$role]) ? $roles[$role] : $roles['user'];
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
// 	    $activity['created'] = tst_query_member_tasks_created($user, null, null, true);
// 		$activity['created_closed'] = tst_query_member_tasks_created($user, array('closed'), null, true);
// 		$activity['joined'] = tst_calculate_member_tasks_joined($user, null, null, true);
// 		$activity['solved'] = tst_calculate_member_tasks_solved($user, null, true);

	    $activity['created'] = tst_query_member_tasks_created_count_raw_sql($user);
	    $activity['created_closed'] = tst_query_member_tasks_created_closed_count_raw_sql($user);
	    $activity['joined'] = tst_calculate_member_tasks_joined_count_raw_sql($user);
	    $activity['solved'] = tst_calculate_member_tasks_solved_count_raw_sql($user);
	}
	elseif($type == 'created') {
// 		$activity['created'] = tst_query_member_tasks_created($user, null, null, true);
	    $activity['created'] = tst_query_member_tasks_created_count_raw_sql($user);
	}
	elseif($type == 'created_closed') {
// 		$activity['created_closed'] = tst_query_member_tasks_created($user, array('closed'), null, true);
	    $activity['created_closed'] = tst_query_member_tasks_created_closed_count_raw_sql($user);
	}
	elseif($type == 'joined') {
// 		$activity['joined'] = tst_calculate_member_tasks_joined($user, null, null, true);
		$activity['joined'] = tst_calculate_member_tasks_joined_count_raw_sql($user);		
	}
	elseif($type == 'solved') {
// 		$activity['solved'] = tst_calculate_member_tasks_solved($user, null, true);
	    $activity['solved'] = tst_calculate_member_tasks_solved_count_raw_sql($user);
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
	unset($activity);
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

function tst_query_member_tasks_created_count_raw_sql($user) {
    global $wpdb;
    $sql = "SELECT COUNT(posts.ID) FROM {$wpdb->posts} as posts WHERE posts.post_author = %d AND posts.post_type = 'tasks' AND posts.post_status IN ('publish', 'in_work', 'closed')";
    return $wpdb->get_var($wpdb->prepare($sql, $user->ID));
}

function tst_query_member_tasks_created_closed_count_raw_sql($user) {
    global $wpdb;
    $sql = "SELECT COUNT(posts.ID) FROM {$wpdb->posts} as posts WHERE posts.post_author = %d AND posts.post_type = 'tasks' AND posts.post_status IN ('closed')";
    return $wpdb->get_var($wpdb->prepare($sql, $user->ID));
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

function tst_calculate_member_tasks_joined_count_raw_sql($user) {
    global $wpdb;
    #$sql = "SELECT COUNT(posts.ID) FROM {$wpdb->posts} AS posts INNER JOIN {$wpdb->prefix}p2p AS p2p ON p2p.p2p_from = posts.ID WHERE posts.post_type = 'tasks' AND posts.post_status IN ('publish', 'in_work', 'closed') AND p2p.p2p_type = 'task-doers' AND posts.ID = p2p.p2p_from AND p2p.p2p_to = %d ";
    $sql = "SELECT COUNT(posts.ID) FROM {$wpdb->posts} AS posts LEFT JOIN {$wpdb->prefix}p2p AS p2p ON p2p.p2p_from = posts.ID LEFT JOIN {$wpdb->prefix}usermeta AS um ON um.user_id = posts.post_author AND um.meta_key = 'activation_code' WHERE posts.post_type = 'tasks' AND posts.post_status IN ('publish', 'in_work', 'closed') AND p2p.p2p_type = 'task-doers' AND posts.ID = p2p.p2p_from AND p2p.p2p_to = %d AND (um.meta_value = '' OR um.meta_value IS NULL) ";
    return $wpdb->get_var($wpdb->prepare($sql, $user->ID));
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

function tst_calculate_member_tasks_solved_count_raw_sql($user) {
    global $wpdb;
    
    $sql = "SELECT COUNT(posts.ID) FROM {$wpdb->posts} AS posts INNER JOIN {$wpdb->prefix}p2p AS p2p ON p2p.p2p_from = posts.ID INNER JOIN {$wpdb->prefix}p2pmeta AS p2pmeta ON p2p.p2p_id = p2pmeta.p2p_id 
        LEFT JOIN {$wpdb->prefix}usermeta AS um ON um.user_id = posts.post_author AND um.meta_key = 'activation_code' 
        WHERE posts.post_type = 'tasks' AND posts.post_status = 'closed'
            AND (um.meta_value = '' OR um.meta_value IS NULL)
            AND p2p.p2p_type = 'task-doers' AND posts.ID = p2p.p2p_from 
            AND p2p.p2p_to = %d AND p2pmeta.meta_key = 'is_approved'
            AND CAST(p2pmeta.meta_value AS CHAR) = '1' ";
    
    return $wpdb->get_var($wpdb->prepare($sql, $user->ID));
}

function itv_get_unique_user_login($first_name, $last_name = '') {
	$new_ok_login = sanitize_user($first_name, true);
	$is_ok = false;
	
	if(!username_exists($new_ok_login)) {
		$is_ok = true;
	}
	
	if(!$is_ok && $last_name) {
		$new_ok_login = sanitize_user($last_name, true);
		if(!username_exists($new_ok_login)) {
			$is_ok = true;
		}
	}
	
	if(!$is_ok) {
		$user_login = sanitize_user($first_name . ($last_name ? '_' . $last_name : ''), true);
		$new_ok_login = $user_login;
		$iter = 1;
		while(username_exists($new_ok_login) && $iter < 1000) {
			$new_ok_login = $user_login . $iter;
			$iter += 1;
		}
	}
	
	return $new_ok_login;
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

	$task_id = (int)$_POST['task-id'];
	$doer_id = (int)$_POST['doer-id'];
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

	$message = filter_var(trim(isset($_POST['review-message']) ? $_POST['review-message'] : ''), FILTER_SANITIZE_STRING);
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

	$task_id = (int)$_POST['task-id'];
	$author_id = (int)$_POST['author-id'];
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

	$message = filter_var(trim(isset($_POST['review-message']) ? $_POST['review-message'] : ''), FILTER_SANITIZE_STRING);
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

# member activation button
function itv_is_user_activated($user_id) {
    return get_user_meta($user_id, 'activation_code', true) ? false : true;
}

function itv_get_user_activation_email_datetime($user) {
    $activation_email_time = get_user_meta($user->ID, 'activation_email_time', true);
    if(!$activation_email_time) {
        $activation_email_time = $user->user_registered;
    }
    return $activation_email_time;
}

function itv_is_activated_field ( $user ) {
    $is_user_activated = itv_is_user_activated($user->ID);
?>
    <table class="form-table">
    <tr id="itv-is-activated-user-option">
    <th><label><?php _e("Is activated", 'tst'); ?></label></th>
    <td>
    <span id="itv-user-activated-yes-no-box">
    <?php if($is_user_activated):?>
        <font class="itv-option-ok-label"><?php _e('Yes'); ?></font>
    <?php else: ?>
        <font class="itv-option-bad-label"><?php _e('No'); ?></font>
        <button class="button button-primary itv-resend-activation-email" id="itv-resend-activation-email" <?php if(!itv_is_resend_activation_available($user->ID)):?>disabled="disabled"<?php endif;?>><?php _e('Resend activation email', 'tst'); ?></button>
        <?php echo itv_get_confirm_email_date($user);?>
    <?php endif; ?>
    </span>
    <span id="itv-user-activation-mail-sent-box" style="display: none;">
        <font class="itv-option-ok-label"><?php _e('Activation mail sent', 'tst'); ?></font>
    </span>
    </td>
    </tr>
    </table>
    
<?php 
}

function itv_xp_field ( $user ) {
    $user_xp = UserXPModel::instance()->get_user_xp($user->ID);
?>
    <table class="form-table">
    <tr id="itv-userxp-user-option">
    <th><label><?php _e('XP Rating', 'tst'); ?></label></th>
    <td>
        <b id="itv-userxp-value"><?php echo $user_xp; ?></b>
        <input id="itv-userxp-inc" type="text" class="itv-userxp-inc" />
        <button class="button button-primary" id="itv-userxp-add-btn"><?php _e('Add XP to user', 'tst'); ?></button>
        <input type="hidden" id="inc_userxp_nonce" value="<?php echo wp_create_nonce('inc_userxp'); ?>"/>
    </td>
    </tr>
    </table>
<?php 
}

function itv_extra_user_profile_fields( $user ) {
    itv_is_activated_field( $user );
    itv_xp_field( $user );
}
add_action( 'edit_user_profile', 'itv_extra_user_profile_fields' );

function itv_get_confirm_email_date($user, $is_short = false) {
    $activation_email_time = itv_get_user_activation_email_datetime($user);
    $activation_email_delta = floor((time() - strtotime($activation_email_time)) / (3600*24));
    $activation_email_date = date('d.m.Y', strtotime($activation_email_time));
    $is_resend_activation_available = itv_is_resend_activation_available($user->ID);
    
    $itv_config = ItvConfig::instance();
    
    ob_start();
?>
    <p class="itv-activation-email-time <?php if($activation_email_delta > $itv_config->get('USER_NOT_ACTIVATED_ALERT_TIME')):?>itv-activation-email-long-time-ago<?php endif;?>">
        <?php echo $is_short ? $activation_email_date : sprintf(__('Activation email time: %s', 'tst'), $activation_email_date);?>
        <?php if(!$is_resend_activation_available):?><span class="itv-reactivation-limit" title="<?php _e('Reactivation sent 2 times!', 'tst')?>"><b> ! </b></span><?php endif;?>
    </p>
<?php
    return ob_get_clean();
}

function itv_is_resend_activation_available($user_id) {
    $itv_config = ItvConfig::instance();
    $activation_email_counter = get_user_meta($user_id, 'activation_email_counter', true);
    
    # hack to process correctly users with no activation_email_counter
    if(!$activation_email_counter) {
        $activation_email_time = get_user_meta($user_id, 'activation_email_time', true);
        if($activation_email_time) {
            $activation_email_counter = 1;
            update_user_meta($user_id, 'activation_email_counter', $activation_email_counter);
        }
    }
    
    return (int)$activation_email_counter < $itv_config->get('REACTIVATION_EMAILS_LIMIT') ? true : false;
}

function itv_resend_activation_email_core($user) {
    if(!itv_is_resend_activation_available($user->ID)) {
        return;
    }
    
    $email_templates = ItvEmailTemplates::instance();
    $email_subject = $email_templates->get_title('activate_account_notice');
    $email_body_template = $email_templates->get_text('activate_account_notice');
    
    tst_send_activation_email($user, $email_subject, $email_body_template);
    update_user_meta($user->ID, 'activation_email_time', date('Y-m-d H:i:s'));
    
    $activation_email_counter = get_user_meta($user->ID, 'activation_email_counter', true);
    if(!$activation_email_counter) {
        $activation_email_counter = 0;
    }
    $activation_email_counter += 1;
    update_user_meta($user->ID, 'activation_email_counter', $activation_email_counter);
}

function itv_resend_activation_email() {
    $res = array('status' => 'error');
    $user_id = isset($_POST['user_id']) ? (int)$_POST['user_id'] : 0;
    try {
        $user = get_user_by('id', $user_id);
        
        if($user) {
            itv_resend_activation_email_core($user);
            $res = array('status' => 'ok');
        }
    }
    catch(Exception $ex) {}

    wp_die(json_encode($res));
}
add_action('wp_ajax_resend-activation-email', 'itv_resend_activation_email');
# end activation process

function itv_user_reg_date($user_id) {
    $user = get_user_by('id', $user_id);
    $reg_date = '';
    if($user) {
        $reg_date = date('d.m.Y', strtotime($user->user_registered));
    }
    return $reg_date;
}

// activated/not activated users filter
function admin_users_filter( $query ){
    global $pagenow, $wpdb;
    
    if(get_current_blog_id() != SITE_ID_CURRENT_SITE){
        return;
    }

    if(is_admin() && $pagenow=='users.php') {
        if ( isset($_GET['users_activation_status']) && $_GET['users_activation_status'] != '') {
            if($_GET['users_activation_status'] == 'activated') {
                $query->query_from .= " INNER JOIN {$wpdb->usermeta} AS um_activated ON " .
                "{$wpdb->users}.ID=um_activated.user_id AND " .
                "um_activated.meta_key='activation_code' AND (um_activated.meta_value IS NULL OR um_activated.meta_value = '') ";
            }
            elseif($_GET['users_activation_status'] == 'not_activated') {
                    $query->query_from .= " INNER JOIN {$wpdb->usermeta} AS um_activated ON " .
                    "{$wpdb->users}.ID=um_activated.user_id AND " .
                    "um_activated.meta_key='activation_code' AND um_activated.meta_value IS NOT NULL AND um_activated.meta_value != ''";
            }
        }

        if ( isset($_GET['users_city']) && $_GET['users_city'] != '') {
            $qcity = esc_sql(filter_var($_GET['users_city'], FILTER_SANITIZE_STRING));
            $query->query_from .= " INNER JOIN {$wpdb->usermeta} AS um_city ON " .
            "{$wpdb->users}.ID=um_city.user_id AND " .
            "um_city.meta_key='user_city' AND (um_city.meta_value LIKE '{$qcity}%' ) ";
        }
        
        if(isset($_GET['orderby'])) {
            if( $_GET['orderby'] == 'user_xp') {
                $user_xp_order = 'DESC';
                if(isset($_GET['order']) && $_GET['order'] == 'asc') {
                    $user_xp_order = 'ASC';
                }
                $query->query_from .= " LEFT JOIN {$wpdb->prefix}itv_user_xp AS uxp ON {$wpdb->users}.ID=uxp.user_id ";
                $query->query_orderby = " ORDER BY uxp.xp $user_xp_order, {$wpdb->users}.user_registered DESC, {$wpdb->users}.user_login ASC ";
            }
        }
        else {
            $query->query_orderby = 'ORDER BY user_registered DESC, user_login ASC';
        }
    }
    
    if(isset($query->query_vars['query_id']) && in_array($query->query_vars['query_id'], ['itv_count_all_users_for_period', 'itv_count_activated_users_for_period', ])) {
        $query->query_where .= " AND user_registered >= '".esc_sql($query->query_vars['from_date'])." 00:00:00' AND user_registered < '".esc_sql($query->query_vars['to_date'])." 00:00:00' ";
    }
    
    if(isset($query->query_vars['query_id']) && in_array($query->query_vars['query_id'], ['get_members_for_members_page', 'itv_count_activated_users_for_period', 'itv_count_main_users_stats'])) {
        $query->query_from .= " LEFT JOIN {$wpdb->usermeta} AS um_activated ON " .
        "{$wpdb->users}.ID=um_activated.user_id AND " .
        "um_activated.meta_key='activation_code' AND (um_activated.meta_value IS NULL OR um_activated.meta_value = '') ";
    }
    
    // join user_xp
    if(isset($query->query_vars['query_id']) && in_array($query->query_vars['query_id'], ['get_members_for_members_page'])) {
        $query->query_from .= " LEFT JOIN {$wpdb->prefix}itv_user_xp AS uxp ON {$wpdb->users}.ID=uxp.user_id ";
        $query->query_orderby = " ORDER BY uxp.xp DESC, {$wpdb->prefix}usermeta.meta_value DESC, {$wpdb->users}.user_registered DESC ";
    }
}
add_filter( 'pre_user_query', 'admin_users_filter' );

function show_users_filter_by_activation() {
    if(get_current_blog_id() != SITE_ID_CURRENT_SITE){
        return;
    }
    
    $ret = "";
    
    $current_filter_val = isset($_GET['users_city']) ? filter_var($_GET['users_city'], FILTER_SANITIZE_STRING) : '';
    $ret .= '<input type="text" name="users_city" id="users_city" class="itv-user-custom-filter itv-user-filter-city" placeholder="'.__('City', 'tst').'" data-filter-button-title="'.__('Filter', 'tst').'" value="'.$current_filter_val.'" />';
    
    $current_filter_val = isset($_GET['users_activation_status']) ? filter_var($_GET['users_activation_status'], FILTER_SANITIZE_STRING) : '';
    $ret .= '<select name="users_activation_status" id="users_activation_status" class="users_activation_status itv-user-custom-filter" data-filter-button-title="'.__('Filter', 'tst').'">';
    $ret .= '<option value="" '.(!$current_filter_val ? 'selected="selected"' : '').'>'.__('All users', 'tst').'</option>';
    $ret .= '<option value="activated" '.($current_filter_val == 'activated' ? 'selected="selected"' : '').'>'.__('Activated users', 'tst').'</option>';
    $ret .= '<option value="not_activated" '.($current_filter_val == 'not_activated' ? 'selected="selected"' : '').'>'.__('Not activated users', 'tst').'</option>';
    $ret .= '</select>';

    echo  $ret;
}

function itv_filter_users_by_activation() {
    show_users_filter_by_activation();
}
add_action('restrict_manage_users', 'itv_filter_users_by_activation');

function itv_add_user_custom_columns($columns) {
    if(get_current_blog_id() != SITE_ID_CURRENT_SITE){
        return $columns;
    }
    
    $columns['itv_user_role'] = __('ITV role', 'tst');
    $columns['is_activated'] = __('Is activated', 'tst');
    $columns['reg_date'] = __('Registration date', 'tst');
    $columns['access_ip'] = __('Access IP', 'tst');
    $columns['tasks_created'] = __('Tasks created', 'tst');
    $columns['tasks_done'] = __('Tasks done', 'tst');
    $columns['user_xp'] = __('XP Rating', 'tst');
    $columns['user_city'] = __('City', 'tst');
    return $columns;
}
add_filter('manage_users_columns', 'itv_add_user_custom_columns');

function itv_add_user_custom_sortable_columns($columns) {
    if(get_current_blog_id() != SITE_ID_CURRENT_SITE){
        return $columns;
    }
        
    $columns['user_xp'] = 'user_xp';
    return $columns;
}
add_filter( 'manage_users_sortable_columns', 'itv_add_user_custom_sortable_columns' );

function itv_show_user_custom_columns_content($value, $column_name, $user_id) {
    if(get_current_blog_id() != SITE_ID_CURRENT_SITE){
        return;
    }
        
    if('is_activated' == $column_name) {
        $user = get_user_by('id', $user_id);
        return itv_is_user_activated($user_id) ? __('Yes') : __('No') . itv_get_confirm_email_date($user, true);
    }
    elseif('reg_date' == $column_name) {
        return itv_user_reg_date($user_id);
    }
    elseif('user_xp' == $column_name) {
        return UserXPModel::instance()->get_user_xp($user_id);
    }
    elseif('access_ip' == $column_name) {
        $res = '';
        $reg_ip = get_user_meta($user_id, 'itv_reg_ip', true);
        if($reg_ip) {
            $res .= __('Reg IP:', 'tst') . ' ' . $reg_ip;
        }
        
        $login_ip = get_user_meta($user_id, 'itv_login_ip', true);
        if($login_ip) {
            $res .= $res ? '<br />' : '';
            $res .= __('Last login IP:', 'tst') . ' ' . $login_ip;
        }
        return $res;
    }
    elseif('itv_user_role' == $column_name) {
        $user = get_user_by('id', $user_id);
        return tst_get_member_role_name($user);
    }
    elseif('tasks_created' == $column_name) {
        $user = get_user_by('id', $user_id);
        $stats = tst_get_member_activity($user, 'created');
        return isset($stats['created']) ? $stats['created'] : 0;
    }
    elseif('tasks_done' == $column_name) {
        $user = get_user_by('id', $user_id);
        $stats = tst_get_member_activity($user, 'solved');
        return isset($stats['solved']) ? $stats['solved'] : 0;
    }
    elseif('user_city' == $column_name) {
        $user_city = ItvIPGeo::instance()->get_geo_city($user_id);
        return $user_city;
    }
    
    return $value;
}
add_action('manage_users_custom_column',  'itv_show_user_custom_columns_content', 10, 3);

# batch activation mail resend
function itv_get_users_to_resend_activation($limit = 0, $count = false) {
    global $wpdb;
    $itv_config = ItvConfig::instance();
    
    $sql = "";
    if($count) {
        $sql = "SELECT COUNT(*) ";
    }
    else {
        $sql = "SELECT {$wpdb->users}.* ";
    }
    
    $min_time = time() - $itv_config->get('USER_NOT_ACTIVATED_ALERT_TIME') * 3600 * 24;
    $min_time_str = date('Y-m-d H:i:s', $min_time);
    $resend_activation_email_limit = $itv_config->get('REACTIVATION_EMAILS_LIMIT');
    $resend_activation_email_limit = $resend_activation_email_limit ? $resend_activation_email_limit : 0;
    
    $sql .= " FROM {$wpdb->users} INNER JOIN {$wpdb->usermeta} AS um_activated ON " .
            " {$wpdb->users}.ID=um_activated.user_id AND " .
            " um_activated.meta_key='activation_code' AND um_activated.meta_value IS NOT NULL AND um_activated.meta_value != '' " .
            " LEFT JOIN {$wpdb->usermeta} AS um_activation_email ON " .
            " {$wpdb->users}.ID=um_activation_email.user_id AND " .
            " um_activation_email.meta_key='activation_email_time' " .
            
            " LEFT JOIN {$wpdb->usermeta} AS um_activation_email_counter ON " .
            " {$wpdb->users}.ID=um_activation_email_counter.user_id AND " .
            " um_activation_email_counter.meta_key='activation_email_counter' ";
    
    $sql .= " WHERE (um_activation_email.meta_value < '{$min_time_str}' OR (um_activation_email.meta_value IS NULL AND {$wpdb->users}.user_registered  < '{$min_time_str}')) ";
    $sql .= " AND (um_activation_email_counter.meta_value IS NULL OR CAST(um_activation_email_counter.meta_value AS DECIMAL) < {$resend_activation_email_limit}) ";
    $sql .= " ORDER BY {$wpdb->users}.user_registered ASC ";
    
    $res = null;
    if($count) {
        $ret = $wpdb->get_var($sql);
    }
    else {
        if($limit) {
            $sql .= " LIMIT " . (int)$limit;
        }
        $ret = $wpdb->get_results($sql);
    }
    
    return $ret;
}

function itv_show_users_bulk_actions() {
    if(get_current_blog_id() != SITE_ID_CURRENT_SITE){
        return;
    }
    
    $remain_to_resend = itv_get_users_to_resend_activation(0, true);
    $itv_config = ItvConfig::instance();
    $reactivation_emails_portion = $itv_config->get('BULK_ACTIVATION_EMAIL_SEND_LIMIT');
    if($remain_to_resend < $reactivation_emails_portion) {
        $reactivation_emails_portion = $remain_to_resend;
    }
?>
    <div class="tablenav itv-users-bulk-actions" id="itv-users-bulk-actions">
    <input type="button" class="button itv-bulk-resend-activation-email" id="itv-bulk-resend-activation-email" data-count="<?php echo $remain_to_resend;?>" value="<?php echo sprintf(__('Resend activation email next %s (remains %s)', 'tst'), $reactivation_emails_portion, $remain_to_resend);?>"/>
    </div>
<?php 
}
add_action('restrict_manage_users', 'itv_show_users_bulk_actions');

function itv_bulk_resend_activation_email() {
    $res = array('status' => 'error');
    $itv_config = ItvConfig::instance();
    try {
        
        $users = itv_get_users_to_resend_activation($itv_config->get('BULK_ACTIVATION_EMAIL_SEND_LIMIT'));

        foreach($users as $user) {
            itv_resend_activation_email_core($user);
        }
        
        $res = array('status' => 'ok');
        $res['remain_count'] = itv_get_users_to_resend_activation(0, true);
    }
    catch(Exception $ex) {}

    wp_die(json_encode($res));
}
add_action('wp_ajax_bulk-resend-activation-email', 'itv_bulk_resend_activation_email');

function itv_save_reg_ip($user_id) {
    update_user_meta($user_id, 'itv_reg_ip', itv_get_client_ip());
}

function itv_save_login_ip($user_id) {
    $user_city = get_user_meta($user_id, 'user_city', true);
    $user_ip = itv_get_client_ip();
    if(!trim($user_city)) {
        ItvIPGeo::instance()->save_location_by_ip($user_id, $user_ip);
    }
    update_user_meta($user_id, 'itv_login_ip', $user_ip);
}

function itv_get_client_ip() {
    $ip = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '';
    if(isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip_list = preg_split('/\s*,\s*/', $_SERVER['HTTP_X_FORWARDED_FOR']);
        if(count($ip_list)) {
            $ip = array_shift($ip_list);
        }
        else {
            $ip = $ip_list;
        }
    }
    return $ip;
}

function tst_get_new_members_count($from_date, $to_date) {
    global $wpdb;
    
    $user_query = new WP_User_Query([
        'count_total' => true, 
        'query_id' => 'itv_count_all_users_for_period', 
        'from_date' => $from_date, 
        'to_date' => $to_date
    ]);
    
    return $user_query->get_total();
}

function tst_get_new_active_members_count($from_date, $to_date) {
    global $wpdb;
    
    $user_query = new WP_User_Query([
        'count_total' => true, 
        'query_id' => 'itv_count_activated_users_for_period', 
        'from_date' => $from_date, 
        'to_date' => $to_date
    ]);
    
    return $user_query->get_total();
}

/** Say thank you to member */
function ajax_thankyou() {
    $_POST['nonce'] = empty($_POST['nonce']) ? '' : trim($_POST['nonce']);

    if(
            empty($_POST['to-uid'])
            || !wp_verify_nonce($_POST['nonce'], 'thankyou-action')
    ) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> wrong data given.', 'tst'),
        )));
    }
    
    if(!is_user_logged_in()) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> Access denied!', 'tst'),
        )));
    }

    $to_uid = (int)$_POST['to-uid'];
    $user_id = get_current_user_id();

    $is_error = true;
    if($to_uid && $user_id) {
        $error_message = __('Error!', 'tst');
        
        try {
            ThankyouModel::instance()->do_thankyou($user_id, $to_uid);
            $is_error = false;
        }
        catch(\ITV\models\ItvThankyouRecentlySaidException $ex) {
            error_log($ex);
            $error_message = __('<strong>Error:</strong> Recently said thank you!', 'tst');
        }
        catch(\Exception $ex) {
            error_log($ex);
        }
    }

    $ret;
    if($is_error) {
        $ret = [
            'status' => 'fail',
            'message' => $error_message,
        ];
    }
    else {
        $ret = [
            'status' => 'ok',
            'message' => __('Review saved', 'tst'),
        ];
    }
    
    wp_die(json_encode($ret));
}
add_action('wp_ajax_thankyou', 'ajax_thankyou');
add_action('wp_ajax_nopriv_thankyou', 'ajax_thankyou');

function itv_city_lookup() {
    $input = isset($_GET['q']) ? filter_var($_GET['q'], FILTER_SANITIZE_STRING) : '';
    $query = UserMeta::where('meta_key', '=', 'user_city');
    if(trim($input)) {
        $query->where('meta_value', 'like', trim($input) . "%");
    }
    else {
        $query->where('meta_value', '<>', "");
    }
    
    $metas = $query->groupBy('meta_value')->get();
    
    $cities = [];
    foreach($metas as $meta) {
        $cities[] = $meta->meta_value;
    }
    wp_die(implode("\n", $cities));
}
add_action('wp_ajax_city_lookup', 'itv_city_lookup');

/* inc user xp value */
function ajax_inc_userxp_value() {
    $_POST['nonce'] = empty($_POST['nonce']) ? '' : trim($_POST['nonce']);

    if(
            empty($_POST['user_id'])
            || empty($_POST['user_xp'])
            || !wp_verify_nonce($_POST['nonce'], 'inc_userxp')
    ) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> wrong data given.', 'tst'),
        )));
    }
    
    $user_id = (int)$_POST['user_id'];
    $user_xp = (int)$_POST['user_xp'];

    $is_error = true;
    if($user_id && $user_xp) {
        $error_message = __('Error!', 'tst');
        
        try {
            $new_userxp_value = UserXPModel::instance()->inc_user_xp_value($user_id, $user_xp);
            $is_error = false;
        }
        catch(\Exception $ex) {
            error_log($ex);
        }
    }

    $ret;
    if($is_error) {
        $ret = [
            'status' => 'fail',
            'message' => $error_message,
        ];
    }
    else {
        $ret = [
            'status' => 'ok',
            'user_xp' => $new_userxp_value,
        ];
    }
    
    wp_die(json_encode($ret));
}
add_action('wp_ajax_inc-userxp-value', 'ajax_inc_userxp_value');

