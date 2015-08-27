<?php
/**
 * Common template tags - on top reviewed ones
 * 
 **/


/** == Page elements == **/

/* page title */
function frl_page_title(){	
	global $post, $wp_query;
	
	$title = '';
	if(is_post_type_archive('tasks')){
        $title = apply_filters('post_type_archive_title', get_post_type_object('tasks')->labels->name);
		
	}
    elseif(is_tag()) {
        $title = apply_filters('tag_archive_title', single_tag_title('', false));
		$title = sprintf(__('Tasks by tag: %s ( %s )', 'tst'), $title, (int)$wp_query->found_posts);
    }
	elseif(is_singular('tasks')) {

		//$id = intval($post->ID); 
		$title = apply_filters('the_title', $post->post_title);

	} elseif(is_single_member()) {
        $title = apply_filters('the_title', tst_get_member_name());
		
	} elseif(is_page('tags')) {
		$title = apply_filters('post_type_archive_title', get_post_type_object('tasks')->labels->name);
		
	} elseif(is_page('task-actions')) {
		
		if(empty($_GET['task']))
			$title = __('New task', 'tst');
		else {
			$id = intval($_GET['task']);
			$title = sprintf(__('Edit task #%s', 'tst'), $id);
		}
	} elseif(is_page('member-actions'))
        $title = apply_filters('the_title', tst_get_member_action_title());

    elseif(is_page('member-tasks')){
		$user_id = get_current_user_id();
        $title = apply_filters('the_title', __('All Tasks', 'tst'). ' / '. tst_get_member_name($user_id));
    }
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
		
		$title = mb_substr(frl_page_title(), 0, 40);
		$bredcrumbs[] = "<li class='active'>{$title}&hellip;</li>";
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



/** Next/previous nav when applicable **/
function tst_content_nav( $nav_id, $query = null ) {	

	$nav_class = ( is_single() || is_single_member()) ? 'nav-post' : 'nav-paging';
	?>
	<nav role="navigation" id="<?php echo esc_attr( $nav_id ); ?>" class="clearfix <?php echo $nav_class; ?>">		

	<?php if ( is_single() ) : // navigation links for single posts ?>
		
	<div class="nextprev">
		<?php
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

/** Paging **/
function frl_paginate_links($query = null, $echo = true) {
    global $wp_query;
    
	if(!$query)
		$query = $wp_query;
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
		
	$member = tst_get_comment_author($comment_id);
	if(!$member)
		return '';
	
	$name = tst_get_member_name($member);
	$url = tst_get_member_url($member);
	
	return "<a href='{$url}' class='url'>{$name}</a>";
}

function tst_get_comment_author($comment_id = 0){
	
	$comment = get_comment($comment_id);
	
	if(!$comment->user_id)
		return false;
	
	return get_user_by('id', $comment->user_id);
}

function tst_comment( $comment, $args, $depth ) {
	
	$member = tst_get_comment_author($comment->comment_ID);
?>
	<li id="comment-<?php comment_ID(); ?>" <?php comment_class( empty( $args['has_children'] ) ? '' : 'parent' ); ?>>
		<article id="div-comment-<?php comment_ID(); ?>" class="comment-body media">
			<span class="pull-left comment-avatar">
				<?php if(0 != $args['avatar_size'] && $member) tst_temp_avatar($member); ?>
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


/** == User & Tasks connection == **/

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


