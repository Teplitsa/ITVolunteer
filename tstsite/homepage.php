<?php
/**
 * Template Name: Homepage
 * The Template for homepage
 * 
 */

get_header(); ?>

<?php if(isset($_GET['t'])) {
    switch($_GET['t']) {
        case 1: echo '<div class="alert alert-success">'.__('Your profile has been successfully deleted!', 'tst').'</div>';
        default:
    }
}?>

<section class="home-section tasks">
	<div class="section-content">
        <?php global $wp_query;
        $wp_query = new WP_Query(array(
            'post_type' => 'tasks',
            'post_status' => array('publish'),
            'nopaging' => 1,
            'author' => '-'.ACCOUNT_DELETED_ID,
        ));
        $tasks_per_page = get_option('posts_per_page');
        if(have_posts()) { $count = 0;?>
            <div class="row in-loop tasks-list">
                <?php while(have_posts()) {
                    if($count >= $tasks_per_page)
                        break;
                    $count++;
                    the_post();?>

                    <?php get_template_part('content-tasks', get_post_format());?>
					
					<?if($count == 4):?>
						<?php //get_template_part('home-news');?>
					<?endif?>

                <?php }?>
            </div><!-- .row -->

            <?php if($wp_query->post_count > $tasks_per_page) {?>
                <div class="home-nav"><a href="<?php echo home_url('/tasks/page/2/');?>" class="btn btn-default"><?php _e('More tasks', 'tst');?> &raquo;</a></div>
            <?php }?>

        <?php } else {?>

            <?php get_template_part('no-results', 'index');?>

        <?php }?>
	</div>
</section><!-- .home-section -->

<div class="itv-home-prefooter clearfix">
	<p class="pull-left"><?php _e('Need help with site?', 'tst');?></p>
	<?php if(is_user_logged_in()): ?>
		<a href="<?php echo home_url('task-actions');?>" class="add-new-task-button pull-right"><?php _e('Create task', 'tst');?></a>
	<?php else: ?>
		<a href="<?php echo home_url('/registration/')?>" class="register-prefooter pull-right"><?php _e('Register', 'tst');?></a>
	<?php endif?>
</div>

<?php get_footer(); ?>