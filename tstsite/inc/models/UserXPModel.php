<?php
namespace ITV\models;

require_once 'ITVModel.php';
require_once dirname(__FILE__) . '/../dao/ITVDAO.php';
require_once dirname(__FILE__) . '/../dao/UserXP.php';
require_once dirname(__FILE__) . '/../dao/Review.php';

use \ITV\models\ITVSingletonModel;
use \ITV\dao\UserXP;
use \ITV\dao\UserXPActivity;
use \ITV\dao\Review;
use \ITV\dao\ReviewAuthor;
use \WeDevs\ORM\WP\User as User; 
use \WeDevs\ORM\WP\Post as Post; 
use \WeDevs\ORM\Eloquent\Database as DB;
use ITV\dao\UserXPAlerts;

class UserXPModel extends ITVSingletonModel {
    public static $ACTION_REGISTER = 'register';
    public static $ACTION_FILL_FIELD = 'fill_field';
    public static $ACTION_UPLOAD_PHOTO = 'upload_photo';
    public static $ACTION_ADD_COMMENT = 'add_comment';
    public static $ACTION_CREATE_TASK = 'create_task';
    public static $ACTION_ADD_AS_CANDIDATE = 'add_as_candidate';
    public static $ACTION_TASK_DONE = 'task_done';
    public static $ACTION_MY_TASK_DONE = 'my_task_done';
    public static $ACTION_REVIEW_FOR_DOER = 'review_for_doer';
    public static $ACTION_REVIEW_FOR_AUTHOR = 'review_for_author';
    public static $ACTION_LOGIN = 'login';
    
    private $is_benchmark_user = false;
    private $ACTION_XP = [];
    private $ONE_TIME_ACTIONS = [];
    private $XP_ALERT_CONFIG = [];
    
    public static $USER_PROFILE_VAL_FIELDS = ['description', 'user_city', 'user_workplace', 'user_workplace_desc', 'user_speciality', 
        'user_contacts', 'user_skype', 'twitter', 'facebook', 'vk', 'googleplus', 'user_skills'];
    
    public function __construct() {
        $itv_config = \ItvConfig::instance();
        $this->ACTION_XP = $itv_config->get('USER_ACTION_XP');
        $this->XP_ALERT_CONFIG = $itv_config->get('USER_ACTION_XP_ALERT');
        $this->ONE_TIME_ACTIONS = [UserXPModel::$ACTION_FILL_FIELD, UserXPModel::$ACTION_UPLOAD_PHOTO];
    }
    
    public function get_user_xp($user_id) {
        $user_xp = UserXP::find($user_id);
        $xp = 0;
        if($user_xp) {
            $xp = $user_xp->xp;
        }
        return $xp;
    }
    
    public function register_activity($user_id, $action, $meta = '', $moment = '') {
        $user_xp_activity = new UserXPActivity();
        $user_xp_activity->user_id = $user_id;
        $user_xp_activity->action = $action;
        if($meta) {
            $user_xp_activity->meta = $meta;
        }
        if($moment) {
            $user_xp_activity->created_at = $moment;
            $user_xp_activity->updated_at = $moment;
        }
        
        $user_xp_activity->save();
        
        $this->inc_user_xp($user_id, $action);
    }
    
    private function inc_user_xp($user_id, $action) {
        $user_xp = $this->get_user_xp($user_id);
        $this->set_user_xp($user_id, $user_xp + $this->get_action_xp($action));
    }
    
    private function set_user_xp($user_id, $xp_val) {
        $user_xp = UserXP::find($user_id);
        if(!$user_xp) {
            $user_xp = new UserXP();
            $user_xp->user_id = $user_id;
        }
        $user_xp->xp = $xp_val;
        $user_xp->save();
    }
    
    private function get_action_xp($action) {
        $xp = 0;
        if(isset($this->ACTION_XP[$action])) {
            $xp = $this->ACTION_XP[$action];
        }
        return $xp;
    }
    
    public function register_activity_if_no($user_id, $action, $meta = '') {
        $query = UserXPActivity::where(['user_id' => $user_id, 'action' => $action]);
        if($meta) {
            $query = $query->where(['meta' => $meta]);
        }
        else {
            $query = $query->whereNull('meta');
        }
        
        $acitvity = $query->first();
        $ret = false;
        if(!$acitvity) {
            $this->register_activity($user_id, $action, $meta);
            $ret = true;
        }
        
        return $ret;
    }
    
