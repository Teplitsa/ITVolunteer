<?php
/**
 * Template Name: MembersPage
 **/

global $post, $tst_member, $wp_query;

$user_login = get_query_var('membername');

if(is_single_member()) {
	$tst_member = get_user_by('slug', $user_login);
    if( !$tst_member ) {
        $refer = stristr(wp_get_referer(), $_SERVER['REQUEST_URI']) !== false ? home_url() : wp_get_referer();
        $back_url = $refer ? $refer : home_url();

        wp_redirect($back_url);
        die();
    }

    $tasks_created = tst_get_user_created_tasks($user_login);
    $tasks_created_closed = count(tst_get_user_created_tasks($user_login, 'closed'));
    $tasks_working_on = tst_get_user_working_tasks($user_login);
    $user_rating = tst_get_user_rating($user_login);
}

get_header();?>


<header class="page-heading members-list-header no-breadcrumbs">

	<div class="row">
		<div class="col-md-8">
			<!--<nav class="page-breadcrumbs"><?php echo frl_breadcrumbs();?></nav>-->
			<h1 class="page-title <?php if(is_single_member()) echo 'member-title';?>">
			<?php echo frl_page_title();?>
			<?php if(!is_single_member()):?>
			<span class="itv-total-members-heading">( <?php echo tst_get_active_members_count() ?> )</span>
			<?endif?>			
			<?php if(is_single_member() && current_user_can('edit_user', $tst_member->ID)): ?>
				<small class="edit-item"> <a href="<?php echo tst_get_edit_member_url();?>"><?php _e('Edit', 'tst');?></a></small>
			<?php endif; ?>
			</h1>
			<?php if(is_single_member()):?>
				<div class="subtitle"><?php echo sanitize_text_field(tst_get_member_field('user_speciality', $tst_member));?></div>
			<?php endif;?>
		</div>

		<div class="col-md-4">
			<?php if(is_single_member()) { //single case ?>
			<div class="status-block-member">
				<?php tst_member_profile_infoblock($user_login);?>
			</div>
			<?php } else { // list case ?>
				&nbsp; <!-- TODO: Блок фильтров списка -->
			<?php }?>
		</div>
	</div><!-- .row -->

</header>

