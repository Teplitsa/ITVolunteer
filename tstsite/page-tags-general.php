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
			    $tags = get_terms($tst_tags_taxonomy_name, array('hide_empty' => 1, 'orderby' => 'count', 'order' => 'DESC'));
			    
				if(!empty($tags)){
    				
    				$max_tasks_by_tag = $tasks_stats_by_tags->get_max_posts_count_by_tags();
    					
    				echo "<ul class='task-tags-list'>";
    				foreach($tags as $tag){ 
    					if(isset($_GET['update']) && $_GET['update'] == 1)
    						tst_correct_tag_count($tag->term_taxonomy_id, $tag->taxonomy);
    				
    					$tasks_stats = $tasks_stats_by_tags->get_tag_stats($tag->term_taxonomy_id);
    					
    					if($tasks_stats) {
    					    echo "<li>";
    					    echo "<a href='".get_term_link($tag, $tst_tags_taxonomy_name)."'>".apply_filters('frl_the_title', $tag->name)."</a> <i>".$tasks_stats->total."</i>";
    					    echo itv_show_tasks_stats_by_tag($tasks_stats, $max_tasks_by_tag);
    					    echo "</li>";
    					}
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