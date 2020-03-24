<?php
/**
 * Template for single task 
 **/

get_header();

while ( have_posts() ) the_post();

$task_id = get_the_ID();
$author_id = get_the_author_meta('ID');

?>
<script>
	var ITV_CURRENT_TASK_GQLID = '<?php echo $task_post_id = \GraphQLRelay\Relay::toGlobalId( 'tasks', $task_id );?>';
	var ITV_CURRENT_TASK_AUTHOR_GQLID = '<?php echo $task_post_id = \GraphQLRelay\Relay::toGlobalId( 'tasks', $author_id );?>';
</script>
<?php get_footer();
