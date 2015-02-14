<?php
/**
 * Task in loop
 * 
 */

?>

<<<<<<< HEAD
<article id="post-<?php the_ID(); ?>" <?php post_class('col-md-6'); ?>>
=======
<article id="post-<?php the_ID(); ?>" <?php post_class('col-md-6 item-masonry'); ?>>
>>>>>>> dev

	<div class="border-card">
		<header class="task-title">
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
                ?>
            </div>
			<div class="title-content">
				<h4>				
					<a href="<?php the_permalink(); ?>" rel="bookmark"><?php the_title(); //echo ' ('.strlen(get_the_title()).')'; ?></a>
				</h4>			
				<div class="task-meta"><?php tst_task_fixed_meta();?></div>
			</div>

		</header><!-- .entry-header -->

		<div class="task-summary">
			
			<div class="task-activity">
				<b><?php echo tst_get_task_doers_count();?></b>
				<span class="task-log"><?php _e('Volunteers', 'tst');?></span>
			</div>
			
			<div class="task-summary-content">
				<?php tst_task_params();?>								
				<div class="tags">
				<?php
					_e('Tags', 'tst');
					echo ": ";
                    $tags = wp_get_post_terms(get_the_ID(), 'post_tag');
                    foreach($tags as $i => $tag) { if($i != 0) echo ', ';
				?><a href="<?php echo home_url('/tag/'.$tag->slug);?>"><?php echo $tag->name;?></a><?php } ?>
                </div>			
				<div class="read-more"><a href="<?php the_permalink(); ?>" class="btn btn-default btn-sm"><?php _e('Get the details', 'tst');?></a></div>
			</div>
			
		</div>
	</div>	
		
</article><!-- #post-## -->
