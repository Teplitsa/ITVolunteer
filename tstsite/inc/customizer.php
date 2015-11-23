<?php
/**
 * Code for ITV functions
 */

function ord_cand_orderbyreplace($orderby) {
	remove_filter('posts_orderby','ord_cand_orderbyreplace');
	return str_replace('str_posts.menu_order ASC', 'cast(mt1.meta_value as unsigned) ASC, cast(str_postmeta.meta_value as unsigned) DESC', $orderby);
}
add_filter('wp_mail_from_name', function($original_email_from){
    return __('ITVounteer', 'tst');
});
add_filter('wp_mail_from', function($email){
    return 'support@te-st.ru';
});
add_filter('wp_mail_content_type', function(){
    return 'text/html';
});

add_filter('comment_notification_text', function($email_text, $comment){
    return sprintf(ItvEmailTemplates::instance()->get_text('new_comment_task_author_notification'), get_comment_link($comment));
}, 10, 2);

add_filter('get_comment_link', function($link, $comment, $args){
    return stristr($link, '-'.$comment->comment_ID) ? $link : $link.'-'.$comment->comment_ID;
}, 10, 3);

function date_from_dd_mm_yy_to_yymmdd($date) {
    if(preg_match('/^\d{2}\.\d{2}\.\d{4}$/', $date)) {
        $date_arr = date_parse_from_format ( "d.m.Y" , $date );
        return sprintf("%04d%02d%02d", $date_arr['year'], $date_arr['month'], $date_arr['day']);
    }
    else {
        return $date;
    }
}

function date_from_yymmdd_to_dd_mm_yy($date) {
    if(preg_match('/^\d{8}$/', $date)) {
        $date_arr = date_parse_from_format ( "Ymd" , $date );
        return sprintf("%02d.%02d.%04d", $date_arr['day'], $date_arr['month'], $date_arr['year']);
    }
    else {
        return $date;
    }
}


/** Tasks manipulations **/

/** Publish task */
function ajax_publish_task() {
    $_POST['nonce'] = empty($_POST['nonce']) ? '' : trim($_POST['nonce']);

    if(
        empty($_POST['task-id'])
        || empty($_POST['nonce'])
        || !wp_verify_nonce($_POST['nonce'], 'task-publish-by-author')
    ) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> wrong data given.', 'tst'),
        )));
    }

    $upd_id = wp_update_post(array('ID' => $_POST['task-id'], 'post_status' => 'publish'));
	if($author_id = get_post($upd_id)->post_author){
		do_action('update_member_stats', array($author_id));
	}
	
    ItvLog::instance()->log_task_action($_POST['task-id'], ItvLog::$ACTION_TASK_PUBLISH, get_current_user_id());
    
    wp_die(json_encode(array(
        'status' => 'ok',
        'permalink' => get_permalink($_POST['task-id'])
    )));
}
add_action('wp_ajax_publish-task', 'ajax_publish_task');
add_action('wp_ajax_nopriv_publish-task', 'ajax_publish_task');


/** Remove task from publication */
function ajax_unpublish_task() {
    $_POST['nonce'] = empty($_POST['nonce']) ? '' : trim($_POST['nonce']);

    if(
        empty($_POST['task-id'])
        || empty($_POST['nonce'])
        || !wp_verify_nonce($_POST['nonce'], 'task-unpublish-by-author')
    ) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> wrong data given.', 'tst'),
        )));
    }

    $upd_id = wp_update_post(array('ID' => $_POST['task-id'], 'post_status' => 'draft'));
    if($author_id = get_post($upd_id)->post_author){
		do_action('update_member_stats', array($author_id));
	}
	
    ItvLog::instance()->log_task_action($_POST['task-id'], ItvLog::$ACTION_TASK_UNPUBLISH, get_current_user_id());
    
    wp_die(json_encode(array(
        'status' => 'ok',
    )));
}
add_action('wp_ajax_unpublish-task', 'ajax_unpublish_task');
add_action('wp_ajax_nopriv_unpublish-task', 'ajax_unpublish_task');


