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
	$tasks_per_page = get_option('posts_per_page');
	$tasks_query = new WP_Query(array(
		'post_type'      => 'tasks',
		'post_status'    => array('publish'),
		'posts_per_page' => $tasks_per_page,
		'author__not_in' => array(ACCOUNT_DELETED_ID),
		'set_users'      => 'yes'		
	));
	
	
	if($tasks_query->have_posts()) { $count = 0; ?>
	
		<div class="row in-loop tasks-list">
		<?php
			foreach($tasks_query->posts as $qp) {
				$count++;
				tst_task_card_in_loop($qp);
				
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
					if($news_posts->have_posts()) {						
						tst_news_item_in_loop($news_posts->posts[0]);
					} 
				}
			}			
		?>
		</div><!-- .row -->
		
		<?php if($tasks_query->found_posts > $tasks_per_page) { ?>
		<div class="home-nav">
			<a href="<?php echo home_url('tasks/publish/page/2/');?>" class="btn btn-default ga-event-trigger" <?php tst_ga_event_data('hp_more_nav');?>>
				<?php _e('More tasks', 'tst');?> &raquo;
			</a>
		</div>
		<?php } ?>

	<?php } else { // have posts ?>
		
		<div class="no-results">К сожалению, задач не найдено.</div>
		
	<?php } ?>
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
