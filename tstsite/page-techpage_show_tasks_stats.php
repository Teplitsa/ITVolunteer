
<br />
***********************************
<br /><br />

<?php

$query_params = array(
	'post_type' => 'tasks',
	'nopaging' => true,
);

$task_id = isset($_GET['task_id']) ? $_GET['task_id'] : 0;

if($task_id) {
	$query_params['post__in'] = explode(',', $task_id);
}

$query = new WP_Query($query_params);

while($query->have_posts()) {
	$query->the_post();
	
	echo "==========" . get_the_ID() . ' --- ' . get_the_title() . "<br />";
 	echo 'candidates_number=' . get_post_meta(get_the_ID(), 'candidates_number', true) . "<br />";
 	echo 'status_order=' . get_post_meta(get_the_ID(), 'status_order', true) . "<br />";
}

?>
<br />
***********************************
<br /><br /><br /><br /><br /><br />