/** Send task to work */
function ajax_task_to_work() {
    $_POST['nonce'] = empty($_POST['nonce']) ? '' : trim($_POST['nonce']);

    if(
        empty($_POST['task-id'])
        || empty($_POST['nonce'])
        || !wp_verify_nonce($_POST['nonce'], 'task-send-to-work')
    ) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> wrong data given.', 'tst'),
        )));
    }
	
	$task_id = $_POST['task-id'];
    wp_update_post(array('ID' => $task_id, 'post_status' => 'in_work'));
	
	$task = get_post($task_id);	
	if($task) {
		$users = tst_get_task_doers($task->ID);
		$users[] = get_user_by('id', $task->post_author);;	
		do_action('update_member_stats', $users);
	}	
	
    ItvLog::instance()->log_task_action($task_id, ItvLog::$ACTION_TASK_INWORK, get_current_user_id());

    wp_die(json_encode(array(
        'status' => 'ok',
    )));
}
add_action('wp_ajax_task-in-work', 'ajax_task_to_work');
add_action('wp_ajax_nopriv_task-in-work', 'ajax_task_to_work');


/** Close task */
function ajax_close_task() {
    $_POST['nonce'] = empty($_POST['nonce']) ? '' : trim($_POST['nonce']);

    if(
        empty($_POST['task-id'])
        || empty($_POST['nonce'])
        || !wp_verify_nonce($_POST['nonce'], 'task-close-by-author')
    ) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> wrong data given.', 'tst'),
        )));
    }

    $task_id = $_POST['task-id'];
    wp_update_post(array('ID' => $task_id, 'post_status' => 'closed'));
    ItvLog::instance()->log_task_action($task_id, ItvLog::$ACTION_TASK_CLOSE, get_current_user_id());
    tst_send_admin_notif_task_complete($task_id);
    
    $task = get_post($task_id);	
	if($task) {
		$users = tst_get_task_doers($task->ID);
		$users[] = get_user_by('id', $task->post_author);;	
		do_action('update_member_stats', $users);
	}	

    wp_die(json_encode(array(
        'status' => 'ok',
    )));
}
add_action('wp_ajax_close-task', 'ajax_close_task');
add_action('wp_ajax_nopriv_close-task', 'ajax_close_task');


/** Approve candidate as task doer */
function ajax_approve_candidate() {
    $_POST['nonce'] = empty($_POST['nonce']) ? '' : trim($_POST['nonce']);

    if(
        empty($_POST['link-id'])
        || empty($_POST['doer-id'])
        || empty($_POST['task-id'])
        || empty($_POST['nonce'])
        || !wp_verify_nonce($_POST['nonce'], $_POST['link-id'].'-candidate-'.$_POST['doer-id'])
    ) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> wrong data given.', 'tst'),
        )));
    }

    p2p_update_meta($_POST['link-id'], 'is_approved', true);

    // Send email to the task doer:
    $task = get_post($_POST['task-id']);
    $doer = get_user_by('id', $_POST['doer-id']);
    $task_author = get_user_by('id', $task->post_author);
    	
    ItvLog::instance()->log_task_action($task->ID, ItvLog::$ACTION_TASK_APPROVE_CANDIDATE, $doer->ID);
	
	if($task) {
		$users = tst_get_task_doers($task->ID);
		$users[] = get_user_by('id', $task->post_author);;	
		do_action('update_member_stats', $users);
	}	

    // Notice to doer:
    $email_templates = ItvEmailTemplates::instance();
    
    wp_mail(
        $doer->user_email,
        $email_templates->get_title('approve_candidate_doer_notice'),
        nl2br(sprintf(
            $email_templates->get_text('approve_candidate_doer_notice'),
            $doer->first_name,
            $task->post_title,
            $task_author->user_email,
            $task_author->user_email,
            home_url('members/'.$task_author->user_login.'/')
        ))
    );
    ItvLog::instance()->log_email_action(ItvLog::$ACTION_EMAIL_APPROVE_CANDIDATE_DOER, $doer->ID, $email_templates->get_title('approve_candidate_doer_notice'), $task ? $task->ID : 0);

    // Notice to author:
    wp_mail(
        $task_author->user_email,
        $email_templates->get_title('approve_candidate_author_notice'),
        nl2br(sprintf(
            $email_templates->get_text('approve_candidate_author_notice'),
            $task_author->first_name,
            $task->post_title,
            $doer->user_email,
            $doer->user_email,
            home_url('members/'.$doer->user_login.'/')
        ))
    );
    ItvLog::instance()->log_email_action(ItvLog::$ACTION_EMAIL_APPROVE_CANDIDATE_AUTHOR, $task_author->ID, $email_templates->get_title('approve_candidate_author_notice'), $task ? $task->ID : 0);

    // Task is automatically switched "to work":
    wp_update_post(array('ID' => $_POST['task-id'], 'post_status' => 'in_work'));

    wp_die(json_encode(array(
        'status' => 'ok',
    )));
}
add_action('wp_ajax_approve-candidate', 'ajax_approve_candidate');
add_action('wp_ajax_nopriv_approve-candidate', 'ajax_approve_candidate');


