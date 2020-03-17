<?php
define('TST_WORKING_VERSION', '1.9.101');
//require get_template_directory().'/inc/acf_keys.php';

/**
 * Blank functions and definitions
 *
 * @package Blank
 */
 
/**
 * Initials
 **/
if(!isset($content_width))
	$content_width = 640; /* pixels */


define('ACCOUNT_DELETED_ID', 30); // ID of "account-deleted" special service user
define('ITV_FRONTEND_VERSION', '1.0.3');

function tst_get_version_num(){
	
	if(false !== strpos(site_url(), 'testplugins.ngo2.ru')){
		//on dev force random number to avoid cache problems
		$num = rand();
	}
	elseif(false !== strpos(site_url(), 'multisite')){
		//on dev force random number to avoid cache problems
		$num = rand();
	}
	else {
		$num = (defined('TST_WORKING_VERSION')) ? TST_WORKING_VERSION : '1.0';
	}
	
	return $num;
}

function itv_is_spa() {
    return is_singular('tasks');
}

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
	include(get_template_directory().'/inc/itv_email_templates.php');	



	/**
	 * Images
	 **/
	add_theme_support( 'post-thumbnails' );
	
	/* image sizes */
	set_post_thumbnail_size(390, 244, true ); // regular thumbnails
	add_image_size('logo', 220, 140, true ); // logo thumbnail
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
						'name' => 'Футер - 1',
						'description' => 'Динамическая нижняя область - 1 колонка'
					),
		'footer_two' => array(
						'name' => 'Футер - 2',
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
 * Lock Administration Screens for user 
 */
function wp_admin_block() {
	$php_self = isset($_SERVER['PHP_SELF']) ? $_SERVER['PHP_SELF'] : '';
	if(strstr($php_self, '/wp-admin/profile.php') === false) {
		if (!current_user_can('administrator')) { 
			wp_redirect( home_url() );
			exit;
		}
	}	
	else {
		if(is_user_logged_in()) {
			if (!current_user_can('administrator')) {
				$current_user = wp_get_current_user();
				wp_redirect( site_url('/members/' . $current_user->user_login . '/'));
				exit;
			}
		}
		else {
			wp_redirect( site_url('/') );
			exit;
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

//refactor config into config class with all related items inside
require get_template_directory().'/itv_config.php';

//classes
require get_template_directory().'/inc/class-itv-cssjs.php';
require get_template_directory().'/inc/class-itv-query.php';

//templates and funcitons
require get_template_directory().'/inc/template-general.php';
require get_template_directory().'/inc/functions-general.php';
require get_template_directory().'/inc/template-tasks.php';
require get_template_directory().'/inc/template-members.php';
require get_template_directory().'/inc/functions-members.php';
require get_template_directory().'/inc/functions-tasks.php';

//compot
require get_template_directory().'/inc/customizer.php';
//require get_template_directory().'/inc/extras.php';
require get_template_directory().'/inc/user_profile.php';
require get_template_directory().'/inc/post-types.php';

require_once get_template_directory().'/inc/itv_log.php';
require_once get_template_directory().'/inc/itv_site_stats.php';
require_once get_template_directory().'/inc/itv_reviews.php';
require_once get_template_directory().'/inc/stats-events.php';
require_once get_template_directory().'/inc/itv_notificator.php';
require_once get_template_directory().'/inc/itv_tasks_stats.php';
require_once get_template_directory().'/inc/itv_consult.php';

// ipgeo lib and wrapper
require_once get_template_directory().'/ipgeo/ipgeobase.php';
require_once get_template_directory().'/inc/itv_ipgeo.php';

require_once get_template_directory() . '/vendor/autoload.php';
require_once get_template_directory() . '/inc/models/UserXPModel.php';
require_once get_template_directory() . '/inc/models/ThankyouModel.php';
require_once get_template_directory() . '/inc/models/MailSendLogModel.php';
require_once get_template_directory() . '/inc/models/ResultScreenshots.php';
require_once get_template_directory() . '/inc/models/UserBlockModel.php';

// grapql
require get_template_directory().'/graphql/graphql.php';