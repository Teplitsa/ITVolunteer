<?php
/**
 * Utility functions
 **/



/**
 * Favicon
 **/
function itv_favicon(){
	
	$favicon_test = get_template_directory(). '/favicon.ico'; //in the root not working don't know why
    if(!file_exists($favicon_test))
        return;
        
    $favicon = get_template_directory_uri(). '/favicon.ico';
	echo "<link href='{$favicon}' rel='shortcut icon' type='image/x-icon' >";
}
add_action('wp_enqueue_scripts', 'itv_favicon', 1);
add_action('admin_enqueue_scripts', 'itv_favicon', 1);
add_action('login_enqueue_scripts', 'itv_favicon', 1);


/**
 * Default filters
 **/

add_filter( 'frl_the_content', 'wptexturize'        );
add_filter( 'frl_the_content', 'convert_smilies'    );
add_filter( 'frl_the_content', 'convert_chars'      );
add_filter( 'frl_the_content', 'wpautop'            );
add_filter( 'frl_the_content', 'shortcode_unautop'  );
add_filter( 'frl_the_content', 'do_shortcode' );


add_filter( 'frl_the_title', 'wptexturize'   );
add_filter( 'frl_the_title', 'convert_chars' );
add_filter( 'frl_the_title', 'trim'          );

/* jpeg compression */
//add_filter( 'jpeg_quality', create_function( '', 'return 85;' ) );



/* no admin bar for non-editors */
add_filter('show_admin_bar', 'tst_remove_admin_bar');
function tst_remove_admin_bar($show){
	
	if(!current_user_can('edit_others_posts'))
		return false;
	
	return $show;
}




/**
 * Widgets
 **/
function tst_custom_widgets(){

	unregister_widget('WP_Widget_Pages');
	unregister_widget('WP_Widget_Archives');
	unregister_widget('WP_Widget_Calendar');
	unregister_widget('WP_Widget_Meta');
	unregister_widget('WP_Widget_Categories');
	//unregister_widget('WP_Widget_Recent_Posts');
	unregister_widget('WP_Widget_Tag_Cloud');
	//unregister_widget('WP_Widget_Search');
	unregister_widget('FrmListEntries');
	
	//register_widget('TST_Related_Widget');
	//register_widget('TST_Upcoming_Widget');
//    register_widget('TST_Single_Task_Widget');
}
add_action('widgets_init', 'tst_custom_widgets', 11);


/**
 * Query manipulations
 **/
 
/*  Custom query vars and rewrites */
add_action('init', 'tst_custom_query_vars');
function tst_custom_query_vars(){
	global $wp;
	
	$wp->add_query_var('navpage');
	
	//Pretty permalinks for tasks
	$wp->add_query_var('task_status');	
	
		
	add_rewrite_rule('^tasks/(publish|in_work|closed)/page/([0-9]{1,})/?$', 'index.php?post_type=tasks&task_status=$matches[1]&navpage=$matches[2]', 'top');	
	add_rewrite_rule('^tasks/(publish|in_work|closed)/?$', 'index.php?post_type=tasks&task_status=$matches[1]', 'top');
	
	
	//Pretty permalinks for members
	$wp->add_query_var('member_role');
	$wp->add_query_var('membername');
	
	add_rewrite_rule('^members/(donee|activist|hero|volunteer)/page/([0-9]{1,})/?$', 'index.php?pagename=members&member_role=$matches[1]&navpage=$matches[2]', 'top');
	add_rewrite_rule('^members/(donee|activist|hero|volunteer)/?$', 'index.php?pagename=members&member_role=$matches[1]', 'top');	
	add_rewrite_rule('^members/([^/]+)/?$', 'index.php?pagename=members&membername=$matches[1]', 'top');
	// [^/]+/([^/]+)/?$  pagename=members

}


/* Request customization */
add_action('parse_request', 'tst_request_corrections');
function tst_request_corrections(WP $request){
	
	if($request->request == 'tasks') {
		$redirect = get_post_type_archive_link('tasks');
		wp_redirect($redirect);
		exit;
	}
}