/** Refuse candidate as task doer */
function ajax_refuse_candidate() {
    $_POST['nonce'] = empty($_POST['nonce']) ? '' : trim($_POST['nonce']);

    if(
        empty($_POST['link-id'])
        || empty($_POST['doer-id'])
        || empty($_POST['task-id'])
        || empty($_POST['nonce'])
        || !wp_verify_nonce($_POST['nonce'], $_POST['link-id'].'-candidate-'.$_POST['doer-id'])
    ) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> wrong data given.', 'tst'),
        )));
    }

    p2p_update_meta($_POST['link-id'], 'is_approved', false);

    // Send email to the task doer:
    $task = get_post($_POST['task-id']);
    $doer = get_user_by('id', $_POST['doer-id']);
    	
    ItvLog::instance()->log_task_action($task->ID, ItvLog::$ACTION_TASK_REFUSE_CANDIDATE, $doer->ID);
	if($task){
		do_action('update_member_stats', array($doer, $task->post_author));
	}
		
    $email_templates = ItvEmailTemplates::instance();
	
    $user = get_user_by('id', $_POST['doer-id']);
    wp_mail(
        $user->user_email,
        $email_templates->get_title('refuse_candidate_doer_notice'),
        nl2br(sprintf(
            $email_templates->get_text('refuse_candidate_doer_notice'),
            $doer->first_name,
            $task->post_title
        ))
    );
    ItvLog::instance()->log_email_action(ItvLog::$ACTION_EMAIL_REFUSE_CANDIDATE_AUTHOR, $user->ID, $email_templates->get_title('refuse_candidate_doer_notice'), $task ? $task->ID : 0);

    // Task is automatically switched "publish":
    wp_update_post(array('ID' => $_POST['task-id'], 'post_status' => 'publish'));
	
    wp_die(json_encode(array(
        'status' => 'ok',
    )));
}
add_action('wp_ajax_refuse-candidate', 'ajax_refuse_candidate');
add_action('wp_ajax_nopriv_refuse-candidate', 'ajax_refuse_candidate');


/** Add new candidate */
function ajax_add_candidate() {
    $_POST['nonce'] = empty($_POST['nonce']) ? '' : trim($_POST['nonce']);

    if(
        empty($_POST['task-id'])
        || empty($_POST['nonce'])
        || !wp_verify_nonce($_POST['nonce'], 'task-add-candidate')
    ) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> wrong data given.', 'tst'),
        )));
    }

    $task_id = $_POST['task-id'];
    $task = get_post($task_id);
    $task_author = get_user_by('id', $task->post_author);
	$task_doer_id = get_current_user_id();

    p2p_type('task-doers')->connect($task_id, $task_doer_id, array());        
    ItvLog::instance()->log_task_action($task->ID, ItvLog::$ACTION_TASK_ADD_CANDIDATE, get_current_user_id());
		
	if($task) {
		$users = tst_get_task_doers($task->ID);
		$users[] = get_user_by('id', $task->post_author);	
		do_action('update_member_stats', $users);
		do_action('update_task_stats', $task);	
	}	
	
	
    // Send email to the task doer:
    $email_templates = ItvEmailTemplates::instance();

    wp_mail(
        $task_author->user_email,
        $email_templates->get_title('add_candidate_author_notice'),
        nl2br(sprintf(
            $email_templates->get_text('add_candidate_author_notice'),
            $task_author->first_name,
            $task->post_title,
            htmlentities($_POST['candidate-message'], ENT_COMPAT, 'UTF-8'),
            get_permalink($task_id)
        ))
    );
    ItvLog::instance()->log_email_action(ItvLog::$ACTION_EMAIL_ADD_CANDIDATE_AUTHOR, $task_author->ID, $email_templates->get_title('add_candidate_author_notice'), $task ? $task->ID : 0);

    wp_die(json_encode(array(
        'status' => 'ok',
		'users' => array($task_author, $task_doer_id)
    )));
}
add_action('wp_ajax_add-candidate', 'ajax_add_candidate');
add_action('wp_ajax_nopriv_add-candidate', 'ajax_add_candidate');


