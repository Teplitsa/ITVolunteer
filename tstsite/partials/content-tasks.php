<?php
/**
 * Task in loop
 * 
 */
 
?>

<article id="post-<?php the_ID(); ?>" <?php post_class('col-md-6 item-masonry tpl-task'); ?>>
<div class="border-card">
	<div class="status-wrap">
		<?php
			$status_label = tst_get_task_status_label();
			if($status_label)
		?>
		<span class="status-label" title="<?php echo esc_attr(tst_tast_status_tip());?>">&nbsp;</span>
	</div>
	
	<header class="task-header">	
		<h4 class="task-title">				
			<a href="<?php the_permalink(); ?>" class="ga-event-trigger" <?php tst_ga_event_data('tc_title');?> rel="bookmark"><?php the_title(); ?></a>
		</h4>							
		<div class="task-meta"><?php echo tst_task_fixed_meta_in_card();?></div>
		<?php echo get_the_term_list(get_the_ID(), 'post_tag', '<div class="task-tags">', ', ', '</div>'); ?>		
	</header><!-- .entry-header -->

	<div class="task-summary">	
		<div class="task-reward"><?php tst_task_reward_in_card();?></div>
		<div class="task-more">
			<a href="<?php the_permalink(); ?>" class="more-link ga-event-trigger" <?php tst_ga_event_data('tc_more');?>  title="<?php _e('Details', 'tst');?>">...</a>
		</div>		
	</div>
	
</div>	<!-- .border-card -->		
</article><!-- #post-## -->