/* Query customization */
add_action('parse_query', 'tst_query_corrections');
function tst_query_corrections(WP_Query $query){
	
	if(is_admin() || !$query->is_main_query())
		return;
	
	if(isset($query->query_vars['pagename']) && $query->query_vars['pagename'] == 'login') {
		$redirect = home_url('registration');
		wp_redirect($redirect);
		exit;
		
	}
	elseif(is_tag() && !$query->get('post_type')) {
		$query->set('post_type', 'tasks');
		
	}
	elseif($query->get('task_status')){
		
		if($query->get('task_status') == 'all'){ //fix for archive
			$query->set('task_status', '');
		}
		else {
			$status = (in_array($query->get('task_status'), array('publish', 'in_work', 'closed'))) ? $query->get('task_status') : 'publish';
			$query->set('post_status', $status);
		}
		
		if($query->get('navpage')){
			$query->set('paged', intval($query->get('navpage')));
		}
	}
	
	
}



/* OLD filteting for query
 * @to_do: move from  pre_get_posts into parse_query with custom qv */
add_action('pre_get_posts', 'tst_main_query_mods');
function tst_main_query_mods(WP_Query $query) {

    // exclude account_deleted's tasks:
    if( !is_admin() && $query->is_main_query() ) {
        
        $query->set('author', '-'.ACCOUNT_DELETED_ID);
    }

    if(isset($query->query_vars['query_id']) && @$query->query_vars['query_id'] == 'count_tasks_by_status') {
        $query->set('author', '-'.ACCOUNT_DELETED_ID);
    }
    elseif(($query->is_main_query() && $query->is_archive())
       || ($query->get('post_type') == 'tasks')
    ) {
    	$query->set('query_id', 'get_tasks');
    	
        //if( !empty($_GET['st']) ) {
        //    $query->set('post_status', $_GET['st'] == '-' ? array('publish', 'in_work', 'closed') : $_GET['st']);
        //}
        if( !empty($_GET['dl']) ) {
            $metas = (array)$query->get('meta_query');
            switch($_GET['dl']) {
                case '10':
                    $metas[] = array(
                        'key' => 'deadline',
                        'value' => array(date('Ymd'), date('Ymd', strtotime('+10 days'))),
                        'compare' => 'BETWEEN',
                        'type' => 'DATE'
                    );
                    break;
                case 'lm':
                    $metas[] = array(
                        'key' => 'deadline',
                        'value' => array(date('Ymd'), date('Ymd', strtotime('+1 month'))),
                        'compare' => 'BETWEEN',
                        'type' => 'DATE'
                    );
                    break;
                case 'mm':
                    $metas[] = array(
                        'key' => 'deadline',
                        'value' => array(date('Ymd', strtotime('+1 month')), date('Ymd', strtotime('+6 months'))),
                        'compare' => 'BETWEEN',
                        'type' => 'DATE'
                    );
                    break;
            }
            $query->set('meta_query', $metas);
        }
        if( !empty($_GET['rw']) ) {
            $metas = (array)$query->get('meta_query');
            $metas[] = array(
                'key' => 'reward',
                'value' => $_GET['rw'], //'slug',
                'compare' => '=',
            );
            $query->set('meta_query', $metas);
        }
        if( !empty($_GET['tt']) ) {
            $query->set('tag_slug__in', (array)$_GET['tt']);
        }
    }
    
    global $wpdb;
    if(@$_GET['ord_cand'] && $query->query_vars['query_id'] && $query->query_vars['query_id'] == 'get_tasks') {
    	$metas = (array)$query->get('meta_query');
    	
    	$query->set('orderby', 'menu_order');
    	$query->set('order', 'ASC');
    	
    	if(!$metas) {
    		$metas = array();
    	}
    	
    	$meta_candidates_number = array(
    			'key' => 'candidates_number',
    			'value' => '',
    			'compare' => '>='
    	);
    	$meta_status_order = array(
    			'key' => 'status_order',
    			'value' => '',
    			'compare' => '>='
    	);
    	 
    	array_unshift($metas, $meta_status_order);
    	array_unshift($metas, $meta_candidates_number);
    	
    	$query->set('meta_query', $metas);
    	add_filter('posts_orderby','ord_cand_orderbyreplace');
    }
}





