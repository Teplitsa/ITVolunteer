<?php
/**
 * Template tags for tasks templates
 * moved here after adoption in redesign
 **/

/** == Tasks in loop ==**/
function tst_get_task_status_list() {
    return array(
        'draft'   => __('Draft', 'tst'),
        'publish' => __('Opened', 'tst'),
        'in_work' => __('In work', 'tst'),
        'closed'  => __('Closed', 'tst'),
		'archived'  => __('Archived', 'tst')
    );
}

function tst_get_task_status_label($status = false) {

    if( !$status ) {
        global $post;

        if( !$post || $post->post_type != 'tasks')
            return false;

        $status = $post->post_status;
    }

    $status_list = tst_get_task_status_list();
    return isset($status_list[$status]) ? $status_list[$status] : false;
}

function tst_tast_status_tip($task = null){
		
	$label = array();
	$task_id = ($task) ? $task->ID : get_the_ID();
    $status = get_post_status($task_id);
	$status_list = tst_get_task_status_list();
	
    $label[] = isset($status_list[$status]) ? $status_list[$status] : '';
	
	if($status != 'closed' && function_exists('get_field')){
		$deadline = date_from_yymmdd_to_dd_mm_yy(get_field('deadline', $task_id));
		$deadline = date('d.m.Y', strtotime($deadline));
		$label[] = sprintf(__('deadline: %s', 'tst'), $deadline);
	}

	return implode(', ', $label);
}

function tst_task_fixed_meta_in_card($task = null){
	    
	$author_id = ($task) ? $task->post_author : get_the_author_meta('ID');
    $user_workplace = trim(sanitize_text_field(tst_get_member_field('user_workplace', $author_id)));
   
	$meta = array();
	$meta[] = tst_get_task_author_link($task);
	
	if(!empty($user_workplace)) {
		$meta[] = "<span class='workplace'>{$user_workplace}</span>";
	}
	
	#$meta[] = "<time>".get_the_date('', $task)."</time>";
	$meta[] = "<time>".get_the_modified_date('', $task)."</time>";
	
	return implode(', ', $meta);
}


function tst_get_task_author_link($task = null, $name_wrapper = false){	
	
	$author_id = ($task) ? $task->post_author : get_the_author_meta('ID');
	$author = get_user_by('id', $author_id);
	if( !$author )
		return '';

	$name = tst_get_member_name($author, $name_wrapper);
	$url = tst_get_member_url($author);
	
	return "<a href='{$url}'>{$name}</a>";
}

function tst_get_task_author_avatar($task = null){	
	
	$author_id = ($task) ? $task->post_author : get_the_author_meta('ID');
	return tst_temp_avatar($author_id, false);	
}

function tst_get_task_author_org($task = null){	
	
	$author_id = ($task) ? $task->post_author : get_the_author_meta('ID');
	$user_workplace = trim(sanitize_text_field(tst_get_member_field('user_workplace', $author_id)));
	
	return $user_workplace;
}


function tst_task_reward_in_card($task = null){
	
	$task_id = ($task) ? $task->ID : get_the_ID();
	$reward = get_term(get_field('reward', $task_id), 'reward');
	if(is_wp_error($reward))
		return;
	
?>
<span class="reward-icon glyphicon glyphicon-gift"></span>
<span class="reward-name" title="<?php _e('Reward', 'tst');?>">
<?php echo apply_filters('frl_the_title', $reward->name); ?>
</span>
</span>
<?php
}


