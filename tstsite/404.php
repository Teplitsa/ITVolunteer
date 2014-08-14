<?php
/**
 * The template for displaying 404 pages (Not Found).
 *
 * @package Blank
 */


get_header(); ?>


<header class="page-heading">

	<div class="row">
		<div class="col-md-12">
			<nav class="page-breadcrumbs"><?php echo frl_breadcrumbs();?></nav>
			<h1 class="page-title"><?php echo frl_page_title();?></h1>
		</div>
		
	</div>

</header>
	
<div class="page-body">
<div class="row in-single">
		
	<div class="col-md-3">
		<div class="err-mark">404</div>
	</div>
	
	<div class="col-md-7">
		<section class="not-found-404">
			

			<div class="page-content">
				<p><?php  _e("We're sorry, but there is no such page on our website.", "tst");?></p>
				<p><?php _e('Let\'s try to find an information you needed', 'tst');?></p>

				<div class="search-holder"><?php get_search_form(); ?></div>


			</div><!-- .page-content -->
		</section><!-- .error-404 -->
	</div>		
			
	<div class="col-md-2">&nbsp;</div>
</div>
</div><!-- .page-body -->

<?php get_footer(); ?>