    public function register_fill_profile_activity($user_id) {
        $new_filled_fields = 0;
        foreach(UserXPModel::$USER_PROFILE_VAL_FIELDS as $meta_key) {
            $value = get_user_meta($user_id, $meta_key, true);
            $is_new_activity = false;
            if($value) {
                $is_new_activity = $this->register_activity_if_no($user_id, UserXPModel::$ACTION_FILL_FIELD, $meta_key);
            }
            if($is_new_activity) {
                $new_filled_fields++;
            }
        }
        return $new_filled_fields;
    }
    
    public function fill_users_activity($user_id = 0) {
        $start = microtime(true);
        $db = DB::instance();
        if($user_id) {
            $db->update('DELETE FROM str_itv_user_activity WHERE user_id = ?', [$user_id]);
            
            $user = User::find($user_id);
            $this->is_benchmark_user = true;
            $this->fill_user_activity($user);
            $this->is_benchmark_user = false;
        }
        else {
            $new_table_name = 'str_itv_user_activity_' . date('Ymd_His');
            $db->update('ALTER TABLE str_itv_user_activity RENAME ' . $new_table_name);
            $db->update('CREATE TABLE str_itv_user_activity LIKE ' . $new_table_name);
            $db->update('TRUNCATE str_itv_user_xp');
            
            User::chunk(100, function($users) {
                foreach ($users as $user) {
                    $this->fill_user_activity($user);
                }
            });
        }
        echo "total: ".(microtime(true) - $start) . " sec.\n";
    }
    
    public function fill_user_activity($user) {
//         print $user->ID . "\n";
        
        $start = microtime(true);
        
        $this->register_activity($user->ID, UserXPModel::$ACTION_REGISTER, '', strtotime($user->user_registered));
        $step = microtime(true);if($this->is_benchmark_user) {echo "ACTION_REGISTER: ".($step - $start) . " sec.\n";}$start = $step;
         
        $meta_value = get_user_meta($user->ID, 'user_avatar', true);
        if($meta_value && !is_wp_error($meta_value)) {
            $media = Post::find($meta_value);
            $this->register_activity($user->ID, UserXPModel::$ACTION_UPLOAD_PHOTO, '', $media ? strtotime($media->post_date) : '');
        }
        $step = microtime(true);if($this->is_benchmark_user) {echo "ACTION_UPLOAD_PHOTO: ".($step - $start) . " sec.\n";}$start = $step;
        
        $this->register_fill_profile_activity($user->ID);
        $step = microtime(true);if($this->is_benchmark_user) {echo "fill_profile_activity: ".($step - $start) . " sec.\n";}$start = $step;
        
        $user_comments = get_comments( ['user_id' => $user->ID, 'status' => 'approve'] );
        foreach($user_comments as $comment) {
            $this->register_activity($user->ID, UserXPModel::$ACTION_ADD_COMMENT, '', strtotime($comment->comment_date));
        }
        
        $user_tasks = tst_get_user_created_tasks($user, array('draft', 'publish', 'in_work', 'closed'));
        foreach($user_tasks as $task) {
            $this->register_activity($user->ID, UserXPModel::$ACTION_CREATE_TASK, '', strtotime($task->post_date));
        }
        $step = microtime(true);if($this->is_benchmark_user) {echo "ACTION_CREATE_TASK: ".($step - $start) . " sec.\n";}$start = $step;
        
        $tasks_joined_as_doer = tst_calculate_member_tasks_joined($user);
        foreach($tasks_joined_as_doer->posts as $task) {
            // suppose member connected as doer in 24 hours
            $this->register_activity($user->ID, UserXPModel::$ACTION_ADD_AS_CANDIDATE, '', strtotime($task->post_date) + 24 * 3600);
        }
        $step = microtime(true);if($this->is_benchmark_user) {echo "ACTION_ADD_AS_CANDIDATE: ".($step - $start) . " sec.\n";}$start = $step;
        
        $tasks_complete_as_doer = tst_calculate_member_tasks_solved($user);
        foreach($tasks_complete_as_doer->posts as $task) {
            // suppose doer complete task in 14 days
            $this->register_activity($user->ID, UserXPModel::$ACTION_TASK_DONE, '', strtotime($task->post_date) + 14 * 24 * 3600);
        }
        $step = microtime(true);if($this->is_benchmark_user) {echo "ACTION_TASK_DONE: ".($step - $start) . " sec.\n";}$start = $step;
        
        $tasks_closed = tst_get_user_closed_tasks($user);
        foreach($tasks_closed as $task) {
            // suppose doer complete task in 14 days
            $this->register_activity($user->ID, UserXPModel::$ACTION_MY_TASK_DONE, '', strtotime($task->post_date) + 14 * 24 * 3600);
        }
        $step = microtime(true);if($this->is_benchmark_user) {echo "ACTION_MY_TASK_DONE: ".($step - $start) . " sec.\n";}$start = $step;
        
        $reviews = ReviewAuthor::where(['doer_id' => $user->ID])->get();
        foreach($reviews as $review) {
            $this->register_activity($user->ID, UserXPModel::$ACTION_REVIEW_FOR_AUTHOR, '', strtotime($review->time_add));
        }
        $step = microtime(true);if($this->is_benchmark_user) {echo "ACTION_REVIEW_FOR_AUTHOR: ".($step - $start) . " sec.\n";}$start = $step;
        
        $reviews = Review::where(['author_id' => $user->ID])->get();
        foreach($reviews as $review) {
            $this->register_activity($user->ID, UserXPModel::$ACTION_REVIEW_FOR_DOER, '', strtotime($review->time_add));
        }
        $step = microtime(true);if($this->is_benchmark_user) {echo "ACTION_REVIEW_FOR_DOER: ".($step - $start) . " sec.\n";}$start = $step;
    }
    