function tst_tasks_filters_menu(){
	global $wp_query;
	
	$current = ($wp_query->get('task_status')) ? trim($wp_query->get('task_status')) : '';
?>
<ul class="tasks-filters">
	<li class="publish<?php if($current == 'publish') echo ' active';?>">
	<a href="<?php echo tst_tasks_filters_link('publish'); ?>" class="ga-event-trigger" <?php tst_ga_event_data('tl_tf_open');?>>
		<?php _e('New tasks:', 'tst')?> <?php echo tst_get_new_tasks_count();?>
	</a>
	</li>
	<li class="in_work<?php if($current == 'in_work') echo ' active';?>">
	<a href="<?php echo tst_tasks_filters_link('in_work'); ?>" class="ga-event-trigger" <?php tst_ga_event_data('tl_tf_work');?>>
		<?php _e('In work tasks:', 'tst')?> <?php echo tst_get_work_tasks_count();?>
	</a>
	</li>
	<li class="closed<?php if($current == 'closed') echo ' active';?>">
	<a href="<?php echo tst_tasks_filters_link('closed'); ?>" class="ga-event-trigger" <?php tst_ga_event_data('tl_tf_close');?>>
		<?php _e('Closed tasks:', 'tst')?> <?php echo tst_get_closed_tasks_count();?>
	</a>
	</li>
	<?php $archived = tst_get_archived_tasks_count(); if($archived > 0) { ?>
	<li class="archived<?php if($current == 'archived') echo ' active';?>">
	<a href="<?php echo tst_tasks_filters_link('archived'); ?>" class="ga-event-trigger" <?php tst_ga_event_data('tl_tf_archived');?>>
		<?php _e('Archived', 'tst')?>: <?php echo tst_get_archived_tasks_count();?>
	</a>
	</li>
	<?php } ?>
	<li class="tags<?php if(is_page('tags')) echo ' active';?>">
	
	<a href="<?php echo home_url('tags'); ?>" class="ga-event-trigger" <?php tst_ga_event_data('tl_tf_tags');?>>
		<?php _e('By tags', 'tst')?>
	</a>
	</li>
</ul>
<?php	
}

function tst_tasks_filters_link($status = 'publish') {
	
	$statuses = array('publish', 'in_work', 'closed', 'archived');
	if(!in_array($status, $statuses))
		$status = 'publish';
		
	$url = home_url("/tasks/$status/"); //alter for pretty permalink support
	
	return $url;
}


function tst_task_card_in_loop(){
	
?>	
<article id="post-<?php the_ID(); ?>" <?php post_class('col-md-6 item-masonry tpl-task'); ?>>
<div class="border-card">
	<div class="status-wrap">
		<?php
			$status_label = tst_get_task_status_label();
			if($status_label) {
		?>
		<span class="status-label" title="<?php echo esc_attr(tst_tast_status_tip());?>">&nbsp;</span>
		<?php } ?>
	</div>
	
	<header class="task-header">	
		<h4 class="task-title">				
			<a href="<?php the_permalink(); ?>" class="ga-event-trigger" <?php tst_ga_event_data('tc_title');?> rel="bookmark"><?php the_title(); ?></a>
		</h4>							
		<div class="task-meta"><?php echo tst_task_fixed_meta_in_card();?></div>
		<?php echo get_the_term_list(get_the_ID(), 'post_tag', '<div class="task-tags">', ', ', '</div>'); ?>		
	</header><!-- .entry-header -->

	<div class="task-summary">	
		<div class="task-reward"><?php tst_task_reward_in_card();?></div>
		<div class="task-more">
			<a href="<?php the_permalink(); ?>" class="more-link ga-event-trigger" <?php tst_ga_event_data('tc_more');?>  title="<?php _e('Details', 'tst');?>">...</a>
		</div>		
	</div>
	
</div>	<!-- .border-card -->		
</article><!-- #post-## -->
<?php	
}

function tst_task_related_card($task){
	
?>	
<div class="tpl-task related-task col-md-6">
<div class="border-card">
	<div class="status-wrap">
		<?php
			$status_label = tst_get_task_status_label($task->post_status);
			if($status_label) {
		?>
		<span class="status-label" title="<?php echo esc_attr(tst_tast_status_tip($task));?>">&nbsp;</span>
		<?php } ?>
	</div>
	
	<header class="task-header">	
		<h4 class="task-title">				
			<a href="<?php echo get_permalink($task); ?>" class="ga-event-trigger" <?php tst_ga_event_data('tc_title');?> rel="bookmark">
				<?php echo get_the_title($task->ID); ?>
			</a>
		</h4>							
		<div class="task-meta"><?php echo tst_task_fixed_meta_in_card($task);?></div>
		<?php echo get_the_term_list($task->ID, 'post_tag', '<div class="task-tags">', ', ', '</div>'); ?>		
	</header><!-- .entry-header -->

	<div class="task-summary">	
		<div class="task-reward"><?php tst_task_reward_in_card($task);?></div>
		<div class="task-more">
			<a href="<?php echo get_permalink($task); ?>" class="more-link ga-event-trigger" <?php tst_ga_event_data('tc_more');?>  title="<?php _e('Details', 'tst');?>">...</a>
		</div>		
	</div>
	
</div>	<!-- .border-card -->		
</div><!-- #post-## -->
<?php	
}




