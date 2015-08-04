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
 * TRanslit in filenames
 **/

add_action('sanitize_file_name', 'frl_translit_sanitize', 0);
function frl_translit_sanitize($title){
		
	$rtl_translit = array (
		"Є"=>"YE","І"=>"I","Ѓ"=>"G","і"=>"i","№"=>"#","є"=>"ye","ѓ"=>"g",
		"А"=>"A","Б"=>"B","В"=>"V","Г"=>"G","Д"=>"D",
		"Е"=>"E","Ё"=>"YO","Ж"=>"ZH",
		"З"=>"Z","И"=>"I","Й"=>"J","К"=>"K","Л"=>"L",
		"М"=>"M","Н"=>"N","О"=>"O","П"=>"P","Р"=>"R",
		"С"=>"S","Т"=>"T","У"=>"U","Ф"=>"F","Х"=>"KH",
		"Ц"=>"TS","Ч"=>"CH","Ш"=>"SH","Щ"=>"SHH","Ъ"=>"'",
		"Ы"=>"Y","Ь"=>"","Э"=>"E","Ю"=>"YU","Я"=>"YA",
		"а"=>"a","б"=>"b","в"=>"v","г"=>"g","д"=>"d",
		"е"=>"e","ё"=>"yo","ж"=>"zh",
		"з"=>"z","и"=>"i","й"=>"j","к"=>"k","л"=>"l",
		"м"=>"m","н"=>"n","о"=>"o","п"=>"p","р"=>"r",
		"с"=>"s","т"=>"t","у"=>"u","ф"=>"f","х"=>"kh",
		"ц"=>"ts","ч"=>"ch","ш"=>"sh","щ"=>"shh","ъ"=>"",
		"ы"=>"y","ь"=>"","э"=>"e","ю"=>"yu","я"=>"ya","«"=>"","»"=>"","—"=>"-"
	);

	return strtr($title, $rtl_translit);	
}


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

/* redirect incapable mebers from admin */
add_action('parse_query', 'tst_admin_redirect');
function tst_admin_redirect(){
	# this sometimes brokes ajax calls
	
	//if(is_admin() && !current_user_can('edit_others_posts')){
	//	$redirect = home_url();
	//	wp_redirect($redirect);
	//	die();
	//}
	
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
	
	register_widget('TST_Related_Widget');
	//register_widget('TST_Upcoming_Widget');
//    register_widget('TST_Single_Task_Widget');
}
add_action('widgets_init', 'tst_custom_widgets', 11);


/**
 * Query manipulations
 **/

add_action('parse_request', 'tst_request_corrections');
function tst_request_corrections($request){
	
	if($request->request == 'tasks') {
		$redirect = get_post_type_archive_link('tasks');
		wp_redirect($redirect);
		die();
	}
}