/** Remove a candidate */
function ajax_remove_candidate() {
    $_POST['nonce'] = empty($_POST['nonce']) ? '' : trim($_POST['nonce']);

    if(
        empty($_POST['task-id'])
        || empty($_POST['nonce'])
        || !wp_verify_nonce($_POST['nonce'], 'task-remove-candidate')
    ) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> wrong data given.', 'tst'),
        )));
    }

    $task_id = $_POST['task-id'];
    $task = get_post($task_id);
    $task_author = get_user_by('id', $task->post_author);
	$task_doer_id = get_current_user_id();

    p2p_type('task-doers')->disconnect($task_id, $task_doer_id);	
    ItvLog::instance()->log_task_action($task->ID, ItvLog::$ACTION_TASK_REMOVE_CANDIDATE, get_current_user_id());
    
	if($task){
		do_action('update_task_stats', $task);	
		do_action('update_member_stats', array($task_doer_id, $task->post_author));
	}
	
    // Send email to the task doer:
    $email_templates = ItvEmailTemplates::instance();

    wp_mail(
        $task_author->user_email,
        $email_templates->get_title('refuse_candidate_author_notice'),
        nl2br(sprintf(
            $email_templates->get_text('refuse_candidate_author_notice'),
            $task_author->first_name,
            $task->post_title,
            $_POST['candidate-message']
        ))
    );
    ItvLog::instance()->log_email_action(ItvLog::$ACTION_EMAIL_REMOVE_CANDIDATE_AUTHOR, $task_author->ID, $email_templates->get_title('refuse_candidate_author_notice'), $task ? $task->ID : 0);

    // Task is automatically switched "publish":
    wp_update_post(array('ID' => $_POST['task-id'], 'post_status' => 'publish'));
	
    wp_die(json_encode(array(
        'status' => 'ok',
    )));
}
add_action('wp_ajax_remove-candidate', 'ajax_remove_candidate');
add_action('wp_ajax_nopriv_remove-candidate', 'ajax_remove_candidate');


/** Add a new login check - is account active or not: */
add_filter('authenticate', function($user, $username, $password){
    if( !is_wp_error($user) && get_user_meta($user->ID, 'activation_code', true)) {
        $err = new WP_Error('user-inactive', __('Your account is not active yet! Please check out your email.', 'tst'));
        return $err;
    }
    return $user;
}, 30, 3);

/** User logging in: */
function ajax_login() {
    $_POST['nonce'] = empty($_POST['nonce']) ? '' : trim($_POST['nonce']);

    if(
        empty($_POST['login'])
        || empty($_POST['nonce'])
        || !wp_verify_nonce($_POST['nonce'], 'user-login')
    ) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> wrong data given.', 'tst'),
        )));
    }

    $user = wp_signon(array(
        'user_login' => $_POST['login'],
        'user_password' => $_POST['pass'],
        'remember' => $_POST['remember'],
    ));
    if(is_wp_error($user)) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => $user->get_error_message($user->get_error_code()),
        )));
    }

    wp_die(json_encode(array(
        'status' => 'ok',
    )));
}
add_action('wp_ajax_login', 'ajax_login');
add_action('wp_ajax_nopriv_login', 'ajax_login');


