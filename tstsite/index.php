<?php
/**
 * The main template file.
 **/

global $wp_query;

$css = (isset($wp_query->posts[0]->post_type)) ? $wp_query->posts[0]->post_type : 'tasks';

get_header(); ?>

<header class="page-heading tasks-list-header">
	
	<?php if(is_post_type_archive('tasks')) { ?>
	<div class="row">	
		<div class="col-md-2">
			<!--<nav class="page-breadcrumbs"><?php echo frl_breadcrumbs();?></nav>-->
			<h1 class="page-title"><?php echo frl_page_title();?></h1>			
		</div>
		
		<div class="col-md-10">
			<?php //get_template_part( 'tasks', 'filter'); ?>
			<?php tst_tasks_filters_menu();?>
			
		</div><!-- col-md-4 -->
	</div>
	<?php } else { ?>
		<h1 class="page-title"><?php echo frl_page_title();?></h1>
	<?php } ?>
</header>
	
<div class="page-body">
	<?php if ( have_posts() ) : ?>
	<div class="row in-loop <?php echo $css;?>-list">
		<?php while ( have_posts() ) : the_post(); ?>

			<?php get_template_part('content', get_post_type()); ?>

		<?php endwhile; ?>
	</div><!-- .row -->

		<?php tst_content_nav( 'nav-below' ); ?>

	<?php else : ?>

		<?php get_template_part( 'no-results', 'index' ); ?>

	<?php endif; ?>
	

</div><!-- .page-body -->

<?php get_footer(); ?>