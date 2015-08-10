<?php
/**
 * Template Name: Member tasks
 *
 **/

global $tst_member;

$member_id = get_current_user_id();

if( !$member_id ) {
    $refer = stristr(wp_get_referer(), $_SERVER['REQUEST_URI']) !== false ? home_url() : wp_get_referer();
    $back_url = $refer ? $refer : home_url();

    wp_redirect($back_url);
    exit;
}

$member = get_user_by('id', $member_id);
if(empty($member) || !current_user_can('edit_user', $member_id)) {
    wp_redirect(home_url('member-actions'));
    exit;
}

$tst_member = $member;
$member_data = array(
    'member_id' =>  $member_id,
    'user_login' => $member->user_login,
    'user_email' => $member->user_email,
    'first_name' => $member->first_name,
    'last_name' => $member->last_name,
);

$tasks_created = tst_get_user_created_tasks($member->user_login, array('draft', 'publish', 'in_work', 'closed'));
$tasks_working_on = tst_get_user_working_tasks($member->user_login, array('draft', 'publish', 'in_work', 'closed'));
$tasks_closed = tst_get_user_closed_tasks($member->user_login);

get_header();?>

<article class="member-actions">
<?php //while ( have_posts() ) : the_post();?>


<header class="page-heading">

	<div class="row">
		<div class="col-md-8">
			<nav class="page-breadcrumbs"><?php echo frl_breadcrumbs();?></nav>
			<h1 class="page-title">
				<?php echo frl_page_title();?>
				<small class="edit-item"><a href="<?php echo tst_get_member_url($member);?>"><?php _e('Back to profile', 'tst');?></a></small>
			</h1>			
		</div>
		
		<div class="col-md-4">
            <div class="status-block-member">
                <?php tst_member_profile_infoblock($member->user_login);?>
            </div>
		</div>
	</div><!-- .row -->

</header>
	
<div class="page-body">
    <div class="in-single">
    <?php if(isset($_GET['t'])) {
        switch($_GET['t']) {
            case 1: echo '<div class="alert alert-success">'.__('Your task was successfully deleted.', 'tst').'</div>';
            default:
        }
    }?>
        <div id="task-tabs">
            <ul class="nav nav-tabs">
                <li class="active"><a href="#tasks-created" data-toggle="tab"><?php _e('Tasks created', 'tst');?></a></li>
				<li><a href="#tasks-closed" data-toggle="tab"><?php _e('Tasks closed', 'tst');?></a></li>
                <li><a href="#tasks-working-on" data-toggle="tab"><?php _e('Tasks you\'ve joined', 'tst');?></a></li>
            </ul>

            <div class="tab-content">

                <div class="tab-pane fade in active" id="tasks-created">
                    <?php if($tasks_created) { foreach($tasks_created as $task) {?>
                        <div class="task-row">
                            <h5><a href="<?php echo get_permalink($task->ID);?>"><?php echo $task->post_title;?></a></h5>
                            <div class="row">
								<div class="col-md-2 task-row-meta"><b><?php _e('Date:', 'tst');?></b> <?php echo date(get_option('date_format'), strtotime($task->post_date));?></div>
								<div class="col-md-2 task-row-meta"><b><?php _e('Deadline:', 'tst');?></b> <?php echo date_from_yymmdd_to_dd_mm_yy(get_field('field_533bef200fe90', $task->ID));?></div>
								<div class="col-md-2 task-row-meta"><?php echo tst_get_task_status_label($task->post_status);?></div>
								<div class="col-md-2 task-row-meta"><b><?php _e('Volunteers:', 'tst');?></b> <?php echo tst_get_task_doers_count($task->ID);?></div>
							
							<div class="col-md-4 task-row-action">
								<a href="<?php echo tst_get_edit_task_url($task);?>" class="btn btn-primary btn-xs"><?php _e('Edit', 'tst');?></a>
								<a href="<?php echo get_permalink($task);?>" class="btn btn-default btn-xs"><?php _e('View task', 'tst');?></a>
							</div>
							</div>
						</div>
                    <?php }
                    } else {?>
                    <div class="alert alert-warning"><?php _e('You still have to create some tasks.', 'tst');?></div>
                    <?php }?>
                </div>
				
				<div class="tab-pane fade" id="tasks-closed">
                    <?php if($tasks_closed) { foreach($tasks_closed as $task) {?>
                        <div class="task-row">
                            <h5>
                            <?php if($task->post_author != ACCOUNT_DELETED_ID) {?>
                                <a href="<?php echo get_permalink($task->ID);?>"><?php echo $task->post_title;?></a>
                            <?php } else {
                                echo $task->post_title;
                            }?>
                            </h5>
							<div class="row">
                            <div class="col-md-2 task-row-meta"><b><?php _e('Date:', 'tst');?></b> <?php echo date(get_option('date_format'), strtotime($task->post_date));?></div>
                            <div class="col-md-2 task-row-meta"><b><?php _e('Deadline:', 'tst');?></b> <?php echo date_from_yymmdd_to_dd_mm_yy(get_field('field_533bef200fe90', $task->ID));?></div>
							<div class="col-md-2 task-row-meta"><?php echo tst_get_task_status_label($task->post_status);?></div>
                            <div class="col-md-2 task-row-meta"><b><?php _e('Volunteers:', 'tst');?></b> <?php echo tst_get_task_doers_count($task->ID);?></div>							

                            <div class="col-md-4 task-row-action">
								<a href="<?php echo get_permalink($task);?>" class="btn btn-default btn-xs"><?php _e('View task', 'tst');?></a>
							</div>
							</div>
						</div>
                    <?php }
                    } else {?>
                        <div class="alert alert-warning"><?php _e('You don\'t have closed tasks.', 'tst');?></div>
                    <?php }?>
                </div>
				
                <div class="tab-pane fade" id="tasks-working-on">
                    <?php if($tasks_working_on) { foreach($tasks_working_on as $task) {?>
                        <div class="task-row">
                            <h5>
                            <?php if($task->post_author != ACCOUNT_DELETED_ID) {?>
                                <a href="<?php echo get_permalink($task->ID);?>"><?php echo $task->post_title;?></a>
                            <?php } else {
                                echo $task->post_title;
                            }?>
                            </h5>
							<div class="row">
                            <div class="col-md-2 task-row-meta"><b><?php _e('Date:', 'tst');?></b> <?php echo date(get_option('date_format'), strtotime($task->post_date));?></div>
                            <div class="col-md-2 task-row-meta"><b><?php _e('Deadline:', 'tst');?></b> <?php echo date_from_yymmdd_to_dd_mm_yy(get_field('field_533bef200fe90', $task->ID));?></div>
							<div class="col-md-2 task-row-meta"><?php echo tst_get_task_status_label($task->post_status);?></div>
                            <div class="col-md-2 task-row-meta"><b><?php _e('Volunteers:', 'tst');?></b> <?php echo tst_get_task_doers_count($task->ID);?></div>
							
							<div class="col-md-4 task-row-action">
								<a href="<?php echo get_permalink($task);?>" class="btn btn-default btn-xs"><?php _e('View task', 'tst');?></a>
							</div>
							</div>
						</div>
                    <?php }
                    } else {?>
                        <div class="alert alert-warning"><?php _e('You still have to join some tasks.', 'tst');?></div>
                    <?php }?>
                </div>				
				
            </div>
        </div>

    </div><!-- .row -->
</div> <!-- .page-body -->

<?php //endwhile; // end of the loop. ?>
</article>

<?php get_footer();?>