/** Register a new user */
function ajax_user_register_old() {
    $_POST['nonce'] = empty($_POST['nonce']) ? '' : trim($_POST['nonce']);
    $user_login = itv_get_unique_user_login(itv_translit_sanitize($_POST['first_name']), itv_translit_sanitize($_POST['last_name']));

    if( !wp_verify_nonce($_POST['nonce'], 'user-reg') ) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => '<div class="alert alert-danger">'.__('<strong>Error:</strong> wrong data given.', 'tst').'</div>',
        )));
    } else if(username_exists($user_login)) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => '<div class="alert alert-danger">'.__('Username already exists!', 'tst').'</div>',
        )));
    } else if(email_exists($_POST['email'])) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => '<div class="alert alert-danger">'.__('Email already exists!', 'tst').'</div>',
        )));
    } else {
        $user_id = wp_insert_user(array(
            'user_login' => $user_login,
            'user_email' => $_POST['email'],
            'user_pass' => $_POST['pass'],
            'first_name' => $_POST['first_name'],
            'last_name' => $_POST['last_name'],
            'role' => 'author',
        ));
        
        if(is_wp_error($user_id)) {
            wp_die(json_encode(array(
                'status' => 'fail',
                'message' => '<div class="alert alert-danger">'.__('We are very sorry :( Some error occured while registering your account.', 'tst').'</div>',
            )));
        } else {
        	tstmu_save_user_reg_source($user_id, get_current_blog_id());
        	 
        	$itv_log = ItvLog::instance();
        	$itv_log->log_user_action(ItvLog::$ACTION_USER_REGISTER, $user_id);
        		 
            /** @var $user_id integer */
            $activation_code = sha1($user_id.'-activation-'.time());
            update_user_meta($user_id, 'activation_code', $activation_code);            
			do_action('update_member_stats', array($user_id));	

            
            $email_templates = ItvEmailTemplates::instance();

            wp_mail(
                $_POST['email'],
                $email_templates->get_title('activate_account_notice'),
                nl2br(sprintf($email_templates->get_text('activate_account_notice'), home_url("/account-activation/?uid=$user_id&code=$activation_code"), $user_login))
            );

            wp_die(json_encode(array(
                'status' => 'ok',
                'message' => '<div class="alert alert-success">'.__('Your registration is complete! Please check out the email you gave us for our activation message.', 'tst').'</div>',
            )));
        }
    }
}

function ajax_user_register() {
	$_POST['nonce'] = empty($_POST['nonce']) ? '' : trim($_POST['nonce']);

	if( !wp_verify_nonce($_POST['nonce'], 'user-reg') ) {
		wp_die(json_encode(array(
		'status' => 'fail',
		'message' => '<div class="alert alert-danger">'.__('<strong>Error:</strong> wrong data given.', 'tst').'</div>',
		)));
	} else {
		$user_params = array(
				'email' => $_POST['email'],
				'pass' => $_POST['pass'],
				'first_name' => $_POST['first_name'],
				'last_name' => $_POST['last_name'],
		);
		$reg_result = tst_register_user($user_params);
		
		if(is_wp_error($reg_result)) {
			wp_die(json_encode(array(
				'status' => 'fail',
				'message' => '<div class="alert alert-danger">' . $reg_result->get_error_message() . '</div>',
			)));
		}
		else {
			$user_id = $reg_result;
			$user = get_user_by( 'id', $user_id );
			
			if(!function_exists('tstmu_save_user_reg_source')) {
				require_once(get_template_directory().'/../../themes/mu-tst-all/inc/tstmu-users.php');
			}
			tstmu_save_user_reg_source($user_id, get_current_blog_id());
			
			$itv_log = ItvLog::instance();
			$itv_log->log_user_action(ItvLog::$ACTION_USER_REGISTER, $user_id);
				
			$email_templates = ItvEmailTemplates::instance();
			$email_subject = $email_templates->get_title('activate_account_notice');
			$email_body_template = $email_templates->get_text('activate_account_notice');
			
			tst_send_activation_email($user, $email_subject, $email_body_template);
			
			wp_die(json_encode(array(
				'status' => 'ok',
				'message' => '<div class="alert alert-success">'.__('Your registration is complete! Please check out the email you gave us for our activation message.', 'tst').'</div>',
			)));
		}
	}
}
add_action('wp_ajax_user-register', 'ajax_user_register');
add_action('wp_ajax_nopriv_user-register', 'ajax_user_register');


