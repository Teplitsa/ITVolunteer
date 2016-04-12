<?php
/**
 * Common functions and manipulations
 * (code wiil be modevd here from customizer.php and extras.php)
 ***/



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


/** Notification about KMS **/
add_filter('itv_notification_badge', 'itv_notification_badge_screen');
function itv_notification_badge_screen(){
	
	$content = apply_filters('itv_notification_badge_content', '');
	
	if(empty($content))
		return '';
	
	return "<span class='badge'>{$content}</span>";	
}

add_filter('itv_notification_bar', 'itv_notification_bar_screen');
function itv_notification_bar_screen(){
	
	$content = apply_filters('itv_notification_bar_content', '');
	if(empty($content))
		return '';
	
	if($request->request == 'tasks') {
		$redirect = get_post_type_archive_link('tasks');
		wp_redirect($redirect);
		exit;
	}
}


/* Query customization */
add_action('parse_query', 'tst_query_corrections');
function tst_query_corrections(WP_Query $query){
    return ITV_Query::get_instance()->query_corrections($query);
}

function itv_fill_template($template, $data) {
    return preg_replace_callback ( '/\{\{(\w+)\}\}/i', function($matches) use($data) {
        return isset($matches[1]) && isset($data[$matches[1]]) ? $data[$matches[1]] : '';
    }, $template );
}