add_action('parse_query', 'tst_query_corrections');
function tst_query_corrections($query){
	
	if(is_admin() || !$query->is_main_query())
		return;
	
	if(isset($query->query_vars['pagename']) && $query->query_vars['pagename'] == 'login') {
		$redirect = home_url('registration');
		wp_redirect($redirect);
		die();
		
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
	
	//var_dump($query->query_vars);
}

add_action('init', 'tst_custom_query_vars');
function tst_custom_query_vars(){
	global $wp;
	
	$wp->add_query_var('task_status');
	$wp->add_query_var('navpage');
	
	//rewrite for pages   '/?([0-9]{1,})/?$'
	add_rewrite_rule('^tasks/(publish|in_work|closed)/page/([0-9]{1,})/?', 'index.php?post_type=tasks&task_status=$matches[1]&navpage=$matches[2]', 'top');
	
	
	//rewrite
	//add_rewrite_rule('^tasks/([^/]*)/?', 'index.php?post_type=tasks&task_status=$matches[1]', 'top');
	add_rewrite_rule('^tasks/(publish|in_work|closed)/?', 'index.php?post_type=tasks&task_status=$matches[1]', 'top');
	
	
}


/** To-do: remove from  pre_get_posts into parse_query with custom qv */
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

function tst_actualize_current_member_role() {
	tst_actualize_member_role(get_current_user_id());
}

function set_user_order_data($user_id, $order_data) {	
		update_user_meta($user_id, 'member_order_data', $order_data);
}

function tst_process_members_filter($users_query_params) {
	
	if( !empty($_GET['role']) && (int)$_GET['role']) {
		$users_query_params['itv_member_role'] = $_GET['role'];
	//    $metas_cond = array(
	//		'key' => 'member_role',
	//		'value' => $_GET['role'],
	//		'compare' => '=',
	//    );
	//	if(!is_array(@$users_query_params['meta_query'])) {
	//		$users_query_params['meta_query'] = array();
	//	}
	//	array_unshift($users_query_params['meta_query'], $metas_cond);
	}
	
	return $users_query_params;
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
		<?if($user_workplace):?><?=$user_workplace?>, <?endif?>
	</span>
	<?php //echo frl_get_sep();?>
	<span class="time-label"></span>
	<time><?php echo get_the_date('', $task);?> </time>
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
add_action('init', 'tst_members_rewrite');
function tst_members_rewrite(){
	global $wp;

	$wp->add_query_var('membername');
	add_rewrite_rule('^members/([^/]+)/?$', 'index.php?pagename=members&membername=$matches[1]', 'top');
	// [^/]+/([^/]+)/?$  pagename=members
}

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
	//$contactmethods['vk'] = __('VKontakte', 'tst');	
	 
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
	
	$summary = apply_filters('frl_the_content', wp_trim_words($summary, 30));
	
	if($more){
		$url = tst_get_member_url($member);
		$summary .= "<p class='member-more'><a href='{$url}' class='btn btn-default btn-sm'>".__('More', 'tst')."</a></p>";
	}
	
	return $summary;
}

function tst_get_member_name($member = null){
	global $tst_member;
	
	if(!$member)
		$member = $tst_member;
	
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

function tst_member_fixed_meta($member = null){
	global $tst_member;
	
	if(!$member)
		$member = $tst_member;
?>
<span class="fixed-member-meta">
<span class="status-meta" title="<?php _e('Location', 'tst');?>">
<?php echo sanitize_text_field(tst_get_member_field('user_city', $member));?>
</span>
<?php echo frl_get_sep();?>
<span class="time-label"><?php _e('Joined at', 'tst');?>: </span>
<time><?php echo tst_get_member_field('user_date', $member);?> </time>
</span>
<?php
}

function tst_editmember_fixed_meta($member = null){
	global $tst_member;
	
	if( !$member )
		$member = $tst_member;
?>
<span class="fixed-member-meta">
<span class="time-label"><?php _e('Joined at', 'tst');?>: </span>
<time><?php echo tst_get_member_field('user_date', $member);?> </time>
</span>
<?php
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

function tst_get_member_tasks_title() {
    return __('All tasks', 'tst');
}

/* count users total */
global $ITV_TOTAL_USERS_COUNT;
$ITV_TOTAL_USERS_COUNT = null;
function tst_get_active_members_count() {
	global $ITV_TOTAL_USERS_COUNT;	
	if(is_null($ITV_TOTAL_USERS_COUNT)) {
		$result = count_users();
		$emergency = @$result['total_users'];
		$what_we_need = @$result['avail_roles']['author'];
		$ITV_TOTAL_USERS_COUNT = $what_we_need ? $what_we_need : $emergency;
	}
	return $ITV_TOTAL_USERS_COUNT;
}


function tst_member_profile_infoblock($user_login) {
	
	$tasks_created = tst_get_user_created_tasks($user_login);
    $tasks_created_closed = count(tst_get_user_created_tasks($user_login, 'closed'));
    $tasks_working_on = tst_get_user_working_tasks($user_login);
	
?>
<div class="row-top"><?php tst_member_fixed_meta();?></div>
<div class="row-main">
	
	<div class="role-marker">
	<span class="vlabel">Роль</span>
		<?php if(count($tasks_created) > count($tasks_working_on)) {
			$role = __('Client', 'tst');
			$class = 'btn-warning';
			$comment = __('A Client is a blah-blah-blah.', 'tst');
		} elseif(count($tasks_created) < count($tasks_working_on)) {
			$role = __('Volunteer', 'tst');
			$class = 'btn-success';
			$comment = __('A Volunteer is a mimimi.', 'tst');
		} else {
			$role = __('Participator', 'tst');
			$class = 'btn-info';
			$comment = __('A Participator is a nyan-nyan.', 'tst');
		}?>
	<button type="button" class="btn <?php echo $class;?>"><?php echo $role;?></button>
	<span class="role-desc" data-toggle="tooltip" data-placement="right" title="<?php echo esc_attr($comment);?>">?</span>
	</div>
	
</div>
<?php	
}



