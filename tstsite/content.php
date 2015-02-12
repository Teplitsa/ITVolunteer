<?php
/**
 * this is temporary post layout
 * 
 */

?>

<article id="post-<?php the_ID(); ?>" <?php post_class('col-md-6 tpl-post'); ?>>

	<div class="border-card">
		<header class="post-title"> 
			<h4><a href="<?php the_permalink(); ?>" rel="bookmark"><?php the_title(); ?></a></h4>			
			<div class="post-meta"><time><?php echo get_the_date();?></time></div>
		</header><!-- .entry-header -->
		
		<div class="post-preview"><a href="<?php the_permalink(); ?>" class="thumb-link">
			<?php the_post_thumbnail();?>
		</a></div>
		
		<div class="post-summary">			
			<?php the_excerpt(); ?>
			
		</div>
	</div>	
		
</article><!-- #post-## -->
