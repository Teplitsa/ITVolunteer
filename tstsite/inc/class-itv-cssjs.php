<?php
/**
 * Class for general ITV tasks and configurations
 **/
use ITV\models\UserXPModel;

class ITV_CssJs {
	
	private static $_instance = null;	
	private $manifest = null;
	
	private function __construct() {
		
		
		add_action('wp_enqueue_scripts', array($this, 'load_styles'), 30);
		add_action('wp_enqueue_scripts', array($this, 'load_scripts'), 30);
		add_action('init', array($this, 'disable_wp_emojicons'));
		
		add_action('admin_enqueue_scripts',  array($this, 'load_admin_scripts'), 30);
		add_action('login_enqueue_scripts',  array($this, 'load_login_scripts'), 30);
	}
	
	public static function get_instance() {

        // If the single instance hasn't been set, set it now.
        if( !self::$_instance ) {
            self::$_instance = new self;
        }
		
        return self::$_instance;
    }
	
	/** revisions **/
	private function get_manifest() {
		
		if(null === $this->manifest) {
			$manifest_path = get_template_directory().'/assets/rev/rev-manifest.json';

			if (file_exists($manifest_path)) {
				$this->manifest = json_decode(file_get_contents($manifest_path), TRUE);
			} else {
				$this->manifest = [];
			}
		}
		
		return $this->manifest;
	}
	
	
	public function get_rev_filename($filename) {
		
		$manifest = $this->get_manifest();
		if (array_key_exists($filename, $manifest)) {
			return $manifest[$filename];
		}
	
		return $filename;
	}
	
	/* load css */
	function load_styles() {
		
		$url = get_template_directory_uri();
		wp_enqueue_style('front', $url.'/assets/rev/'.$this->get_rev_filename('bundle.css'), array(), null);	
	}
	