/** Register a new user */
function ajax_update_profile() {
    $_POST['nonce'] = empty($_POST['nonce']) ? '' : trim($_POST['nonce']);
    $member = wp_get_current_user();

    if( !wp_verify_nonce($_POST['nonce'], 'member_action') ) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => '<div class="alert alert-danger">'.__('<strong>Error:</strong> wrong data given.', 'tst').'</div>',
        )));
    } else if($member->user_email != $_POST['email'] && email_exists($_POST['email'])) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => '<div class="alert alert-danger">'.__('Email already exists!', 'tst').'</div>',
        )));
    } else {
        $params = array(
            'ID' => $_POST['id'],
            'user_email' => $_POST['email'],
            'first_name' => $_POST['first_name'],
            'last_name' => $_POST['last_name'],
        	'user_url' => $_POST['user_website'],
        );
        if( !empty($_POST['pass']) )
            $params['user_pass'] = $_POST['pass'];

        $user_id = wp_update_user($params);
        if(is_wp_error($user_id)) {
            wp_die(json_encode(array(
                'status' => 'fail',
                'message' => '<div class="alert alert-danger">'.__('We are very sorry :( Some error occured while updating your profile.', 'tst').'</div>',
            )));
        } else {
            // Update another fields...
            update_user_meta($member->ID, 'description', htmlentities($_POST['bio'], ENT_QUOTES, 'UTF-8'));
            update_user_meta($member->ID, 'user_city', htmlentities($_POST['city'], ENT_QUOTES, 'UTF-8'));
            update_user_meta($member->ID, 'user_workplace', htmlentities(isset($_POST['user_workplace']) ? $_POST['user_workplace'] : '', ENT_QUOTES, 'UTF-8'));
			update_user_meta($member->ID, 'user_workplace_desc', htmlentities(isset($_POST['user_workplace_desc']) ? $_POST['user_workplace_desc'] : '', ENT_QUOTES, 'UTF-8'));
            update_user_meta($member->ID, 'user_speciality', htmlentities($_POST['spec'], ENT_QUOTES, 'UTF-8'));            
            update_user_meta($member->ID, 'user_contacts', htmlentities($_POST['user_contacts_text'], ENT_QUOTES, 'UTF-8'));
            update_user_meta($member->ID, 'user_skype', htmlentities($_POST['user_skype'], ENT_QUOTES, 'UTF-8'));
            update_user_meta($member->ID, 'twitter', htmlentities($_POST['twitter'], ENT_QUOTES, 'UTF-8'));
            update_user_meta($member->ID, 'facebook', htmlentities($_POST['facebook'], ENT_QUOTES, 'UTF-8'));
            update_user_meta($member->ID, 'vk', htmlentities($_POST['vk'], ENT_QUOTES, 'UTF-8'));
            update_user_meta($member->ID, 'googleplus', htmlentities($_POST['googleplus'], ENT_QUOTES, 'UTF-8'));
            update_user_meta($member->ID, 'user_skills', isset($_POST['user_skills']) ? $_POST['user_skills'] : array());
           
		    do_action('update_member_stats', array($user_id));

            $itv_log = ItvLog::instance();
            $itv_log->log_user_action(ItvLog::$ACTION_USER_UPDATE, $user_id, $member->user_login);
            
            wp_die(json_encode(array(
                'status' => 'ok',
                'message' => '<div class="alert alert-success">'.sprintf(__('Your profile is successfully updated! <a href="%s" class="alert-link">View it</a>', 'tst'), tst_get_member_url($member)).'</div>',
            )));
        }
    }
}
add_action('wp_ajax_update-member-profile', 'ajax_update_profile');
add_action('wp_ajax_nopriv_update-member-profile', 'ajax_update_profile');

function ajax_delete_profile() {
    $_POST['nonce'] = empty($_POST['nonce']) ? '' : trim($_POST['nonce']);
    $_POST['id'] = (int)$_POST['id'];

    if( !wp_verify_nonce($_POST['nonce'], 'member_action') || !$_POST['id'] ) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => '<div class="alert alert-danger">'.__('<strong>Error:</strong> wrong data given.', 'tst').'</div>',
        )));
    }
    
    $user = get_user_by('id', $_POST['id']);
    $user_login = '';
    if($user) {
    	$user_login = $user->user_login;
    }

    #	delete user from multisite forever
    if(wpmu_delete_user($_POST['id'])) {
    #if(wp_delete_user($_POST['id'], ACCOUNT_DELETED_ID)) {
    	$itv_log = ItvLog::instance();
    	$itv_log->log_user_action(ItvLog::$ACTION_USER_DELETE_PROFILE, $user_id, $user_login);
    	 
        wp_die(json_encode(array(
            'status' => 'ok',
        )));
    } else {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => '<div class="alert alert-danger">'.__('<strong>Error:</strong> something wrong happens when we deleted your account. We are already looking to it.', 'tst').'</div>',
        )));
    }
}
add_action('wp_ajax_delete-profile', 'ajax_delete_profile');
add_action('wp_ajax_nopriv_delete-profile', 'ajax_delete_profile');