/** == OLD == **/
/**
 * Tasks actions
 **/
function tst_get_task_author($task = null){
	global $post;
	
	if(!$task)
		$task = $post;
		
	$author = get_user_by('id', get_the_author_meta('ID'));
	if(!$author)
		return '';
	
	return tst_get_member_name($author);
}


# count task candidates
function tst_get_task_candidates_number($task_id) {
	$arr = array(
		'connected_type' => 'task-doers',
		'connected_items' => $task_id,
	);
	return count(get_users($arr));
}

function tst_get_task_status_order($task_id) {
	$task = get_post($task_id);
	global $ITV_TASK_STATUSES_ORDER;
	$order = 100;
	if($task) {
		$order = array_search($task->post_status, $ITV_TASK_STATUSES_ORDER);
		if($order < 0) {
			$order = 100;
		}
	}
	return $order;
}

function tst_actualize_task_stats($task_id) {
	update_post_meta($task_id, 'candidates_number', tst_get_task_candidates_number($task_id));
	update_post_meta($task_id, 'status_order', tst_get_task_status_order($task_id));
}



function tst_task_fixed_meta($task = null){
	global $post;
	
	if( !$task )
		$task = $post;

        $author = get_user_by('id', $task->post_author);
        $user_workplace = trim(sanitize_text_field(tst_get_member_field('user_workplace', $author)));
?>
    <span class="status-meta">
		<span class="created-by-label"><?php _e('Created by', 'tst');?>:</span> <?php echo tst_get_task_author_link($task);?>,
		<?php if($user_workplace):?><?php echo $user_workplace; ?>, <?php endif; ?>
	</span>	
	<span class="time-label"></span>
	<time><?php echo get_the_date('', $task);?></time>
<?php
}

function tst_newtask_fixed_meta(){
	global $current_user;
	
	$name = $url = '';
	if(isset($current_user->ID)){
		$name = tst_get_member_name($current_user);
		$url = tst_get_member_url($current_user);
	}
		
?>
	<span class="status-meta" title="<?php _e('Created by', 'tst');?>">
		<?php echo "<a href='{$url}'>{$name}</a>"; ?>
	</span>
	<?php echo frl_get_sep();?>
	<span class="time-label"><?php _e('Created at', 'tst');?>: </span>
	<time><?php echo date_i18n(get_option('date_format', strtotime('now')));?> </time>
<?php
}

function tst_get_task_meta($task, $field) {
    $task = is_object($task) ? $task->ID : $task;

    switch($field) {
        case 'deadline':
            $deadline = function_exists('get_field') ? get_field('field_533bef200fe90', $task) : get_post_meta($task, 'deadline', true);
            return date('d.m.Y', strtotime($deadline));
        case 'reward': $reward_term = function_exists('get_field') ? get_term(get_field('field_533bef600fe91', $task), 'reward') : reset(wp_get_post_terms($task, 'reward'));
            return is_object($reward_term) && !is_wp_error($reward_term) ? $reward_term->name : __('No reward setted yet', 'tst');
//        case '': return function_exists('get_field') ? get_field('', $task) : get_post_meta($task, '', true);
//        case '': return function_exists('get_field') ? get_field('', $task) : get_post_meta($task, '', true);
    }
}

function tst_get_edit_task_url($task = null){
	global $post;
	
	if(!$task)
		$task = $post;
	
	return add_query_arg('task', intval($task->ID), home_url('/task-actions/'));
}



/**
 * Members actions
 **/
/* contact fields */
add_filter( 'user_contactmethods', 'tst_correct_contactmethods', 10, 1 );
function tst_correct_contactmethods($contactmethods) {
	
	//var_dump($contactmethods);
	if(isset($contactmethods['aim']))
		unset($contactmethods['aim']);
	
	if(isset($contactmethods['yim']))
		unset($contactmethods['yim']);
	
	if(isset($contactmethods['jabber']))
		unset($contactmethods['jabber']);
		
	$contactmethods['twitter'] = __('Twitter (username without @)', 'tst');
	$contactmethods['facebook'] = __('Facebook profile (link)', 'tst');	
	$contactmethods['vk'] = __('VKontakte profile (link)', 'tst');
	$contactmethods['googleplus'] = __('Google+ (link)', 'tst');
		 
	return $contactmethods;
}


