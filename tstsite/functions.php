<?php
@error_reporting(E_ALL & ~E_NOTICE);
require get_template_directory().'/inc/acf_keys.php';

/**
 * Blank functions and definitions
 *
 * @package Blank
 */
 
global $ITV_ADMIN_EMAILS, $ITV_CONSULT_EMAILS, $ITV_EMAIL_FROM, $ITV_TASK_COMLETE_NOTIF_EMAILS;
$ITV_ADMIN_EMAILS = array('support@te-st.ru', 'suvorov@te-st.ru', 'denis.cherniatev@gmail.com');
$ITV_TASK_COMLETE_NOTIF_EMAILS = array('vlad@te-st.ru', 'suvorov@te-st.ru', 'denis.cherniatev@gmail.com');
$ITV_CONSULT_EMAILS = array('anna.ladoshkina@te-st.ru', 'denis.cherniatev@gmail.com');
$ITV_EMAIL_FROM = 'info@itv.te-st.ru';
$ITV_TASK_STATUSES_ORDER = Array('publish', 'in_work', 'closed', 'future', 'draft', 'pending', 'private', 'trash', 'auto-draft', 'inherit');

/**
 * Initials
 **/
if(!isset($content_width))
	$content_width = 640; /* pixels */

if(empty($tst_main_w)) { //setting of main content wrappers
	
	$tst_nav_w = 0;
	$tst_main_w = 8;
	$tst_side_w = 4;
}

define('ACCOUNT_DELETED_ID', 30); // ID of "account-deleted" special service user
$email_templates = array();

if ( ! function_exists( 'tst_setup' ) ) :
function tst_setup() {

	/**
	 * Make theme available for translation
	 * Translations can be filed in the /languages/ directory
	 * If you're building a theme based on Blank, use a find and replace
	 * to change 'blank' to the name of your theme in all the template files
	 */
	load_theme_textdomain( 'tst', get_template_directory() . '/lang' );
	
	#	can't find translation if load earlier
	global $email_templates;
	include(get_template_directory().'/inc/email-templates.php');	

	//add_theme_support( 'automatic-feed-links' );

	/**
	 * Images
	 **/
	add_theme_support( 'post-thumbnails' );
	
	/* image sizes */
	set_post_thumbnail_size(390, 244, true ); // regular thumbnails
	add_image_size('logo', 220, 140, true ); // logo thumbnail 
	//add_image_size('poster', 220, 295, true ); // poster in widget	
	add_image_size('embed', 640, 400, true ); // fixed size for embending
	add_image_size('long', 640, 280, true ); // long thumbnail for pages
	add_image_size('avatar', 180, 180, array( 'center', 'center' ) );
	
	/**
	 * This theme uses wp_nav_menu() in one location.
	 */
	register_nav_menus( array(
		'primary'   => 'Главное меню',
		'auxiliary' => 'Вспомогательное меню',		
		'social'    => 'Социальные кнопки'
	));

	
}
endif; // blank_setup
add_action( 'after_setup_theme', 'tst_setup' );


/**
 * Register widgetized area and update sidebar with default widgets
 */
function tst_widgets_init() {
	
	$config = array(
		'tasks' => array(
						'name' => 'Задача: Боковая колонка',
						'description' => 'Боковая колонка на страницах задач'
					),
		'page' => array(
						'name' => 'Страница: Боковая колонка',
						'description' => 'Боковая колонка на статичных страницах'
					),
		'member' => array(
						'name' => 'Участник: Боковая колонка',
						'description' => 'Боковая колонка на страницах участников'
					),				
		'footer_one' => array(
						'name' => 'Футер - 1/3',
						'description' => 'Динамическая нижняя область - 1 колонка'
					),
		'footer_two' => array(
						'name' => 'Футер - 2/3',
						'description' => 'Динамическая нижняя область - 2 колонка'
					),
		/*'footer_three' => array(
						'name' => 'Футер - 3/3',
						'description' => 'Динамическая нижняя область - 3 колонка'
					),
		'home_one' => array(
						'name' => 'Главная - 1/3',
						'description' => 'Динамическая нижняя область - 1 колонка'
					),
		'home_two' => array(
						'name' => 'Главная - 2/3',
						'description' => 'Динамическая нижняя область - 2 колонка'
					),
		'home_three' => array(
						'name' => 'Главная - 3/3',
						'description' => 'Динамическая нижняя область - 3 колонка'
					)	*/
	);
		
	
	foreach($config as $id => $sb) {
		
		$before = '<div id="%1$s" class="widget %2$s">';
		
		if(false !== strpos($id, 'footer')){
			$before = '<div id="%1$s" class="widget %2$s bottom">';
			
		}
		elseif(false !== strpos($id, 'header')) {
			$before = '<div id="%1$s" class="header-block">';
		}
		
		register_sidebar(array(
			'name' => $sb['name'],
			'id' => $id.'-sidebar',
			'description' => $sb['description'],
			'before_widget' => $before,
			'after_widget' => '</div>',
			'before_title' => '<h5 class="widget-title">',
			'after_title' => '</h5>',
		));
	}
}
add_action('widgets_init', 'tst_widgets_init');


/**
 * Enqueue scripts and styles
 */
