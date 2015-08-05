<?php
/**
 * Members related template tags
 **/



function tst_members_filters_menu(){
	global $wp_query;
	
	$current = ($wp_query->get('member_role')) ? trim($wp_query->get('member_role')) : 'all';
	
?>
<ul class="members-filters">
	<li class="all<?php if($current == 'all') echo ' active';?>">
	<a href="<?php echo home_url('members'); ?>" class="ga-event-trigger" <?php tst_ga_event_data('ml_mf_all');?>>
		<?php _e('All:', 'tst')?> <?php echo tst_get_active_members_count();?>
	</a>
	</li>
	<li class="donee<?php if($current == 'donee') echo ' active';?>">
	<a href="<?php echo tst_members_filters_link('donee'); ?>" class="ga-event-trigger" <?php tst_ga_event_data('ml_mf_donee');?>>
		<?php _e('Beneficiaries:', 'tst')?> 123
	</a>
	</li>
	<li class="activist<?php if($current == 'activist') echo ' active';?>">
	<a href="<?php echo tst_members_filters_link('activist'); ?>" class="ga-event-trigger" <?php tst_ga_event_data('ml_mf_activist');?>>
		<?php _e('Activists:', 'tst')?> 123
	</a>
	</li>
	<li class="hero<?php if($current == 'hero') echo ' active';?>">
	<a href="<?php echo tst_members_filters_link('hero'); ?>" class="ga-event-trigger" <?php tst_ga_event_data('ml_mf_hero');?>>
		<?php _e('Superheroes:', 'tst')?> 123
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
		$result = count_users();
		$emergency = @$result['total_users'];
		$what_we_need = @$result['avail_roles']['author'];
		$ITV_TOTAL_USERS_COUNT = $what_we_need ? $what_we_need : $emergency;
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
	
	$current = ($page_query->query_vars['navpage'] > 1) ? $page_query->query_vars['navpage'] : 1;
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
		$default = get_template_directory_uri() . '/img/temp-avatar.png';
		$size = 180;
		$grav_url = $user ? "//www.gravatar.com/avatar/" . md5( strtolower( trim( $user->user_email ) ) ) . "?d=" . urlencode( $default ) . "&s=" . $size : $default;
		$grav_url = $default;
		?>
			<img src="<?=$grav_url?>" alt="<? _e('Member', 'tst');?>">
		<?php
	}
}