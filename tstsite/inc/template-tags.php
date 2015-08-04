<?php
/**
 * Common template tags - on top reviewed ones
 * 
 **/


/** == Page elements == **/

/* page title */
function frl_page_title(){	
	global $post, $tst_member, $wp_query;
	
	$title = '';
	if(is_post_type_archive('tasks')){
        $title = apply_filters('post_type_archive_title', get_post_type_object('tasks')->labels->name);
		
	}
    elseif(is_tag()) {
        $title = apply_filters('tag_archive_title', single_tag_title('', false));
		$title = sprintf(__('Tasks by tag: %s ( %s )', 'tst'), $title, (int)$wp_query->found_posts);
    }
	elseif(is_singular('tasks')) {

		$id = intval($post->ID); 
		$title = apply_filters('the_title', $post->post_title)." (#{$id})";

	} elseif(is_single_member())
        $title = apply_filters('the_title', tst_get_member_name());

	elseif(is_page('task-actions')) {
		
		if(empty($_GET['task']))
			$title = __('New task', 'tst');
		else {
			$id = intval($_GET['task']);
			$title = sprintf(__('Edit task #%s', 'tst'), $id);
		}
	} elseif(is_page('member-actions'))
        $title = apply_filters('the_title', tst_get_member_action_title());

    elseif(is_page('member-tasks'))
        $title = apply_filters('the_title', __('All Tasks', 'tst'). ' / '. tst_get_member_name());

	elseif(is_page() || is_single())
        $title = apply_filters('the_title', $post->post_title);
    elseif(is_search()){
        $title = __('Search results', 'tst');
    }
	elseif(is_home()){
		$p = get_page(get_option('page_for_posts'));
		$title = apply_filters('the_title', $p->post_title);
	}
    elseif(is_404())
		$title = __('Page not found', 'tst');

    else { //@to_do make reeal titles here
		$title = __('Some title', 'tst');
	}
	
	return $title;
}

function frl_breadcrumbs(){
	global $post;
	
	$bredcrumbs = array();	
	$bredcrumbs[] = "<li><a href='".home_url()."'>Главная</a></li>";
	
	if(is_post_type_archive('tasks')){
		
		$title = frl_page_title();
		$bredcrumbs[] = "<li class='active'>{$title}</li>";
	}
	elseif(is_singular('tasks') || is_page('task-actions')){
		
		$a_link= get_post_type_archive_link('tasks');
		$a_title = apply_filters('post_type_archive_title', get_post_type_object('tasks')->labels->name);
		
		$bredcrumbs[] = "<li><a href='{$a_link}'>{$a_title}</a></li>";
		
		$title = frl_page_title();
		$bredcrumbs[] = "<li class='active'>{$title}</li>";
	}
	elseif(is_single_member()){
				
		$a_link= get_permalink($post);
		$a_title = apply_filters('the_title', $post->post_title);
		
		$bredcrumbs[] = "<li><a href='{$a_link}'>{$a_title}</a></li>";
		
		$title = frl_page_title();
		$bredcrumbs[] = "<li class='active'>{$title}</li>";
	}
	elseif(is_page('member-actions')){
		
		$members_page = get_page_by_path('members');
		$a_link= get_permalink($members_page);
		$a_title = apply_filters('the_title', $members_page->post_title);
		
		$bredcrumbs[] = "<li><a href='{$a_link}'>{$a_title}</a></li>";
		
		$member_name = tst_get_member_name();
		$member_url = tst_get_member_url();
		
		$bredcrumbs[] = "<li><a href='{$member_url}'>{$member_name}</a></li>";
		
		$title = frl_page_title();
		$bredcrumbs[] = "<li class='active'>{$title}</li>";
	}
	elseif(is_page('member-tasks')){
		
		$members_page = get_page_by_path('members');
		$a_link= get_permalink($members_page);
		$a_title = apply_filters('the_title', $members_page->post_title);
		
		$bredcrumbs[] = "<li><a href='{$a_link}'>{$a_title}</a></li>";
		
		$member_name = tst_get_member_name();
		$member_url = tst_get_member_url();
		
		$bredcrumbs[] = "<li><a href='{$member_url}'>{$member_name}</a></li>";
		
		$title = __('All Tasks', 'tst');
		$bredcrumbs[] = "<li class='active'>{$title}</li>";
	}
	elseif(is_home()) {
		$about = get_page_by_path('about');
		$about_t = apply_filters('the_title', $about->post_title);
		$bredcrumbs[] = "<li><a href='".get_permalink($about)."'>{$about_t}</a></li>";
		
		$p = get_page(get_option('page_for_posts'));
		$title = apply_filters('the_title', $p->post_title);
		$bredcrumbs[] = "<li class='active'>{$title}</li>";
	}
	elseif(is_page()) {
		if(is_page('sovety-dlya-nko-uspeshnye-zadachi') || is_page('contacts')) {
			$about = get_page_by_path('about');
			$about_t = apply_filters('the_title', $about->post_title);
			$bredcrumbs[] = "<li><a href='".get_permalink($about)."'>{$about_t}</a></li>";
		}
		
		$title = frl_page_title();
		$bredcrumbs[] = "<li class='active'>{$title}</li>";
	}
	elseif(is_single()) {
		$p = get_page(get_option('page_for_posts'));
		$title = apply_filters('the_title', $p->post_title);
		
		$about = get_page_by_path('about');
		$about_t = apply_filters('the_title', $about->post_title);
				
		$bredcrumbs[] = "<li><a href='".get_permalink($about)."'>{$about_t}</a></li>";
		$bredcrumbs[] = "<li class='active'>{$title}</li>";
	}
	else { //@to_do make real structures here
		
		$title = frl_page_title();
		$bredcrumbs[] = "<li class='active'>{$title}</li>";
	}
	
	return (!empty($bredcrumbs)) ? "<ol class='breadcrumb'>".implode('',$bredcrumbs )."</ol>" : '';
}


