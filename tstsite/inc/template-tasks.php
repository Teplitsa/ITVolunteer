<?php
/**
 * Template tags for tasks templates
 * moved here after adoption in redesign
 **/

/** == Tasks in loop ==**/
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
	$reward = get_term(get_field('field_533bef600fe91', get_the_ID()), 'reward'); //
?>
	<span class="reward-label" <?if(!is_wp_error($reward)):?>title="Награда"<?endif?>>
		<span class="reward-icon glyphicon glyphicon-star"></span>
		<span class="reward-name"><?php
			echo is_wp_error($reward) ? __('No reward setted yet', 'tst') : $reward->name;
		?>
		</span>
	</span>
<?php
}


function tst_tasks_filters_menu(){
	
	$current = '';
	if(isset($_GET['st']) & !empty($_GET['st'])){
		$current = trim($_GET['st']);
	}
?>
<ul class="tasks-filters">
	<li class="publish<?php if($current == 'publish') echo ' active';?>"><a href="<?php echo home_url('/tasks/?st=publish')?>">
		<?php _e('New tasks:', 'tst')?> <?php echo tst_get_new_tasks_count();?>
	</a></li>
	<li class="in_work<?php if($current == 'in_work') echo ' active';?>"><a href="<?php echo home_url('/tasks/?st=in_work')?>">
		<?php _e('In work tasks:', 'tst')?> <?php echo tst_get_work_tasks_count();?>
	</a></li>
	<li class="closed<?php if($current == 'closed') echo ' active';?>"><a href="<?php echo home_url('/tasks/?st=closed')?>">
		<?php _e('Closed tasks:', 'tst')?> <?php echo tst_get_closed_tasks_count();?>
	</a></li>
</ul>
<?php	
}



/** == Tasks counters == **/
/* count tasks by statuses */
global $ITV_TASKS_COUNT_ALL, $ITV_TASKS_COUNT_WORK, $ITV_TASKS_COUNT_CLOSED, $ITV_TASKS_COUNT_NEW;
$ITV_TASKS_COUNT_ALL = null;
$ITV_TASKS_COUNT_WORK = null;
$ITV_TASKS_COUNT_CLOSED = null;

function tst_get_new_tasks_count() {
	global $ITV_TASKS_COUNT_NEW;	
	if(is_null($ITV_TASKS_COUNT_NEW)) {
		$args = array(
			'post_type' => 'tasks',
			'post_status' => 'publish',
			'query_id' => 'count_tasks_by_status',
			'nopaging' => 1,
			'exclude' => ACCOUNT_DELETED_ID,			
		);
		$wp_query = new WP_Query($args);
		$ITV_TASKS_COUNT_NEW = $wp_query->found_posts;
	}
	return $ITV_TASKS_COUNT_NEW;
}

function tst_get_all_tasks_count() {
	global $ITV_TASKS_COUNT_ALL;	
	if(is_null($ITV_TASKS_COUNT_ALL)) {
		$args = array(
			'post_type' => 'tasks',
			'post_status' => array('publish', 'in_work', 'closed'),
			'query_id' => 'count_tasks_by_status',
			'nopaging' => 1,
			'exclude' => ACCOUNT_DELETED_ID,			
		);
		$wp_query = new WP_Query($args);
		$ITV_TASKS_COUNT_ALL = $wp_query->found_posts;
	}
	return $ITV_TASKS_COUNT_ALL;
}

function tst_get_work_tasks_count() {
	global $ITV_TASKS_COUNT_WORK;	
	if(is_null($ITV_TASKS_COUNT_WORK)) {
		$args = array(
			'post_type' => 'tasks',
			'post_status' => 'in_work',
			'query_id' => 'count_tasks_by_status',
			'nopaging' => 1,
			'exclude' => ACCOUNT_DELETED_ID,
		);
		$wp_query = new WP_Query($args);
		$ITV_TASKS_COUNT_WORK = $wp_query->found_posts;
	}
	return $ITV_TASKS_COUNT_WORK;
}

function tst_get_closed_tasks_count() {
	global $ITV_TASKS_COUNT_CLOSED;	
	if(is_null($ITV_TASKS_COUNT_CLOSED)) {
		$args = array(
			'post_type' => 'tasks',
			'post_status' => 'closed',
			'query_id' => 'count_tasks_by_status',
			'nopaging' => 1,
			'exclude' => ACCOUNT_DELETED_ID,
		);
		$wp_query = new WP_Query($args);
		$ITV_TASKS_COUNT_CLOSED = $wp_query->found_posts;
	}
	return $ITV_TASKS_COUNT_CLOSED;
}