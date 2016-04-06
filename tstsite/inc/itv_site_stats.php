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
    private $longrun_offset = 0;
    private $app = null;
    private static $_instance = NULL;
    private function __construct() {
        add_action ( 'wp_head', 'ItvSiteStats::perform_calculations' );
    }
    public static function instance() {
        if (ItvSiteStats::$_instance == NULL) {
            ItvSiteStats::$_instance = new ItvSiteStats ();
        }
        return ItvSiteStats::$_instance;
    }
    public function get_stats_value($key) {
        $value = get_option ( $key );
        return $value ? $value : 0;
    }
    public function set_app($app) {
        $this->app = $app;
        
        $longrun_offset = $this->app->get_data ( 'offset' );
        $this->longrun_offset = $longrun_offset ? $longrun_offset : 0;
    }
    public function refresh_users_role_stats($per_page = 100) {
        global $wpdb;
        
        $USERS_ROLE_BENEFICIARY_COUNT = 0;
        $USERS_ROLE_SUPERHERO_COUNT = 0;
        $USERS_ROLE_ACTIVIST_COUNT = 0;
        $USERS_ROLE_VOLUNTEER_COUNT = 0;
        $USERS_OTHER_COUNT = 0;
        $USERS_COUNT = 0;
        
        if ($this->longrun_offset) {
            $tmp_count = $this->app->get_data ( 'tmp_count' );
            
            if($tmp_count && is_array($tmp_count)) {
                $USERS_ROLE_BENEFICIARY_COUNT = $tmp_count['USERS_ROLE_BENEFICIARY_COUNT'];
                $USERS_ROLE_SUPERHERO_COUNT = $tmp_count['USERS_ROLE_SUPERHERO_COUNT'];
                $USERS_ROLE_ACTIVIST_COUNT = $tmp_count['USERS_ROLE_ACTIVIST_COUNT'];
                $USERS_ROLE_VOLUNTEER_COUNT = $tmp_count['USERS_ROLE_VOLUNTEER_COUNT'];
                $USERS_OTHER_COUNT = $tmp_count['USERS_OTHER_COUNT'];
            }
        }
        
        $offset = $this->longrun_offset;
        $is_stop = false;
        $is_any_users_processed = false;
        while ( ! $is_stop ) {
            echo 'offset=' . $offset . "\n";
            
            $users_query_params = array (
                'query_id' => 'itv_count_main_users_stats',
                'number' => $per_page,
                'offset' => $offset,
                'exclude' => ACCOUNT_DELETED_ID,
                'orderby' => 'user_registered',
                'order' => 'ASC' 
            );
            
            $start001 = microtime ( true );
            // $user_query = new WP_User_Query($users_query_params);
            $sql = "SELECT * FROM {$wpdb->prefix}users AS u LEFT JOIN {$wpdb->prefix}usermeta AS um ON um.user_id = u.ID AND um.meta_key = 'activation_code' WHERE um.meta_value = '' ORDER BY ID ASC LIMIT $offset, $per_page";
            $users_portion = $wpdb->get_results ( $sql );
            
            echo "get users portion: " . (microtime ( true ) - $start001) . " sec.\n";
            
            $users_count_portion = 0;
            
            $start002 = microtime ( true );
            // foreach($user_query->results as $user) {
            foreach ( $users_portion as $user ) {
                $is_count = true;
                $is_any_users_processed = true;
                
                if ($is_count) {
                    
                    // $start001 = microtime(true);
                    tst_update_member_stat ( $user );
                    // echo "tst_update_member_stat: ".(microtime(true) - $start001) . " sec.\n";
                    
                    // $start001 = microtime(true);
                    $user_role = tst_get_member_role_key ( $user );
                    // echo "tst_get_member_role_key: ".(microtime(true) - $start001) . " sec.\n";
                    
                    if ($user_role == 'donee') {
                        $USERS_ROLE_BENEFICIARY_COUNT += 1;
                    } elseif ($user_role == 'hero') {
                        $USERS_ROLE_SUPERHERO_COUNT += 1;
                    } elseif ($user_role == 'activist') {
                        $USERS_ROLE_ACTIVIST_COUNT += 1;
                    } elseif ($user_role == 'volunteer') {
                        $USERS_ROLE_VOLUNTEER_COUNT += 1;
                    } else {
                        $USERS_OTHER_COUNT += 1;
                    }
                }
                
                $users_count_portion += 1;
            }
            echo "process users portion: " . (microtime ( true ) - $start002) . " sec.\n";
            echo "timestamp: " . time () . "\n";
            echo "memory usage: " . round ( memory_get_usage () / 1024 ) . "kB\n";
            system ( 'egrep --color \'Mem|Cache|Swap\' /proc/meminfo' );
            
            $found_useless_links = gc_collect_cycles ();
            echo "useless memory links: " . $found_useless_links . "\n";
            
            if ($users_count_portion < $per_page) {
                $is_stop = true;
            }
            
            $offset += $per_page;
            $this->app->save_data ( 'offset', $offset );
            $this->app->save_data ( 'tmp_count', [
                'USERS_ROLE_BENEFICIARY_COUNT' => $USERS_ROLE_BENEFICIARY_COUNT,
                'USERS_ROLE_SUPERHERO_COUNT' => $USERS_ROLE_SUPERHERO_COUNT,
                'USERS_ROLE_ACTIVIST_COUNT' => $USERS_ROLE_ACTIVIST_COUNT,
                'USERS_ROLE_VOLUNTEER_COUNT' => $USERS_ROLE_VOLUNTEER_COUNT,
                'USERS_OTHER_COUNT' => $USERS_OTHER_COUNT,
            ] );
        }
        
        if ($is_any_users_processed) {
            $USERS_COUNT = $USERS_OTHER_COUNT + $USERS_ROLE_BENEFICIARY_COUNT + $USERS_ROLE_SUPERHERO_COUNT + $USERS_ROLE_ACTIVIST_COUNT + $USERS_ROLE_VOLUNTEER_COUNT;
            
            update_option ( ItvSiteStats::$USERS_ROLE_BENEFICIARY, $USERS_ROLE_BENEFICIARY_COUNT );
            update_option ( ItvSiteStats::$USERS_ROLE_SUPERHERO, $USERS_ROLE_SUPERHERO_COUNT );
            update_option ( ItvSiteStats::$USERS_ROLE_ACTIVIST, $USERS_ROLE_ACTIVIST_COUNT );
            update_option ( ItvSiteStats::$USERS_ROLE_VOLUNTEER, $USERS_ROLE_VOLUNTEER_COUNT );
            update_option ( ItvSiteStats::$USERS_TOTAL, $USERS_COUNT );
            
            echo "USERS_ROLE_BENEFICIARY_COUNT: " . $USERS_ROLE_BENEFICIARY_COUNT . "\n";
            echo "USERS_ROLE_SUPERHERO: " . $USERS_ROLE_SUPERHERO_COUNT . "\n";
            echo "USERS_ROLE_ACTIVIST: " . $USERS_ROLE_ACTIVIST_COUNT . "\n";
            echo "USERS_ROLE_VOLUNTEER: " . $USERS_ROLE_VOLUNTEER_COUNT . "\n";
            echo "USERS_TOTAL: " . $USERS_COUNT . "\n";
        }
    }
    
    /**
     * Common calculations on all pages *
     */
    public static function perform_calculations() {
        global $wpdb;
        
        $calc = $wpdb->get_results ( "SELECT post_status, COUNT(ID) as num FROM $wpdb->posts WHERE post_type = 'tasks' AND post_status IN ('publish', 'in_work', 'closed', 'archived') GROUP BY post_status", OBJECT_K );
        
        if (empty ( $calc ))
            return;
        
        $total = 0;
        if (isset ( $calc ['publish'] )) {
            self::$ITV_TASKS_COUNT_NEW = ( int ) $calc ['publish']->num;
            $total += ( int ) $calc ['publish']->num;
        }
        if (isset ( $calc ['in_work'] )) {
            self::$ITV_TASKS_COUNT_WORK = ( int ) $calc ['in_work']->num;
            $total += ( int ) $calc ['in_work']->num;
        }
        if (isset ( $calc ['closed'] )) {
            self::$ITV_TASKS_COUNT_CLOSED = ( int ) $calc ['closed']->num;
            $total += ( int ) $calc ['closed']->num;
        }
        if (isset ( $calc ['archived'] )) {
            self::$ITV_TASKS_COUNT_ARCHIVED = ( int ) $calc ['archived']->num;
            $total += ( int ) $calc ['archived']->num;
        }
        
        self::$ITV_TASKS_COUNT_ALL = $total;
    }
} // class

ItvSiteStats::instance ();