function is_single_member(){
	global $wp_query;
	
	$qv = $wp_query->get('membername', '');
	if(!empty($qv))
		return true;
	
	return false;
}

function tst_get_member_summary($member = null, $more = false){
	global $tst_member;
	
	if(!$member)
		$member = $tst_member;
		
	$summary = get_user_meta($member->ID, 'description', true);	
	$spec = sanitize_text_field(tst_get_member_field('user_speciality', $member));
	if(!empty($spec)){
		$summary = "<em>{$spec}.</em> ".$summary;
	}
	
	$summary = wp_trim_words($summary, 20);
	if($more && !empty($summary)){
		$url = tst_get_member_url($member);
		$summary .= " <a href='{$url}' class='more-link'>".__('Detailed', 'tst')."</a>";
	}
	
	$summary = apply_filters('frl_the_content', $summary);	
	return $summary;
}

function tst_get_member_name($member = null){
	global $tst_member;
		
	if(!$member){
		$member = $tst_member;
	}
	elseif(is_int($member)){
		$member = get_user_by('id', $member);
	}
	
	$name = sanitize_text_field($member->first_name.' '.$member->last_name);	
	
	return $name;
}

function tst_get_member_url($member = null) {
	global $tst_member;
	
	if( !$member )
		$member = $tst_member;
//    echo '<pre>' . print_r($member, 1) . '</pre>';
	$url = home_url('/members/'.$member->user_login);
	
	return $url;
}

function tst_get_member_field($field, $member = null){
	global $tst_member;
	
	if(!$member)
		$member = $tst_member;
	
	$fields = array(
		'user_bio',
		'user_city',
		'user_date',
		'user_speciality',
		'user_professional',
		'user_contacts',
		'user_website',
		'user_skype',
		'user_socials',
		'user_email',
		'user_workplace'
	);
	
	if( !in_array($field, $fields) )
		return '';
	
	$value = '';
	//var_dump();
	switch($field) {
		case 'user_bio':
            $value = get_user_meta($member->ID, 'description', true);
            break;
		
		case 'user_city':
            $value = get_user_meta($member->ID, 'user_city', true);
            break;
		
		case 'user_speciality':
            $value = get_user_meta($member->ID, 'user_speciality', true);
            break;
	
		case 'user_professional':
            $value = get_user_meta($member->ID, 'user_professional', true);
            break;
	
		case 'user_email':
            $value = get_userdata($member->ID)->user_email;
            break;
	
		case 'user_contacts':
            $value = get_user_meta($member->ID, 'user_contacts', true);
            break;
	
		case 'user_website':
            $value = get_userdata($member->ID)->user_url;
            $value = (!empty($value)) ? untrailingslashit(esc_url($value)) : $value;
            break;
	
		case 'user_skype':
			$value = get_user_meta($member->ID, 'user_skype', true);
			break;
            
		case 'user_socials':
            $value = tst_get_member_links_list($member);
            break;
	
		case 'user_date':
            $date = get_userdata($member->ID)->user_registered;
            $value = date_i18n(get_option('date_format'), strtotime($date));
            break;
			
		case 'user_workplace':
            $value = get_user_meta($member->ID, 'user_workplace', true);
            break;

        default:
            $value = '';
	}

	return $value;
}

