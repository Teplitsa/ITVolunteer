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

function tst_tast_status_tip(){
	global $post;

    if( !$post || $post->post_type != 'tasks')
        return '';
	
	$label = array();
    $status = $post->post_status;
	$status_list = tst_get_task_status_list();
	
    $label[] = isset($status_list[$status]) ? $status_list[$status] : '';
	
	if($status != 'closed' && function_exists('get_field')){
		$deadline = date_from_yymmdd_to_dd_mm_yy(get_field('deadline', get_the_ID()));
		$deadline = date('d.m.Y', strtotime($deadline));
		$label[] = sprintf(__('deadline: %s', 'tst'), $deadline);
	}

	return implode(', ', $label);
}

function tst_task_fixed_meta_in_card($task = null){
	global $post;
	
	if( !$task )
		$task = $post;
    
    $user_workplace = trim(sanitize_text_field(tst_get_member_field('user_workplace', $author)));
   
	$meta = array();
	$meta[] = tst_get_task_author_link($task);
	
	if(!empty($user_workplace)) {
		$meta[] = "<span class='workplace'>{$user_workplace}</span>";
	}
	
	$meta[] = "<time>".get_the_date('', $task)."</time>";
	
	return implode(', ', $meta);
}


function tst_get_task_author_link($task = null){
	global $post;
	
	if(!$task)
		$task = $post;
		
	$author = get_user_by('id', $task->post_author);
	if( !$author )
		return '';

	$name = tst_get_member_name($author);
	$url = tst_get_member_url($author);
	
	return "<a href='{$url}'>{$name}</a>";
}


function tst_task_reward_in_card(){	
	$reward = get_term(get_field('reward', get_the_ID()), 'reward');
	if(is_wp_error($reward))
		return;
	
?>
<span class="reward-icon glyphicon glyphicon-star"></span>
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
</ul>
<?php	
}

function tst_tasks_filters_link($status = 'publish') {
	
	$statuses = array('publish', 'in_work', 'closed');
	if(!in_array($status, $statuses))
		$status = 'publish';
		
	$url = home_url("/tasks/$status/"); //alter for pretty permalink support
	
	return $url;
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
