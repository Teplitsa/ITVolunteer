<?php

namespace ITV\models;

use ITV\models\{TaskManager, MemberManager, PartnerIcon};

class TaskExportExtraData
{
    public static function get_close_date($task_id)
    {
        $close_date = '';
        $task_actions_log = \ItvLog::instance()->get_task_log($task_id);
        foreach($task_actions_log as $action) {
            if($action->action === \ItvLog::$ACTION_TASK_CLOSE) {
                $close_date = $action->action_time;
                break;
            }
        }

        return $close_date;
    }

    public static function check_is_closed_by_paseka_member($task_id)
    {
        $doers = \tst_get_task_doers($task_id, true);
        $doer = null;
        if(count($doers)) {
            $doer = $doers[0];
        }

        $mm = new MemberManager();
        return $doer ? $mm->is_paseka_member($doer->ID) : false;
    }

    public static function get_paseka_partner_title($task_id) {
        $doers = \tst_get_task_doers($task_id, true);
        $doer = null;
        if(count($doers)) {
            $doer = $doers[0];
        }

        $partner_icon = $doer ? PartnerIcon::get_icon($doer->ID, MemberManager::$META_PARTNER_ICON) : '';
        return $partner_icon ? $partner_icon['title'] : '';
    }
}

