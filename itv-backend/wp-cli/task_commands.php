<?php

namespace ITV\cli;

use ITV\Config;
use ITV\models\{Task, TaskManager, MemberManager, TaskExportExtraData, PartnerIcon};

if (!class_exists('\WP_CLI')) {
    return;
}

class TaskCommands
{
    function print_with_export_extra_data($args, $assoc_args)
    {
        $tasks = get_posts([
            'post_type' => Task::$post_type,
            'post_status' => 'all',
            'include' => [7606, 7603, 7602, 7600],
        ]);

        foreach ($tasks as $task) {
            \WP_CLI::line("task: {$task->ID} - {$task->post_title}");

            $create_date = substr($task->post_date, 0, 10);
            $close_date = substr(TaskExportExtraData::get_close_date($task->ID), 0, 10);
            $is_closed_by_paseka_member = TaskExportExtraData::check_is_closed_by_paseka_member($task->ID);
            $paseka_partner_title = TaskExportExtraData::get_paseka_partner_title($task->ID);

            \WP_CLI::line("created date: {$create_date}");
            \WP_CLI::line("close date: {$close_date}");
            \WP_CLI::line("closed by paseka member: {$is_closed_by_paseka_member}");
            \WP_CLI::line("paseka_partner_title: {$paseka_partner_title}");
        }

        \WP_CLI::success(__('Done.', 'itv-backend'));
    }

}

\WP_CLI::add_command('itv_task', '\ITV\cli\TaskCommands');
