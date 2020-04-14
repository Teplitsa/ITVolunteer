<?php

$task_id = get_the_ID();
$task = get_post($task_id);
$task_slug = $task->post_name;
$author_id = get_the_author_meta('ID');

$basic_stats = [
    'activeMemebersCount' => tst_get_active_members_count(),
    'closedTasksCount' => tst_get_closed_tasks_count(),
    'workTasksCount' => tst_get_work_tasks_count(),
    'newTasksCount' => tst_get_new_tasks_count(),
];
?>
<script>
	var ITV_CURRENT_TASK_GQLID = '<?php echo $task_post_id = \GraphQLRelay\Relay::toGlobalId( 'tasks', $task_id );?>';
	var ITV_CURRENT_TASK_SLUG = '<?php echo $task_slug;?>';
	var ITV_CURRENT_TASK_AUTHOR_GQLID = '<?php echo $task_post_id = \GraphQLRelay\Relay::toGlobalId( 'tasks', $author_id );?>';
	var ITV_BASIC_STATS = <?php  echo json_encode($basic_stats);?>
</script>
