<?php
/**
 * Utility functions
 **/

/* OLD filteting for query
 * @to_do: move from  pre_get_posts into parse_query with custom qv */
add_action('pre_get_posts', 'tst_main_query_mods');
function tst_main_query_mods(WP_Query $query) {

    // exclude account_deleted's tasks:
    if( !is_admin() && $query->is_main_query() ) {
        
        $query->set('author', '-'.ACCOUNT_DELETED_ID);
    }

    if(isset($query->query_vars['query_id']) && $query->query_vars['query_id'] == 'count_tasks_by_status') {
        $query->set('author', '-'.ACCOUNT_DELETED_ID);
    }
    elseif(($query->is_main_query() && $query->is_archive())
       || ($query->get('post_type') == 'tasks')
    ) {
    	$query->set('query_id', 'get_tasks');
    	
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
        
    if(isset($_GET['ord_cand']) && $_GET['ord_cand'] && isset($query->query_vars['query_id']) && $query->query_vars['query_id'] == 'get_tasks') {
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




/** == OLD == **/
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
	$task_status_order = array('publish', 'in_work', 'closed', 'future', 'draft', 'pending', 'private', 'trash', 'auto-draft', 'inherit');
	$order = 100;
	if($task) {
		$order = array_search($task->post_status, $task_status_order);
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



function tst_task_fixed_meta($task = null){
	global $post;
	
	if( !$task )
		$task = $post;

        $author = get_user_by('id', $task->post_author);
        $user_workplace = trim(sanitize_text_field(tst_get_member_field('user_workplace', $author)));
?>
    <span class="status-meta">
		<span class="created-by-label"><?php _e('Created by', 'tst');?>:</span> <?php echo tst_get_task_author_link($task);?>,
		<?php if($user_workplace):?><?php echo $user_workplace; ?>, <?php endif; ?>
	</span>	
	<span class="time-label"></span>
	<time><?php echo get_the_date('', $task);?></time>
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

/** Role calculations === old **/
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

function set_user_order_data($user_id, $order_data) {	
	update_user_meta($user_id, 'member_order_data', $order_data);
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
    

    return $user ? count(tst_get_user_closed_tasks($user)) : 0;
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
	<span class="reward task-param btn btn-default" <?php if(!is_wp_error($reward)):?>title="<?php echo $reward->name; ?>"<?php endif; ?>>
		<span class="reward-icon glyphicon glyphicon-thumbs-up"></span>
		<span class="reward-name">
		<?php echo is_wp_error($reward) ? __('No reward setted yet', 'tst') : $reward->name; ?>
		</span>
	</span>
</div>
<?php 
}


function tst_login_avatar(){
?>
	<img src="<?php echo get_template_directory_uri();?>/assets/img/temp-avatar.png" alt="<?php _e('LogIn', 'tst');?>">
<?php
}

function tst_task_modified_date($task) {
	if((int)$task == $task) {
		$task = get_post($task);
	}
	
	$ret = '';
	if($task) {
		$ret = date( get_option( 'date_format' ), strtotime($task->post_modified) );
	}
	return $ret;
}