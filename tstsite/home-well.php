<?php
/* well on homepage **/
global $post;
?>
<div class="well">
	
	<div class="intro-text">
		<?php echo apply_filters('frl_the_content', $post->post_content);?>
	</div>
	
	<div class="intro-actions">
		<div class="details mobile-only">			
			<a href="http://www.youtube.com/embed/D32OZIhoC6E" target="_blank"><?php _e('how it works', 'tst');?></a>
		</div>
		
		<div class="details desktop-only">
			<a href="#" data-toggle="modal" data-target="#myModal"><?php _e('how it works', 'tst');?></a>
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
		
		<div class="cta">
			<?php
				//GA Events
				$ga_atts = array(
					'ga_category' => 'Создать задачу',
					'ga_action' => 'Кнопка создать задачу на главной',
					'ga_label' => 'Главная'
				);
			?>
				<a href="<?php echo home_url('task-actions');?>" <?php tst_ga_event_data($ga_atts);?> class="btn btn-success ga-event-trigger">
					<?php _e('Create task', 'tst');?>
				</a>			
		</div>
		
	</div>
	
</div><!-- .well -->	

<div class="home-header-buttons">	
	
	<span><?php _e('Tasks on site', 'tst');?></span>
	<a href="<?php echo tst_tasks_filters_link('publish'); ?>" class="publish">
		<?php _e('New tasks:', 'tst')?>&nbsp;<?php echo tst_get_new_tasks_count();?>
	</a>
	<a href="<?php echo tst_tasks_filters_link('in_work'); ?>" class="in_work">
		<?php _e('In work tasks:', 'tst')?>&nbsp;<?php echo tst_get_work_tasks_count();?>
	</a>
	<a href="<?php echo tst_tasks_filters_link('closed'); ?>" class="closed">
		<?php _e('Closed tasks:', 'tst')?>&nbsp;<?php echo tst_get_closed_tasks_count();?>
	</a>	
	
</div>