/** == Tasks counters == **/
/* count tasks by statuses */
function tst_get_new_tasks_count() {
	if(is_null(ItvSiteStats::$ITV_TASKS_COUNT_NEW)) {
		$args = array(
			'post_type' => 'tasks',
			'post_status' => 'publish',
			'query_id' => 'count_tasks_by_status',
			'nopaging' => 1,
			'exclude' => ACCOUNT_DELETED_ID,			
		);
		$wp_query = new WP_Query($args);
		ItvSiteStats::$ITV_TASKS_COUNT_NEW = $wp_query->found_posts;
	}
	return ItvSiteStats::$ITV_TASKS_COUNT_NEW;
}

function tst_get_all_tasks_count() {
	if(is_null(ItvSiteStats::$ITV_TASKS_COUNT_ALL)) {
		$args = array(
			'post_type' => 'tasks',
			'post_status' => array('publish', 'in_work', 'closed'),
			'query_id' => 'count_tasks_by_status',
			'nopaging' => 1,
			'exclude' => ACCOUNT_DELETED_ID,			
		);
		$wp_query = new WP_Query($args);
		ItvSiteStats::$ITV_TASKS_COUNT_ALL = $wp_query->found_posts;
	}
	return ItvSiteStats::$ITV_TASKS_COUNT_ALL;
}

function tst_get_work_tasks_count() {
	if(is_null(ItvSiteStats::$ITV_TASKS_COUNT_WORK)) {
		$args = array(
			'post_type' => 'tasks',
			'post_status' => 'in_work',
			'query_id' => 'count_tasks_by_status',
			'nopaging' => 1,
			'exclude' => ACCOUNT_DELETED_ID,
		);
		$wp_query = new WP_Query($args);
		ItvSiteStats::$ITV_TASKS_COUNT_WORK = $wp_query->found_posts;
	}
	return ItvSiteStats::$ITV_TASKS_COUNT_WORK;
}

function tst_get_closed_tasks_count() {
	if(is_null(ItvSiteStats::$ITV_TASKS_COUNT_CLOSED)) {
		$args = array(
			'post_type' => 'tasks',
			'post_status' => 'closed',
			'query_id' => 'count_tasks_by_status',
			'nopaging' => 1,
			'exclude' => ACCOUNT_DELETED_ID,
		);
		$wp_query = new WP_Query($args);
		ItvSiteStats::$ITV_TASKS_COUNT_CLOSED = $wp_query->found_posts;
	}
	return ItvSiteStats::$ITV_TASKS_COUNT_CLOSED;
}

function tst_get_archived_tasks_count() {
	if(is_null(ItvSiteStats::$ITV_TASKS_COUNT_ARCHIVED)) {
		$args = array(
			'post_type' => 'tasks',
			'post_status' => 'archived',
			'query_id' => 'count_tasks_by_status',
			'nopaging' => 1,
			'exclude' => ACCOUNT_DELETED_ID,
		);
		$wp_query = new WP_Query($args);
		ItvSiteStats::$ITV_TASKS_COUNT_ARCHIVED = $wp_query->found_posts;
	}
	return ItvSiteStats::$ITV_TASKS_COUNT_ARCHIVED;
}


/** == Single Task == **/
function tst_tasks_view_counter($task = null) {
	global $post;
	
	if(!$task)
		$task = $post;
	
	$views = pvc_get_post_views($task->ID); //temp usage og plugin function 
?>
	<span class="view-counter"><i class="glyphicon glyphicon-eye-open"></i> <?php echo (int)$views;?></span>
<?php
}

function tst_get_edit_task_url($task = null){
	global $post;
	
	if(!$task)
		$task = $post;
	
	return add_query_arg('task', intval($task->ID), home_url('/task-actions/'));
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