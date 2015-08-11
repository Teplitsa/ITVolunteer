<?php
/**
 * Page template
 **/

get_header(); ?>
<?php while ( have_posts() ) : the_post(); ?>

<header class="page-heading <?php if(is_page('about')) echo 'no-breadcrumbs';?>">

	<div class="row">
		<div class="col-md-12">
			<?php if(!is_page('about')) { ?>
				<nav class="page-breadcrumbs"><?php echo frl_breadcrumbs();?></nav>
			<?php } ?>
			<h1 class="page-title"><?php echo frl_page_title();?></h1>
		</div>
		
	</div>

</header>
	
<div class="page-body">	
	
	<div class="row in-single">	
		
		
		<div class="col-md-8">
			<div class="page-content">
				<?php the_content();?>
				<?php
					if(is_page('contacts')) {
						get_template_part('partials/contact', 'form');
					}
				?>		
			</div>
			
		</div>
			
		<div class="col-md-4">
			<div class="page-sidebar"><?php dynamic_sidebar('page-sidebar');?></div>
		</div>
		
	</div><!-- .row -->
	
	

</div><!-- .page-body -->
<?php endwhile; ?>
<?php get_footer(); ?>
