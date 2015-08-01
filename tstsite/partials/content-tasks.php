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
			if($status_lab)
		?>
		<span class="status-label" title="<?php echo esc_attr(tst_tast_status_tip());?>">&nbsp;</span>
	</div>
	
	<header class="task-header">
	<?php
		//GA Event
		$label = 'Список задач';
		if(is_front_page()){
			$label = 'Главная';
		}
		elseif(is_tag()){
			$label = 'Тег';
		}
		
		$ga_atts_1 = array(
			'category' => 'Подробности задачи',
			'action' => 'Заголовок в карточке задачи',
			'label' => $label
		);
	?>
		<h4 class="task-title">				
			<a href="<?php the_permalink(); ?>" <?php tst_ga_event_data($ga_atts_1);?> rel="bookmark"><?php the_title(); ?></a>
		</h4>							
		<div class="task-meta"><?php echo tst_task_fixed_meta_in_card();?></div>
		<?php echo get_the_term_list(get_the_ID(), 'post_tag', '<div class="task-tags">', ', ', '</div>'); ?>		
	</header><!-- .entry-header -->

	<div class="task-summary">
	<?php
		//GA Event		
		$ga_atts_2 = array(
			'category' => 'Подробности задачи',
			'action' => 'Ссылка подробнее в карточке задачи',
			'label' => $label
		);
	?>
		<div class="task-reward"><?php tst_task_reward_in_card();?></div>
		<div class="task-more"><a href="<?php the_permalink(); ?>" <?php tst_ga_event_data($ga_atts_2);?> class="more-link" title="<?php _e('Details', 'tst');?>">...</a></div>		
	</div>
	
</div>	<!-- .border-card -->		
</article><!-- #post-## -->
