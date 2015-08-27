<br />
***********************************
<br /><br />

<?php

$offset = isset($_GET['offset']) ? $_GET['offset'] : 0;

$query_params = array(
	'post_type' => 'tasks',
	'posts_per_page' => 200,
	'offset' => $offset,
	'orderby' => 'ID',
	'order'   => 'ASC'		
);

$task_id = isset($_GET['task_id']) ? $_GET['task_id'] : 0;

if($task_id) {
	$query_params['post__in'] = explode(',', $task_id);
}

global $wpdb;
$query = new WP_Query($query_params);

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
	
	$is_need_consult = get_field('is_tst_consult_needed', $post_id);
	
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
		$candidates = tst_get_task_doers($task->ID, false);
		foreach($candidates as $candidate) {
			if(p2p_get_meta($candidate->p2p_id, 'is_approved', true)) {
				$doer = $candidate;
				break;
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
	echo $wpdb->last_error . "<br />";
	
}

?>
<br />
***********************************
<br /><br /><br /><br /><br /><br />
