<?php
class ItvSiteStats {
	public static $USERS_ROLE_BENEFICIARY = 'common_stats_users_beneficiary_count';
	public static $USERS_ROLE_SUPERHERO = 'common_stats_users_superhero_count';
	public static $USERS_ROLE_ACTIVIST = 'common_stats_users_activist_count';
	public static $USERS_ROLE_VOLUNTEER = 'common_stats_users_volunteer_count';
	public static $USERS_TOTAL = 'common_stats_users_count';
	
	public static $ITV_TOTAL_USERS_COUNT = null;
	public static $ITV_TASKS_COUNT_CLOSED = null;
	public static $ITV_TASKS_COUNT_WORK = null;
	public static $ITV_TASKS_COUNT_NEW = null;
	public static $ITV_TASKS_COUNT_ARCHIVED = null;
	public static $ITV_TASKS_COUNT_ALL = null;
	
	private static $_instance = NULL;
	
	
	private function __construct() {
		
		add_action('wp_head', 'ItvSiteStats::perform_calculations');		
	}
	
	
	public static function instance() {
		if(ItvSiteStats::$_instance == NULL) {
			ItvSiteStats::$_instance = new ItvSiteStats();
		}
		return ItvSiteStats::$_instance;
	}
	
	public function get_stats_value($key) {
		$value = get_option($key);
		return $value ? $value : 0;
	}
	
	public function refresh_users_role_stats($per_page = 100) {
	    global $wpdb;
		
		$USERS_ROLE_BENEFICIARY_COUNT = 0;
		$USERS_ROLE_SUPERHERO_COUNT = 0;
		$USERS_ROLE_ACTIVIST_COUNT = 0;
		$USERS_ROLE_VOLUNTEER_COUNT = 0;
		$USERS_COUNT = 0;
			
		$offset = 0;
		$is_stop = false;
		while(!$is_stop) {
			echo 'offset=' . $offset . "\n";
			
			$users_query_params = array(
			    'query_id' => 'itv_count_main_users_stats',
				'number' => $per_page,
				'offset' => $offset,
				'exclude' => ACCOUNT_DELETED_ID,
				'orderby' => 'user_registered',
				'order' => 'ASC'
			);
			
			$start001 = microtime(true);
			$user_query = new WP_User_Query($users_query_params);
			echo "get users portion: ".(microtime(true) - $start001) . " sec.\n";
			
			$users_count_portion = 0;
					
			$start002 = microtime(true);
			foreach($user_query->results as $user) {
				$is_count = true;
										
				if($is_count) {
					
				    $start001 = microtime(true);
				    tst_update_member_stat($user);
				    echo "tst_update_member_stat: ".(microtime(true) - $start001) . " sec.\n";
				    
				    $start001 = microtime(true);
				    $user_role = tst_get_member_role_key($user);
				    echo "tst_get_member_role_key: ".(microtime(true) - $start001) . " sec.\n";
				    
					if($user_role == 'donee') {
						$USERS_ROLE_BENEFICIARY_COUNT += 1;
					}
					elseif($user_role == 'hero') {
						$USERS_ROLE_SUPERHERO_COUNT += 1;
					}
					elseif($user_role == 'activist') {
						$USERS_ROLE_ACTIVIST_COUNT += 1;
					}
					elseif($user_role == 'volunteer') {
						$USERS_ROLE_VOLUNTEER_COUNT += 1;
					}
					else {
						$USERS_COUNT +=1;
					}
				}
				
				$users_count_portion += 1;
			}
			echo "process users portion: ".(microtime(true) - $start002) . " sec.\n";
			
			if($users_count_portion < $per_page) {
				$is_stop = true;
			}
			
			$offset += $per_page;
		}
		
		
		$USERS_COUNT += ($USERS_ROLE_BENEFICIARY_COUNT+$USERS_ROLE_SUPERHERO_COUNT+$USERS_ROLE_ACTIVIST_COUNT+$USERS_ROLE_VOLUNTEER_COUNT);
		
		update_option(ItvSiteStats::$USERS_ROLE_BENEFICIARY, $USERS_ROLE_BENEFICIARY_COUNT);
		update_option(ItvSiteStats::$USERS_ROLE_SUPERHERO, $USERS_ROLE_SUPERHERO_COUNT);
		update_option(ItvSiteStats::$USERS_ROLE_ACTIVIST, $USERS_ROLE_ACTIVIST_COUNT);
		update_option(ItvSiteStats::$USERS_ROLE_VOLUNTEER, $USERS_ROLE_VOLUNTEER_COUNT);
		update_option(ItvSiteStats::$USERS_TOTAL, $USERS_COUNT);
	}
	
	
	/** Common calculations on all pages **/
	public static function perform_calculations(){
		global $wpdb;
		
		$calc = $wpdb->get_results("SELECT post_status, COUNT(ID) as num FROM $wpdb->posts WHERE post_type = 'tasks' AND post_status IN ('publish', 'in_work', 'closed', 'archived') GROUP BY post_status", OBJECT_K);
		
		if(empty($calc))
			return;
		
		$total = 0; 
		if(isset($calc['publish'])){
			self::$ITV_TASKS_COUNT_NEW = (int)$calc['publish']->num;
			$total += (int)$calc['publish']->num;
		}
		if(isset($calc['in_work'])){
			self::$ITV_TASKS_COUNT_WORK = (int)$calc['in_work']->num;
			$total += (int)$calc['in_work']->num;
		}
		if(isset($calc['closed'])){
			self::$ITV_TASKS_COUNT_CLOSED = (int)$calc['closed']->num;
			$total += (int)$calc['closed']->num;
		}
		if(isset($calc['archived'])){
			self::$ITV_TASKS_COUNT_ARCHIVED = (int)$calc['archived']->num;
			$total += (int)$calc['archived']->num;
		}
		
		self::$ITV_TASKS_COUNT_ALL = $total;		
	}
	
} //class

ItvSiteStats::instance();
