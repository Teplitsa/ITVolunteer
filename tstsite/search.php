<?php
/**
 * The template for displaying Search Results pages.
 *
 * @package Blank
 */

global $wp_query;

 
get_header(); ?>

<header class="page-heading">

	<div class="row">
		<div class="col-md-8">
			<nav class="page-breadcrumbs"><?php echo frl_breadcrumbs();?></nav>
			<h1 class="page-title"><?php echo frl_page_title();?></h1>
		</div>
		<div class="col-md-4">
			&nbsp;
		</div>
	</div>

</header>
	
<div class="page-body">
<div class="row">
	
	<div class="col-md-2">
		<div class="res-count">
			
			<?php echo __('Results', 'tst');?>: <b><?php echo (int)$wp_query->found_posts;?></b>
			
        </div>
	</div>
	
	<div class="col-md-7">		
			<div class="search-holder"><?php get_search_form();?></div>
			
			<?php if ( have_posts() ) : ?>
				
				<?php while ( have_posts() ) : the_post(); $pt = get_post_type(); ?>
					
				<article class="search-item <?php echo $pt;?>">
					<h4>
						<a href="<?php the_permalink(); ?>" rel="bookmark"><?php the_title();?></a>
						<span class="title-part">
						<?php
							if($pt == 'tasks') {
								echo " (#".get_the_ID().")";
							}								
						?>
						</span>
						<span class="nav-mark">&raquo;</span>	
					</h4>
					<div class="description"><?php the_excerpt();?></div>
				</article>					
	
				<?php endwhile; ?>
	
				<?php tst_content_nav( 'nav-below' ); ?>
	
			<?php else {
	: ?>
	
				<?php get_template_part( 'no-results', 'index' );
}
?>
	
			<?php endif; ?>
	
	</div>
	
	<div class="col-md-3">&nbsp;</div>
	
</div></div>
	
<?php get_footer(); ?>
