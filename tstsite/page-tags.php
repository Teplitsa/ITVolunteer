<?php
/**
 * Template Name: Tags Page
 **/


 
get_header(); ?>
<?php while ( have_posts() ) : the_post(); ?>

<header class="page-heading tasks-list-header no-breadcrumbs">

	<div class="row">	
		<div class="col-md-2">			
			<h1 class="page-title"><?php echo frl_page_title();?></h1>			
		</div>
		
		<div class="col-md-10">
			<?php tst_tasks_filters_menu();?>			
		</div><!-- col-md-4 -->
	</div>

</header>
	
<div class="page-body">	
	
	<div class="row in-single">	
		<div class="col-md-8">
			<div class="page-content">
			<?php
				$tags = get_terms('post_tag', array('hide_empty' => 1, 'orderby' => 'count', 'order' => 'DESC'));
				if(!empty($tags)){
				
				echo "<ul class='task-tags-list'>";
				foreach($tags as $tag){
					echo "<li>";
					echo "<a href='".get_term_link($tag)."'>".apply_filters('frl_the_title', $tag->name)."</a> <i>".$tag->count."</i>";
					echo "</li>";
				}
				echo "</ul>";	
				}
			?>
			</div>			
		</div>
			
		
	</div><!-- .row -->
	
	

</div><!-- .page-body -->
<?php endwhile; ?>
<?php get_footer(); ?>