<div class="page-body">

	<?php if(is_single_member()) {?>
	<div class="row in-single">
		<div class="col-md-8">
			<div class="row">
				<div class="col-md-3">
					<span class="thumbnail">
						<?php tst_temp_avatar();?>
					</span>
				</div>
				<div class="col-md-9">
					
					<?if($is_user_test_employee = get_user_meta($tst_member->ID, 'user_test_employee', true)):?>
					<section class="data-section-member">
						<h4><?php _e('Te-st employee', 'tst');?></h4>
						<img class="itv-test-employee-big" src="<?=content_url('themes/tstsite/img/te-st-logo.jpg')?>" />
					</section>
					<?endif?>
					
					<?if($is_user_test_partner = get_user_meta($tst_member->ID, 'user_test_partner', true)):?>
					<section class="data-section-member">
						<h4><?php _e('Te-st partner', 'tst');?></h4>
						<img class="itv-test-partner-big" src="<?=content_url('themes/tstsite/img/logo-v.png')?>" />
					</section>
					<?endif?>
					
					<?if($user_bio = trim(tst_get_member_field('user_bio'))):?>
					<section class="data-section-member">
						<h4><?php _e('About me', 'tst');?></h4>
						<?php
							$text = apply_filters('frl_the_content', $user_bio);
							echo $text ? $text : '<div class="">'.__('No data.', 'tst').'</div>';
						?>
					</section>
					<?endif?>


					<?if($text = tst_get_member_field('user_workplace')):?>
					<section class="data-section-member">
						<h4><?php _e('Place of work', 'tst');?></h4>
						<?=$text?>
					</section>
					<?endif?>

					
					<?if($user_company_logo = tst_get_member_user_company_logo($tst_member->ID)):?>
					<section class="data-section-member">
						<?=$user_company_logo?>
					</section>
					<?endif?>


					<?if($user_skills_string = tst_get_member_user_skills_string($tst_member->ID)):?>
					<section class="data-section-member">
						<h4><?php _e('Skills list', 'tst');?></h4>
						<?=$user_skills_string?>
					</section>
					<?endif?>

					
					<?if($text = tst_get_member_field('user_socials')):?>
					<section class="data-section-member">
						<h4><?php _e('In the web', 'tst');?></h4>
						<?=$text?>
					</section>
					<?endif?>

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
								<td class="num"><span class="user-rating"><?php echo $user_rating;?></span></td>
							</tr>
							<tr>
								<th><?php _e('Tasks joined', 'tst');?></th>
								<td class="num"><?php echo count($tasks_working_on).' / <span title="'.__('Closed from them', 'tst').'">'.$user_rating.'</span>';?></td>
							</tr>
							<tr>
								<th><?php _e('Tasks created', 'tst');?></th>
								<td class="num"><?php echo count($tasks_created).' / <span title="'.__('Closed from them', 'tst').'">'.$tasks_created_closed.'</span>';?></td>
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
					<?php if(count($tasks_working_on) == 0) {?>
						<div class="well well-sm"><?php _e('No tasks in progress', 'tst');?></div>
					<?php
						} else {

                        foreach(array_slice($tasks_working_on, 0, 5) as $task) {?>
                        <li>
                            <div class="mt-title">
                            <?php if($task->post_author != ACCOUNT_DELETED_ID) {?>
                                <a href="<?php echo get_permalink($task->ID);?>"><?php echo $task->post_title;?></a>
                            <?php } else {
                                echo $task->post_title;
                            }?>

                            </div>
                            <div class="mt-meta"><strong>
                                <?php _e('Created by', 'tst');?>:</strong> <?php echo $task->post_author != ACCOUNT_DELETED_ID ? tst_get_task_author_link($task) : __('Author deleted his account', 'tst');?>
                            </div>
                            <div class="mt-meta"><strong><?php _e('Deadline', 'tst');?>:</strong> <?php echo tst_get_task_meta($task, 'deadline');?></div>
                            <div class="mt-meta"><strong><?php _e('Reward', 'tst');?>:</strong> <?php echo tst_get_task_meta($task, 'reward');?></div>
                        </li>
                    <?php } //endforeach
				        }
                    ?></ul>
                    <?php if(wp_get_current_user()->user_login == $user_login && count($tasks_working_on) > 0) {?>
                        <hr />
                        <a href="<?php echo home_url("member-actions/member-tasks/");?>" class="btn btn-primary btn-xs">
						<?php _e('All tasks', 'tst');?> &raquo;</a>
                    <?php }?>
                    </div>
					
					<div class="tab-pane" id="created"><ul class="member-tasks-list">
					<?php
						if(count($tasks_created) == 0) {
					?>
						<div class="well well-sm"><?php _e('No tasks created', 'tst');?></div>
					<?php
						}
						else {
						foreach(array_slice($tasks_created, 0, 5) as $task) {?>
							<li>
								<div class="mt-title"><a href="<?php echo get_permalink($task->ID);?>"><?php echo $task->post_title;?></a></div>
								<div class="mt-meta"><strong><?php _e('Created by', 'tst');?>:</strong> <?php _e('Me', 'tst');?></div>
								<div class="mt-meta"><strong><?php _e('Deadline', 'tst');?>:</strong> <?php echo tst_get_task_meta($task, 'deadline');?></div>
								<div class="mt-meta"><strong><?php _e('Reward', 'tst');?>:</strong> <?php echo tst_get_task_meta($task, 'reward');?></div>
							</li>
                    <?php } //endforeach
					
						}
                    ?></ul>
                        <?php if(wp_get_current_user()->user_login == $user_login && count($tasks_created) > 0) {?>
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
			<div class="col-md-8"><?php tst_content_nav( 'nav-below' ); ?>&nbsp;</div>
			<div class="col-md-4"><div class="sharing"><?php frl_page_actions();?></div></div>
		</div>		
	</footer>
	
	<?php } else { // list

		$per_page = get_option('posts_per_page');
		$current = ($wp_query->query_vars['paged'] > 1) ? $wp_query->query_vars['paged'] : 1;
		$offset = ($current > 1) ? ($current-1)*$per_page : 0;

		$users_query_params = array(
	            'number' => $per_page,
	            'offset' => $offset,
	//            'nopaging' => true,
	            'exclude' => ACCOUNT_DELETED_ID,
				'query_id' => 'get_members_for_members_page',
	        );
		
		$users_query_params = tst_process_members_filter($users_query_params);

		$user_query = new WP_User_Query($users_query_params);
		?>
		
		<div class="row">
			<div class="col-md-8">
			</div>
			<div class="col-md-4">
				<?php get_template_part( 'members', 'filter'); ?>
			</div>
		</div>
		
		<?if($user_query->results) {?>
		
		<div class="row in-loop members-list">
		<?php
			foreach($user_query->results as $u){
				$tst_member = $u;
				get_template_part('content', 'member'); 
			}
		?>
		</div><!-- .row -->

        <?php tst_content_nav( 'nav-below' ); ?>

		<?php } else {?>

			<?php get_template_part( 'no-results', 'index' ); ?>

		<?php }?>

	<?php } //if single memmber?>

</div><!-- .page-body -->

<?php get_footer(); ?>