function ajax_add_message() {

    if(empty($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'we-are-receiving-a-letter-goshujin-sama')) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> wrong data given.', 'tst'),
        )));
    }

    $email_templates = ItvEmailTemplates::instance();

    $success = wp_mail(
        get_option('admin_email'),
        $email_templates->get_title('message_added_notification'),
        nl2br(sprintf(
            $email_templates->get_text('message_added_notification'),
            isset($_POST['page_url']) ? $_POST['page_url'] : '', $_POST['name'], $_POST['email'], $_POST['message']
        ))
    );

    if($success) {
        wp_die(json_encode(array(
            'status' => 'ok',
            'message' => __('Your message has been sent! Thanks a lot :)', 'tst'),
        )));
    } else {

    }
}
add_action('wp_ajax_add-message', 'ajax_add_message');
add_action('wp_ajax_nopriv_add-message', 'ajax_add_message');

add_filter('retrieve_password_message', function($message, $key){

    return nl2br(str_replace(array('>', '<'), array('', ''), $message));

});


function tst_get_days_until_deadline($deadline) {

    if(date_create($deadline) > date_create())
        return date_diff(date_create(), date_create($deadline))->days;
    else
        return 0;

}


function tst_send_admin_notif_new_task($post_id) {
    # disabled function
    return;
}

function tst_send_admin_notif_task_complete($post_id) {
	$itv_config = ItvConfig::instance();
	
	$email_from = $itv_config->get('EMAIL_FROM');
	$task_complete_notif_emails = $itv_config->get('TASK_COMLETE_NOTIF_EMAILS');
	
	$task = get_post($post_id);

	if($task && count($task_complete_notif_emails) > 0) {
		$to = $task_complete_notif_emails[0];
		$other_emails = array_slice($task_complete_notif_emails, 1);
		$message = __('itv_email_task_complete_message', 'tst');
		$data = array(
				'{{task_url}}' => '<a href="' . get_permalink($post_id) . '">' . get_permalink($post_id) . '</a>',
				'{{task_title}}' => get_the_title($post_id),
				'{{task_content}}' => $task->post_content
		);
		$message = str_replace(array_keys($data), $data, $message);
		$message = str_replace("\\", "", $message);
		$message = nl2br($message);

		$subject = __('itv_email_task_complete_subject', 'tst');

		$headers  = 'MIME-Version: 1.0' . "\r\n";
		$headers .= 'Content-type: text/html; charset=UTF-8' . "\r\n";
		$headers .= 'From: ' . __('ITVounteer', 'tst') . ' <'.$email_from.'>' . "\r\n";
		if(count($other_emails) > 0) {
			$headers .= 'Cc: ' . implode(', ', $other_emails) . "\r\n";
		}
		wp_mail($to, $subject, $message, $headers);
	}
}

function tst_task_saved( $task_id, WP_Post $task, $is_update ) {
	if ( $task->post_type != 'tasks' ) {
		return;
	}
		
    remove_action( 'save_post', 'tst_task_saved' );
	
	if($task->post_author == get_current_user_id()) {
		if ( $task->post_status == 'archived' ) {
			$update_args = array(
				'ID' => $task->ID,
				'post_status' => 'publish',
			);
			wp_update_post($update_args);
		}
	}
	
	$itv_log = ItvLog::instance();
	if($is_update) {
		$itv_log->log_task_action($task_id, ItvLog::$ACTION_TASK_EDIT, get_current_user_id());
	}
	else {
		$itv_log->log_task_action($task_id, ItvLog::$ACTION_TASK_CREATE, get_current_user_id());
	}
		
	do_action('update_member_stats', array($task->post_author));
}
add_action( 'save_post', 'tst_task_saved', 10, 3 );

