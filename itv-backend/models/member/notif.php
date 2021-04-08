<?php
namespace ITV\models;

use \ITV\models\UserNotifModel;

class MemberNotifManager {
    public static $table = 'itv_user_notif';

    public static $ICON_LIST = "list";
    public static $ICON_NOTIF = "notification";
    public static $ICON_ROCK = "hard-rock";

    public static $MARKUP_TYPE_WARNING = "warning-message";
    public static $MARKUP_TYPE_NEW = "new-message";
    public static $MARKUP_TYPE_CUSTOM = "custom-message";

    private static $notif_text = [
        'task_published' => "Вы опубликовали новую задачу",
        'post_comment_taskauthor' => "прокомментировал(а) вашу задачу",
        'post_comment_user' => "Вы прокомментировали задачу",
        'reaction_to_task_user' => "Вы откликнулись на задачу",
        'reaction_to_task_taskauthor' => "откликнулся на задачу",
        'task_approved_taskauthor' => "Модератор одобрил вашу задачу",
        'task_disapproved_taskauthor' => "Вы выбрали волонтёра для задачи",
        'choose_taskdoer_to_taskdoer' => "выбрал(а) вас на задачу",
        'choose_taskdoer_to_taskauthor' => "Вы выбрали волонтёра для задачи",
        'choose_other_taskdoer' => "выбрал(а) другого исполнителя на задачу",
        'deadline_update_taskauthor' => "Вы изменили дедлайн задачи",
        'deadline_update_taskdoer' => "изменил(а) дедлайн задачи",
        'suggest_new_deadline_to_taskauthor' => "предложил(а) новый дедлайн задачи",
        'suggest_new_deadline_to_taskdoer' => "Вы предложили новый дедлайн задачи",
        'suggest_task_close_to_taskauthor' => "предложил(а) закрыть задачу",
        'reject_task_close_to_taskdoer' => "отклонил(а) предложение закрыть задачу",
        'task_closing_taskauthor' => "Вы закрыли задачу",
        'task_closing_taskdoer' => "закрыл(а) задачу",
        'post_feedback_taskauthor_to_taskdoer' => "оставил(а) вам отзыв по задаче",
        'post_feedback_taskdoer_to_taskdoer' => "Вы оставили отзыв автору задачи",
        'post_feedback_taskauthor_to_taskauthor' => "Вы оставили отзыв волонтёру по задаче",
        'post_feedback_taskdoer_to_taskauthor' => "оставил(а) вам отзыв по задаче",
        'reaction_to_task_back' => "отозвал свой отклик на задачу",
        'decline_doer_to_taskdoer' => "отклонил(а) вас в качестве исполнителя задачи",
    ];
    
    public static function type_db_fields($item) {
        $item->id = intval($item->id);
        
        if($item->from_user_id) {
            $item->from_user_id = intval($item->from_user_id);
        }
        
        if($item->user_id) {
            $item->user_id = intval($item->user_id);
        }
        
        if($item->task_id) {
            $item->task_id = intval($item->task_id);
        }

        if($item->is_read !== null) {
            $item->is_read = boolval( intval( $item->is_read ) );
        }
        
        return $item;
    }

    public function extend_with_connected_data($item) {
        
        if($item->from_user_id !== null) {
            $from_user = get_user_by('id', $item->from_user_id);
            $item->from_user = itv_get_user_in_gql_format($from_user);
        }
        else {
            $item->from_user = null;
        }
        
        if($item->task_id !== null) {
            $task = get_post($item->task_id);
            $item->task = itv_get_ajax_task_short($task);
        }
        else {
            $item->task = null;
        }
        
        $dt = new \DateTime($item->created_at);
        $utcTimezone = new \DateTimeZone('UTC');
        $dt->setTimezone($utcTimezone);
        $item->dateGmt = $dt->format("Y-m-d H:i:s");
        
        return $item;
    }

    public function add_markup($item, $user) {
        // error_log('item: ' . print_r($item, true));

        $item->icon = self::$ICON_LIST;
        $item->avatar = null;

        $time_diff = human_time_diff( time(), strtotime($item->created_at) );
        $item->time = sprintf( __("%s ago", "itv-backend"), $time_diff);

        $item->title = [];

        if($item->from_user && $item->from_user_id !== $user->ID) {
            $item->title[] = [
                'link' => [
                    'url' => str_replace(site_url(), "", $item->from_user['profileURL']), 
                    'text' => $item->from_user['fullName'], 
                    'type' => "normal",
                ]
            ];
        }

        if($item->from_user) {
            $item->avatar = $item->from_user['itvAvatar'];
        }

        if(!empty(self::$notif_text[$item->type])) {
            $item->title[] = ["text" => self::$notif_text[$item->type]];
        }
        else {
            $item->title[] = ["text" => $item->content];
        }

        if($item->task) {
            $item->title[] = [
                'link' => [
                    'url' => "/tasks/" . $item->task['slug'], 
                    'text' => $item->task['title'], 'type' => "normal"
                ]
            ];
        }

        if($item->type === UserNotifModel::$TYPE_GENERAL_NOTIF) {
            $item->icon = self::$ICON_NOTIF;
        }
        else if(in_array( $item->type, [UserNotifModel::$TYPE_TASK_CLOSING_TASKAUTHOR, UserNotifModel::$TYPE_TASK_CLOSING_TASKDOER ]) ) {
            $item->icon = self::$ICON_ROCK;
        }

        // replace db type with markup type
        if($item->type === UserNotifModel::$TYPE_GENERAL_NOTIF) {
            $item->type = self::$MARKUP_TYPE_CUSTOM;
        }
        else {
            $item->type = null;
        }

        return $item;
    }
}