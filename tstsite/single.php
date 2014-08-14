<?php
/**
 * Assuming that single.php is using for task
 * for member there prabably shoul be separate template
 **/

get_header(); ?>
<?php while ( have_posts() ) : the_post();?>

<header class="page-heading">

	<div class="row">
		<div class="col-md-8">
			<nav class="page-breadcrumbs"><?php echo frl_breadcrumbs();?></nav>
			<h1 class="page-title task-title">
				<div class="status-wrap"><?php
                    $status_label = tst_get_task_status_label();
                    switch(get_post_status()) {
                        case 'draft':
                            echo '<span class="label">'.$status_label.'</span>'; break;
                        case 'publish':
                            echo '<span class="label alert-info">'.$status_label.'</span>'; break;
                        case 'in_work':
                            echo '<span class="label alert-success">'.$status_label.'</span>'; break;
                        case 'closed':
                            echo '<span class="label alert-warning">'.$status_label.'</span>'; break;
                        default:
                    }
                ?></div>
				<?php echo frl_page_title();?>
				<?php if(current_user_can('edit_post', get_the_ID())): ?>
					<small class="edit-item"> <a href="<?php echo tst_get_edit_task_url();?>"><?php _e('Edit', 'tst');?></a></small>		
				<?php endif; ?>
			</h1>
		</div>
		<div class="col-md-4">
			<div class="status-block-task">
				<div class="row-top task-meta"><?php tst_task_fixed_meta();?></div>
				<div class="row-main">
                    <?php tst_task_params();?>
				</div>
			</div>
		</div><!-- .col-md-4-->
	</div>

</header>
	
<div class="page-body">	
	
	<div class="row in-single">
		
		<div class="col-md-8">

        <?php if(isset($_GET['t'])) {
            switch((int)$_GET['t']) {
                case 1: echo '<div class="alert alert-success">'.__('Task was successfully published!', 'tst').'</div>'; break;
                case 2: echo '<div class="alert alert-success">'.__('Task was successfully unpublished.', 'tst').'</div>'; break;
                case 3: echo '<div class="alert alert-success">'.__('Task was successfully sent to work!', 'tst').'</div>'; break;
                case 4: echo '<div class="alert alert-success">'.__('Task was successfully closed!', 'tst').'</div>'; break;
                case 5: echo '<div class="alert alert-success">'.__('The candidate was successfully approved!', 'tst').'</div>'; break;
                case 6: echo '<div class="alert alert-success">'.__('The candidate was successfully refused.', 'tst').'</div>'; break;
                case 7: echo '<div class="alert alert-success">'.__('<strong>You have been added to the task as a candidate to help with it!</strong> A task author is already noted.', 'tst').'</div>'; break;
                case 8: echo '<div class="alert alert-success">'.__('You have been removed from the candidates list for this task.', 'tst').'</div>'; break;
//                case : echo '<div class="alert alert-success">'.__('', 'tst').'</div>'; break;
                default:
            }
        }?>

			<div class="task-summary">
				<?php the_content(); //this is very temporary?>

                <div class="tags">
                    <?php $tags = wp_get_post_terms(get_the_ID(), 'post_tag');
                    foreach($tags as $tag) {?>
                        <a href="<?php echo home_url('/tasks/?tt[]='.$tag->term_id);?>"><?php echo $tag->name;?></a>
                    <?php } //echo get_the_term_list(get_the_ID(), 'post_tag', '<div class="tags">', ' ', '</div>'); ?>
                </div>
			</div>
			
			<div class="task-details">

				<!-- Nav tabs -->
				<ul class="nav nav-tabs grey-tabs">
				  <li class="active"><a href="#t-details" data-toggle="tab"><?php _e('Details', 'tst');?></a></li>
				<?php if(is_user_logged_in()):?> 
					<li><a href="#t-comments" data-toggle="tab"><?php _e('Discussion', 'tst');?></a></li>
				<?php endif;?>
				</ul>
				
				<!-- Tab panes -->
				<div class="tab-content">
					<div class="tab-pane active" id="t-details">
						<div class="tab-pane-body">							
							<section class="data-section-task">
								<h4><?php _e('What we are expecting', 'tst');?></h4>
								<?php echo htmlspecialchars_decode(get_field('field_533bebda0fe8d'), ENT_QUOTES);?>
							</section>
							<section class="data-section-task">
								<h4><?php _e('A little about reward', 'tst');?></h4>
								<?php echo htmlspecialchars_decode(get_field('field_533bec930fe8e'), ENT_QUOTES);?>
							</section>
							<section class="data-section-task">
								<h4><?php _e('About organization/project', 'tst');?></h4>
								<?php echo htmlspecialchars_decode(get_field('field_533beee40fe8f'), ENT_QUOTES);?>
							</section>
						</div>
					</div>
					<?php if(is_user_logged_in()):?> 
					<div class="tab-pane fade" id="t-comments">
						<div class="tab-pane-body">
						<?php comments_template(); ?>
						</div>
					</div>
					<?php endif;?>
				</div><!-- .tab-content -->

			</div>
		</div>

		<div class="col-md-4">
			<div class="task-actions sidebar">
				<?php get_template_part('sidebar', 'task');?>
			</div>			
		</div>

	</div><!-- .row -->

	<footer class="inpage-footer task-footer">
		<div class="row">
			<div class="col-md-8"><?php tst_content_nav( 'nav-below' ); ?>&nbsp;</div>
			<div class="col-md-4">
				<div class="sharing"><span class="txt"><?php _e('Share with friends', 'tst');?></span><?php frl_page_actions();?></div></div>
		</div>		
	</footer>

</div><!-- .page-body -->
<?php endwhile; ?>
<?php get_footer(); ?>