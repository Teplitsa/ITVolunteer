<?php
/* well on homepage **/

global $post;
global $TST_ABOUT_VIDEO_URL;
$TST_ABOUT_VIDEO_URL = $video = ($post->post_excerpt) ? $post->post_excerpt : '#';

//print modal	
add_action('wp_footer', function(){
	global $TST_ABOUT_VIDEO_URL;
?>
<div class="modal fade" id="tst-about-video-modal" tabindex="-1" role="dialog" aria-labelledby="tst-about-video-modal-label" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
				<h4 class="modal-title" id="tst-about-video-modal-label"><?php _e('About IT-Volunteer', 'tst');?></h4>
			</div>
			<div class="modal-body" id="video-content">
                <iframe class="tst-about-video" allowfullscreen="" frameborder="0" height="360" width="640" id="tst-about-video-iframe" src="//<?php echo $TST_ABOUT_VIDEO_URL;?>?enablejsapi=1&origin=<?php echo site_url()?>"></iframe>
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
			<a href="//<?php echo $video;?>" target="_blank" <?php tst_ga_event_data('hp_video_mobile');?> class="ga-event-trigger"><?php _e('how it works', 'tst');?></a>
		</div>
		
		<div class="details desktop-only" id="hp-mtr">
			<a href="//<?php echo $video;?>" data-toggle="modal" data-target="#tst-about-video-modal" target="_blank" <?php tst_ga_event_data('hp_video');?> class="ga-event-trigger tst-show-about-video-modal"><?php _e('how it works', 'tst');?></a>			
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
		<a href="<?php echo home_url('tags'); ?>" class="tags ga-event-trigger" <?php tst_ga_event_data('hp_tf_tags');?>>
			<?php _e('By tags', 'tst')?>
		</a>	
		<a href="<?php echo home_url('nko-tags'); ?>" class="tags ga-event-trigger" <?php tst_ga_event_data('hp_tf_nko_tags');?>>
			<?php _e('By NPO tags', 'tst')?>
		</a>	
	</div>
	
</section>
