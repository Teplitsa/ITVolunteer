<?php
/**
 * Members related template tags
 **/



function tst_members_filters_menu(){
	global $wp_query;
	
	$current = ($wp_query->get('member_role')) ? trim($wp_query->get('member_role')) : 'all';
	
?>
<ul class="members-filters">
	<li class="hero<?php if($current == 'hero') echo ' active';?>">
	<a href="<?php echo tst_members_filters_link('hero'); ?>" class="ga-event-trigger" <?php tst_ga_event_data('ml_mf_hero');?>>
		<?php _e('Superheroes:', 'tst')?> <?php echo ItvSiteStats::instance()->get_stats_value(ItvSiteStats::$USERS_ROLE_SUPERHERO);?>
	</a>
	</li>
	<li class="donee<?php if($current == 'donee') echo ' active';?>">
	<a href="<?php echo tst_members_filters_link('donee'); ?>" class="ga-event-trigger" <?php tst_ga_event_data('ml_mf_donee');?>>
		<?php _e('Beneficiaries:', 'tst')?> <?php echo ItvSiteStats::instance()->get_stats_value(ItvSiteStats::$USERS_ROLE_BENEFICIARY);?>
	</a>
	</li>
	<li class="activist<?php if($current == 'activist') echo ' active';?>">
	<a href="<?php echo tst_members_filters_link('activist'); ?>" class="ga-event-trigger" <?php tst_ga_event_data('ml_mf_activist');?>>
		<?php _e('Activists:', 'tst')?> <?php echo ItvSiteStats::instance()->get_stats_value(ItvSiteStats::$USERS_ROLE_ACTIVIST);?>
	</a>
	</li>	
	<li class="all<?php if($current == 'all') echo ' active';?>">
	<a href="<?php echo home_url('members'); ?>" class="ga-event-trigger" <?php tst_ga_event_data('ml_mf_all');?>>
		<?php _e('All:', 'tst')?> <?php echo tst_get_active_members_count();?>
	</a>
	</li>
</ul>
<?php	
}


function tst_members_filters_link($role = 'donee') {	
	
	$roles = array('donee', 'activist', 'hero');
	
	if(!in_array($role, $roles))
		$role = 'activist';
		
	$url = home_url("/members/$role/"); 
	
	return $url;	
}


global $ITV_TOTAL_USERS_COUNT;
$ITV_TOTAL_USERS_COUNT = null;
function tst_get_active_members_count() {
	global $ITV_TOTAL_USERS_COUNT;	
	if(is_null($ITV_TOTAL_USERS_COUNT)) {
		$itv_site_stats = ItvSiteStats::instance();
		$ITV_TOTAL_USERS_COUNT = $itv_site_stats->get_stats_value(ItvSiteStats::$USERS_TOTAL);
	}
	return $ITV_TOTAL_USERS_COUNT;
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

function tst_members_paging($page_query, $user_query, $echo = true){
	global $wp_rewrite, $wp_query;
    
	if(null == $page_query)
		$page_query = $wp_query;
	
    //var_dump($wp_query);
	$remove = array(
			
	);
	
	if($page_query->query_vars['navpage']){
		$current = ($page_query->query_vars['navpage'] > 1) ? $page_query->query_vars['navpage'] : 1;
	}
	else{
		$current = ($page_query->query_vars['paged'] > 1) ? $page_query->query_vars['paged'] : 1;
	}
	
	$parts = parse_url(get_pagenum_link(1));	
	$base = trailingslashit(esc_url($parts['host'].$parts['path']));
	if(function_exists('tstmu_is_ssl') && tstmu_is_ssl()){
		$base = str_replace('http:', 'https:', $base);
	}
	
	// Calculate total pages:
	$per_page = get_option('posts_per_page');
	$users_count = $user_query->total_users;	
	$total_pages = ceil($users_count/$per_page); //do we need any particular part?
    
	$filter_args = array();
	if(isset($_GET) && is_array($_GET)) {
		foreach($_GET as $k => $v) {
			$filter_args[$k] = $v;
		}
	}
	
	$pagination = array(
        'base' => $base.'%_%',
        'format' => 'page/%#%/',
        'total' => $total_pages,
        'current' => $current,
        'prev_text' => __('&laquo; prev.', 'tst'),
        'next_text' => __('next. &raquo;', 'tst'),
        'end_size' => 4,
        'mid_size' => 4,
        'show_all' => false,
        'type' => 'list', //list
		'add_args' => $filter_args
    );
    	
	
	foreach($remove as $param){
			
		if(isset($_GET[$param]) && !empty($_GET[$param]))
			$pagination['add_args'] = array_merge($pagination['add_args'], array($param => esc_attr(trim($_GET[$param]))));
	}
		
	
	$links = paginate_links($pagination);
	if(!empty($links)){		
	    $links = str_replace("<ul class='page-numbers'>", '<ul class="page-numbers pagination">', $links);
	}
	
    if($echo)
		echo $links;
	return
		$links;
	
}


/** Avatar related functions **/
function tst_temp_avatar($user = null){
	if($user == null) {
		global $tst_member;
		$user = $tst_member;
	}
	
	$itv_user_avatar = tst_get_member_user_avatar($user->ID);
	
	if($itv_user_avatar) {
		echo $itv_user_avatar;
	}
	else {
		$src = '';				
		if($user) {
			if(!metadata_exists('user', $user->ID, 'gravatar_local_url')) {
				$src = tst_localize_gravatar($user);
				update_user_meta($user->ID, 'gravatar_local_url', $src);
			}
			else {
				$src = get_user_meta($user->ID, 'gravatar_local_url', true);
			}
			
		}
		
		if(empty($src)){
			$src = get_template_directory_uri() . '/img/temp-avatar.png';
		}	
			
		$name = tst_get_member_name($user);		
		?>
			<img src="<?=$src?>" alt="<?php echo esc_attr($name); ?>" title="<?php echo esc_attr($name); ?>">
		<?php
	}
	
}


function tst_get_member_user_avatar($member_id) {
	$image_id = get_user_meta($member_id, 'user_avatar', true);
	$res = '';
	
	if($image_id) {
		
		$name = tst_get_member_name($member_id);		
		$res = wp_get_attachment_image( $image_id, 'avatar', false, array('alt' => $name, 'title'=> $name));
	}
	return $res;
}

function tst_localize_gravatar($user) {
	
	$url = '';
	$grav_url = "http://www.gravatar.com/avatar/".md5(strtolower(trim($user->user_email)))."?s=180&d=404";	
	$headers = @get_headers($grav_url);
	
	if (!preg_match("|200|", $headers[0])) {
		return '';
	}
	else {//save the content
		if(!function_exists(download_url)) {
			require_once(ABSPATH.'/wp-admin/includes/file.php');
			require_once(ABSPATH.'/wp-admin/includes/media.php');
		}
		
		$upload_dir = wp_upload_dir();
		$file = $upload_dir['path'].'/user_avatar-'.$user->ID.'.jpg';
		$tmp = download_url($grav_url);
		
		if (is_wp_error($tmp) ) {
            @unlink($tmp); 
			return '';
		}
		
		if (false === @rename($tmp, $file ) ) {
			@unlink($_tmp);			
			return '';
		
		} else {
			$url = $upload_dir['url'].'/user_avatar-'.$user->ID.'.jpg';
		}
		
		return $url;
	}
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
