<br />
***********************************
<br /><br />

<?php 

$posts = get_posts(array(
	'numberposts'     => 0,
	'posts_per_page'   => 1000,
	'offset'          => 0,
	'orderby'         => 'post_date',
	'order'           => 'DESC',
	'post_type'       => 'tasks',
	'post_status'     => 'any',	
));
 
$to_fix_count = 0;
foreach($posts as $post) {
	setup_postdata($post);
	$task_id = get_the_ID();
	
	echo $task_id . "<br />";
	$deadline = get_field('field_533bef200fe90', $task_id);
	
	$is_to_fix = false;
	if(preg_match('/^\d{2}\.\d{2}\.\d{4}$/', $deadline)) {
		$is_to_fix = true;
	}
	
	$update = isset($_GET['update']) ? $_GET['update'] : '';
	if($is_to_fix && $update == 'ok') {
		update_field('field_533bef200fe90', date_from_dd_mm_yy_to_yymmdd($deadline), $task_id);
	}
	
	if($is_to_fix) {
		$to_fix_count++;
	}
	
}

echo "to_fix_count=" . $to_fix_count . "<br />";

?>
<br />
***********************************
<br /><br /><br /><br /><br /><br />
