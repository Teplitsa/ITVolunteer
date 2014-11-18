<?php
/**
 * The main template file.
 **/

get_header(); ?>

<header class="page-heading">

	<div class="row">
		<div class="col-md-8">
			<nav class="page-breadcrumbs"><?php echo frl_breadcrumbs();?></nav>
			<h1 class="page-title"><?php echo frl_page_title();?></h1>
		</div>
		<div class="col-md-4">
			<?php get_template_part( 'tasks', 'filter'); ?>
		
		</div><!-- col-md-4 -->
	</div>

</header>
	
<div class="page-body">

	<?php if ( have_posts() ) : ?>
	<div class="row in-loop tasks-list">
		<?php while ( have_posts() ) : the_post(); ?>

			<?php get_template_part( 'content', get_post_format() ); ?>

		<?php endwhile; ?>
	</div><!-- .row -->

		<?php tst_content_nav( 'nav-below' ); ?>

	<?php else : ?>

		<?php get_template_part( 'no-results', 'index' ); ?>

	<?php endif; ?>
	

</div><!-- .page-body -->

<?php get_footer(); ?>