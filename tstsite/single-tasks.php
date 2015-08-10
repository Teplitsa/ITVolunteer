<?php
/**
 * Assuming that single.php is using for task
 * for member there prabably shoul be separate template
 **/

get_header(); ?>
<?php while ( have_posts() ) : the_post();?>

<header class="page-heading">

	<div class="row">
		<div class="col-md-7">
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
		<div class="col-md-5">
			<div class="status-block-task">
				<div class="row-top task-meta"><?php tst_task_fixed_meta();?></div>
				<div class="row-main">
                    <?php tst_task_params();?>
				</div>
				<div class="row-main itv-task-view-row">
					<span class="task-param btn btn-default">
						<?=do_shortcode('[post-views]')?>
					</span>
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
                case 5: echo '<div class="alert alert-success">'.__('The volunteer was successfully approved!', 'tst').'</div>'; break;
                case 6: echo '<div class="alert alert-success">'.__('The volunteer was successfully refused.', 'tst').'</div>'; break;
                case 7: echo '<div class="alert alert-success">'.__('<strong>You have been added to the task as a volunteer to help with it!</strong> A task author is already noted.', 'tst').'</div>'; break;
                case 8: echo '<div class="alert alert-success">'.__('You have been removed from the volunteers list for this task.', 'tst').'</div>'; break;
//                case : echo '<div class="alert alert-success">'.__('', 'tst').'</div>'; break;
                default:
            }
        }?>

			<div class="task-summary">
				<?php the_content(); //this is very temporary?>

                <div class="tags">
                    <?php $tags = wp_get_post_terms(get_the_ID(), 'post_tag');
                    foreach($tags as $tag) {?>
                        <a href="<?php echo home_url('/tag/'.$tag->slug);?>"><?php echo $tag->name;?></a>
                    <?php } //echo get_the_term_list(get_the_ID(), 'post_tag', '<div class="tags">', ' ', '</div>'); ?>
                </div>
			</div>

			<div class="task-details">

                <h3><?php _e('Details', 'tst');?></h3>
				
				<!-- Tab panes -->
				<div class="">
                    <section class="data-section-task">
                        <h4><?php _e('What we are expecting', 'tst');?></h4>
                        <?php echo htmlspecialchars_decode(get_field('field_533bebda0fe8d'), ENT_QUOTES);?>
                    </section>
                    <section class="data-section-task">
                        <h4><?php _e('A little about reward', 'tst');?></h4>
			<div class="row task-params itv-about-reward-bubble">
				<?php $reward = get_term(get_field('field_533bef600fe91', get_the_ID()), 'reward');?>
				<?php tst_task_reward($reward)?>
			</div>
                        <?php echo htmlspecialchars_decode(get_field('field_533bec930fe8e'), ENT_QUOTES);?>
                    </section>
                    <section class="data-section-task">
                        <h4><?php _e('About organization/project', 'tst');?></h4>
                        <?php echo htmlspecialchars_decode(get_field('field_533beee40fe8f'), ENT_QUOTES);?>
                    </section>

<!--					--><?php //if(is_user_logged_in()) {?>

                    <h3><?php _e('Discussion', 'tst');?></h3>
                    <div class="">
                        <?php comments_template();?>
                    </div>
<!--					--><?php //}?>

				</div>

			</div>
		</div>

		<div class="col-md-4">
			<div class="task-actions sidebar">
				<?php get_template_part('sidebar', 'task');?>
			</div>			
		</div>

	</div><!-- .row -->

</div><!-- .page-body -->
<?php endwhile; ?>
<?php get_footer(); ?>