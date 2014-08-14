<?php
/**
 * Related items by tags
 **/

/* connection configuration */
$related_pt_rules = array(
	'post'    => array('post', 'event', 'article', 'project'),
	'event'   => array('post', 'event', 'article', 'project'),
	'article' => array('post', 'event', 'article', 'project'),
	'project' => array('post', 'event')
);
 
/* get relalted ids */
function tst_get_related_ids($cpost, $tax = 'post_tag', $limit = 5){
	global $wpdb, $related_pt_rules;
	
	$related_ids = array();
	
	//params		
	$post_type = (isset($related_pt_rules[$cpost->post_type])) ? $related_pt_rules[$cpost->post_type] : '';
	$post_type = apply_filters('tst_related_post_types', $post_type, $cpost, $tax); //sometimes we need to alter it outside
	
	if(empty($post_type))
		return $related_ids;
		
	$post_type = implode("','", $post_type);	
	$limit = absint($limit);
	$post_id = absint($cpost->ID);
	
	//tags
	$relation_tags = get_the_terms($cpost, $tax);
	if(empty($relation_tags))
		return $related_ids;
	
	$tag_ids = array();
	foreach($relation_tags as $pt) 
		$tag_ids[] = (int)$pt->term_taxonomy_id;

	$tag_ids = implode(',', $tag_ids);
	
$sql =
"SELECT p.ID, COUNT(t_r.object_id) AS cnt 
FROM $wpdb->term_relationships AS t_r, $wpdb->posts AS p
WHERE t_r.object_id = p.id 
AND t_r.term_taxonomy_id IN($tag_ids) 
AND p.post_type IN('$post_type') 	
AND p.id != $post_id 
AND p.post_status='publish' 
GROUP BY t_r.object_id 
ORDER BY cnt DESC, p.post_date_gmt DESC 
LIMIT $limit "; 		

	$r_posts = $wpdb->get_results($sql);
	if(empty($r_posts))
		return $related_ids;
	
	foreach($r_posts as $p){
		$related_ids[] = (int)$p->ID;
	}
	
	return $related_ids;
}

/* print loop */
function tst_related_posts_list($cpost = null, $tax = 'post_tag', $limit = 5, $args = array()){
	global $post;
	
	if(empty($cpost))
		$cpost = $post;
	
	$defaults = array(
		'thumb' => true,
		'meta' => true,
		'thumb_size' => 'post-thumbnail',
		'not_found_msg' => true
	);
	$args = wp_parse_args($args, $defaults);
	
	
	$r_ids = tst_get_related_ids($cpost, $tax, $limit);
	if(empty($r_ids) && $args['not_found_msg']){
	?>
		<p><?php _e('No related posts found.', 'tst');?></p>
	<?php
		return;
	}
		
	
	$query = new WP_Query(array('post__in' => $r_ids, 'post_type' => 'any'));
	if($query->have_posts()):
?>
	<ul class="related-posts">
	<?php while($query->have_posts()): $query->the_post(); ?>
	<li class="tst-recent-item <? echo esc_attr($post->post_type);?><?php if($args['thumb']) echo ' has-thumb';?>">

		<?php if(has_post_thumbnail() && $args['thumb'] == true): //thumb  ?>
			<div class="item-preview"><a href="<?php the_permalink(); ?>" rel="bookmark" >
				<?php the_post_thumbnail($args['thumb_size']); ?>
			</a></div>
		<?php endif; ?>

			<div class="item-title"><a href="<?php the_permalink();?>" rel="bookmark"><?php the_title();?></a></div>			
			
			<?php //metas
				if($args['meta']):
					$meta = tst_related_item_meta($post);
					$sep = frl_get_sep();
					
					if(!empty($meta)):
			?>
			<div class="item-metadata"><?php echo implode($sep, $meta); ?></div>
			<?php endif; endif; ?>
	</li>
	<?php endwhile; wp_reset_postdata(); ?>
	</ul>
<?php
	elseif($args['not_found_msg']):
?>
	<p><?php _e('No related posts found.', 'tst');?></p>
<?php	
	endif;
}

/* define metas if needed */
function tst_related_item_meta($cpost) {
	
	$date = ($cpost->post_type == 'event') ? tst_event_date() : mysql2date('d.m.Y', $cpost->post_date);
	switch($cpost->post_type) {
		case 'event':
			$tax = 'eventcat';
			break;
		/*case 'project':
			$tax = 'prcat';
			break;
		case 'article':
			$tax = 'art_cat';
			break;*/
		default:
			$tax = 'category';
			break;
	}
	
	$cat = get_the_term_list(get_the_ID(), $tax, '<span class="category">', ', ', '</span>');
	
	$metas[] = $date;
	if(!empty($cat))
		$metas[] = $cat;
	
	return $metas;
}

/* template tag */


/* related widget */
class TST_Related_Widget extends WP_Widget {

	/** Widget setup */
	function __construct() {
        
		$widget_ops = array(
			'classname'   => 'widget_related',
			'description' => __('Related items selected by some taxonomy terms', 'tst')
		);
		$this->WP_Widget('widget_related', __('Related posts', 'tst'), $widget_ops);	
	}

