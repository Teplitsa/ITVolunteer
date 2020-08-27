<?php
/**
 * Members related template tags
 **/

use ITV\models\UserXPModel;

function tst_members_filters_menu(){
	global $wp_query;
	
	$current = ($wp_query->get('member_role')) ? trim($wp_query->get('member_role')) : 'all';
		
?>
<ul class="members-filters">
	<li class="hero<?php if($current == 'hero') echo ' active';?>">
	<a href="<?php echo tst_members_filters_link('hero'); ?>" class="ga-event-trigger" <?php tst_ga_event_data('ml_mf_hero');?>>
		<?php _e('Superheroes:', 'tst')?> <?php echo tst_get_members_counter('hero'); ?>
	</a>
	</li>
	<li class="donee<?php if($current == 'donee') echo ' active';?>">
	<a href="<?php echo tst_members_filters_link('donee'); ?>" class="ga-event-trigger" <?php tst_ga_event_data('ml_mf_donee');?>>
		<?php _e('Beneficiaries:', 'tst')?> <?php echo tst_get_members_counter('donee'); ?>
	</a>
	</li>
	<li class="volunteer<?php if($current == 'volunteer') echo ' active';?>">
	<a href="<?php echo tst_members_filters_link('volunteer'); ?>" class="ga-event-trigger" <?php tst_ga_event_data('ml_mf_volunteer');?>>
		<?php _e('Volunteers:', 'tst')?> <?php echo tst_get_members_counter('volunteer'); ?>
	</a>
	</li>
	<li class="activist<?php if($current == 'activist') echo ' active';?>">
	<a href="<?php echo tst_members_filters_link('activist'); ?>" class="ga-event-trigger" <?php tst_ga_event_data('ml_mf_activist');?>>
		<?php _e('Activists:', 'tst')?> <?php echo tst_get_members_counter('activist'); ?>
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

function tst_members_filters_link($role = 'hero') {	
	
	$roles = array('donee', 'activist', 'hero', 'volunteer');
	
	if(!in_array($role, $roles)){
		$role = 'hero';
	}
		
	$url = home_url("/members/$role/"); 
	
	return $url;	
}


/** Calculations **/
function tst_get_members_counter($role_key){
	
	$count = 0;
	
	if($role_key == 'hero'){
		$count = ItvSiteStats::instance()->get_stats_value(ItvSiteStats::$USERS_ROLE_SUPERHERO);
	}
	elseif($role_key == 'donee') {
		$count = ItvSiteStats::instance()->get_stats_value(ItvSiteStats::$USERS_ROLE_BENEFICIARY);
	}
	elseif($role_key == 'activist') {
		$count = ItvSiteStats::instance()->get_stats_value(ItvSiteStats::$USERS_ROLE_ACTIVIST);
	}
	elseif($role_key == 'volunteer') {
		$count = ItvSiteStats::instance()->get_stats_value(ItvSiteStats::$USERS_ROLE_VOLUNTEER);
	}
	
	return $count;
}

function tst_get_active_members_count() {
	if(is_null(ItvSiteStats::$ITV_TOTAL_USERS_COUNT)) {
		$itv_site_stats = ItvSiteStats::instance();
		ItvSiteStats::$ITV_TOTAL_USERS_COUNT = $itv_site_stats->get_stats_value(ItvSiteStats::$USERS_TOTAL);
	}
	return ItvSiteStats::$ITV_TOTAL_USERS_COUNT;
}


/** members paging **/
function tst_members_paging($page_query, $user_query, $echo = true){
	global $wp_query;
    
	if(!$page_query)
		$page_query = $wp_query;
	    
	$remove = array(
			
	);
	
	if(isset($page_query->query_vars['navpage']) && $page_query->query_vars['navpage']){
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
	$users_count = $user_query->get_total(); 
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
function tst_get_avatar_fallback($member_id = null) {
	$src = tst_get_avatar_fallback_url($member_id);
	$name = tst_get_member_name($member_id);
	
	return "<img src='".$src."' alt='".esc_attr($name)."' title='".esc_attr($name)."'>";	
}

function tst_get_avatar_fallback_url($member_id = null) {
    
    if( !$member_id )
        $member_id = tst_get_current_member()->ID;
    elseif(is_object($member_id))
        $member_id = $member_id->ID;
        
    $src = '';
    if($member_id) {
        if(!metadata_exists('user', $member_id, 'gravatar_local_url')) {
            $src = tst_localize_gravatar($member_id);
            update_user_meta($member_id, 'gravatar_local_url', $src);
        }
        else {
            $src = get_user_meta($member_id, 'gravatar_local_url', true);
        }
        
    }
    
    if(empty($src)){
        $src = get_template_directory_uri() . '/assets/img/temp-avatar.png';
    }
    else {
        $itv_user_avatar_fpath = str_replace(home_url() . "/wp-content", WP_CONTENT_DIR, $src);    
        if(!is_file($itv_user_avatar_fpath)) {
            $src = get_template_directory_uri() . '/assets/img/temp-avatar.png';
        }
    }
    
    return $src;
}

function tst_temp_avatar($member_id = null, $echo = true){
	
	if( !$member_id )
		$member_id = tst_get_current_member()->ID;
	elseif(is_object($member_id))
		$member_id = $member_id->ID;
	
	$itv_user_avatar = tst_get_member_user_avatar($member_id);
	
	if(!$itv_user_avatar) {					
		$itv_user_avatar = tst_get_avatar_fallback($member_id);		
	}
	
	if($echo)
		echo $itv_user_avatar;
	else
		return $itv_user_avatar;
}

function itv_avatar_url($member_id = null){
    
    if( !$member_id ) {
        $member_id = tst_get_current_member()->ID;
    }
    elseif(is_object($member_id)) {
        $member_id = $member_id->ID;
    }
        
    $itv_user_avatar = tst_get_member_user_avatar_url($member_id);
    $itv_user_avatar_fpath = str_replace(home_url() . "/wp-content", WP_CONTENT_DIR, $itv_user_avatar);
//     error_log("member_id: " . $member_id);
//     error_log("itv_user_avatar_fpath: " . $itv_user_avatar_fpath);
    
    if(!$itv_user_avatar) {
        $itv_user_avatar = tst_get_avatar_fallback_url($member_id);
    }
    elseif(!is_file($itv_user_avatar_fpath)) {
        $itv_user_avatar = get_template_directory_uri() . '/assets/img/temp-avatar.png';
    }
    
    return $itv_user_avatar;
}

function itv_member_cover_url($member_id = null){
    
    if( !$member_id ) {
        $member_id = tst_get_current_member()->ID;
    }
    elseif(is_object($member_id)) {
        $member_id = $member_id->ID;
    }
        
    $image_id = get_user_meta($member_id, 'user_cover', true);
    $img_url = '';
    
    if($image_id) {
        $res = wp_get_attachment_image_src( $image_id, 'large');
        $img_url = $res ? $res[0] : '';
    }

    $img_fpath = str_replace(home_url() . "/wp-content", WP_CONTENT_DIR, $img_url);
    
    if(!$img_url) {
        $img_url = '';
    }
    elseif(!is_file($img_fpath)) {
        $img_url = '';
    }
    
    return $img_url;
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

function tst_get_member_user_avatar_url($member_id) {
    $image_id = get_user_meta($member_id, 'user_avatar', true);
    $res = '';
    
    if($image_id) {
        $res = wp_get_attachment_image_src( $image_id, 'avatar');
        $res = $res ? $res[0] : '';
    }
    
    return $res;
}

function tst_localize_gravatar($user_id) {
	
	$url = '';
	if(is_int($user_id))
		$user = get_user_by('id', $user_id);
	elseif(is_object($user_id))
		$user = $user_id;
		
	$grav_url = "https://www.gravatar.com/avatar/".md5(strtolower(trim($user->user_email)))."?s=180&d=404";	
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

add_filter( 'get_avatar' , 'itv_custom_avatar' , 1 , 5 );
function itv_custom_avatar( $avatar, $id_or_email, $size, $default, $alt ) {
	$user_id = 0;
	if ( is_numeric( $id_or_email ) ) {
		$user_id = (int) $id_or_email;

	} elseif ( is_object( $id_or_email ) ) {
		if ( ! empty( $id_or_email->user_id ) ) {
			$user_id = (int) $id_or_email->user_id;
		}
	} else {
		$user = get_user_by( 'email', $id_or_email );
		$user_id = $user->ID;
	}

	if( $user_id ) {
		$user_avatar = tst_get_member_user_avatar($user_id);
		$fallback = tst_get_avatar_fallback($user_id);
		
		if(!$user_avatar) {
			$user_avatar = $fallback;
		}
		
		if($user_avatar) {
			$doc = new DOMDocument();
			@$doc->loadHTML($user_avatar);
			$tags = $doc->getElementsByTagName('img');
			
			$user_avatar = null;
			foreach ($tags as $tag) {
				$user_avatar = $tag;
				break;
			}			
		} 
		
		if($user_avatar) {
			$avatar_src = $user_avatar->getAttribute('src');
			if($avatar_src) {
				$avatar = "<img alt='{$alt}' src='{$avatar_src}' class='avatar avatar-{$size} photo' height='{$size}' width='{$size}' />";
			}
		}
	}

	return $avatar;
}

/** Profile tags **/
function tst_member_profile_infoblock($user_id) {
		
	$key = tst_get_member_role_key($user_id); 
	$role = tst_get_role_name($key);	
?>
<div class="row-top"><?php tst_member_fixed_meta($user_id);?></div>
<div class="row-main">
	
	<div class="role-marker">
	<span class="vlabel">Роль</span>		
	<button type="button" class="btn <?php echo esc_attr($key);?>"><?php echo esc_attr($role);?></button>	
	</div>	
</div>
<?php	
}

function tst_member_fixed_meta($member_id = null){
	
	if( !$member_id )
		$member_id = tst_get_current_member()->ID;
	elseif(is_object($member_id))
		$member_id = $member_id->ID;
	
	
?>
<span class="fixed-member-meta">
<span class="status-meta" title="<?php _e('Location', 'tst');?>">
<?php echo sanitize_text_field(tst_get_member_field('user_city', $member_id));?>
</span>
<?php echo frl_get_sep();?>
<span class="time-label"><?php _e('Joined at', 'tst');?>: </span>
<time><?php echo tst_get_member_field('user_date', $member_id);?> </time>
</span>
<?php
}

function tst_editmember_fixed_meta($member_id = null){	
	
	if( !$member_id )
		$member_id = tst_get_current_member()->ID;
	elseif(is_object($member_id))
		$member_id = $member_id->ID;
?>
<span class="fixed-member-meta">
<span class="time-label"><?php _e('Joined at', 'tst');?>: </span>
<time><?php echo tst_get_member_field('user_date', $member_id);?> </time>
</span>
<?php
}


/* contact fields */
add_filter( 'user_contactmethods', 'tst_correct_contactmethods', 10, 1 );
function tst_correct_contactmethods($contactmethods) {
	
	if(isset($contactmethods['aim']))
		unset($contactmethods['aim']);
	
	if(isset($contactmethods['yim']))
		unset($contactmethods['yim']);
	
	if(isset($contactmethods['jabber']))
		unset($contactmethods['jabber']);
		
	$contactmethods['twitter'] = __('Twitter (username without @)', 'tst');
	$contactmethods['facebook'] = __('Facebook profile (link)', 'tst');	
	$contactmethods['vk'] = __('VKontakte profile (link)', 'tst');
	$contactmethods['googleplus'] = __('Phone', 'tst');
		 
	return $contactmethods;
}


function is_single_member(){	
	
	$qv = get_query_var('membername');
	if(!empty($qv))
		return true;
	
	return false;
}

function tst_get_member_summary($member_id = null, $more = false){	
	
	if(!$member_id)
		$member_id = tst_get_current_member()->ID;
	elseif(is_object($member_id))
		$member_id = $member_id->ID;
		
	$summary = get_user_meta($member_id, 'description', true);	
	$spec = sanitize_text_field(tst_get_member_field('user_speciality', $member_id));
	if(!empty($spec)){
		$summary = "<em>{$spec}.</em> ".$summary;
	}
	
	$summary = wp_trim_words($summary, 20);
	if($more && !empty($summary)){
		$url = tst_get_member_url($member_id);
		$summary .= " <a href='{$url}' class='more-link'>".__('Detailed', 'tst')."</a>";
	}
	
	$summary = apply_filters('frl_the_content', $summary);	
	return $summary;
}

function tst_get_member_name($member = null, $wrapper = false){	
		
	if(!$member){
		$member = tst_get_current_member();
	}
	elseif(is_int($member)){
		$member = get_user_by('id', $member);
	}
	
	if(!$wrapper){
		$name = sanitize_text_field($member->first_name.' '.$member->last_name);
	}
	else {
		$name = '<span class="f-name">'.sanitize_text_field($member->first_name)."</span> ";
		$name .= '<span class="l-name">'.sanitize_text_field($member->last_name)."</span> ";
	}		
	
	return $name;
}

function tst_get_member_url($member = null) {	
	
	if(!$member){
		$member = tst_get_current_member();
	}
	elseif(is_int($member)){
		$member = get_user_by('id', $member);
	}
	
	return home_url('/members/'.$member->user_login);
}

function tst_get_member_field($field, $member_id = null){	
	
	if(!$member_id)
		$member_id = tst_get_current_member()->ID;
	elseif(is_object($member_id))
		$member_id = $member_id->ID;
	
	
	$fields = array(
		'user_bio',
		'user_city',
		'user_date',
		'user_speciality',		
		'user_contacts',
		'user_website',
		'user_skype',
		'user_socials',
		'user_email',
		'user_workplace',
		'user_workplace_desc',
    'twitter',
    'facebook',
    'vk',
    'instagram',
	);
	
	if( !in_array($field, $fields) )
		return '';
	
	$value = ''; 
	switch($field) {
		case 'user_bio':
            $value = get_user_meta($member_id, 'description', true);
            break;
		
		case 'user_city':
            $value = get_user_meta($member_id, 'user_city', true);
            break;
		
		case 'user_speciality':
            $value = get_user_meta($member_id, 'user_speciality', true);
            break;
	
		case 'user_email':
            $value = get_userdata($member_id)->user_email;
            break;
	
		case 'user_contacts':
            $value = get_user_meta($member_id, 'user_contacts', true);
            break;
	
		case 'user_website':
            $value = get_userdata($member_id)->user_url;
            $value = (!empty($value)) ? untrailingslashit(esc_url($value)) : $value;
            break;
	
		case 'user_skype':
			$value = get_user_meta($member_id, 'user_skype', true);
			break;
            
		case 'user_socials':
            $value = tst_get_member_links_list($member_id);
            break;
	
		case 'user_date':
            $date = get_userdata($member_id)->user_registered;
            $value = date_i18n(get_option('date_format'), strtotime($date));
            break;
			
		case 'user_workplace':
            $value = ($member_id) ? get_user_meta($member_id, 'user_workplace', true) : '';
            break;
		
		case 'user_workplace_desc':
            $value = ($member_id) ? get_user_meta($member_id, 'user_workplace_desc', true) : '';
            break;

        default:
            $value = '';
	}

	return $value;
}

function tst_get_member_links_list($member_id){	
	
	if(!$member_id)
		$member_id = tst_get_current_member()->ID;
	elseif(is_object($member_id))
		$member_id = $member_id->ID;
	
	$links = array();
	
	$website = tst_get_member_field('user_website', $member_id);
	if(!empty($website)){
		$links['website'] = array(
			'label' => __('Website', 'tst'),
			'txt' => str_replace(array('http://', 'https://'), '', $website),
			'url' => esc_url($website)
		);
	}
	
	$twitter = get_user_meta($member_id, 'twitter', true);
	if(!empty($twitter)){
		$twitter = str_replace('@', '', $twitter);
		$links['twitter'] = array(
			'label' => __('Twitter', 'tst'),
			'txt' => 'twitter.com/'.$twitter,
			'url' => esc_url('https://twitter.com/'.$twitter)
		);
	}
		
	$facebook = get_user_meta($member_id, 'facebook', true);
	if(!empty($facebook)){		
		$links['facebook'] = array(
			'label' => __('Facebook', 'tst'),
			'txt' => str_replace(array('http://', 'https://'), '', $facebook),
			'url' => esc_url($facebook)
		);
	}
	
	$vk = get_user_meta($member_id, 'vk', true);
	if(!empty($vk)){		
		$links['vk'] = array(
			'label' => __('VKontakte', 'tst'),
			'txt' => str_replace(array('http://', 'https://'), '', $vk),
			'url' => esc_url($vk)
		);
	}
	
	$google = get_user_meta($member_id, 'googleplus', true);
	if(!empty($google)){		
		$links['googleplus'] = array(
			'label' => __('Phone', 'tst'),
			'txt' => $google,
			'url' => 'tel:'.$google
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

function tst_get_edit_member_url($member_id = null){	

	if(!$member_id)
		$member_id = tst_get_current_member()->ID;
	elseif(is_object($member_id))
		$member_id = $member_id->ID;

	return add_query_arg('member', intval($member_id), home_url('member-actions/'));
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

/** Member in Loop **/
function tst_member_in_loop($tst_member){
	
$img_folder = get_template_directory_uri().'/assets/img/';
?>

<article class="member col-md-6">
	
	<div class="border-card">
		
	<header class="member-header">
		<div class="row">
			<div class="col-md-3">
				<a href="<?php echo tst_get_member_url($tst_member);?>" class="thumbnail">
					<?php tst_temp_avatar($tst_member->ID);?>
				</a>
			</div>
			<div class="col-md-9">

                <?php
                    $is_user_test_employee = get_user_meta($tst_member->ID, 'user_test_employee', true);
					$is_user_test_partner = get_user_meta($tst_member->ID, 'user_test_partner', true);
                    $role = tst_get_member_role_key($tst_member);
					
					$activity = tst_get_member_activity($tst_member);					
                ?>
				<div class="member-status">
					<span class="label <?php echo esc_attr($role); ?>"><?php echo tst_get_role_name($role); ?></span>
					<span class="label-from"> <?php _e('from', 'tst');?> <?php echo date("d.m.Y", strtotime(get_userdata($tst_member->ID)->user_registered)); ?></span>
					
					<?php if($is_user_test_employee):?><img class="itv-test-employee" title="<?php _e('Te-st employee', 'tst');?>" alt="<?php _e('Te-st employee', 'tst');?>" src="<?php echo $img_folder.'/te-st-logo.jpg'; ?>" /><?php endif; ?>
					<?php if($is_user_test_partner):?><img class="itv-test-partner" title="<?php _e('Te-st partner', 'tst');?>" alt="<?php _e('Te-st partner', 'tst');?>" src="<?php echo $img_folder.'logo-v.png'; ?>" /><?php endif; ?>
				</div>
				<h4 class="member-title"><a href="<?php echo tst_get_member_url($tst_member);?>"><?php echo tst_get_member_name($tst_member);?></a></h4>
				
				<!-- metas -->
				<div class="member-meta">
					<span class="member-points">
						<?php if($place_of_work = tst_get_member_field('user_workplace', $tst_member->ID)): ?>
						<span><?php _e('Place of work', 'tst');?>:</span> <b class="user-rating"><?php echo $place_of_work; ?></b><br />
						<?php endif; ?>
						
						<span><?php _e('XP Rating', 'tst');?>:</span> <b class="user-rating"><?php echo UserXPModel::instance()->get_user_xp($tst_member->ID);?></b>
						<span><?php _e('Rating', 'tst');?>:</span> <b class="user-rating"><?php echo (int)$activity['solved'];?></b>
						
						<span><?php _e('Tasks', 'tst');?>:</span>
						<b title="<?php _e('Participating in tasks / completed tasks', 'tst');?>"><?php echo (int)$activity['joined'].'(<span>'.(int)$activity['solved'].'</span>)';?></b>
						<?php echo ' / '; ?>
						<span title="<?php _e('Created tasks / completed tasks', 'tst');?>"><?php echo (int)$activity['created'].'('.(int)$activity['created_closed'].')';?></span>
			
					</span>
			
					<?php $city = sanitize_text_field(tst_get_member_field('user_city', $tst_member->ID));					
					if($city) {?>
						<span class='city'><?php echo $city;?></span>
					<?php }?>
				</div>
							
			</div><!-- .col-md-9 -->
		</div>
	</header>
	<div class="member-summary">
		<?php echo html_entity_decode(tst_get_member_summary($tst_member->ID, true), ENT_QUOTES, 'UTF-8'); ?>
	</div>
	
	</div>
</article><!-- .member -->

<?php	
}


/** Singleton replacement for global $tst_member **/
class TST_Current_Member {
	
	private static $_instance = null;
	private $user_object = null;
	
	private function __construct() {		
		
		$this->user_object = get_user_by('slug', get_query_var('membername'));
		if($this->user_object) {
			update_meta_cache('user', array($this->user_object->ID));
		}
		
	}
	
	public static function get_instance() {

        // If the single instance hasn't been set, set it now.
        if( !self::$_instance ) {
            self::$_instance = new self;
        }
		
        return self::$_instance;
    }
	
	public function __get($param) {
		
		switch($param) {
			case 'ID':
				return ($this->user_object) ? $this->user_object->ID : 0;
			case 'user_login':
				return ($this->user_object) ? $this->user_object->user_login : '';
			case 'user_object':
				return ($this->user_object) ? $this->user_object : null;
			case 'first_name' :
				return ($this->user_object) ? $this->user_object->first_name : '';
			case 'last_name' :
				return ($this->user_object) ? $this->user_object->last_name : '';
		}
	}
}

function tst_get_current_member() {
    return TST_Current_Member::get_instance();
}

function itv_show_review_rating_readonly($rating) {
	?>
<div class="itv-rating review-rating-readonly pull-left clearfix">
	<div class="review-rating-container-readonly">
		<?php foreach(array(1, 2, 3, 4, 5) as $v):?>
		<input type="radio" class="rating" value="<?php echo $v?>" <?php if($rating == $v):?>checked="true"<?php endif?> />
		<?php endforeach ?>
	</div>
</div>
<?php 							
}

function itv_show_review($review, $review_author) {
	$review_author_url = $review_author ? trailingslashit(site_url('/members/'.$review_author->user_login)) : '';
?>
	<div class="itv-user-review-item clearfix">
		<div class="itv-user-review-message">
		<?php echo apply_filters('frl_the_content', stripslashes($review->message))?>
		</div>
		
		<?php itv_show_review_rating_readonly($review->rating); ?>
		
		<?php if($review_author):?>
		<div class="itv-user-review-author pull-right">
			<a href="<?php echo $review_author_url;?>"><?php echo $review_author->first_name.' '.$review_author->last_name;?></a>
			<br />
			<small><i><?php echo date("d.m.Y", strtotime($review->time_add)); ?></i></small>
		</div>
		<?php endif?>
	</div>
<?php 
}