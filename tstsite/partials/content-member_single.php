<?php
/**
 * Single member profile
 **/
 
global $post, $wp_query;

$tst_member = tst_get_current_member();
if(isset($_GET['update']) && $_GET['update']) {	
	tst_update_member_stat($tst_member->ID);
}


$user_login = $tst_member->user_login;
$activity = tst_get_member_activity($tst_member->user_object);

?>
<header class="page-heading member-header">
	
	<div class="row">
		<div class="col-md-8">
		<nav class="page-breadcrumbs"><?php echo frl_breadcrumbs();?></nav>
			<h1 class="page-title member-title"><?php echo frl_page_title();?>
					
			<?php if(current_user_can('edit_user', $tst_member->ID)): ?>
				<a href="<?php echo tst_get_edit_member_url();?>" class="edit-item"><?php _e('Edit', 'tst');?></a>
			<?php endif; ?>
			</h1>
			
			<div class="subtitle"><?php echo sanitize_text_field(tst_get_member_field('user_speciality', $tst_member->user_object));?></div>
			
		</div>

		<div class="col-md-4">
			
			<div class="status-block-member">
				<?php tst_member_profile_infoblock($tst_member->ID);?>
			</div>
			
		</div>
	</div>
</header>

<div class="page-body">
<div class="row in-single">
		<div class="col-md-8">
			<div class="row">
				<div class="col-md-3">					
					<?php tst_temp_avatar();?>
					
				</div>
				<div class="col-md-9">
					
					<?php if($is_user_test_employee = get_user_meta($tst_member->ID, 'user_test_employee', true)):?>
					<section class="data-section-member">
						<h4><?php _e('Te-st employee', 'tst');?></h4>
						<img class="itv-test-employee-big" src="<?php echo get_template_directory_uri().'/assets/img/te-st-logo.jpg'; ?>" />
					</section>
					<?php endif?>
					
					<?php if($is_user_test_partner = get_user_meta($tst_member->ID, 'user_test_partner', true)):?>
					<section class="data-section-member">
						<h4><?php _e('Te-st partner', 'tst');?></h4>
						<img class="itv-test-partner-big" src="<?php echo get_template_directory_uri().'/assets/img/logo-v.png'; ?>" />
					</section>
					<?php endif?>
					
					<?php if($user_bio = trim(tst_get_member_field('user_bio'))):?>
					<section class="data-section-member">
						<h4><?php _e('About me', 'tst');?></h4>
						<?php
							$text = apply_filters('frl_the_content', $user_bio);
							echo $text ? $text : '<div class="">'.__('No data.', 'tst').'</div>';
						?>
					</section>
					<?php endif?>


					<?php if($text = tst_get_member_field('user_workplace')):?>
					<section class="data-section-member">
						<h4><?php _e('Place of work', 'tst');?></h4>
						<?php echo $text?>
					</section>
					<?php endif?>

					
					<?php if($user_company_logo = tst_get_member_user_company_logo($tst_member->ID)):?>
					<section class="data-section-member">
						<?php echo $user_company_logo?>
					</section>
					<?php endif?>


					<?php if($user_skills_string = tst_get_member_user_skills_string($tst_member->ID)):?>
					<section class="data-section-member">
						<h4><?php _e('Skills list', 'tst');?></h4>
						<?php echo $user_skills_string?>
					</section>
					<?php endif?>

					
					<?php if($text = tst_get_member_field('user_socials')):?>
					<section class="data-section-member">
						<h4><?php _e('In the web', 'tst');?></h4>
						<?php echo $text?>
					</section>
					<?php endif?>

					<?php if(is_user_logged_in()):?>
					<section class="data-section-member">
						<h4><?php _e('Contact details', 'tst');?></h4>
						<dl class="member-data-list">
							<dt>Email: </dt>
							<dd><?php echo sanitize_text_field(tst_get_member_field('user_email'));?></dd>
							
							<?php $user_skype = tst_get_member_field('user_skype'); ?>
							<?php if($user_skype): ?>
							<dt>Skype: </dt>
							<dd><?php echo sanitize_text_field($user_skype);?></dd>
							<?php endif?>
							
							<?php $user_contacts = tst_get_member_field('user_contacts'); ?>
							<?php if($user_contacts): ?>
							<dt><?php _e('Additional', 'tst');?>: </dt>
							<dd><?php echo apply_filters('frl_the_content', $user_contacts);?></dd>
							<?php endif?>
							
						</dl>
						
					</section>
					<?php endif;?>
									
					<?php
						$solved_tasks = tst_calculate_member_tasks_solved($tst_member, 20, false);
						if($solved_tasks->have_posts()) {
					?>
					<section class="data-section-member">
						<h4><?php _e('Closed tasks', 'tst');?></h4>
						<ul class="member-tasks-list">
						<?php foreach($solved_tasks->posts as $task) {?>
                        <li>
                            <div class="mt-title">
                            <?php if($task->post_author != ACCOUNT_DELETED_ID) {?>
                                <a href="<?php echo get_permalink($task->ID);?>"><?php echo $task->post_title;?></a>
                            <?php } else {
                                echo $task->post_title;
                            }?>

                            </div>
                            <div class="mt-meta"><time><?php echo date('d.m.Y', strtotime($task->post_modified) );?></time></div>                            
                        </li>
                    <?php } //endforeach ?>
						</ul>
					</section>
					<?php } ?>
				</div><!-- .col-md-9 -->
			</div>
			
			<?php
				$latest_doer_reviews = ItvReviews::instance()->get_doer_reviews_short_list($tst_member->ID); 
			?>
			<?php if(count($latest_doer_reviews) > 0):?>
			<div class="row">
		        <div id="task-tabs" class="itv-reviews-tabs">
		            <ul class="nav nav-tabs">
		                <li class="active"><a href="#doer-reviews-list" data-toggle="tab"><?php _e('Doer reviews', 'tst');?></a></li>
		            </ul>
		            <div class="tab-content">
		                <div class="tab-pane fade in active itv-user-reviews-list" id="doer-reviews-list">
		                <?php foreach($latest_doer_reviews as $review):?>
		                	<?php 
		                		$review_author = get_user_by('id', $review->author_id);
		                		$review_author_url = $review_author ? trailingslashit(site_url('/members/'.$review_author->user_login)) : '';
		                	?>
		                	<div class="itv-user-review-item clearfix">
		                		<div class="itv-user-review-message">
		                		<?php echo apply_filters('frl_the_content', stripslashes($review->message))?>
		                		</div>
		                		<?php if($review_author):?>
		                		<div class="itv-user-review-author pull-right">
		                			<a href="<?php echo $review_author_url;?>"><?php echo $review_author->first_name.' '.$review_author->last_name;?></a>
		                			<br />
		                			<small><i><?php echo date("d.m.Y", strtotime($review->time_add)); ?></i></small>
		                		</div>
		                		<?php endif?>
		                	</div>
		                	
		                <?php endforeach;?>
						<a href="<?php echo home_url("doer-reviews/?membername=" . $tst_member->user_login);?>" class="btn btn-primary btn-xs"><?php _e('All doer reviews', 'tst');?> &raquo;</a>
		                </div>
					</div>
				</div>			
			</div>
			<?php endif?>
		</div>
		
		<div class="col-md-4">
			<div class="panel panel-default member-activity">
				<div class="panel-body">
					<table class="table table-condensed">
						<tbody>
							<tr>
								<th><?php _e('Rating', 'tst');?></th>
								<td class="num"><span class="user-rating"><?php echo (int)$activity['solved'];?></span></td>
							</tr>
							<tr>
								<th><?php _e('Tasks joined', 'tst');?></th>
								<td class="num"><?php echo (int)$activity['joined'].' / <span title="'.__('Closed from them', 'tst').'">'.(int)$activity['solved'].'</span>';?></td>
							</tr>
							<tr>
								<th><?php _e('Tasks created', 'tst');?></th>
								<td class="num"><?php echo (int)$activity['created'].' / <span title="'.__('Closed from them', 'tst').'">'.(int)$activity['created_closed'].'</span>';?></td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			
			<div class="member-tasks">
				<ul class="nav nav-tabs grey-tabs">
					<li class="active"><a href="#joined" data-toggle="tab"><?php _e('Tasks in progress', 'tst');?></a></li>
					<li><a href="#created" data-toggle="tab"><?php _e('Created tasks', 'tst');?></a></li>					
				</ul>
				
				<div class="tab-content">
					<div class="tab-pane active" id="joined"><ul class="member-tasks-list">
					<?php
						$task_working = tst_calculate_member_tasks_joined($tst_member, array('publish', 'in_work'), 5, false);
						if(!$task_working->have_posts()) {
					?>
						<div class="well well-sm"><?php _e('No tasks in progress', 'tst');?></div>
					<?php
						} else {

                        foreach($task_working->posts as $task) {?>
                        <li>
                            <div class="mt-title">
                            <?php if($task->post_author != ACCOUNT_DELETED_ID) {?>
                                <a href="<?php echo get_permalink($task->ID);?>"><?php echo $task->post_title;?></a>
                            <?php } else {
                                echo $task->post_title;
                            }?>

                            </div>
                            <div class="mt-meta"><?php echo tst_task_fixed_meta_in_card($task);?></div>                            
                            
                        </li>
                    <?php } //endforeach
				        }
                    ?></ul>
                    <?php if(wp_get_current_user()->user_login == $user_login && $task_working->have_posts()) {?>
                        <hr />
                        <a href="<?php echo home_url("member-actions/member-tasks/");?>" class="btn btn-primary btn-xs">
						<?php _e('All tasks', 'tst');?> &raquo;</a>
                    <?php }?>
                    </div>
					
					<div class="tab-pane" id="created"><ul class="member-tasks-list">
					<?php
						$tasks_created = tst_query_member_tasks_created($tst_member, array('publish', 'in_work', 'closed'), 5, false);
						if(!$tasks_created->have_posts()) {
					?>
						<div class="well well-sm"><?php _e('No tasks created', 'tst');?></div>
					<?php
						}
						else {
						foreach($tasks_created->posts as $task) {?>
							<li>
								<div class="mt-title">
									<a href="<?php echo get_permalink($task->ID);?>"><?php echo $task->post_title;?></a>
								</div>							
								<div class="mt-meta">
									<span class="reward-icon glyphicon glyphicon-gift"></span> <?php echo tst_get_task_meta($task, 'reward');?>
								</div>
							</li>
                    <?php } //endforeach
					
						}
                    ?></ul>
                        <?php if(wp_get_current_user()->user_login == $user_login && $tasks_created->have_posts()) {?>
                            <hr />
                            <a href="<?php echo home_url("member-actions/member-tasks/");?>" class="btn btn-primary btn-xs">
							<?php _e('All tasks', 'tst');?> &raquo;</a>
                        <?php }?>
                    </div>
				</div>
			</div><!-- .member-tasks -->
		</div>
	</div><!-- .row -->
	
	<footer class="inpage-footer">
		<div class="row">
			<div class="col-md-8">
				<nav role="navigation" class="nextprev nav-post">
				<?php
					$role = tst_get_member_role_key($tst_member);					
					$back = ($role != 'user') ? home_url('members/'.$role) : home_url('members');					
				?>
				<a href="<?php echo $back;?>">&laquo; <?php _e('Back to members list', 'tst');?></a>				
				</nav>
			</div>
			<div class="col-md-4">&nbsp;</div>
		</div>		
	</footer>	
	
	
	
	
</div>