	/** Display widget */
	function widget($args, $instance) {
		global $post;
		
		extract($args, EXTR_SKIP);
		
		$title = $instance['title'];	
		$limit = intval($instance['limit']);
			
		
		$title = apply_filters('widget_title', $title);
		
		echo $before_widget;
		if($title)
			echo $before_title.$title.$after_title;
			
		// markup here
		$args = array(
			'thumb' => $instance['thumb'],
			'meta' => $instance['meta'],
			'thumb_size' => $instance['thumb_size']
		);
		tst_related_posts_list($post, $instance['taxonomy'], $limit, $args);
		
		echo $after_widget;
		
	}
	
	
	function update($new_instance, $old_instance) {

		$instance = $old_instance;
		$instance['title']    = esc_attr($new_instance['title']);			
		$instance['limit']    = intval($new_instance['limit']);
		$instance['taxonomy'] = $new_instance['taxonomy'];
		$instance['thumb']    = $new_instance['thumb'];
		$instance['thumb_size'] = $new_instance['thumb_size'];
		$instance['meta']     = $new_instance['meta'];
		
		return $instance;
	}
	
	/** Widget setting */
	function form($instance) {

		/* Set up some default widget settings. */
		$defaults = array(
			'title' => '',			
			'limit' => 5,
			'taxonomy' => 'post_tag',
			'thumb' => true,
			'thumb_size' => '',
			'meta' => true,	
		);

		$instance = wp_parse_args((array)$instance, $defaults);
		
		$title = esc_attr($instance['title']);
		$limit = intval($instance['limit']);
		$taxonomy = $instance['taxonomy'];
		$thumb = $instance['thumb'];
		$thumb_size = $instance['thumb_size'];
		$meta = $instance['meta'];
		
		$taxes = get_taxonomies(array('public' => true), 'objects');
	?>			
		<p>
			<label for="<?php echo esc_attr($this->get_field_id('title')); ?>"><?php _e('Title', 'tst'); ?></label>
			<input class="widefat" id="<?php echo esc_attr($this->get_field_id('title')); ?>" name="<?php echo esc_attr($this->get_field_name('title')); ?>" type="text" value="<?php echo $title; ?>"/>
		</p>
		<p>
			<label for="<?php echo esc_attr($this->get_field_id('limit')); ?>"><?php _e('Num.', 'tst'); ?></label>
			<select class="widefat" name="<?php echo $this->get_field_name('limit'); ?>" id="<?php echo $this->get_field_id('limit'); ?>">
				<?php for ($i = 1; $i <= 20; $i++) { ?>
					<option <?php selected($limit, $i) ?> value="<?php echo $i; ?>"><?php echo $i; ?></option>
				<?php } ?>
			</select>
		</p>
		
		<p>
			<label for="<?php echo esc_attr($this->get_field_id('taxonomy'));?>"><?php _e('Choose the Taxonomy: ', 'tst');?></label>

			<select class="widefat" id="<?php echo $this->get_field_id('taxonomy');?>" name="<?php echo $this->get_field_name('taxonomy');?>">
			<option value="0"><?php _e('Select taxonomy', 'tst');?></option>
				<?php foreach ($taxes as $id => $tax):  ?>
					<option value="<?php echo esc_attr($id);?>" <?php selected($instance['taxonomy'], $id);?>><?php echo esc_html($tax->labels->name);?></option>
				<?php endforeach; ?>
			</select>
		</p>
		<p>
			<label for="<?php echo esc_attr($this->get_field_id('meta')); ?>"><?php _e('Display Metas?', 'tst'); ?></label>
			<input id="<?php echo $this->get_field_id('meta'); ?>" name="<?php echo $this->get_field_name('meta'); ?>" type="checkbox" value="1" <?php checked('1', $meta); ?> />&nbsp;
		</p>
		
		<?php if(current_theme_supports('post-thumbnails')) :?>

			<p>
				<label for="<?php echo esc_attr($this->get_field_id('thumb')); ?>"><?php _e('Display Thumbnail?', 'tst'); ?></label>
				<input id="<?php echo $this->get_field_id('thumb'); ?>" name="<?php echo $this->get_field_name('thumb'); ?>" type="checkbox" value="1" <?php checked('1', $thumb); ?> />&nbsp;
			</p>
			
			<p>
				<label for="<?php echo $this->get_field_id( 'thumb_size' ); ?>"><?php _e('Thumbnail size', 'tst'); ?>: </label>
				<input id="<?php echo $this->get_field_id( 'thumb_size' ); ?>" name="<?php echo $this->get_field_name( 'thumb_size' ); ?>" value="<?php echo $thumb_size; ?>" type="text" class="widefat"><br/>
				<small class="help"><?php _e('Specify thumbnail size. Leave blank to apply size defined by theme.', 'tst'); ?> </small>
			</p>

		<?php endif; ?>
	<?php
	}
	
	
} //class end