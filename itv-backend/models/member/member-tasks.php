<?php
namespace ITV\models;

use \ITV\models\TaskManager;
use \ITV\models\MemberManager;

class MemberTasks {
    protected $user_id = null;

    public function __construct($user_id) {
        $this->user_id = $user_id;
    }    

    public function has_member_created_and_completed_tasks() {
        $task_manager = new TaskManager();
        $latest_created_task = $task_manager->get_latest_user_created_task($this->user_id);
        $latest_completed_task = $task_manager->get_latest_user_completed_task($this->user_id);

        return $latest_created_task && $latest_completed_task;
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

}

__('member_role_doer', 'itv-backend');
__('member_role_author', 'itv-backend');