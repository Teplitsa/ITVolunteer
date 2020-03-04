<?php
/**
 * Template for single task 
 **/

get_header();

$task_id = get_the_ID();
?>
<script>
	var ITV_CURRENT_TASK_ID = parseInt('<?php echo $task_id;?>');
</script>
<?php get_footer();
