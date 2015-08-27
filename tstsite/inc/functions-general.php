<?php
/**
 * Common functions and manipulations
 * (code wiil be modevd here from customizer.php and extras.php)
 ***/

/** Customize RSS feed post types **/
add_filter('request', 'rss_feed_request');
function rss_feed_request($qv) {
	if(isset($qv['feed'])) {
		if(!isset($qv['post_type'])) {
			$qv['post_type'] = 'tasks';
		}
	}
	return $qv;
}

/** Only lat symbols in filenames **/
add_action('sanitize_file_name', 'itv_translit_sanitize', 0);
function itv_translit_sanitize($string) {
	$rtl_translit = array (
			"Є"=>"YE","І"=>"I","Ѓ"=>"G","і"=>"i","№"=>"","є"=>"ye","ѓ"=>"g",
			"А"=>"A","Б"=>"B","В"=>"V","Г"=>"G","Д"=>"D",
			"Е"=>"E","Ё"=>"YO","Ж"=>"ZH",
			"З"=>"Z","И"=>"I","Й"=>"J","К"=>"K","Л"=>"L",
			"М"=>"M","Н"=>"N","О"=>"O","П"=>"P","Р"=>"R",
			"С"=>"S","Т"=>"T","У"=>"U","Ф"=>"F","Х"=>"KH",
			"Ц"=>"TS","Ч"=>"CH","Ш"=>"SH","Щ"=>"SHH","Ъ"=>"'",
			"Ы"=>"Y","Ь"=>"","Э"=>"E","Ю"=>"YU","Я"=>"YA",
			"а"=>"a","б"=>"b","в"=>"v","г"=>"g","д"=>"d",
			"е"=>"e","ё"=>"yo","ж"=>"zh",
			"з"=>"z","и"=>"i","й"=>"j","к"=>"k","л"=>"l",
			"м"=>"m","н"=>"n","о"=>"o","п"=>"p","р"=>"r",
			"с"=>"s","т"=>"t","у"=>"u","ф"=>"f","х"=>"kh",
			"ц"=>"ts","ч"=>"ch","ш"=>"sh","щ"=>"shh","ъ"=>"",
			"ы"=>"y","ь"=>"","э"=>"e","ю"=>"yu","я"=>"ya","«"=>"","»"=>"","—"=>"-"
	);
	return strtr($string, $rtl_translit);
}

/** Favicon  **/
function itv_favicon(){
	
	$favicon_test = get_template_directory(). '/favicon.ico'; //in the root not working don't know why
    if(!file_exists($favicon_test))
        return;
        
    $favicon = get_template_directory_uri(). '/favicon.ico';
	echo "<link href='{$favicon}' rel='shortcut icon' type='image/x-icon' >";
}
add_action('wp_enqueue_scripts', 'itv_favicon', 1);
add_action('admin_enqueue_scripts', 'itv_favicon', 1);
add_action('login_enqueue_scripts', 'itv_favicon', 1);


/** Default filters  **/
add_filter( 'frl_the_content', 'wptexturize'        );
add_filter( 'frl_the_content', 'convert_smilies'    );
add_filter( 'frl_the_content', 'convert_chars'      );
add_filter( 'frl_the_content', 'wpautop'            );
add_filter( 'frl_the_content', 'shortcode_unautop'  );
add_filter( 'frl_the_content', 'do_shortcode' );


add_filter( 'frl_the_title', 'wptexturize'   );
add_filter( 'frl_the_title', 'convert_chars' );
add_filter( 'frl_the_title', 'trim'          );


/** Widgets **/
function tst_custom_widgets(){

	unregister_widget('WP_Widget_Pages');
	unregister_widget('WP_Widget_Archives');
	unregister_widget('WP_Widget_Calendar');
	unregister_widget('WP_Widget_Meta');
	unregister_widget('WP_Widget_Categories');
	unregister_widget('WP_Widget_Tag_Cloud');
	unregister_widget('FrmListEntries');

}
add_action('widgets_init', 'tst_custom_widgets', 11);


/** Query manipulations **/
 
/*  Custom query vars and rewrites */
add_action('init', 'tst_custom_query_vars');
function tst_custom_query_vars(){
	global $wp;
	
	$wp->add_query_var('navpage');
	
	//Pretty permalinks for tasks
	$wp->add_query_var('task_status');	
	
		
	add_rewrite_rule('^tasks/(publish|in_work|closed|archived)/page/([0-9]{1,})/?$', 'index.php?post_type=tasks&task_status=$matches[1]&navpage=$matches[2]', 'top');	
	add_rewrite_rule('^tasks/(publish|in_work|closed|archived)/?$', 'index.php?post_type=tasks&task_status=$matches[1]', 'top');
	
	
	//Pretty permalinks for members
	$wp->add_query_var('member_role');
	$wp->add_query_var('membername');
	
	add_rewrite_rule('^members/(donee|activist|hero|volunteer)/page/([0-9]{1,})/?$', 'index.php?pagename=members&member_role=$matches[1]&navpage=$matches[2]', 'top');
	add_rewrite_rule('^members/(donee|activist|hero|volunteer)/?$', 'index.php?pagename=members&member_role=$matches[1]', 'top');	
	add_rewrite_rule('^members/([^/]+)/?$', 'index.php?pagename=members&membername=$matches[1]', 'top');
	// [^/]+/([^/]+)/?$  pagename=members

}


/* Request customization */
add_action('parse_request', 'tst_request_corrections');
function tst_request_corrections(WP $request){
	
	if($request->request == 'tasks') {
		$redirect = get_post_type_archive_link('tasks');
		wp_redirect($redirect);
		exit;
	}
}


/* Query customization */
add_action('parse_query', 'tst_query_corrections');
function tst_query_corrections(WP_Query $query){
	
	if(is_admin() || !$query->is_main_query())
		return;
	
	if(isset($query->query_vars['pagename']) && $query->query_vars['pagename'] == 'login') {
		$redirect = home_url('registration');
		wp_redirect($redirect);
		exit;
		
	}
	elseif(is_tag() && !$query->get('post_type')) {
		$query->set('post_type', 'tasks');
		
	}
	elseif($query->get('task_status')){
		
		if($query->get('task_status') == 'all'){ //fix for archive
			$query->set('task_status', '');
		}
		else {
			$status = (in_array($query->get('task_status'), array('publish', 'in_work', 'closed', 'archived'))) ? $query->get('task_status') : 'publish';
			$query->set('post_status', $status);
		}
		
		if($query->get('navpage')){
			$query->set('paged', intval($query->get('navpage')));
		}
	}
		
}