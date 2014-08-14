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

<header class="page-heading">

	<div class="row">
		<div class="col-md-8">
			<nav class="page-breadcrumbs"><?php echo frl_breadcrumbs();?></nav>
			<h1 class="page-title <?php if(is_single_member()) echo 'member-title';?>">
			<?php echo frl_page_title();?>
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
					<section class="data-section-member">
						<h4><?php _e('About me', 'tst');?></h4>
						<?php
                        $text = apply_filters('frl_the_content', tst_get_member_field('user_bio'));
                        echo $text ? $text : '<div class="">'.__('No data.', 'tst').'</div>';
                        ?>
					</section>

					<section class="data-section-member">
						<h4><?php _e('Professional skills', 'tst');?></h4>
						<?php
                        $text = apply_filters('frl_the_content', tst_get_member_field('user_professional'));
                        echo $text ? $text : '<div class="">'.__('No data.', 'tst').'</div>';
                        ?>
					</section>

					<section class="data-section-member">
						<h4><?php _e('In the web', 'tst');?></h4>
						<?php
                        $text = tst_get_member_field('user_socials');
                        echo $text ? $text : '<div class="">'.__('No data.', 'tst').'</div>';
                        ?>
					</section>

					<?php if(is_user_logged_in()):?>
					<section class="data-section-member">
						<h4><?php _e('Contact details', 'tst');?></h4>
						<dl class="member-data-list">
							<dt>Email: </dt>
							<dd><?php echo sanitize_text_field(tst_get_member_field('user_email'));?></dd>
							<dt><?php _e('Additional', 'tst');?>: </dt>
							<dd><?php echo apply_filters('frl_the_content', tst_get_member_field('user_contacts'));?></dd>
						</dl>
					</section>
					<?php endif;?>
				</div><!-- .col-md-9 -->
			</div>
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
								<th><?php _e('Tasks created', 'tst');?></th>
								<td class="num"><?php echo count($tasks_created).' / <span title="'.__('Closed from them', 'tst').'">'.$tasks_created_closed.'</span>';?></td>
							</tr>
							<tr>
								<th><?php _e('Tasks joined', 'tst');?></th>
								<td class="num"><?php echo count($tasks_working_on).' / <span title="'.__('Closed from them', 'tst').'">'.$user_rating.'</span>';?></td>
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
		
		$user_query = new WP_User_Query(array(
            'number' => $per_page,
            'offset' => $offset,
//            'nopaging' => true,
            'exclude' => ACCOUNT_DELETED_ID,
        ));
		if($user_query->results) {?>

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