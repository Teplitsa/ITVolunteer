<?php
/**
 * Homepage elements
 **/

/**
 * 3W blocks
 **/

function la_banner_format_home_textblock($query, $format_args) {
	global $post;
	
	//check for plugin
	if(!class_exists('La_Banner_Core'))
		return '';		
	
	ob_start();
	
	$counter = 1;
		
	while($query->have_posts()): $query->the_post();
		$url = esc_url($post->post_excerpt);
		
?>
		<div class="<?php echo esc_attr($format_args);?>">
		<article class="home-block block-<?php echo $counter;?>">			
			
			<h3><?php the_title();?></h3>
			<div class="block-content">
				<?php the_content();?>
				<div class="more-link"><a href="<?php echo $url?>" class="">Подробнее &raquo;</a></div>
			</div>
			
		</article>
		</div>
	<?php $counter++; endwhile; wp_reset_postdata(); ?>
    
	
<?php     
    $out = ob_get_contents();
    ob_end_clean();
    return $out;
}


/**
 * Call out
 **/

add_shortcode('tst_home_callout', 'tst_home_callout_screen');
function tst_home_callout_screen($atts, $content = null){
		
	extract(shortcode_atts(array(
		'button_link' => false,
		'button_text' => __('Participate', 'tst'),		
	), $atts, 'tst_home_callout' ));
	
	if(empty($content))
		return '';
	
	$content = apply_filters('frl_the_content', $content);
	$out = '<div class="callout-wrap"><div class="frame">';
	
	if($button_link){
		$out .= '<div class="bit-10">'.$content.'</div>';
		$out .= '<div class="bit-2"><a class="call btn" href="'.esc_url($button_link).'">'.$button_text.'</a></div>';
	}
	else {
		$out = '<div class="bit-12">'.$content.'</div>';
	}
	
	$out .= "</div></div>";	

	return $out;
}


/* extas sceletons */


/**
 * Adds custom classes to the array of body classes.
 */

add_filter('body_class', 'tst_body_classes');
function tst_body_classes( $classes ) {
	

	return $classes;
}



/**
 * Filters wp_title to print a neat <title> tag based on what is being viewed.
 * remove filter when Yoas SEO is active
 */

add_filter( 'wp_title', 'tst_wp_title', 10, 2 );
function tst_wp_title( $title, $sep ) {
	global $page, $paged;

	if ( is_feed() )
		return $title;

	// Add the blog name
	$title .= get_bloginfo( 'name' );

	// Add the blog description for the home/front page.
	$site_description = get_bloginfo( 'description', 'display' );
	if ( $site_description && ( is_home() || is_front_page() ) )
		$title .= " $sep $site_description";

	// Add a page number if necessary:
	if ( $paged >= 2 || $page >= 2 )
		$title .= " $sep " . sprintf('Стр. %s', max( $paged, $page ) );

	return $title;
}


/* menu filter sceleton */
//add_filter('wp_nav_menu_objects', 'frl_clear_menu_item_classes', 2, 2);
function frl_clear_menu_item_classes($items, $args){		
	global $sections;
	
	if(empty($items))
		return;	
	
	$tops = array(); 
	if($args->theme_location == 'primary' && empty($sections['labels'])){
		foreach($items as $index => $menu_item){
			//clear mess - remove everythind except any current mark
			
			if(!empty($menu_item->classes)){
				
				foreach($menu_item->classes as $i => $iclass){
					
					
				}
				
			}
			
		}		
		
	}
		
	return $items;
}



/**
 * Thumbnails &metas  filters sceletons
 **/
add_filter('lpg_thumbnail_size', 'tst_lpg_thumbnail_size');
function tst_lpg_thumbnail_size($size){
	
	return 'post-thumbnail'; 
}

add_filter('la_rpw_thumbnail_size', 'tst_la_rpw_thumbnail_size', 2, 3);
function tst_la_rpw_thumbnail_size($size,  $post, $instance){
	
	
	return $size; 
}

add_filter('la_rpw_post_meta', 'tst_la_rpw_post_meta', 2, 2);
function tst_la_rpw_post_meta($meta, $post) {
	
	if(!empty($meta)){
		$meta = tst_related_item_meta($post);
	}
	
	return $meta;
}