function tst_get_member_links_list($member){
	global $tst_member;
	
	if(!$member)
		$member = $tst_member;
	
	$links = array();
	
	$website = tst_get_member_field('user_website', $member);	
	if(!empty($website)){
		$links['website'] = array(
			'label' => __('Website', 'tst'),
			'txt' => str_replace(array('http://', 'https://'), '', $website),
			'url' => esc_url($website)
		);
	}
	
	$twitter = get_user_meta($member->ID, 'twitter', true);
	if(!empty($twitter)){
		$twitter = str_replace('@', '', $twitter);
		$links['twitter'] = array(
			'label' => __('Twitter', 'tst'),
			'txt' => 'twitter.com/'.$twitter,
			'url' => esc_url('https://twitter.com/'.$twitter)
		);
	}
		
	$facebook = get_user_meta($member->ID, 'facebook', true);
	if(!empty($facebook)){		
		$links['facebook'] = array(
			'label' => __('Facebook', 'tst'),
			'txt' => str_replace(array('http://', 'https://'), '', $facebook),
			'url' => esc_url($facebook)
		);
	}
	
	$vk = get_user_meta($member->ID, 'vk', true);
	if(!empty($vk)){		
		$links['vk'] = array(
			'label' => __('VKontakte', 'tst'),
			'txt' => str_replace(array('http://', 'https://'), '', $vk),
			'url' => esc_url($vk)
		);
	}
	
	$google = get_user_meta($member->ID, 'googleplus', true);
	if(!empty($google)){		
		$links['googleplus'] = array(
			'label' => __('Google+', 'tst'),
			'txt' => str_replace(array('http://', 'https://'), '', $google),
			'url' => esc_url($google)
		);
	}
	
	
	if(empty($links))
		return '';
	
	$li = array();
	foreach($links as $id => $link){
		
		$label = $link["label"];
		$txt = $link["txt"];
		$url = $link["url"];
		$li[] = "<dt>{$label}: </dt><dd><a href='{$url}' target='_blank'>{$txt}</a></dd>";
	}
	
	return "<dl class='member-links-list'>".implode('', $li)."</dl>";
}

function tst_get_member_action_stage(){

    $user = wp_get_current_user();
    if(isset($_GET['login']) && (int)$_GET['login'] == 1 && !$user->ID)
		return 'login';
    if( !$user->ID )
        return 'new_member';
	if( !empty($_GET['member']) && current_user_can('edit_user', (int)$_GET['member']) )
        return 'edit_member';
    return 'new_member';
}

function tst_get_edit_member_url($member = null){
	global $tst_member;

	if(!$member)
		$member = $tst_member;

	return add_query_arg('member', intval($member->ID), home_url('member-actions/'));
}

function tst_get_member_action_title(){
	
	$stage = tst_get_member_action_stage();
	$title = '';
	switch($stage){
		case 'login':
			$title = __('Log In', 'tst');
			break;
		
		case 'new_member':
			$title = __('New Member', 'tst');
			break;
		
		case 'edit_member':
			$title = __('Edit profile', 'tst');
			break;
	}
	
	return $title;
}




/** Role calculations === old **/
function tst_get_member_role($user) {
    $user = is_object($user) ? $user : (int)$user;

    $tasks_created = tst_get_user_created_tasks($user->user_login);
    $tasks_working_on = tst_get_user_working_tasks($user->user_login);

    if(count($tasks_created) > count($tasks_working_on))
        return 1;
    elseif(count($tasks_created) < count($tasks_working_on))
        return 2;
    else
        return 3;
}

function tst_get_member_role_label($role) {
    switch($role) {
        case 1: return __('Client', 'tst');
        case 2: return __('Volunteer', 'tst');
        case 3: return __('Participator', 'tst');
        default: return __('Unknown role', 'tst');
    }
}

global $ITV_ROLE_SORT_TABLE;
$ITV_ROLE_SORT_TABLE = array(2 => 1, 1 => 2, 3 => 3, 0 => 4);
function tst_actualize_member_role($user) {
	global $ITV_ROLE_SORT_TABLE;
	if(!is_object($user)) {
		$user = (int)$user;
		$user = get_user_by('id', $user);
	}
	if($user) {
		$new_member_role = tst_get_member_role($user);
		update_user_meta($user->ID, 'member_role', $new_member_role);
		update_user_meta($user->ID, 'member_rating', sprintf("%010d", tst_get_user_rating($user)));
		set_user_order_data($user->ID, $ITV_ROLE_SORT_TABLE[(int)$new_member_role]);
	}
}

function tst_actualize_current_member_role() {
	tst_actualize_member_role(get_current_user_id());
}

