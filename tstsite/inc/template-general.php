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
    elseif(is_tax('nko_task_tag')) {
        $title = apply_filters('tag_archive_title', single_tag_title('', false));
		$title = sprintf(__('Tasks by NKO tag: %s ( %s )', 'tst'), $title, (int)$wp_query->found_posts);
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
		$title = __('News', 'tst');
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
        $redirect = '?redirect_to='.urlencode(stripos(wp_get_referer(), 'login') ? home_url() : wp_get_referer());
    elseif(strlen($redirect) > 1)
        $redirect = '?redirect_to='.urlencode($redirect);
    else
        $redirect = '';

	return home_url('login/'.$redirect);
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

/** Sharing buttons **/
function tst_have_sharing(){
		
	if(is_front_page() || is_post_type_archive('tasks'))
		return true;
	
	if(is_singular(array('tasks', 'post')))
		return true;
	
	if(is_page('members'))
		return true;
	
	if(is_about())
		return true;
	
	if(is_single_member())
		return true;
	
		
	return false;
}

//add_action('tst_layout_footer', 'frl_social_share');
function frl_social_share() {
	
	if(!tst_have_sharing())
		return;	
?>
<div class="social-likes-wrapper">
<div class="social-likes">
	<div class="vkontakte" title="Поделиться ссылкой во Вконтакте">Вконтакте</div>
	<div class="facebook" title="Поделиться ссылкой на Фейсбуке">Facebook</div>
	<div class="odnoklassniki" title="Поделиться ссылкой в Одноклассниках">Одноклассники</div>
	<div class="twitter" title="Поделиться ссылкой в Твиттере">Twitter</div>	
</div></div>
<?php
}

add_action('tst_layout_footer', 'frl_social_share_no_js');
function frl_social_share_no_js() {
	
	if(!tst_have_sharing())
		return;
	
$title = (class_exists('WPSEO_Frontend')) ? WPSEO_Frontend::get_instance()->title( '' ) : '';
$link = frl_current_url();

	$data = array(
		'vkontakte' => array(
			'label' => 'Поделиться во Вконтакте',
			'url' => 'https://vk.com/share.php?url='.$link.'&title='.$title,
			'txt' => 'Вконтакте'
		),
		'facebook' => array(
			'label' => 'Поделиться на Фейсбуке',
			'url' => 'https://www.facebook.com/sharer/sharer.php?u='.$link,
			'txt' => 'Facebook'
		),
		
		'odnoklassniki' => array(
			'label' => 'Поделиться ссылкой в Одноклассниках',
			'url' => 'http://connect.ok.ru/dk?st.cmd=WidgetSharePreview&service=odnoklassniki&st.shareUrl='.$link,
			'txt' => 'Одноклассники'
		),
		'twitter' => array(
			'label' => 'Поделиться ссылкой в Твиттере',
			'url' => 'https://twitter.com/intent/tweet?url='.$link.'&text='.$title,
			'txt' => 'Twitter'
		)
	);
	
?>
<div class="social-likes-wrapper">
<div class="social-likes social-likes_visible social-likes_ready">

<?php
	foreach($data as $key => $obj){
?>
	<div title="<?php echo esc_attr($obj['label']);?>" class="social-likes__widget social-likes__widget_<?php echo $key;?>">
		<a href="<?php echo $obj['url'];?>" class="social-likes__button social-likes__button_<?php echo $key;?>" target="_blank" onClick="window.open('<?php echo $obj['url'];?>','<?php echo $obj['label'];?>','top=320,left=325,width=650,height=430,status=no,scrollbars=no,menubar=no,tollbars=no');return false;">
			<span class="social-likes__icon social-likes__icon_<?php echo $key;?>"></span><?php echo $obj['txt'];?>
		</a>
	</div>
<?php
	}
?>

</div>
</div>
<?php
}

 
/* Custom conditions */
function is_about(){
	global $post;
	
	if(!is_page())
		return false;
	
	if(is_page('about'))
		return true;
	
	if(is_page('contacts'))
		return true;
	
	if(is_page('sovety-dlya-nko-uspeshnye-zadachi'))
		return true;
	
	//$parents = get_post_ancestors($post);
	//$test = get_page_by_path('about');
	//if(in_array($test->ID, $parents))
	//	return true;
	
	return false;
}

function is_page_branch($slug){
	global $post;
	
	if(empty($slug))
		return false;
	
		
	if(!is_page())
		return false;
	
	if(is_page($slug))
		return true;
	
	$parents = get_post_ancestors($post);
	$test = get_page_by_path($slug);
	if(in_array($test->ID, $parents))
		return true;
	
	return false;
}

function is_tax_branch($slug, $tax) {
	global $post;
	
	$test = get_term_by('slug', $slug, $tax);
	if(empty($test))
		return false;
	
	if(is_tax($tax)){
		$qobj = get_queried_object();
		if($qobj->term_id == $test->term_id || $qobj->parent == $test->term_id)
			return true;
	}
	
	if(is_singular() && is_object_in_term($post->ID, $tax, $test->term_id))
		return true;
	
	return false;
}

function is_news() {
	
	if(is_home() || is_category())
		return true;
	
	if(is_singular('post'))
		return true;
	
	return false;
}


/** News item in loop **/
function tst_news_item_in_loop($news){
	
	$css = (is_front_page()) ? 'col-md-6 home-news item-masonry' : 'col-md-6 tpl-post';
?>
<article <?php post_class($css, $news); ?>>

	<div class="border-card">
		<?php if(is_front_page()) { ?><h2>Новости проекта</h2><?php } ;?>
		
		<h4><a href="<?php echo get_permalink($news); ?>" rel="bookmark"><?php echo get_the_title($news); ?></a></h4>
		
		<?php
			$size = (is_front_page()) ? 'embed' : 'post-thumbnail';			
			$thumbnail = get_the_post_thumbnail($news->ID, $size); //2 queries
			if($thumbnail) {
		?>
			<a href="<?php echo get_permalink($news); ?>" class="thumb-link"><?php echo $thumbnail;?></a>
		<?php } ?>
		
		<?php if(!is_front_page()) { ?>
		<div class="post-summary">
			<div class="post-meta"><time><?php echo get_the_date('d.m.Y', $news);?></time></div>
			<?php
				$e = (!empty($news->post_excerpt)) ? $news->post_excerpt : wp_trim_words($news->post_content, 30);
				echo apply_filters('frl_the_content', $e);
			?>			
		</div>
		<?php }?>
	</div>	
		
</article><!-- #post-## -->	
<?php	
}

function itv_get_search_button_color_class($query) {
    $task_status = $query->get('task_status');
    if($task_status == 'in_work') {
        $btn_class = "btn-warning";
    }
    elseif($task_status == 'archived') {
        $btn_class = "btn-primary";
    }
    elseif($task_status == 'closed') {
        $btn_class = "btn-default";
    }
    else {
        $btn_class = "btn-success";
    }
    return $btn_class;
}