add_filter('la_rs_search_item_meta', 'tst_search_meta', 2, 2);
function tst_search_meta($meta, $post){
	
	return $meta;
	
}



if ( ! function_exists( 'tst_posted_on' ) ) :
/**
 * Prints HTML with meta information for the current post-date/time and author.
 */

function tst_posted_on() {
	
	$pt = get_post_type();
	
	if('event' == $pt){
		tst_event_undertitle_meta();
		return;
	}
	/*elseif('media' == $pt) {
		$cat = get_the_term_list(get_the_ID(), 'mediatype', '<span class="category">', ', ', '</span>');
	}*/
	else {
		$cat = get_the_term_list(get_the_ID(), 'category', '<span class="category">', ', ', '</span>');
	}
	
	$sep = frl_get_sep();
	
	if(!empty($cat))
		$cat = ' '.$sep.' '.$cat;
?>	
	<time class="entry-date" datetime="<?php echo esc_attr(get_the_date('c')); ?>"><?php echo esc_html( get_the_date() );?></time>
	<?php echo $cat;

}
endif;




function frl_dynamic_copyright($start_year, $name){
	
	$start = intval($start_year);
	if($start == 0 || empty($name))
		return;
		
	$end = date('Y', time());
	$copy = "&copy; $start";
	
	if($end != $start)
		$copy .= " - $end";
	
	$copy .= ". <strong>".$name."</strong>";
	
	return $copy;
}


/**
 * cycloneslider output
 **/
function frl_cycloneslider($slider_id) {
	
	if(function_exists('cyclone_slider'))
		cyclone_slider($slider_id); 	
}







/**
 * Annotation for post formats
 **/
 
function frl_single_split_content($post) {
	
	$parts = array();
	if(!empty($post->post_excerpt)){
		$parts['intro'] = $post->post_excerpt;
		$parts['content'] = $post->post_content;
		
	}
	else {
		$parts['intro'] = frl_trim_2_phrases($post->post_content);
		$parts['content'] = trim(str_replace($parts['intro'], '', $post->post_content));
	}
	
	return $parts;
}

function frl_trim_2_phrases($text){
		
	$sentences = preg_split('/(?<=[.?!])\s+(?=[a-я])/i', $text);
	if(empty($sentences) || count($sentences) < 2 )
		return $text;
	
	return $sentences[0].' '.$sentences[1];
}


/**
 * Plugins compatibility
 **/

/**
 * Compatibility with Members plugin to build correct caps list
 **/
add_filter( 'members_get_capabilities', 'frl_cabalilities_list' );
function frl_cabalilities_list($caps){
	
	$cpt_caps = frl_get_default_cpt_capabilities();
	$ct_caps = frl_get_default_tax_capabilities();
	
	$full = array_merge($cpt_caps, $ct_caps, $caps);
	
	
	return array_unique($full);
}

function frl_get_default_cpt_capabilities(){
		
	$caps = array();
	$post_types = get_post_types(array(), 'objects');
	
	if(empty($post_types))
		return;
	
	foreach($post_types as $post_type => $post_object){ 
		if($post_object->capability_type != 'post' && $post_object->capability_type != 'page'){
				
			
			if(!empty($post_object->cap)){ foreach($post_object->cap as $cap){
				
				$caps[] = $cap;
			}}
			
			sort($caps);
		}
	}
	
	return $caps;
}
	    
    
function frl_get_default_tax_capabilities(){
	
	
	$ct_caps = array();
	$taxes = get_taxonomies(array(), 'objects');
	if(empty($taxes))
		return $ct_caps;
	
	foreach($taxes as $tax_name => $tax_object){
		
		$tax_cap = $tax_object->cap;
		if(!empty($tax_cap)){ foreach($tax_cap as $cap) {			
			$ct_caps[] = $cap;
		}}
	}
	
	sort($ct_caps);
	return array_unique($ct_caps);
}




/**
 * No default thumbnails on pages
 **/