function set_user_order_data($user_id, $order_data) {	
	update_user_meta($user_id, 'member_order_data', $order_data);
}


function tst_get_user_rating($user) {
    if(is_object($user)) {
    	;
    }
    elseif(preg_match('/^\d+$/', $user) && (int)$user > 0) {
        $user = get_user_by('id', $user);
        if(!$user) {
        	$user = get_user_by('login', $user);
        }
    }
    else {
        $user = get_user_by('login', $user);
    }
    
#    $user = (int)$user <= 0 ? get_user_by('login', $user) : get_user_by('id', $user);

    return $user ? count(tst_get_user_closed_tasks($user)) : 0;
}


function tst_is_user_candidate($user_id = false, $task_id = false) {

    $user_id = $user_id ? $user_id : get_current_user_id();
    if( !$user_id )
        return false;

    if( !$task_id ) {
        global $post;
        $task_id = $post->ID;
    }

    $p2p_id = p2p_type('task-doers')->get_p2p_id($user_id, $task_id);

    if($p2p_id) // connection exists
        return (int)p2p_get_meta($p2p_id, 'is_approved', true) ? 2 : 1;
    return 0;
}



/** Tasks calculations **/
function tst_get_user_created_tasks($user, $status = array()) {
    if(is_object($user)) {
    	;
    }
    elseif(preg_match('/^\d+$/', $user) && (int)$user > 0) {
        $user = get_user_by('id', $user);
        if(!$user) {
        	$user = get_user_by('login', $user);
        }
    }
    else {
        $user = get_user_by('login', $user);
    }
	
    $user = $user ? $user->ID : $user;
#    $user = (int)$user <= 0 ? get_user_by('login', $user)->ID : $user;

    if( !$status )
        $status = array('publish', 'in_work', 'closed',);

    $params = array(
        'post_type' => 'tasks',
        'author' => $user,
        'nopaging' => true,
    );

    if($status && (is_array($status) || strlen($status)))
        $params['post_status'] = $status;

    $query = new WP_Query($params);

    return $query->get_posts();
}

function tst_get_user_working_tasks($user, $status = array()) {
    if(is_object($user)) {
    	;
    }
    elseif(preg_match('/^\d+$/', $user) && (int)$user > 0) {
        $user = get_user_by('id', $user);
        if(!$user) {
        	$user = get_user_by('login', $user);
        }
    }
    else {
        $user = get_user_by('login', $user);
    }

#    $user = (int)$user <= 0 ? get_user_by('login', $user) : get_user_by('id', $user);
	
    if( !$status )
        $status = array('publish', 'in_work', 'closed');

    $params = array(
        'connected_type' => 'task-doers',
        'connected_items' => $user->ID,
        'suppress_filters' => false,
        'nopaging' => true
    );

    if($status && (is_array($status) || strlen($status)))
        $params['post_status'] = $status;

    return get_posts($params);
}

function tst_get_user_closed_tasks($user) {

    if(is_object($user)) {
    	;
    }
    elseif(preg_match('/^\d+$/', $user) && (int)$user > 0) {
        $user = get_user_by('id', $user);
        if(!$user) {
        	$user = get_user_by('login', $user);
        }
    }
    else {
        $user = get_user_by('login', $user);
    }

    $status = array('closed');

    $params = array(
        'connected_type' => 'task-doers',
        'connected_items' => $user->ID,
        'suppress_filters' => false,
        'nopaging' => true,
		'connected_meta' => array(
			array(
				'key' =>'is_approved',
				'value' => 1,
				'compare' => '='
			)
		),
		'post_status' => 'closed'
    );
	
    return get_posts($params);
}

function tst_process_members_filter($users_query_params) {
	global $wp_query;
	
	
	if(get_query_var('member_role')) {
		
		switch(get_query_var('member_role')) {
			case 'donee':
				$role = 1;
				break;
			case 'hero' :
				$role = 2;
				break;
			default:
				$role = 3;
				break;
		}
		
		$users_query_params['itv_member_role'] = $role;		
	}
		
	return $users_query_params;
}