/* Excerpts filters for texts */
function frl_continue_reading_link() {
	$more = __('More', 'tst');
	return '&nbsp;<a href="'. esc_url( get_permalink() ) . '"><span class="meta-nav">'.$more.'&hellip;</span></a>';
}

add_filter( 'excerpt_more', 'frl_auto_excerpt_more' );
function frl_auto_excerpt_more( $more ) {
	return '&hellip;';
}

add_filter( 'excerpt_length', 'frl_custom_excerpt_length' );
function frl_custom_excerpt_length( $l ) {
	return 35;
}

add_filter( 'get_the_excerpt', 'frl_custom_excerpt_more' );
function frl_custom_excerpt_more( $output ) {
	
	if(is_singular())
		return $output;
	
	if (is_search())
		$output .= '&nbsp;[&hellip;]';
	else
		$output .= frl_continue_reading_link();
	
	return $output;
}


/** Login & Registration tags **/
function tst_get_login_url($redirect = true) {

    if(is_bool($redirect))
        $redirect = '?redirect_to='.urlencode(stripos(wp_get_referer(), 'registration') ? home_url() : wp_get_referer());
    elseif(strlen($redirect) > 1)
        $redirect = '?redirect_to='.urlencode($redirect);
    else
        $redirect = '';

	return home_url('registration/'.$redirect);
}

function tst_get_register_url() {

	return home_url('registration');
}


/** GA Events **/
function tst_ga_event_data($trigger_id){
	
	echo "data-ga_event='".esc_attr($trigger_id)."'";
}

// old 



/**
 * Display navigation to next/previous pages when applicable
 */
function tst_content_nav( $nav_id, $query = null ) {
	global $wp_query, $post;

	$nav_class = ( is_single() || is_single_member()) ? 'nav-post' : 'nav-paging';
	?>
	<nav role="navigation" id="<?php echo esc_attr( $nav_id ); ?>" class="clearfix <?php echo $nav_class; ?>">		

	<?php if ( is_single() ) : // navigation links for single posts ?>
		
	<div class="nextprev">
		<?php
			//previous_post_link( '<span class="nav-previous">%link</span>', __('&laquo; prev.', 'tst') );
			//next_post_link('<span class="nav-next">%link</span>', __('next. &raquo;', 'tst') );
			$back = home_url('tasks');
		?>
		<span class="nav-link"><a href="<?php echo $back;?>">&laquo; <?php _e('Back to tasks list', 'tst');?></a></span>
	</div>
	<?php elseif(is_single_member()): ?>
		<div class="nextprev">
		<?php $back = home_url('members');?>
		<span class="nav-link"><a href="<?php echo $back;?>">&laquo; <?php _e('Back to members list', 'tst');?></a></span>
	</div>
	<?php elseif(is_page('members')): ?>
		<div class="pull-right">
		<?php
			$p = tst_members_paging($query, false);
			if(!empty($p)){
				echo $p;
			}
		?>
		</div>
	<?php else : // pagination ?>
		<div class="pull-right">
		<?php
			$p = frl_paginate_links($query, false);
			if(!empty($p)){
				echo $p;
			}
		?>		
		</div>
	<?php endif; ?>

	</nav>
	<?php
}