add_action('wp_enqueue_scripts', function(){

    $url = get_template_directory_uri();

   // wp_enqueue_style('gfonts', 'http://fonts.googleapis.com/css?family=Open+Sans|PT+Serif&subset=latin,cyrillic', array());
    wp_enqueue_style('bootstrap', $url.'/css/bootstrap.min.css', array());
	wp_enqueue_style('jquery-style', 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.2/themes/smoothness/jquery-ui.css');
	wp_enqueue_style('chosen', $url.'/css/chosen.css', array());
    wp_enqueue_style('front', $url.'/css/front.css', array(), '1.8');
	wp_enqueue_style('fixes', $url.'/css/fixes.css', array('front'), '1.8');


    wp_enqueue_script('jquery-ui-datepicker');
    if(get_locale() == 'ru_RU')
        wp_enqueue_script('jquery-ui-datepicker-ru', $url.'/js/jquery.ui.datepicker-ru.js', array('jquery-ui-datepicker'), '1.0', true);

    wp_enqueue_script('jquery-ui-tabs');
    wp_enqueue_script('jquery-chosen', $url.'/js/chosen.min.js', array('jquery'), '1.0', true);
	wp_enqueue_script('bootstrap', $url.'/js/bootstrap.min.js', array('jquery'), '1.0', true);
	wp_enqueue_script('jquery-masonry ');
    wp_enqueue_script('ajaxupload', $url.'/js/ajaxupload-v1.2.js', array('jquery'), '1.0', true);
    wp_enqueue_script('front', $url.'/js/front.js', array('jquery', 'bootstrap', 'jquery-ui-datepicker', 'jquery-chosen', 'jquery-masonry'), '1.41', true);

    wp_localize_script('front', 'frontend', array(
        'ajaxurl' => admin_url('admin-ajax.php'),
        'site_url' => site_url('/'),
        'chosen_no_results_text' => __('No such tags found...', 'tst'),
        'user_login_too_short' => __('User login must have 4 or more symbols.', 'tst'),
        'user_login_incorrect' => __('User login contains incorrect symbols.', 'tst'),
        'user_email_empty' => __('Email is required.', 'tst'),
        'user_email_incorrect' => __('Email is incorrect.', 'tst'),
        'passes_are_inequal' => __('Passwords are inconsistent.', 'tst'),
        'user_pass_empty' => __('Password is required.', 'tst'),
        'first_name_too_short' => __('First name must be at least 3 symbols long.', 'tst'),
        'last_name_too_short' => __('Last name must be at least 3 symbols long.', 'tst'),
        'task_delete_confirm' => __('This task will be deleted. Are you sure?', 'tst'),
        'profile_delete_confirm' => __('Your profile will be deleted. Are you sure?', 'tst'),
        'task_title_is_required' => __('Please, set a title for the task.', 'tst'),
        'deadline_is_required' => __('Please, set a deadline date for the task.', 'tst'),
        'task_descr_is_required' => __('Please, set a small description for the task.', 'tst'),
        'expecting_is_required' => __('Please, give a few words about what you are expecting from a task doer.', 'tst'),
        'about_reward_is_required' => __('Please, note a few words about a reward that you are willing to give for a task.', 'tst'),
        'about_author_org_is_required' => __('Please, tell something about your project, initiative or an organization.', 'tst'),
        'some_tags_are_required' => __('Please, set at least one thematic tag for your task.', 'tst'),
        'reward_is_required' => __('Please, select your reward for a task doer.', 'tst'),
        'contactor_name_empty' => __('Your name is required.', 'tst'),
        'contactor_message_empty' => __('Your message is required.', 'tst'),
        'user_company_logo_upload_error' => __('Company logo upload failed', 'tst'),
        'user_company_logo_delete_error' => __('Company logo delete failed', 'tst'),
        'user_avatar_upload_error' => __('Avatar upload failed', 'tst'),
        'user_avatar_delete_error' => __('Avatar delete failed', 'tst'),
//        '' => __('.', 'tst'),
    ));

	//comments
	if(is_singular('tasks') && get_option('thread_comments')) {
		wp_enqueue_script('comment-reply');
	}
});

add_action('admin_enqueue_scripts', function(){

    $url = get_template_directory_uri();

    wp_enqueue_style('tst-admin', $url.'/css/admin.css', array());
    wp_enqueue_script('tst-admin', $url.'/js/admin.js', array('jquery'));
    
    wp_localize_script('tst-admin', 'adminend', array(
		'ajaxurl' => admin_url('admin-ajax.php'),
		'site_url' => site_url('/'),
	));    

	
});

/* login style */
add_action('login_enqueue_scripts', function(){

    $url = get_template_directory_uri();
    wp_enqueue_style('tst-login', $url.'/css/login.css', array());

});




/**
 * Lock Administration Screens for user 
 */
function wp_admin_block() {
	if(strstr(@$_SERVER['PHP_SELF'], '/wp-admin/profile.php') === false) {
		if (!current_user_can('administrator')) { 
			wp_redirect( home_url() );
			exit();
		}
	}	
	else {
		if(is_user_logged_in()) {
			if (!current_user_can('administrator')) {
				$current_user = wp_get_current_user();
				wp_redirect( site_url('/members/' . $current_user->user_login . '/'));
				exit();
			}
		}
		else {
			wp_redirect( site_url('/') );
			exit();
		}
	}
}
add_action('admin_menu', 'wp_admin_block');
/**
 * Custom additions.
 */
if(is_admin()) {
    require get_template_directory().'/inc/admin.php';
}
require get_template_directory().'/inc/customizer.php';
require get_template_directory().'/inc/template-tags.php';
require get_template_directory().'/inc/extras.php';
require get_template_directory().'/inc/related.php';
require get_template_directory().'/inc/home.php';
require get_template_directory().'/inc/user_profile.php';
require get_template_directory().'/inc/post-types.php';
require get_template_directory().'/inc/notifications.php';
require get_template_directory().'/inc/itv_log.php';
require get_template_directory().'/inc/itv_reviews.php';