    public function recalc_user_activity($user) {
        $start = microtime(true);
        $user_xp = 0;
        UserXPActivity::where(['user_id' => $user->ID])->chunk(100, function($activity_list) use($user_xp) {
            foreach($activity_list as $action) {
                $user_xp += $this->get_action_xp($action->action);
            }
        });
        echo "collect userXP: " . (microtime(true) - $start) . " sec.\n";
            
        $start = microtime(true);
        $this->set_user_xp($user->ID, $user_xp);
        echo "set userXP: ".(microtime(true) - $start) . " sec.\n";
        
        $start = microtime(true);
        $db = DB::instance();
        $wpdb = $db->db;
        echo "get DB instance: ".(microtime(true) - $start) . " sec.\n";
        
        $sql = "SELECT * from str_itv_user_activity WHERE user_id = 75";
        
        $start = microtime(true);
        $actions = UserXPActivity::where(['user_id' => $user->ID])->get();
        echo "get user actions ELOQUENT: ".(microtime(true) - $start) . " sec.\n";
        echo "actions_count=" . count($actions) . "\n";
        
        $start = microtime(true);
        $actions = $wpdb->get_results($sql);
        echo "get user actions WPDB: ".(microtime(true) - $start) . " sec.\n";
        echo "actions_count=" . count($actions) . "\n";
        
        $start = microtime(true);
        $db_link = mysql_connect(DB_HOST, DB_USER, DB_PASSWORD);
        mysql_select_db(DB_NAME, $db_link);
        echo "mysql_connect: ".(microtime(true) - $start) . " sec.\n";
                
        $start = microtime(true);
        $query_result = mysql_query($sql);
        $actions = [];
        while($row = mysql_fetch_assoc($query_result)) {
            $actions[] = $row;
        }
        echo "get user actions PHP_MYSQL: ".(microtime(true) - $start) . " sec.\n";
        echo "actions_count=" . count($actions) . "\n";
        
        mysql_close($db_link);
    }
    
    public function recalc_users_xp($user_id = 0) {
        $start = microtime(true);
        $db = DB::instance();
        
        if($user_id) {
            $user = User::find($user_id);
            $this->is_benchmark_user = true;
            $this->recalc_user_activity($user);
            $this->is_benchmark_user = false;
        }
        else {
            $db->update('TRUNCATE str_itv_user_xp');
            User::chunk(100, function($users) {
                foreach ($users as $user) {
                    $this->recalc_user_activity($user);
                }
            });
        }
        echo "total: ".(microtime(true) - $start) . " sec.\n";
    }
    
    # register actions from GUI
    public function register_activity_from_gui($user_id, $action, $meta = '') {
        if(in_array($action, $this->ONE_TIME_ACTIONS)) {
            $this->register_activity_if_no($user_id, $action, $meta);
        }
        else {
            $this->register_activity($user_id, $action, $meta);
        }
        
        $xp_value = $this->get_action_xp($action);
        $this->push_xp_alert($user_id, $action, $xp_value);
    }
    
    public function register_fill_profile_activity_from_gui($user_id) {
        $new_filled_fields = $this->register_fill_profile_activity($user_id);

        if($new_filled_fields > 0) {
            $action = UserXPModel::$ACTION_FILL_FIELD;
            $xp_value = $this->get_action_xp($action);
            $this->push_xp_alert($user_id, $action, $xp_value);
        }
    }
    
