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
    
    public static $USER_PROFILE_VAL_FIELDS = ['description', 'user_city', 'user_workplace', 'user_workplace_desc', 'user_speciality', 
        'user_contacts', 'user_skype', 'twitter', 'facebook', 'vk', 'googleplus', 'user_skills'];
    
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
        if($user_id) {
            $user = User::find($user_id);
            $this->fill_user_activity($user);
        }
        else {
            User::chunk(100, function($users) {
                foreach ($users as $user) {
                    print $user->ID . "\n";
                    $this->fill_user_activity($user);
                }
            });
        }
                
        print "users_xp_count=" . UserXP::count() . "\n";
        print("recalcAllUsersXPActivity...\n");
    }
    
    public function fill_user_activity($user) {

        $meta_value = get_user_meta($user->ID, 'user_avatar', true);
        if($meta_value) {
            $this->register_activity_if_no($user->ID, UserXPModel::$ACTION_UPLOAD_PHOTO);
        }
        
        $meta_value = get_user_meta($user->ID, 'user_avatar', true);
        if($meta_value) {
            $this->register_activity_if_no($user->ID, UserXPModel::$ACTION_UPLOAD_PHOTO);
        }
        
        UserXPModel::instance()->register_fill_profile_activity($user->ID);
        
        $reviews = ReviewAuthor::where(['doer_id' => $user->ID])->get();
        foreach($reviews as $review) {
            UserXPModel::instance()->register_activity($user->ID, UserXPModel::$ACTION_REVIEW_FOR_AUTHOR, '', strtotime($reviews->time_add));
        }
        
        $reviews = Review::where(['author_id' => $user->ID])->get();
        foreach($reviews as $review) {
            UserXPModel::instance()->register_activity($user->ID, UserXPModel::$ACTION_REVIEW_FOR_DOER, '', strtotime($reviews->time_add));
        }
    }
}
