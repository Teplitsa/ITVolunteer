<?php
namespace ITV\models;

require_once 'ITVModel.php';
require_once dirname(__FILE__) . '/../dao/ITVDAO.php';

use \ITV\dao\UserNotif;

class UserNotifModel extends ITVSingletonModel {
    protected static $_instance = null;
    
    public static $TYPE_TASK_PUBLISHED = 'task_published';
    public static $TYPE_POST_COMMENT_TASKAUTHOR = 'post_comment_taskauthor';
    public static $TYPE_POST_COMMENT_USER = 'post_comment_user';
    public static $TYPE_REACTION_TO_TASK_USER = 'reaction_to_task_user';
    public static $TYPE_REACTION_TO_TASK_TASKAUTHOR = 'reaction_to_task_taskauthor';
    public static $TYPE_TASK_APPROVED_TASKAUTHOR = 'task_approved_taskauthor';
    public static $TYPE_TASK_DISAPPROVED_TASKAUTHOR = 'task_disapproved_taskauthor';
    public static $TYPE_CHOOSE_TASKDOER_TO_TASKDOER = 'choose_taskdoer_to_taskdoer';
    public static $TYPE_CHOOSE_TASKDOER_TO_TASKAUTHOR = 'choose_taskdoer_to_taskauthor';
    public static $TYPE_CHOOSE_OTHER_TASKDOER = 'choose_other_taskdoer';
    public static $TYPE_DEADLINE_UPDATE_TASKAUTHOR = 'deadline_update_taskauthor';
    public static $TYPE_DEADLINE_UPDATE_TASKDOER = 'deadline_update_taskdoer';
    public static $TYPE_SUGGEST_NEW_DEADLINE_TO_TASKAUTHOR = 'suggest_new_deadline_to_taskauthor';
    public static $TYPE_SUGGEST_NEW_DEADLINE_TO_TASKDOER = 'suggest_new_deadline_to_taskdoer';
    public static $TYPE_SUGGEST_TASK_CLOSE_TO_TASKAUTHOR = 'suggest_task_close_to_taskauthor';
    public static $TYPE_REJECT_TASK_CLOSE_TO_TASKDOER = 'reject_task_close_to_taskdoer';
    public static $TYPE_TASK_CLOSING_TASKAUTHOR = 'task_closing_taskauthor';
    public static $TYPE_TASK_CLOSING_TASKDOER = 'task_closing_taskdoer';
    public static $TYPE_POST_FEEDBACK_TASKAUTHOR_TO_TASKAUTHOR = 'post_feedback_taskauthor_to_taskauthor';
    public static $TYPE_POST_FEEDBACK_TASKAUTHOR_TO_TASKDOER = 'post_feedback_taskauthor_to_taskdoer';
    public static $TYPE_POST_FEEDBACK_TASKDOER_TO_TASKAUTHOR = 'post_feedback_taskdoer_to_taskauthor';
    public static $TYPE_POST_FEEDBACK_TASKDOER_TO_TASKDOER = 'post_feedback_taskdoer_to_taskdoer';
    public static $TYPE_REACTION_TO_TASK_BACK = 'reaction_to_task_back';
    public static $TYPE_DECLINE_DOER_TO_TASKDOER = 'decline_doer_to_taskdoer';
    public static $TYPE_GENERAL_NOTIF = 'general_notif';
    
    public static $SHORT_LIST_LIMIT = 20;
    
    public function __construct() {
    }
    
    public function get_list($user_id, $is_read = null, $newer_than_id = null) {
        $params = ['user_id' => $user_id];
        if($is_read !== null) {
            $params['is_read'] = (int)!!$is_read; 
        }
        
        $query = UserNotif::where($params);

        if($newer_than_id !== null) {
            $query->where('id', '>', $newer_than_id);
        }
        
        return $query->orderBy('created_at', 'DESC')->orderBy('id', 'DESC')->limit(UserNotifModel::$SHORT_LIST_LIMIT)->get();
    }
    
    public function push_notif($user_id, $type, $args=array()) {        
        
        $item = new UserNotif();
        $item->type = $type;
        $item->user_id = $user_id;
        $item->is_read = false;
        
        foreach($args as $k => $v) {
            $item->$k = $v;
        }

        $item->save();
    }
    
    public function mark_read($user_id, $notif_id_list) {
        UserNotif::where(['user_id' => $user_id])->whereIn('id', $notif_id_list)->update(['is_read' => 1]);
    }    
}
