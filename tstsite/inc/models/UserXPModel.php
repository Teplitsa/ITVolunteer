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
    
    private $is_benchmark_user = false;
    private $ACTION_XP = [];
    
    public static $USER_PROFILE_VAL_FIELDS = ['description', 'user_city', 'user_workplace', 'user_workplace_desc', 'user_speciality', 
        'user_contacts', 'user_skype', 'twitter', 'facebook', 'vk', 'googleplus', 'user_skills'];
    
    public function __construct() {
        $itv_config = \ItvConfig::instance();
        $this->ACTION_XP = $itv_config->get('USER_ACTION_XP');
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
        $user_xp = UserXP::find($user_id);
        $xp_val = 0;
        if($user_xp) {
            $xp_val = $user_xp->xp;
        }
        else {
            $user_xp = new UserXP();
            $user_xp->user_id = $user_id;
        }
        $xp_val += $this->get_action_xp($action);
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
        if(!$acitvity) {
            $this->register_activity($user_id, $action, $meta);
        }
    }
    
    function register_fill_profile_activity($user_id) {
        foreach(UserXPModel::$USER_PROFILE_VAL_FIELDS as $meta_key) {
            $value = get_user_meta($user_id, $meta_key, true);
            if($value) {
                $this->register_activity_if_no($user_id, UserXPModel::$ACTION_FILL_FIELD, $meta_key);
            }
        }
    }
    
    public function fill_users_activity($user_id = 0) {
        $start = microtime(true);
        if($user_id) {
            $db = DB::instance();
            $db->update('DELETE FROM str_itv_user_activity WHERE user_id = ?', [$user_id]);
            
            $user = User::find($user_id);
            $this->is_benchmark_user = true;
            $this->fill_user_activity($user);
            $this->is_benchmark_user = false;
        }
        else {
            $new_table_name = 'str_itv_user_activity_' . date('Ymd_His');
            $db = DB::instance();
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
        
        UserXPModel::instance()->register_activity($user->ID, UserXPModel::$ACTION_REGISTER, '', strtotime($user->user_registered));
        $step = microtime(true);if($this->is_benchmark_user) {echo "ACTION_REGISTER: ".($step - $start) . " sec.\n";}$start = $step;
         
        $meta_value = get_user_meta($user->ID, 'user_avatar', true);
        if($meta_value && !is_wp_error($meta_value)) {
            $media = Post::find($meta_value);
            $this->register_activity($user->ID, UserXPModel::$ACTION_UPLOAD_PHOTO, '', $media ? strtotime($media->post_date) : '');
        }
        $step = microtime(true);if($this->is_benchmark_user) {echo "ACTION_UPLOAD_PHOTO: ".($step - $start) . " sec.\n";}$start = $step;
        
        UserXPModel::instance()->register_fill_profile_activity($user->ID);
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
            UserXPModel::instance()->register_activity($user->ID, UserXPModel::$ACTION_REVIEW_FOR_AUTHOR, '', strtotime($review->time_add));
        }
        $step = microtime(true);if($this->is_benchmark_user) {echo "ACTION_REVIEW_FOR_AUTHOR: ".($step - $start) . " sec.\n";}$start = $step;
        
        $reviews = Review::where(['author_id' => $user->ID])->get();
        foreach($reviews as $review) {
            UserXPModel::instance()->register_activity($user->ID, UserXPModel::$ACTION_REVIEW_FOR_DOER, '', strtotime($review->time_add));
        }
        $step = microtime(true);if($this->is_benchmark_user) {echo "ACTION_REVIEW_FOR_DOER: ".($step - $start) . " sec.\n";}$start = $step;
    }
}
