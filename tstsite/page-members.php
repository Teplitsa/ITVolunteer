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
	
	$activity = tst_get_member_activity($user);
}



$header_css = (is_single_member()) ? 'member-header' : 'members-list-header no-breadcrumbs';
get_header();?>


<header class="page-heading <?php echo $header_css;?>">
	<div class="row">
		
	<?php if(!is_single_member()) { ?>
		<div class="col-md-3">
			<h1 class="page-title"><?php echo frl_page_title();?></h1>
		</div>
		<div class="col-md-9">
			<?php tst_members_filters_menu();?>
		</div>
		
	<?php } else { tst_update_member_stat($tst_member);  ?>
		<div class="col-md-8">
			<nav class="page-breadcrumbs"><?php echo frl_breadcrumbs();?></nav>
			<h1 class="page-title member-title"><?php echo frl_page_title();?>
					
			<?php if(current_user_can('edit_user', $tst_member->ID)): ?>
				<small class="edit-item"> <a href="<?php echo tst_get_edit_member_url();?>"><?php _e('Edit', 'tst');?></a></small>
			<?php endif; ?>
			</h1>
			
			<div class="subtitle"><?php echo sanitize_text_field(tst_get_member_field('user_speciality', $tst_member));?></div>
			
		</div>

		<div class="col-md-4">
			
			<div class="status-block-member">
				<?php tst_member_profile_infoblock($tst_member);?>
			</div>
			
		</div>
	<?php } ?>
		
	</div><!-- .row -->

</header>

<div class="page-body">

	<?php if(is_single_member()) {?>
	<div class="row in-single">
		<div class="col-md-8">
			<div class="row">
				<div class="col-md-3">					
					<?php tst_temp_avatar();?>
					
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
                            <div class="mt-meta"><?php echo tst_task_fixed_meta_in_card($task);?></div>                            
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
						$tasks_created = tst_query_member_tasks_created($tst_member, array('publish', 'in_work'), 5, false);
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
									<span class="reward-icon glyphicon glyphicon-star"></span> <?php echo tst_get_task_meta($task, 'reward');?>
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
			<div class="col-md-8"><?php tst_content_nav( 'nav-below' ); ?>&nbsp;</div>
			<div class="col-md-4">&nbsp;</div>
		</div>		
	</footer>
	
	<?php } else { // list

		$per_page = get_option('posts_per_page');
		
		if($wp_query->query_vars['navpage']) {
			$current = ($wp_query->query_vars['navpage'] > 1) ? $wp_query->query_vars['navpage'] : 1;
		}
		else {
			$current = ($wp_query->query_vars['paged'] > 1) ? $wp_query->query_vars['paged'] : 1;
		}
		
		$offset = ($current > 1) ? ($current-1)*$per_page : 0;

		$users_query_params = array(
	        'number' => $per_page,
	        'offset' => $offset,
	        'exclude' => ACCOUNT_DELETED_ID,
			'query_id' => 'get_members_for_members_page'			
	    );
		
		if($wp_query->query_vars['member_role']) {			
			$users_query_params['meta_query'] = array(
				array(
					'key'     => 'tst_member_role',
					'value'   => $wp_query->query_vars['member_role'],
					'compare' => '='
				)
			);
			
			//orderby
			if($wp_query->query_vars['member_role'] == 'hero'){
				$users_query_params['orderby'] = array('meta_value' => 'DESC', 'registered' => 'DESC');
				$users_query_params['meta_key'] = 'tst_member_tasks_solved';
			}
			elseif($wp_query->query_vars['member_role'] == 'volunteer') {
				$users_query_params['orderby'] = array('meta_value' => 'DESC', 'registered' => 'DESC');
				$users_query_params['meta_key'] = 'tst_member_tasks_joined';
			}
			elseif($wp_query->query_vars['member_role'] == 'donee') {
				$users_query_params['orderby'] = array('meta_value' => 'DESC', 'registered' => 'DESC');
				$users_query_params['meta_key'] = 'tst_member_tasks_created_closed';
			}
			elseif($wp_query->query_vars['member_role'] == 'activist') {
				$users_query_params['orderby'] = array('meta_value' => 'DESC', 'registered' => 'DESC');
				$users_query_params['meta_key'] = 'tst_member_tasks_created';
			}
		}
		else { //general ordrby	
			$users_query_params['orderby'] = array('registered' => 'DESC');
			//$users_query_params['meta_key'] = 'tst_member_tasks_solved';
		}
		
		
		$user_query = new WP_User_Query($users_query_params);
		
		if($user_query->results) {
		?>
		
		<div class="row in-loop members-list">
		<?php
			foreach($user_query->results as $u){
				$tst_member = $u;
				get_template_part('content', 'member'); 
			}
		?>
		</div><!-- .row -->
		
		<nav class="clearfix nav-paging" id="nav-below" role="navigation"><div class="pull-right">
			<?php tst_members_paging($wp_query, $user_query, $echo = true); ?>
		</div></nav>       

		<?php } else {?>

			<?php get_template_part( 'no-results', 'index' ); ?>

		<?php }?>

	<?php } //if single memmber?>

</div><!-- .page-body -->

<?php get_footer(); ?>