<?php
/**
 * Template Name: MembersPage
 **/

global $wp_query;

$css = (isset($wp_query->posts[0]->post_type)) ? $wp_query->posts[0]->post_type : 'tasks';
$search_str = isset($_GET['s']) ? $_GET['s'] : '';
$search_str = trim($search_str);

get_header(); ?>

<header class="page-heading <?php echo $css;?>-list-header <?php if(!is_home()){echo 'no-breadcrumbs'; }?>">
	<h1 class="page-title"><?php echo frl_page_title();?></h1>
	<div class="row">
	    <div class="col-md-2" style="padding-top:12px;">
	        <?php if($search_str): ?>
	            <?php echo __('Results', 'tst');?>: <b><?php echo (int)$wp_query->found_posts;?></b>
            <?php endif?>
	    </div>
		<div class="col-md-10">
			<?php tst_tasks_filters_search_menu();?>
		</div>
	</div>
</header>

<div class="page-body">
    <div class="row int-search-page-input">
        <div class="col-md-3"></div>
        <div class="col-md-6">
            <form class="searchform" role="search" action="<?php echo home_url('/'); ?>" method="get">
                <div class="row">
                <div class="col-md-10">
                <input class="search-field form-control" type="search" value="<?php echo get_search_query(); ?>" name="s">
                </div>
                <div class="col-md-2">
                <div class="sbutton-holder">
                <input class="search-submit btn <?php echo itv_get_search_button_color_class($wp_query)?> btn-block" type="submit" value="<?php _e('Search'); ?>">
                <input type="hidden" value="<?php echo $wp_query->get('task_status') ?>" name="task_status" />
                </div>
                </div>
                </div>
            </form>
        </div>
        <div class="col-md-3"></div>
    </div>
    <?php if(!$search_str): ?>
        <?php get_template_part( 'partials/no-search-text', 'index' ); ?>
        
	<?php elseif ( have_posts() ) : ?>
	<div class="row in-loop <?php echo $css;?>-list">
		<?php
			foreach($wp_query->posts as $qp){
				if($qp->post_type == 'tasks')
					tst_task_card_in_loop($qp);
			}			
		?>		
	</div><!-- .row -->

		<?php tst_content_nav( 'nav-below' ); ?>

	<?php else : ?>

		<?php get_template_part( 'no-results', 'index' ); ?>

	<?php endif; ?>
	

</div><!-- .page-body -->

<?php get_footer(); ?>
