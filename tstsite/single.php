<?php
/**
 * Single post
 **/

get_header(); ?>
<?php while ( have_posts() ) : the_post();?>


<header class="page-heading">

	<div class="row">
		<div class="col-md-12">
			<nav class="page-breadcrumbs"><?php echo frl_breadcrumbs();?></nav>
			<h1 class="page-title"><?php echo frl_page_title();?></h1>
		</div>
		
	</div>

</header>


<div class="page-body single-post">	
	
	<div class="row in-single">
		
		<div class="col-md-2">
			<div class="page-actions">
			<?php
				wp_nav_menu(array(
					'menu' => 'about',
					'menu_class' => 'list-unstyled'
				));
			?>	
			</div>
			
		</div>
		
		<div class="col-md-7">
			<div class="page-summary"><?php the_excerpt();?></div>
			<div class="page-media"><?php the_post_thumbnail('embed') ;?></div>
			<div class="page-content"><?php the_content();?></div>
		</div>
			
		<div class="col-md-3">
			<div class="page-sidebar"><?php dynamic_sidebar('page-sidebar');?></div>
		</div>
		
	</div><!-- .row -->
	
	

</div><!-- .page-body -->
<?php endwhile; ?>
<?php get_footer(); ?>