add_filter( 'dfi_thumbnail_html', 'tst_dfi_on_pages', 2, 3);
function tst_dfi_on_pages($html, $post_id, $default_thumbnail_id) {
	
	$pt = get_post_type($post_id); 
	if($pt != 'page' && $pt != 'leyka_campaign')
		return $html;
	
	$thumb_id = get_post_thumbnail_id($post_id); 
	if($thumb_id == $default_thumbnail_id)
		$html = '';
	
	return $html;
}


/**
 * Common shortcodes and widgets
 **/


//* attachments shortcodes */
add_shortcode('frl_better_attachments', 'frl_better_attachments_screen');
function frl_better_attachments_screen($atts){
	global $post;
	
	extract(shortcode_atts( array(
		'format' => 'download',
		'num' => -1
	), $atts ));
	
	if(!function_exists('wpba_get_attachments'))
		return '';
	
	$attachments = frl_get_attachments($post->ID, $num);
	
	if(empty($attachments))
		return '';
	
	$callback = 'frl_attachments_'.$format;
	if(is_callable($callback))
		$out = call_user_func($callback, $attachments);
		
	return "<div class='frl-batts'>{$out}</div>";
}

function frl_get_attachments($post_id, $num = -1){
	
	if($num == 0)
		$num = -1;
	
	$att = new WP_Query(array(
		'post_type' => 'attachment',
		'post_status' => 'inherit',
		'posts_per_page' => intval($num),
		'post_parent' => $post_id
	));
	
	return $att->posts;
}

function frl_attachments_image($attachments){
	
	$list = array();
	$gid = uniqid();
	
	foreach($attachments as $i => $att){
		$img = wp_get_attachment_image($att->ID, 'cover');
		$link = wp_get_attachment_url($att->ID);
		$title = apply_filters('the_title', $att->post_title);
		$title_attr = esc_attr($title);
		$desc = apply_filters('the_content', $att->post_excerpt);
		
		$list[$i] = "<article class='frl-batt image cf'>";
		$list[$i] .= "<div class='batt-preview'>";
		$list[$i] .= "<a data-fresco-group='{$gid}' href='{$link}' data-fresco-caption='{$title_attr}' rel='image-overlay' class='img-padder fresco'>{$img}</a></div>";
		$list[$i] .= "<div class='batt-data'><h4>{$title}</h4>{$desc}</div>";
		$list[$i] .= "</article>";		
	}
	
	return implode('', $list);
}

function frl_attachments_download($attachments){
	
	$list = array();
	$gid = uniqid();
	
	foreach($attachments as $i => $att){		
		$img = "<span class='dashicons dashicons-format-aside'></span>";
		$link = wp_get_attachment_url($att->ID);
		$title = apply_filters('the_title', $att->post_title);
		$title_attr = esc_attr($title);
		$desc = apply_filters('frl_the_content', $att->post_excerpt);
		
		$list[$i] = "<article class='frl-batt downlaod cf'>";
		$list[$i] .= "<div class='batt-preview'>{$img}</div>";
		$list[$i] .= "<div class='batt-data'>";
		$list[$i] .= "<h4>{$title}</h4>{$desc}";
		$list[$i] .= "<p class='download'><a href='{$link}' target='_blank'>Скачать &raquo;</a></p></div>";
		$list[$i] .= "</article>";		
	}
	
	return implode('', $list);
}


/**
 * Custom query shortcode
 **/
add_shortcode('frl_query', 'frl_query_screen');
function frl_query_screen($atts){
	global $wp_query;
	
	extract( shortcode_atts( array(
		'q' => '',
		'paging' => 0,
		'format' => 'content',
		'css' => ''
	), $atts ) );
	
	$q = str_replace('+', '&', $q);
		
	//on singlural pages page=2 qv detects paging
	if(isset($wp_query->query_vars['paged']) && $wp_query->query_vars['paged'] > 0)
		$q .= "&paged=".$wp_query->query_vars['paged'];
	elseif(isset($wp_query->query_vars['page']) && $wp_query->query_vars['page'] > 0)
		$q .= "&page=".$wp_query->query_vars['page']."&paged=".$wp_query->query_vars['page'];
	
	
	
	$query = new WP_Query($q);
	if(!$query->have_posts())
		return '';
	
	$out = "";
	
	ob_start();
	echo "<div class='query-loop cf'>";
	while($query->have_posts()): $query->the_post();
		get_template_part($format);
	endwhile; wp_reset_postdata();
	
	if($paging){
		echo "<div class='pagination'>";
		frl_paginate_links($query);
		echo "</div>";
	}
	
	echo "</div>";
	$out = ob_get_contents();
	ob_end_clean();
	
	$css = esc_attr($css);
	return  "<div class='frl-query {$css}'>{$out}</div>";
}


