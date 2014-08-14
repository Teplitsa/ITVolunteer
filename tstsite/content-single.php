<?php
/**
 * @package Blank
 */

$pt = get_post_type();
$format = get_post_format();
$split_content = frl_single_split_content($post);
?>

<article id="post-<?php the_ID(); ?>" <?php post_class('full-post'); ?>>
	<header class="entry-header">
		<h2 class="entry-title"><?php the_title(); ?></h2>

		<div class="entry-meta">
			<?php tst_posted_on(); ?>
		</div>
		<div class="entry-meta">
			<?php global $post;
            if(is_single() && $post->post_type == 'tasks' && $post->post_author == get_current_user_id()) {?>
            <a href="<?php echo site_url('/edit-task/?task='.get_the_ID());?>"><?php _e('Edit task', 'tst');?></a>
            <?php } ?>
		</div>
	</header><!-- .entry-header -->
	
	<?php if(!empty($format)): ?>
	
		<div class="entry-summary">
			<?php echo apply_filters('the_excerpt', $split_content['intro']);?>
		</div>
		
		<div class="entry-media <?php echo esc_attr($format);?> cf">

		<?php
			if($format == 'image') :
				echo the_post_thumbnail('embed');
				
			else :
			
			$field_name = 'format_'.$format;
			$code = get_field($field_name);
			if(!empty($code))
				echo apply_filters('the_content', $code);
				
			endif;
		?>
		</div>
		
		<div class="entry-content">
			<?php echo apply_filters('the_content', $split_content['content']); ?>
		</div>
	
	<?php else: // standard case ?>
	
		<div class="entry-preview"><?php echo the_post_thumbnail();?></div>
		
		<div class="entry-summary">			
			<?php echo apply_filters('the_excerpt', $split_content['intro']); ?>
		</div>
		
		<div class="entry-content">
			<?php echo apply_filters('the_content', $split_content['content']); ?>
		</div>
	
	<?php endif; //if format ?>
	
	<aside class="related-posts">
		<h3><?php _e('Related posts', 'tst');?></h3>
		<?php tst_related_posts_list($post, 'post_tag', 4, array('thumb' => false));?>
	</aside>
	
	<footer class="post-footer">	

	<?php
		/* translators: used between list items, there is a space after the comma */
		$tags_list = get_the_tag_list( '',', ');
		if ( $tags_list ) :
	?>
		<span class="tags-links">
			<?php printf(__('Tags: %1$s', 'tst'), $tags_list ); ?>
		</span>
	<?php endif; // End if $tags_list ?>
		
	</footer><!-- .entry-meta -->
	
	
</article><!-- #post-## -->