function on_all_status_transitions( $new_status, $old_status, $task ) {
    if (! $task || $task->post_type != 'tasks') {
        return;
    }
    
    if ($new_status != $old_status) {
        $itv_notificator = new ItvNotificator ();
        
        $doers_id = array();
        if ($task->post_status == 'closed') {
            $author = get_user_by('id', $task->post_author);
            $itv_notificator->notif_author_about_task_closed( $author, $task );
            
            $doers = tst_get_task_doers ( $task->ID, true );
            foreach ( $doers as $doer ) {
                $doers_id[] = $doer->ID;
                $itv_notificator->notif_doer_about_task_closed( $doer, $task );
            }
        }
        else {
            $doers = tst_get_task_doers ( $task->ID, true );
            foreach ( $doers as $doer ) {
                $doers_id[] = $doer->ID;
                $itv_notificator->notif_doer_about_task_status_change( $doer, $task );
            }
        }
        
        $candidates = tst_get_task_doers ( $task->ID );
        foreach ( $candidates as $candidate ) {
            if(!count($doers) || !in_array($candidate->ID, $doers_id)) {
                $itv_notificator->notif_candidate_about_task_status_change ( $candidate, $task );
            }
        }
    }
}
add_action('transition_post_status',  'on_all_status_transitions', 10, 3);

function tst_consult_column( $column, $post_id ) {
    switch ( $column ) {
	case 'is_tst_consult_needed' :
            $is_tst_consult_needed = get_field('is_tst_consult_needed', $post_id);
            if($is_tst_consult_needed) {
                $is_tst_consult_done = get_field('is_tst_consult_done', $post_id);
                if($is_tst_consult_done) {
                    echo "<b class='itv-admin-test-consult-done'>".__('Done', 'tst')."</b>";
                }
                else {
                    echo "<b class='itv-admin-test-consult-needed'>".__('Needed!', 'tst')."</b>";
                }
            }
            break;
    }
}
add_action( 'manage_posts_custom_column' , 'tst_consult_column', 10, 2 );


function add_tst_consult_column( $columns, $post_type ) {
    
    if($post_type == 'tasks'){
        $columns = array_merge( $columns, array( 'is_tst_consult_needed' => __( 'Te-st consulting', 'tst' ) ) );
    }    
    
    return $columns;
}
add_action( 'manage_posts_columns' , 'add_tst_consult_column', 2,2);


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

function itv_email_login_authenticate($user, $username, $password) {
	if(is_a($user, 'WP_User')) {
		return $user;
	}
	
	$itv_log = ItvLog::instance();
	
	$auth_result = wp_authenticate_username_password(null, $username, $password);
	if(!is_wp_error($auth_result)) {
		$user = $auth_result;
		if($user) {
			if(get_user_meta($user->ID, 'activation_code', true)) {
				$itv_log->log_user_action(ItvLog::$ACTION_USER_LOGIN_FAILED, $user->ID, $user->user_login, __('Your account is not active yet! Please check out your email.', 'tst'));
			}
			else {
				$itv_log->log_user_action(ItvLog::$ACTION_USER_LOGIN_LOGIN, $user->ID, $user->user_login);
				save_user_last_login_time($user);
			}
		}
		return $auth_result;
	}

	if(!empty($username)){
		$username = str_replace('&', '&amp;', stripslashes($username));
		$user = get_user_by('email', $username);
		if(isset($user, $user->user_login, $user->user_status) && 0 == (int) $user->user_status) {
			$username = $user->user_login;
		}
	}

	$auth_result = wp_authenticate_username_password( null, $username, $password );
	if(!is_wp_error($auth_result)) {
		$user = $auth_result;
		if($user) {
			if(get_user_meta($user->ID, 'activation_code', true)) {
				$itv_log->log_user_action(ItvLog::$ACTION_USER_LOGIN_FAILED, $user->ID, $user->user_login, __('Your account is not active yet! Please check out your email.', 'tst'));
			}
			else {
				$itv_log->log_user_action(ItvLog::$ACTION_USER_LOGIN_EMAIL, $user->ID, $user->user_login);
				save_user_last_login_time($user);
			}
		}
	}
	else {
		$user = get_user_by('email', $username);
		if(!$user) {
			$user = get_user_by('login', $username);
		}
		if($user) {
			$itv_log->log_user_action(ItvLog::$ACTION_USER_LOGIN_FAILED, $user->ID, $user->user_login, strip_tags($auth_result->get_error_message()));
		}
	}
	
	return $auth_result;
}
remove_filter('authenticate', 'wp_authenticate_username_password', 20, 3);
add_filter('authenticate', 'itv_email_login_authenticate', 20, 3);

__('itv_week_day_0', 'tst');
__('itv_week_day_1', 'tst');
__('itv_week_day_2', 'tst');
__('itv_week_day_3', 'tst');
__('itv_week_day_4', 'tst');
__('itv_week_day_5', 'tst');
__('itv_week_day_6', 'tst');
