<?php
namespace ITV\models;

class MemberNotifManager {
    public static $table = 'itv_user_notif';
    
    public static function type_db_fields($item) {
        $item->id = intval($item->id);
        
        if(!empty($item->from_user_id)) {
            $item->from_user_id = intval($item->from_user_id);
        }
        
        if(!empty($item->user_id)) {
            $item->user_id = intval($item->user_id);
        }
        
        if(!empty($item->task_id)) {
            $item->task_id = intval($item->task_id);
        }
        
        return $item;
    }

    public function extend_with_connected_data($item) {
        
        if($item->from_user_id !== null) {
            $from_user = get_user_by('id', $item->from_user_id);
            $item->from_user = itv_get_user_in_gql_format($from_user);
        }
        
        if($item->task_id !== null) {
            $task = get_post($item->task_id);
            $item->task = itv_get_ajax_task_short($task);
        }
        
        $dt = new \DateTime($item->created_at);
        $utcTimezone = new \DateTimeZone('UTC');
        $dt->setTimezone($utcTimezone);
        $item->dateGmt = $dt->format("Y-m-d H:i:s");
        
        return $item;
    }
}