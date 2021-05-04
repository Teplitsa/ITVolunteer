<?php
namespace ITV\models;

use \ITV\models\TaskManager;
use \ITV\models\MemberManager;

class MemberTasks {
    protected $user_id = null;

    public function __construct($user_id) {
        $this->user_id = $user_id;
    }    

    public function has_member_created_tasks() {
        $task_manager = new TaskManager();
        $latest_created_task = $task_manager->get_latest_user_created_task($this->user_id);
        return boolval($latest_created_task);
    }

    public function has_member_completed_tasks() {
        $task_manager = new TaskManager();
        $latest_completed_task = $task_manager->get_latest_user_completed_task($this->user_id);
        return boolval($latest_completed_task);
    }

    public function calc_member_role_by_tasks() {
        $task_manager = new TaskManager();
        $latest_created_task = $task_manager->get_latest_user_created_task($this->user_id);
        $latest_completed_task = $task_manager->get_latest_user_completed_task($this->user_id);

        // echo "latest_created_task:" . ($latest_created_task ? $latest_created_task->ID : "") . "\n";
        // echo "latest_completed_task:" . ($latest_completed_task ? $latest_completed_task->ID : "") . "\n";

        // echo "latest_created_task post_date_gmt:" . ($latest_created_task ? $latest_created_task->post_date_gmt : "") . "\n";
        // echo "latest_completed_task post_date_gmt:" . ($latest_completed_task ? $latest_completed_task->post_date_gmt : ""). "\n";

        if($latest_created_task) {
            if(!$latest_completed_task) {
                return MemberManager::$ROLE_AUTHOR;
            }
            else {
                return $latest_completed_task->post_date_gmt >= $latest_created_task->post_date_gmt ? MemberManager::$ROLE_DOER : MemberManager::$ROLE_AUTHOR;
            }
        }
        else {
            return MemberManager::$ROLE_DOER;
        }
    }

    public function calc_member_solved_tasks_in_month($year, $month) {
        global $wpdb;
        
        $sql = "SELECT COUNT(posts.ID) FROM {$wpdb->posts} AS posts INNER JOIN {$wpdb->prefix}p2p AS p2p ON p2p.p2p_from = posts.ID INNER JOIN {$wpdb->prefix}p2pmeta AS p2pmeta ON p2p.p2p_id = p2pmeta.p2p_id 
            LEFT JOIN {$wpdb->prefix}usermeta AS um ON um.user_id = posts.post_author AND um.meta_key = 'activation_code' 
            JOIN {$wpdb->prefix}itv_task_actions_log AS tact ON tact.task_id = posts.ID
                AND tact.action = 'close'
            WHERE posts.post_type = 'tasks' AND posts.post_status = 'closed'
                AND tact.action_time LIKE '{$year}-{$month}-%'
                AND (um.meta_value = '' OR um.meta_value IS NULL)
                AND p2p.p2p_type = 'task-doers' AND posts.ID = p2p.p2p_from 
                AND p2p.p2p_to = %d AND p2pmeta.meta_key = 'is_approved'
                AND CAST(p2pmeta.meta_value AS CHAR) = '1' ";
        
        return $wpdb->get_var($wpdb->prepare($sql, $this->user_id));
    }
    
    public function calc_member_solved_tasks() {
        global $wpdb;
        
        $sql = "SELECT COUNT(posts.ID) FROM {$wpdb->posts} AS posts INNER JOIN {$wpdb->prefix}p2p AS p2p ON p2p.p2p_from = posts.ID INNER JOIN {$wpdb->prefix}p2pmeta AS p2pmeta ON p2p.p2p_id = p2pmeta.p2p_id 
            LEFT JOIN {$wpdb->prefix}usermeta AS um ON um.user_id = posts.post_author AND um.meta_key = 'activation_code' 
            WHERE posts.post_type = 'tasks' AND posts.post_status = 'closed'
                AND (um.meta_value = '' OR um.meta_value IS NULL)
                AND p2p.p2p_type = 'task-doers' AND posts.ID = p2p.p2p_from 
                AND p2p.p2p_to = %d AND p2pmeta.meta_key = 'is_approved'
                AND CAST(p2pmeta.meta_value AS CHAR) = '1' ";
        
        return $wpdb->get_var($wpdb->prepare($sql, $this->user_id));
    }
}
