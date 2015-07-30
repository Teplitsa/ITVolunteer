<?php
/* well on homepage **/
?>
<div class="well">
	<div class="row">
		<div class="col-md-2">
			<div class="intro-logo">
			<?php
				$src = get_template_directory_uri().'/img/logo-v.png';
				echo "<img src='{$src}'>";
			?>
			</div>
		</div>

		<div class="col-md-7">

			<div class="home-text"><p>
            <?php global $post; echo $post->post_content; //the_content(); - not working for some reason ?>
				<? //_e('it-volunteer - a platform for the exchange of tasks to provide digital services for non-profit organizations and community initiatives. Here you can either ask for help for your project or organization, and to offer it. <a href="http://help.te-st.ru/about/">Read more.</a>', 'tst');?>
			</p></div>

		</div>

		<div class="col-md-3">
			<div class="intro-play-video-button pull-right" data-toggle="modal" data-target="#myModal">
				<div class="intro-play-icon"></div>
				<div class="intro-play-lable"><?php _e('how it works', 'tst');?></div>
			</div>
			<!-- Modal -->
			<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
							<h4 class="modal-title" id="myModalLabel"><?php _e('About IT-Volunteer', 'tst');?></h4>
						</div>
						<div class="modal-body">
							<?php echo get_post_meta(get_the_ID(), 'video', true);?>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div><!-- .row -->
</div>

<div class="home-header-buttons">
	<div class="row">
		<div class="col-md-9 clearfix">
			<div class="home-header-members-count pull-left">
				<?php _e('Members count', 'tst');?>: <span class="itv-members-count"><?php echo tst_get_active_members_count() ?></span>
			</div>
			<div class="itv-tasks-stats pull-left">
				<span><?php _e('Tasks on site', 'tst');?></span>
				<a href="<?php echo home_url('/tasks/?st=publish')?>" style="color:#4cae4c;"><?php _e('New tasks:', 'tst')?> <?php echo tst_get_new_tasks_count();?></a>
				<a href="<?php echo home_url('/tasks/?st=in_work')?>" style="color:#D0021B;"><?php _e('In work tasks:', 'tst')?> <?php echo tst_get_work_tasks_count();?></a>
				<a href="<?php echo home_url('/tasks/?st=closed')?>"><?php _e('Closed tasks:', 'tst')?> <?php echo tst_get_closed_tasks_count();?></a>
			</div>
		</div>
		<div class="col-md-3">
		<?php
			//GA Events
			$ga_atts = array(
				'category' => 'Создать задачу',
				'action' => 'Кнопка создать задачу на главной',
				'label' => 'Действия на главной'
			);
		?>
			<a href="<?php echo home_url('task-actions');?>" <?php tst_ga_event_data($ga_atts);?> class="add-new-task-button ga-event-trigger">
				<?php _e('Create task', 'tst');?>
			</a>
		</div>
	</div>
</div>