/* template sceletons */

/* posts formats */
//add_action('init', 'frl_post_formats', 100);
function frl_post_formats(){
	add_post_type_support( 'your_cpt', 'post-formats' );   
	register_taxonomy_for_object_type( 'post_format', 'your_cpt' );
}
 
/* CPT Filters */
//add_filter('request', 'frl_request_corrected');
function frl_request_corrected($query_vars) {
	
	if(isset($query_vars['audience']) && !empty($query_vars['audience']))
		$query_vars['post_type'] = array('post', 'work', 'article');
	
	if(isset($query_vars['tag']) && !empty($query_vars['tag']))
		$query_vars['post_type'] =  array('post', 'work', 'article');
		
	return $query_vars;
} 


/* Admin */
add_filter('manage_posts_columns', 'frl_common_columns_names', 50, 2);
function frl_common_columns_names($columns, $post_type) {
		
	if(!in_array($post_type, array('post', 'work', 'article', 'banner', 'attachment')))
		return $columns;
	
	$columns['id'] = 'ID';
	
	if($post_type != 'attachment')
		$columns['thumbnail'] = 'Миниат.';
		
	
	return $columns;
}

add_action('manage_posts_custom_column', 'frl_common_columns_content', 2, 2);
function frl_common_columns_content($column_name, $post_id) {
	
	if($column_name == 'id'){
		echo intval(get_post($post_id)->ID);
		
	} elseif($column_name == 'thumbnail') {
		$img = get_the_post_thumbnail($post_id, 'thumbnail');
		if(empty($img))
			echo "&ndash;";
		else
			echo "<div class='admin-tmb'>{$img}</div>";
	}
}

/* admin tax columns */
/*add_filter('manage_taxonomies_for_work_columns', function($taxonomies){
	$taxonomies[] = 'pr_type';
	$taxonomies[] = 'audience';
	
    return $taxonomies;
});*/

 
/* Custom conditions */
function is_about(){
	global $post;
	
	if(!is_page())
		return false;
	
	if(is_page('about'))
		return true;
	
	$parents = get_post_ancestors($post);
	$test = get_page_by_path('about');
	if(in_array($test->ID, $parents))
		return true;
	
	return false;
}

function is_page_branch($slug){
	global $post;
	
	if(empty($slug))
		return false;
	
		
	if(!is_page())
		return false;
	
	if(is_page($slug))
		return true;
	
	$parents = get_post_ancestors($post);
	$test = get_page_by_path($slug);
	if(in_array($test->ID, $parents))
		return true;
	
	return false;
}

function is_materials() {
	
	if(is_post_type_archive('article'))
		return true;
	
	if(is_tax('art_cat'))
		return true;
	
	if(is_singular('article'))
		return true;
	
	return false;
}

function is_tax_branch($slug, $tax) {
	global $post;
	
	$test = get_term_by('slug', $slug, $tax);
	if(empty($test))
		return false;
	
	if(is_tax($tax)){
		$qobj = get_queried_object();
		if($qobj->term_id == $test->term_id || $qobj->parent == $test->term_id)
			return true;
	}
	
	if(is_singular() && is_object_in_term($post->ID, $tax, $test->term_id))
		return true;
	
	return false;
}

function is_news() {
	
	if(is_home() || is_category())
		return true;
	
	if(is_singular('post'))
		return true;
	
	return false;
}

function is_events() {
	
	if(is_post_type_archive('event'))
		return true;
	
	if(is_tax('eventcat'))
		return true;
	
	if(is_singular('event'))
		return true;
	
	return false;
}