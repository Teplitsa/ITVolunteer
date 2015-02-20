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
	$expecting = get_field('field_533bebda0fe8d', $task_id);
	$about_reward = get_field('field_533bec930fe8e', $task_id);
	$about_author_org = get_field('field_533beee40fe8f', $task_id);
	
	$is_to_fix = false;
	if(preg_match('/&amp;lt;br \/&amp;gt;/', $expecting)) {
#		echo $expecting . "<br />-----------------<br />";
#		echo preg_replace('/&amp;lt;br \/&amp;gt;/', '', $expecting) . "<br />*******************************************<br /><br />";
		update_field('field_533bebda0fe8d', preg_replace('/&amp;lt;br \/&amp;gt;/', '', $expecting), $task_id);
		$is_to_fix = true;
	}
	
	if(preg_match('/&amp;lt;br \/&amp;gt;/', $about_reward)) {
#		echo $about_reward . "<br />-----------------<br />";
#		echo preg_replace('/&amp;lt;br \/&amp;gt;/', '', $about_reward) . "<br />*******************************************<br /><br />";
		update_field('field_533bec930fe8e', preg_replace('/&amp;lt;br \/&amp;gt;/', '', $about_reward), $task_id);
		$is_to_fix = true;
	}
	
	if(preg_match('/&amp;lt;br \/&amp;gt;/', $about_author_org)) {
#		echo $about_author_org . "<br />-----------------<br />";
#		echo preg_replace('/&amp;lt;br \/&amp;gt;/', '', $about_author_org) . "<br />*******************************************<br /><br />";
		update_field('field_533beee40fe8f', preg_replace('/&amp;lt;br \/&amp;gt;/', '', $about_author_org), $task_id);
		$is_to_fix = true;
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
