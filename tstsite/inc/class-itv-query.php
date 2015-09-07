<?php
/**
 * Query manipulation
 **/

class ITV_Query {
	
	private static $_instance = null;
	private $posts = null;	
	private $post_meta = null;
	
	
	private function __construct() {
		
		add_action('init', array($this, 'custom_query_vars'));
		add_action('parse_request', array($this, 'request_corrections'));
		add_action('parse_query', array($this, 'query_corrections'));
		//add_filter('request',  array($this, 'rss_feed_request'));
		
		add_filter('the_posts', array($this, 'query_posts_adder'), 2,2);
		
		//self::options_cache();		
	}
	
	public static function get_instance() {

        // If the single instance hasn't been set, set it now.
        if( !self::$_instance ) {
            self::$_instance = new self;
        }
		
        return self::$_instance;
    }
	
	
	/** Custom qv and permalinks **/
	public function custom_query_vars(){
		global $wp;
		
		//additional data in query
		$wp->add_query_var('set_users');
		
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
	function request_corrections(WP $request){
		
		if($request->request == 'tasks') {
			$redirect = get_post_type_archive_link('tasks');
			wp_redirect($redirect);
			exit;
		}
	}
	
	
	/* WP_Query modificatinos */
	function query_corrections(WP_Query $query){
		
		if(is_admin() || !$query->is_main_query())
			return;
		
		
		if(is_feed() && !$query->get('post_type')){
			$query->set('post_type', 'tasks'); //tasks in feed by default
		}
		
		if(is_archive())
			$query->set('author__not_in', array(ACCOUNT_DELETED_ID)); //don't include content of deleted users
		
		if(isset($query->query_vars['pagename']) && $query->query_vars['pagename'] == 'login') {
			$redirect = home_url('registration'); //redirect old login page
			wp_redirect($redirect);
			exit;
			
		}
		elseif(is_tag() && !$query->get('post_type')) {
			$query->set('post_type', 'tasks'); //tasks post type in tags page
			
		}
		elseif($query->get('task_status')){ //by status archives for tasks
			
			if($query->get('task_status') == 'all'){ //fix for archive
				$query->set('task_status', '');
			}
			else {
				$status = (in_array($query->get('task_status'), array('publish', 'in_work', 'closed', 'archived'))) ? $query->get('task_status') : 'publish';
				$query->set('post_status', $status);
				$query->set('set_users', 'yes');
			}
			
			if($query->get('navpage')){
				$query->set('paged', intval($query->get('navpage')));
			}
		}
		
	}
	
	
	/* Cache additional posts info by request */
	function query_posts_adder($posts, &$query){
						
		if('yes' == $query->get('set_users')){
			$ids = self::get_user_id_from_posts($posts);
			
			update_meta_cache('user', $ids); //meta cache
			$uquery = new WP_User_Query(array(
				'include' => $ids,
				'fields' => 'all_with_meta' //cache users
			)); 
		}
		
		return $posts;
	}
	
	
	/** Fetch data */
	public static function get_post_id_from_posts($posts){
		
		$ids = array();
		if(!empty($posts)){ foreach($posts as $p) {
			$ids[] = $p->ID;
		}}
		
		return $ids;
	}
	
	public static function get_user_id_from_posts($posts){
		
		$ids = array();
		if(!empty($posts)){ foreach($posts as $p) {
			$ids[] = $p->post_author;
		}}
		
		return $ids;
	}
	
	public static function get_user_id_from_users($users){
		
		$ids = array();
		if(!empty($users)){ foreach($users as $u) {
			$ids[] = $u->ID;
		}}
		
		return $ids;
	}
	
	
	/** Options cache - too late to call it here, (may be) will be moved into mu-plugins */
	public static function options_cache(){
		global $wpdb;
		
		$opts_key = array(
			'post_views_counter_settings_general',
			'post_views_counter_settings_display',
			'subscribe_reloaded_show_subscription_box',
			'subscribe_reloaded_manager_page'
		);
		
		$opts_key = "'".implode("','", $opts_key)."'";
		$opts = $wpdb->get_results("SELECT option_name, option_value FROM $wpdb->options WHERE option_name IN ($opts_key)", OBJECT_K);
		
		
		if(empty($opts))
			return;
		
		foreach($opts as $option => $object){
			$value = $object->option_value; 
			wp_cache_set( $option, $value, 'options' );
		}
	}
	
	
} // class

ITV_Query::get_instance();
