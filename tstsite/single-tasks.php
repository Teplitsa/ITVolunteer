<?php
/**
 * Template for single task 
 **/

get_header();

while ( have_posts() ) the_post();

$task = get_post();
$task_id = get_the_ID();
$task_slug = $task->post_name;
$author_id = get_the_author_meta('ID');

?>
<script>
	var ITV_CURRENT_TASK_GQLID = '<?php echo $task_post_id = \GraphQLRelay\Relay::toGlobalId( 'tasks', $task_id );?>';
	var ITV_CURRENT_TASK_SLUG = '<?php echo $task_slug;?>';
	var ITV_CURRENT_TASK_AUTHOR_GQLID = '<?php echo $task_post_id = \GraphQLRelay\Relay::toGlobalId( 'tasks', $author_id );?>';
</script>
<?php get_footer();