    public function push_xp_alert($user_id, $action, $xp_value) {
        $alert_list = $this->get_xp_alert_list($user_id);
        $alert_list[] = ['action' => $action, 'xp' => $xp_value];
        $alert_list_json = json_encode($alert_list);
        
        if($this->is_show_xp_alert($user_id, $action)) {
            $cookie_name = $this->get_xp_alert_cookie_name($user_id);
            setcookie( $cookie_name, $alert_list_json, 0, '/' );
            
            $this->inc_xp_alerts_count($user_id);
        }
    }
    
    public function get_xp_alert_list($user_id) {
        $cookie_name = $this->get_xp_alert_cookie_name($user_id);
        $alert_list = [];
        if(isset($_COOKIE[$cookie_name])) {
            try {
                $alert_list = json_decode($_COOKIE[$cookie_name]);
            }
            catch (Exception $ex) {
                error_log($ex);
            }
        }
        return $alert_list;
    }
    
    public function empty_xp_alert_list($user_id) {
        $cookie_name = $this->get_xp_alert_cookie_name($user_id);
        unset( $_COOKIE[$cookie_name] );
        setcookie( $cookie_name, '', time() - ( 15 * 60 ) );
    }
    
    public function get_xp_alert_cookie_name($user_id) {
        $user_data = get_userdata($user_id);
        return 'itv_xp_alert_' . ($user_data ? $user_data->user_nicename : '');
    }
    
    public function get_xp_alert_strings_json() {
        $action_xp = [];
        foreach($this->ACTION_XP as $action => $xp) {
            $action_xp[$action] = sprintf(__("user_xp_alert_%s_" . $action, 'tst'), $xp);
        } 
        return json_encode($action_xp);
    }
    
    public function get_site_total_xp() {
        $db = DB::instance();
        $wpdb = $db->db;
        $result = $wpdb->get_var('SELECT SUM(xp) as site_sum_xp FROM str_itv_user_xp');
        return $result;
    }
    
    public function get_site_total_abs_xp() {
        $db = DB::instance();
        $wpdb = $db->db;
        
        $activity = UserXPActivity::get();
        $sum_xp = 0;
        foreach($activity as $action) {
            $sum_xp += abs($this->get_action_xp($action->action));
        }
        
        return $sum_xp;
    }
    
    public function get_xp_for_period($from, $to) {
        $db = DB::instance();
        $wpdb = $db->db;
        
        if($from && !preg_match('/.* \d{2}:\d{2}:\d{2}$/', $from)) {
            $from .= ' 00:00:00';
        }
        
        $query = UserXPActivity::where('created_at', '>=', $from);
        if($to) {
            if(!preg_match('/.* \d{2}:\d{2}:\d{2}$/', $to)) {
                $to .= ' 00:00:00';
            }
            $query->where('created_at', '<', $to);
        }
        
        $activity = $query->get();
        $sum_xp = 0;
        foreach($activity as $action) {
            $sum_xp += abs($this->get_action_xp($action->action));
        }
        
        return $sum_xp;
    }
    
    private function inc_xp_alerts_count($user_id) {
        $user_xp_alerts = UserXPAlerts::find($user_id);
        $alerts_count = 0;
        if($user_xp_alerts) {
            $alerts_count = $user_xp_alerts->alerts_count;
        }
        else {
            $user_xp_alerts = new UserXPAlerts();
            $user_xp_alerts->user_id = $user_id;
        }
        $user_xp_alerts->alerts_count = $alerts_count + 1;
        $user_xp_alerts->save();
    }
    
    private function get_xp_alerts_count($user_id) {
        $user_xp_alerts = UserXPAlerts::find($user_id);
        $alerts_count = 0;
        if($user_xp_alerts) {
            $alerts_count = $user_xp_alerts->alerts_count;
        }
        return $alerts_count;
    }
    
    private function is_show_xp_alert($user_id, $action) {
        $alerts_count = $this->get_xp_alerts_count($user_id);
        $ret = true;
        
        if(in_array($action, $this->XP_ALERT_CONFIG['never']['actions'])) {
            $ret = false;
        }
        elseif(!in_array($action, $this->XP_ALERT_CONFIG['always']['actions'])) {
            foreach($this->XP_ALERT_CONFIG['less_only'] as $action_alert_settings) {
                if(in_array($action, $action_alert_settings['actions']) && $alerts_count >= $action_alert_settings['limit']) {
                    $ret = false;
                    break;
                }
            }
        }
        
        return $ret;
    }
}