	/** Critical CSS should be build manually - after that we can use loadCSS */
	function print_critical_loader() {
	?>
	<style>
		body {
			background-color: #e6e6e6;
			font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
			color: #333;
			font-size: 14px;
		}
		a { color: #0095c7; }
	</style>
	<?php
	}
	
	/* front */
	public function load_scripts() {
		
		$url = get_template_directory_uri();
        $user = wp_get_current_user(); 
		
		wp_dequeue_style('dashicons');
		wp_dequeue_style('post-views-counter-frontend');
				
		wp_enqueue_script('front', $url.'/assets/rev/'.$this->get_rev_filename('bundle.js'), array(), null, true);

		wp_localize_script('front', 'frontend', array(
			'ajaxurl'                        => admin_url('admin-ajax.php'),
			'site_url'                       => site_url('/'),
			'chosen_no_results_text'         => __('No such tags found...', 'tst'),
			'user_login_too_short'           => __('User login must have 4 or more symbols.', 'tst'),
			'user_login_incorrect'           => __('User login contains incorrect symbols.', 'tst'),
			'user_email_empty'               => __('Email is required.', 'tst'),
			'user_email_incorrect'           => __('Email is incorrect.', 'tst'),
			'passes_are_inequal'             => __('Passwords are inconsistent.', 'tst'),
			'user_pass_empty'                => __('Password is required.', 'tst'),
			'first_name_too_short'           => __('First name must be at least 3 symbols long.', 'tst'),
			'last_name_too_short'            => __('Last name must be at least 3 symbols long.', 'tst'),
			'task_delete_confirm'            => __('This task will be deleted. Are you sure?', 'tst'),
			'profile_delete_confirm'         => __('Your profile will be deleted. Are you sure?', 'tst'),
			'task_title_is_required'         => __('Please, set a title for the task.', 'tst'),
			'deadline_is_required'           => __('Please, set a deadline date for the task.', 'tst'),
			'task_descr_is_required'         => __('Please, set a small description for the task.', 'tst'),
			'about_reward_is_required'       => __('Please, note a few words about a reward that you are willing to give for a task.', 'tst'),
			'about_author_org_is_required'   => __('Please, tell something about your project, initiative or an organization.', 'tst'),
			'some_tags_are_required'         => __('Please, set at least one thematic tag for your task.', 'tst'),
			'reward_is_required'             => __('Please, select your reward for a task doer.', 'tst'),
			'contactor_name_empty'           => __('Your name is required.', 'tst'),
			'contactor_message_empty'        => __('Your message is required.', 'tst'),
			'user_company_logo_upload_error' => __('Company logo upload failed', 'tst'),
			'user_company_logo_delete_error' => __('Company logo delete failed', 'tst'),
			'user_avatar_upload_error'       => __('Avatar upload failed', 'tst'),
			'user_avatar_delete_error'       => __('Avatar delete failed', 'tst'),
			'check_agree_data_process_checkbox' => __('Please check agree process data checkbox', 'tst'),
			'xp_cookie_name'                 => UserXPModel::instance()->get_xp_alert_cookie_name(get_current_user_id()),
			'xp_actions'                     => UserXPModel::instance()->get_xp_alert_strings_json(),
			'error'                          => __('Error!', 'tst'),
			'res_screen_delete_error'        => __('Delete screenshot error!', 'tst'),
			'user_company_logo_upload_error' => __('Upload screenshot error!', 'tst'),
			'sure_delete_screen'             => __('Are you sure?', 'tst'),
			'screens_limit_exceeded'         => __('Too much screenshots loaded!', 'tst'),
			'you_said_thankyou'              => __('You said thankyou!', 'tst'),
            'user_full_name'                 => $user ? $user->first_name.($user->last_name ? ' '.$user->last_name : '') : '',
            'user_email'                     => $user ? $user->user_email : '',
			//        '' => __('.', 'tst'),
		));
		
		wp_localize_script('front', 'ga_events', itv_get_ga_events());
	
		//comments
		if(is_singular('tasks') && get_option('thread_comments')) {
			wp_enqueue_script('comment-reply');
		}
		
	}
	
	/** disable emojji **/
	public function disable_wp_emojicons() {
	
		// all actions related to emojis
		remove_action( 'admin_print_styles', 'print_emoji_styles' );
		remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
		remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
		remove_action( 'wp_print_styles', 'print_emoji_styles' );
		remove_filter( 'wp_mail', 'wp_staticize_emoji_for_email' );
		remove_filter( 'the_content_feed', 'wp_staticize_emoji' );
		remove_filter( 'comment_text_rss', 'wp_staticize_emoji' );
	
	}
	
	/* admin styles - moved to news system also */
	public function load_admin_scripts() {
		
		$url = get_template_directory_uri();
		$version = tst_get_version_num();
	
	    wp_enqueue_script('jquery');
	    wp_enqueue_script('suggest');
		wp_enqueue_style('tst-admin', $url.'/assets/css/admin.css', array(), $version);
		wp_enqueue_script('tst-admin', $url.'/assets/js/admin.js', array('jquery'), $version);
		
		wp_enqueue_style('tst-admin-datetimepicker', $url.'/assets/css/jquery.datetimepicker.min.css', array(), null);
		wp_enqueue_script('tst-admin-datetimepicker', $url.'/assets/js/jquery.datetimepicker.min.js', array(), null, true);
		
		$itv_config = ItvConfig::instance();
		$reactivation_emails_portion = $itv_config->get('BULK_ACTIVATION_EMAIL_SEND_LIMIT');
		
		wp_localize_script('tst-admin', 'adminend', array(
			'ajaxurl' => admin_url('admin-ajax.php'),
			'site_url' => site_url('/'),
			'common_ajax_error' => __('Error!'),
			'no_expired_activation_users' => __('No expired activation users', 'tst'),
			'bulk_resend_activation_email_button' => sprintf(__('Resend activation email next %s (remains %s)', 'tst'), '{portion}', '{count}'),
			'reactivation_emails_portion' => $reactivation_emails_portion,
			'empty_xp_inc_val_error' => __('Enter numeric user xp inc value', 'tst'),
		));   

	}
	
	/* login style - make it inline ? */
	public function load_login_scripts(){
	
	?>
		<style>
			#login h1 {display: none !important;}
			#nav {display: none !important;}
		</style>
	<?php
	}
	
	
} //class

ITV_CssJs::get_instance();
