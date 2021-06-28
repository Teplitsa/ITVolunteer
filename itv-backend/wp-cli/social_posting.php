<?php

namespace ITV\cli;

use ITV\models\Telegram;
use ITV\models\TaskManager;

if (!class_exists('\WP_CLI')) {
    return;
}

class SocialPosting
{
    function publish_telegram($args, $assoc_args)
    {
        $task_slug = !empty($args) ? $args[0] : "";

        if(!$task_slug) {
            \WP_CLI::error(__('Empty task slug.', 'itv-backend'));
            return;
        }

        $task = get_page_by_path($task_slug, OBJECT, TaskManager::$post_type);

        if(!$task) {
            \WP_CLI::error(sprintf( __('Task not found: %s.', 'itv-backend'), $task_slug));
        }

        \WP_CLI::line(sprintf( __('Task: %s.', 'itv-backend'), $task->ID) );

        $telegram = new Telegram();
        $telegram->publish_task($task);

        \WP_CLI::success(__('Message sent to telegram.', 'itv-backend'));
    }
}

\WP_CLI::add_command('itv_social_posting', '\ITV\cli\SocialPosting');
