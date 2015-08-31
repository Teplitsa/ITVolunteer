<?php
/**
 * Template for single task 
 **/
 
get_header(); 
while ( have_posts() ) : the_post();

$cur_user_id = get_current_user_id();
$author_id = get_the_author_meta('ID');
$is_curr_users_task = (bool)($cur_user_id == $author_id);
$candidates = tst_get_task_doers(get_the_ID(), false);
//$doers = tst_get_task_doers(get_the_ID(), true);



?>
<article <?php post_class('tpl-task-full'); ?>>
<header class="page-heading">

	<div class="row">
		<div class="col-md-8 col-lg-9">
			
			<h1 class="page-title task-title">
				<div class="status-wrap">
				<?php
					$status_label = tst_get_task_status_label();
					if($status_label) {
				?>
					<span class="status-label" title="<?php echo esc_attr(tst_tast_status_tip());?>">&nbsp;</span>
				<?php } ?>	
				</div>
				
				<?php echo frl_page_title();?>
				<?php if(current_user_can('edit_post', get_the_ID())): ?>
					<small class="edit-item"> <a href="<?php echo tst_get_edit_task_url();?>"><?php _e('Edit', 'tst');?></a></small>		
				<?php endif; ?>
			</h1>
			
			<?php echo get_the_term_list(get_the_ID(), 'post_tag', '<div class="tags">', '', '</div>'); ?>
			<div class="task-reward"><?php  tst_task_reward_in_card(); ?></div>
		</div>
		
		<div class="col-md-4 col-lg-3">
			<div class="row task-top-meta">
				<div class="col-xs-4 col-sm-2 col-md-8"><time><?php echo get_the_date('');?></time></div>
				<div class="col-xs-8 col-sm-10 col-md-4"><?php tst_tasks_view_counter();?></div>
			</div>
			
			<!-- multibutton -->
			<?php include(get_template_directory().'/partials/sidebar-multibutton.php');?>
		</div><!-- .col-md-4-->
	</div>

</header>
	
<div class="page-body">	
	
	<div class="row in-single">
		
		<div class="col-md-8">
        <?php if(isset($_GET['t'])) {
            switch((int)$_GET['t']) {
                case 1: echo '<div class="alert alert-success">'.__('Task was successfully published!', 'tst').'</div>'; break;
                case 2: echo '<div class="alert alert-success">'.__('Task was successfully unpublished.', 'tst').'</div>'; break;
                case 3: echo '<div class="alert alert-success">'.__('Task was successfully sent to work!', 'tst').'</div>'; break;
                case 4: echo '<div class="alert alert-success">'.__('Task was successfully closed!', 'tst').'</div>'; break;
                case 5: echo '<div class="alert alert-success">'.__('The volunteer was successfully approved!', 'tst').'</div>'; break;
                case 6: echo '<div class="alert alert-success">'.__('The volunteer was successfully refused.', 'tst').'</div>'; break;
                case 7: echo '<div class="alert alert-success">'.__('<strong>You have been added to the task as a volunteer to help with it!</strong> A task author is already noted.', 'tst').'</div>'; break;
                case 8: echo '<div class="alert alert-success">'.__('You have been removed from the volunteers list for this task.', 'tst').'</div>'; break;
//                case : echo '<div class="alert alert-success">'.__('', 'tst').'</div>'; break;
                default:
            }
        } else { ?>
			<div id="task-action-message" class="alert alert-danger" style="display:none;"></div>
	<?php } ?>
			<div class="task-summary task-section">
				<?php the_content(); ?>
				<?php echo apply_filters('frl_the_content', htmlspecialchars_decode(get_field('expecting'), ENT_QUOTES));?>
			</div>

			<div class="task-author task-section">
				<h5 class="task-section-title"><?php _e('Need help', 'tst');?></h5>
				<div class="task-author-avatar"><?php echo tst_get_task_author_avatar();?></div>
				<h4 class="task-author-name"><?php echo tst_get_task_author_link(null, true) ;?></h4>
				
			</div>
			
			<div class="task-details task-section">
				<h5 class="task-section-title"><?php _e('About organization/project', 'tst');?></h5>
				<?php
					$org = tst_get_task_author_org();
					if(!empty($org)){
						echo "<p>{$org}</p>";
					}
				?>
				<?php echo apply_filters('frl_the_content', htmlspecialchars_decode(get_field('about-author-org'), ENT_QUOTES));?>
			</div>
			
			<div class="task-comments task-section">
				<h5 class="task-section-title"><?php _e('Comments', 'tst');?></h5>
				<?php comments_template(); ?>
			</div>
			
		</div>

		<div class="col-md-4 col-lg-3 col-lg-offset-1">
			
			<?php include(get_template_directory().'/partials/sidebar-doers.php');?>
					
		</div>

	</div><!-- .row -->	
</div><!-- .page-body -->
</article>
<?php

	$related = new WP_Query(array(
		'post_type' => 'tasks',
		'posts_per_page' => 2,
		'post__not_in' => array(get_the_ID()),
		'author' => (int)get_the_author_meta('ID')
	)); 
	if(!$related->have_posts()){
		$tags = wp_get_object_terms(get_the_ID(), 'post_tag', array('fields' => 'ids', 'orderby' => 'count', 'order' => 'DESC'));
		
		$related = new WP_Query(array(
			'post_type' => 'tasks',
			'posts_per_page' => 2,
			'post__not_in' => array(get_the_ID()),
			'tax_query' => array(
				array(
					'taxonomy' => 'post_tag',
					'field' => 'id',
					'terms' => $tags[0]
				)
			)
		));
	}
	
	if($related->have_posts()) {
?>
<aside class="related-tasks">
	<h5 class="task-section-title">Еще задачи</h5>
	<div class="row">
	<?php
		foreach($related->posts as $rp){
			tst_task_related_card($rp);
		}
	?>
	</div>
</aside>
<?php } ?>
<?php endwhile; ?>
<?php get_footer(); ?>
