<?php
/**
 * Template Name: Homepage
 * The Template for homepage
 * 
 */

get_header();

if(isset($_GET['t'])) {
    switch($_GET['t']) {
        case 1: echo '<div class="alert alert-success">'.__('Your profile has been successfully deleted!', 'tst').'</div>';
        default:
    }
}
?>

<section class="home-section tasks">
	<div class="section-content">
<?php 
	$tasks_query = new WP_Query(array(
		'post_type' => 'tasks',
		'post_status' => array('publish'),
		'nopaging' => 1,
		'author' => '-'.ACCOUNT_DELETED_ID,
	));
	
	$tasks_per_page = get_option('posts_per_page');
	if($tasks_query->have_posts()) { $count = 0; ?>
	
		<div class="row in-loop tasks-list">
		<?php
			while($tasks_query->have_posts()) {
						
				$count++;
				$tasks_query->the_post();
	
				tst_task_card_in_loop();
				
				if($count == 4){
					//news item
					$args = array(
						'posts_per_page'   => 1,
						'orderby'          => 'post_date',
						'order'            => 'DESC',
						'post_type'        => 'post',
						'post_status'      => 'publish',
						'suppress_filters' => true 
					);
					
					$news_posts = new WP_Query( $args );
					
					?>
					
					<?php
					if($news_posts->have_posts()): while($news_posts->have_posts()) : $news_posts->the_post();
					?>
					<article <?php post_class('col-md-6 home-news item-masonry'); ?>>
					<div class="border-card">
						<h2>Новости проекта</h2>
						
						<h4>				
							<a href="<?php the_permalink(); ?>" rel="bookmark"><?php the_title(); ?></a>
						</h4>	
						
						<div class="home-news-content">
							<?php $thumbnail = get_the_post_thumbnail(get_the_ID(), 'embed')?>
							<?php if ( $thumbnail ): ?>
								<a href="<?php the_permalink(); ?>" class="thumb-link"><?php echo $thumbnail ?></a>
							<?php endif?>
							
							<?php echo the_excerpt(); ?>
							
						</div>
					
					</div>
					</article>					
					<?php endwhile; endif; wp_reset_postdata();
					//news item end
				}
				
			} //enwhile
		?>
		</div><!-- .row -->		
		<?php if($tasks_query->post_count > $tasks_per_page) { ?>
		<div class="home-nav">
			<a href="<?php echo home_url('/tasks/page/2/');?>" class="btn btn-default ga-event-trigger" <?php tst_ga_event_data('hp_more_nav');?>>
				<?php _e('More tasks', 'tst');?> &raquo;
			</a>
		</div>
		<?php } ?>

	<?php } else { // have posts ?>

		<?php get_template_part('no-results', 'index');?>

	<?php } wp_reset_postdata(); ?>
	</div>
</section><!-- .home-section -->

<div class="itv-home-prefooter clearfix">
	<p class="pull-left"><?php _e('Need help with site?', 'tst');?></p>
	<?php if(is_user_logged_in()): ?>
		<a href="<?php echo home_url('task-actions');?>" class="add-new-task-button pull-right ga-event-trigger" <?php tst_ga_event_data('hp_ntask_bottom');?>><?php _e('Create task', 'tst');?></a>
	<?php else: ?>
		<a href="<?php echo home_url('/registration/')?>" class="register-prefooter pull-right ga-event-trigger" <?php tst_ga_event_data('hp_reg_bottom');?>><?php _e('Register', 'tst');?></a>
	<?php endif?>
</div>

<?php get_footer(); ?>
