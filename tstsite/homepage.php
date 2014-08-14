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
	<header class="section-header">
		<div class="row">
			<div class="col-md-8">
				<h3><?php _e('Recent tasks', 'tst');?></h3>
			</div>
            <div class="col-md-4">
                <?php get_template_part('tasks', 'filter'); ?>
            </div>
		</div>
	</header>
	<div class="section-content">
        <?php global $wp_query;
        $wp_query = new WP_Query(array(
            'post_type' => 'tasks',
            'post_status' => array('publish', 'in_work'),
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

                    <?php get_template_part('content', get_post_format());?>

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

<?php get_footer(); ?>