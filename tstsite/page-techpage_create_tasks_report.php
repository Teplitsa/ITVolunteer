<br />
***********************************
<br /><br />

<?php

$offset = @$_GET['offset'] ? @$_GET['offset'] : 0;

$query_params = array(
	'post_type' => 'tasks',
	'posts_per_page' => 200,
	'offset' => $offset,
	'orderby' => 'ID',
	'order'   => 'ASC'		
);

$task_id = @$_GET['task_id'];

if($task_id) {
	$query_params['post__in'] = explode(',', $task_id);
}

global $wpdb;
$query = new WP_Query($query_params);

#$wpdb->query("TRUNCATE str_tasks_report");
$itv_log = ItvLog::instance();

while($query->have_posts()) {
	$query->the_post();
	
	$post_id = get_the_ID();
	
	echo $post_id . ' --- ' . get_the_title($post_id) . "<br />";
	
	$task = get_post($post_id);
	
	$task_author = null;
	if($task) {
		$task_author = get_user_by('id', $task->post_author);
	}
	
	$is_need_consult = get_field(ITV_ACF_TASK_is_tst_consult_needed, $post_id);
	
	$inwork_time = $itv_log->get_task_inwork_time($post_id);
	if(!$inwork_time && $task->post_status == 'in_work') {
		$inwork_time = $task->post_modified;
	}
	
	$close_time = $itv_log->get_task_close_time($post_id);
	if(!$close_time && $task->post_status == 'closed') {
		$close_time = $task->post_modified;
	}
	
	$doer = null;
	if($task) {
		$users = get_users( array(
				'connected_type' => 'task-doers',
				'connected_items' => $task
		));
	
		foreach($users as $user) {
			if(tst_is_user_candidate($user->ID, $task->ID) == 2) {
				$doer = $user;
			}
		}
	}
	
	$views = 0;
	if(function_exists('pvc_get_post_views')) {
		$views = pvc_get_post_views($post_id);
	}
	
	$wpdb->query(
			$wpdb->prepare(
					"
					INSERT INTO str_tasks_report
					SET
					ID = %d,
					post_author = %d,
					post_date = %s,
					post_title = %s,
					post_status = %s,
					post_modified = %s,
					guid = %s,
					comment_count = %d,
					is_need_consult = %d,
					owner_name = %s,
					inwork_time = %s,
					close_time = %s,
					doer_name = %s,
					views = %s
					",
					$post_id,
					$task_author ? $task_author->ID : 0,
					get_the_date('Y-m-d H:i:s', $post_id),
					get_the_title($post_id),
					get_post_status($post_id),
					$task ? $task->post_modified : '0000-00-00 00:00:00',
					$task ? $task->guid : '',
					$task ? $task->comment_count : 0,
					$is_need_consult,
					$task_author ? $task_author->user_login : '',
					$inwork_time,
					$close_time,
					$doer ? $doer->user_login : '',
					$views
			)
	);
	#echo $wpdb->last_query . "<br />";
	echo $wpdb->last_error . "<br />";
	
	#echo 'candidates_number=' . get_post_meta(get_the_ID(), 'candidates_number', true) . "<br />";
	#echo 'status_order=' . get_post_meta(get_the_ID(), 'status_order', true) . "<br />";
}

?>
<br />
***********************************
<br /><br /><br /><br /><br /><br />
