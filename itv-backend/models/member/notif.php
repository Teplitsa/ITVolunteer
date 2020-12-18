<?php
namespace ITV\models;

class MemberNotifManager {
    public static $table = 'itv_user_notif';

    public function extend_list_with_connected_data($notif_list) {
        foreach($notif_list as $k => $item) {
            $from_user = null;
            
            if($item->from_user_id !== null) {
                $from_user = get_user_by('id', $item->from_user_id);
                $item->from_user = itv_get_user_in_gql_format($from_user);
            }
            
            if($item->task_id !== null) {
                $task = get_post($item->task_id);
                $item->task = itv_get_ajax_task_short($task);
            }
            
            $dt = new DateTime($item->created_at);
            $utcTimezone = new DateTimeZone('UTC');
            $dt->setTimezone($utcTimezone);
            $item->dateGmt = $dt->format("Y-m-d H:i:s");
        }
    }
    
    return $notif_list;
}