function tst_members_paging($query, $echo = true){
	global $wp_rewrite, $wp_query;
    
	if(null == $query)
		$query = $wp_query;
	
    //var_dump($wp_query);
	$remove = array(
			
	);
	
	$current = ($query->query_vars['paged'] > 1) ? $query->query_vars['paged'] : 1;
	$parts = parse_url(get_pagenum_link(1));	
	$base = trailingslashit(esc_url($parts['host'].$parts['path']));
	if(function_exists('tstmu_is_ssl') && tstmu_is_ssl()){
		$base = str_replace('http:', 'https:', $base);
	}
	
	// Calculate total pages:
	$per_page = get_option('posts_per_page');
	
	$users_query_params = array(
	    'nopaging' => true,
	    'exclude' => ACCOUNT_DELETED_ID,
	);
	$users_query_params = tst_process_members_filter($users_query_params);
	
	$user_query = new WP_User_Query($users_query_params);
	$users_count = array('total_users' => $user_query->total_users);
	
	$total_pages = ceil($users_count['total_users']/$per_page); //do we need any particular part?
    
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

function frl_paginate_links($query = null, $echo = true) {
    global $wp_rewrite, $wp_query;
    
	if(null == $query)
		$query = $wp_query;
	
    //var_dump($wp_query);
	$remove = array(
		's'		
	);
	
	$current = ($query->query_vars['paged'] > 1) ? $query->query_vars['paged'] : 1;
	$parts = parse_url(get_pagenum_link(1));	
	$base = trailingslashit(esc_url($parts['host'].$parts['path']));
	if(function_exists('tstmu_is_ssl') && tstmu_is_ssl()){
		$base = str_replace('http:', 'https:', $base);
	}
	
	$filter_args = array();
	if(isset($_GET) && is_array($_GET)) {
		foreach($_GET as $k => $v) {
			$filter_args[$k] = $v;
		}		
	}
    
	$pagination = array(
        'base' => $base.'%_%',
        'format' => 'page/%#%/',
        'total' => $query->max_num_pages,
        'current' => $current,
        'prev_text' => __('&laquo; prev.', 'tst'),
        'next_text' => __('next. &raquo;', 'tst'),
        'end_size' => 4,
        'mid_size' => 4,
        'show_all' => false,
        'type' => 'list', //list
		'add_args' => $filter_args
    );
    
	
    if(!empty($query->query_vars['s']))
        $pagination['add_args'] = array('s' => str_replace(' ', '+', get_search_query()));
	
	foreach($remove as $param){
		if($param == 's')
			continue;
		
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



function frl_get_sep() {
	return "<span class='sep'>/</span>";
}

function frl_task_candidate_markup(WP_User $candidate, $mode = 1) {
	
$member_url = trailingslashit(site_url('/members/'.$candidate->user_login));
?>
<div class="c-img">
	<?php tst_temp_avatar($candidate);?>
</div>
<div class="c-name">
	<a href="<?php echo $member_url;?>"><?php echo $candidate->first_name.' '.$candidate->last_name;?></a>
	<div class="user-rating"><?php echo __('Rating', 'tst').': <span>'.tst_get_user_rating($candidate->ID).'</span>';?></div>
</div>
<div class="c-actions">
	<?php if(p2p_get_meta($candidate->p2p_id, 'is_approved', true)) {?>

		<span class="candidate-approved">
			<span class="c-status-app btn btn-success btn-xs"><span class="glyphicon glyphicon-ok"></span></span>
		</span>

		<?php if($mode >= 1 && $mode <= 2) {?>
		 
		<span class="candidate-refuse" data-link-id="<?php echo $candidate->p2p_id;?>" data-doer-id="<?php echo $candidate->ID;?>" data-task-id="<?php the_ID();?>" data-nonce="<?php echo wp_create_nonce($candidate->p2p_id.'-candidate-refuse-'.$candidate->ID);?>">
			<span class="btn btn-danger btn-xs"><?php _e('Disapprove', 'tst');?></span>
		</span>

		<?php
		} elseif($mode == 3 && !ItvReviews::instance()->is_review_for_doer_and_task($candidate->ID, get_the_ID())) {?>
				 
		<span class="leave-review" data-doer-id="<?php echo $candidate->ID;?>" data-task-id="<?php the_ID();?>">
			<span class="btn btn-primary btn-xs" title="<?php _e('Leave review', 'tst');?>"><span class="glyphicon glyphicon-bullhorn"></span></span>
		</span>
		
		<?php }
				
	} else { ?>
	
		<span class="candidate-li">
			<span class="c-status-napp btn btn-success btn-xs"><span class="glyphicon glyphicon-ok"></span></span>
		</span>
	
		<?php if($mode == 1) {?>

		<span class="candidate-ok" data-link-id="<?php echo $candidate->p2p_id;?>" data-doer-id="<?php echo $candidate->ID;?>" data-task-id="<?php the_ID();?>" data-nonce="<?php echo wp_create_nonce($candidate->p2p_id.'-candidate-ok-'.$candidate->ID);?>">
			<span class="btn btn-default btn-xs"><?php _e('Approve', 'tst');?></span>
		</span>
		<?php } ?>

		

	<?php }?>
</div>

<?php
}



/**
 * Sharing buttons
 **/
function frl_page_actions(){
?>

<?php
}


if(!function_exists('frl_current_url')){
function frl_current_url() {
   
    $pageURL = 'http';
   
    if (isset($_SERVER["HTTPS"]) && ($_SERVER["HTTPS"] == "on")) {$pageURL .= "s";}
    $pageURL .= "://";
   
    if ($_SERVER["SERVER_PORT"] != "80") {
        $pageURL .= $_SERVER["SERVER_NAME"].":".$_SERVER["SERVER_PORT"].$_SERVER["REQUEST_URI"];
    } else {
        $pageURL .= $_SERVER["SERVER_NAME"].$_SERVER["REQUEST_URI"];
    }
   
    return $pageURL;
}
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
		//$grav_url = $default;
		?>
			<img src="<?=$grav_url?>" alt="<? _e('Member', 'tst');?>">
		<?php
	}
}

function tst_login_avatar(){
?>
	<img src="<?php echo get_template_directory_uri();?>/img/temp-avatar.png" alt="<? _e('LogIn', 'tst');?>">
<?php
}

/* Comments opened for tasks */
add_filter('comments_open', 'tst_comments_on_tasks', 2, 2);
function tst_comments_on_tasks($open, $post_id){
	
	$test = get_post($post_id);
	if($test->post_type == 'tasks' && in_array($test->post_status, array('publish', 'in_work'))){		
		return true;
	}
	return false; // no comments in other cases
}

function tst_get_comment_author_link($comment_id = 0){
		
	$comment = get_comment($comment_id);
	
	if(!$comment->user_id)
		return '';
	
	$member = get_user_by('id', $comment->user_id);	
	$name = tst_get_member_name($member);
	$url = tst_get_member_url($member);
	
	return "<a href='{$url}' class='url'>{$name}</a>";
}

function tst_comment( $comment, $args, $depth ) {
	$GLOBALS['comment'] = $comment;

?>
	<li id="comment-<?php comment_ID(); ?>" <?php comment_class( empty( $args['has_children'] ) ? '' : 'parent' ); ?>>
		<article id="div-comment-<?php comment_ID(); ?>" class="comment-body media">
			<span class="pull-left comment-avatar">
				<?php if(0 != $args['avatar_size']) tst_temp_avatar(); ?>
			</span>

			<div class="media-body">
				<div class="media-body-wrap panel panel-default">

					<div class="panel-heading">
						<h5 class="media-heading">
						<?php echo tst_get_comment_author_link();?>
						<?php echo ' / ';?>						
						<time datetime="<?php comment_time( 'c' ); ?>">
							<?php printf( _x( '%1$s at %2$s', '1: date, 2: time', 'tst' ), get_comment_date(), get_comment_time() ); ?>
						</time>
											
						</h5>
					</div>		

					<div class="comment-content panel-body">
						<?php comment_text(); ?>
					</div>

					<?php comment_reply_link(
						array_merge(
							$args, array(
								'add_below' => 'div-comment',
								'depth' 	=> $depth,
								'max_depth' => $args['max_depth'],
								'before' 	=> '<footer class="reply comment-reply panel-footer">',
								'after' 	=> '</footer><!-- .reply -->'
							)
						)
					); ?>

				</div>
			</div><!-- .media-body -->

		</article><!-- .comment-body -->
<?php

}


/** Old task params - to be reworked */
function tst_task_params(){
	
?>
<div class="row task-params">
	<div class="col-md-4">
	<?php
		$deadline = date_from_yymmdd_to_dd_mm_yy(get_field('field_533bef200fe90', get_the_ID()));
		$interval = tst_get_days_until_deadline($deadline); 
		$reward = get_term(get_field('field_533bef600fe91', get_the_ID()), 'reward');
	?>
		<span class="<?php echo tst_get_deadline_class($interval);?> deadline task-param btn btn-default">
			<span class="deadline-icon glyphicon glyphicon-time"></span>
			<span class="deadline-date"><?php echo date('d.m.Y', strtotime($deadline));?></span>			
		</span>
	</div>

	<?php tst_task_reward($reward)?>
</div><!-- .row -->	
<?php
}

function tst_task_reward($reward) {
?>
	<div class="col-md-8">
		<span class="reward task-param btn btn-default" <?if(!is_wp_error($reward)):?>title="<?=$reward->name?>"<?endif?>>
			<span class="reward-icon glyphicon glyphicon-thumbs-up"></span>
			<span class="reward-name"><?php
				echo is_wp_error($reward) ? __('No reward setted yet', 'tst') : $reward->name;
			?>
			</span>
		</span>
	</div>
<?	
}

