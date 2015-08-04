<?php
/* well on homepage **/
global $post;

$ga_label = 'Главная';

$video = get_post_meta($post->ID, 'video', true);
if(empty($video))
	$video = '#';

//print modal	
add_action('wp_footer', function(){
	
?>
<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
				<h4 class="modal-title" id="myModalLabel"><?php _e('About IT-Volunteer', 'tst');?></h4>
			</div>
			<div class="modal-body" id="video-content">
				<iframe allowfullscreen="" frameborder="0" height="360" width="640"></iframe>
			</div>
		</div>
	</div>
</div>
<?php
});	

?>
<section class="intro-panel">

	<h1><?php echo apply_filters('frl_the_title', $post->post_content);?></h1>

	
	<div class="intro-panel-actions">		
		<div class="details mobile-only">			
			<a href="http://<?php echo $video;?>" target="_blank" <?php tst_ga_event_data('hp_video_mobile');?> class="ga-event-trigger"><?php _e('how it works', 'tst');?></a>
		</div>
		
		<div class="details desktop-only" id="hp-mtr">
			<a href="//<?php echo $video;?>/?autoplay=1" data-toggle="modal" data-target="#myModal" target="_blank" <?php tst_ga_event_data('hp_video');?> class="ga-event-trigger"><?php _e('how it works', 'tst');?></a>			
		</div>
		
		<div class="cta">		
			<a href="<?php echo home_url('task-actions');?>" <?php tst_ga_event_data('hp_new_task');?> class="btn btn-success ga-event-trigger"><?php _e('Create task', 'tst');?></a>			
		</div>
		
	</div>
	

	<div class="intro-panel-filters">		
		<span><?php _e('Tasks on site', 'tst');?></span>
		<a href="<?php echo tst_tasks_filters_link('publish'); ?>" class="publish ga-event-trigger" <?php tst_ga_event_data('hp_tf_open');?>>
			<?php _e('New tasks:', 'tst')?>&nbsp;<?php echo tst_get_new_tasks_count();?>
		</a>
		<a href="<?php echo tst_tasks_filters_link('in_work'); ?>" class="in_work ga-event-trigger" <?php tst_ga_event_data('hp_tf_work');?>>
			<?php _e('In work tasks:', 'tst')?>&nbsp;<?php echo tst_get_work_tasks_count();?>
		</a>
		<a href="<?php echo tst_tasks_filters_link('closed'); ?>" class="closed ga-event-trigger" <?php tst_ga_event_data('hp_tf_close');?>>
			<?php _e('Closed tasks:', 'tst')?>&nbsp;<?php echo tst_get_closed_tasks_count();?>
		</a>	
	</div>
	
</section>