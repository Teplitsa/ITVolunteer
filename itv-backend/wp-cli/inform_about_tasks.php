<?php

namespace ITV\cli;

use ITV\Config;
use ITV\models\{TaskManager, MemberManager};

if (!class_exists('\WP_CLI')) {
    return;
}

class MembersAboutTasksInformer
{
    function inform_paseka_members($args, $assoc_args)
    {
        $need_inform = get_option(TaskManager::$OPTION_NEED_INFORM_PASEKA_MEMBERS_ABOUT_NEW_TASK);

        if($need_inform) {
            \WP_CLI::line("Need inform paseka member");

            $task_manager = new TaskManager();
            $task_id_list = $task_manager->get_tasks_to_inform_paseka_members_about();
            \WP_CLI::line("tasks: " . implode(", ", $task_id_list));

            if(!empty($task_id_list)) {
                $task_list = [];
                foreach ($task_id_list as $task_id) {
                    $task = get_post($task_id);
                    $author = get_user_by('id', $task->post_author);
                    // \WP_CLI::line("task: {$task->post_name}");
                    // $task_list[] = "<a href=\"" . get_permalink($task) . "\">{$task->post_title}</a><br /><br />";

                    $member_manager = new MemberManager();
                    $user_id_list = $member_manager->get_paseka_members();
        
                    foreach($user_id_list as $user_id) {
                        $user = get_user_by('id', $user_id);
        
                        \WP_CLI::line("user: {$user->user_login}");
        
                        \ItvAtvetka::instance()->mail('inform_paseka_members_about_tasks', [
                            'mailto' => $user->user_email,
                            'user_first_name' => $user->first_name,
                            'author_display_name' => $author->display_name,
                            'task_url' => get_permalink($task->ID),
                            'task_link' => itv_get_task_link($task),
                        ]);
                    }
                }
    
                $task_manager->mark_tasks_paseka_members_informed($task_id_list);
            }

            update_option(TaskManager::$OPTION_NEED_INFORM_PASEKA_MEMBERS_ABOUT_NEW_TASK, false);
        }

        \WP_CLI::success(__('Paseka members informed.', 'itv-backend'));
    }

    function deactivate_informing_about_existing_tasks() {
        $task_manager = new TaskManager();
        $task_id_list = $task_manager->get_tasks_to_inform_paseka_members_about();
        \WP_CLI::line("tasks: " . implode(", ", $task_id_list));
        $task_manager->mark_tasks_paseka_members_informed($task_id_list);
    }

    function inform_volunteers_about_tasks() {
        $task_manager = new TaskManager();
        $task_id_list = $task_manager->get_fresh_tasks_with_no_volunteers();
        \WP_CLI::line("tasks: " . implode(", ", $task_id_list));

        if(empty($task_id_list)) {
            \WP_CLI::line("not tasks to inform about");
            return;
        }

        $task_list = [];
        foreach ($task_id_list as $task_id) {
            $task = get_post($task_id);
            \WP_CLI::line("task: {$task->post_name}");
            $task_list[] = "<a href=\"" . get_permalink($task) . "\">{$task->post_title}</a><br /><br />";
        }

        $current_user_id = \get_current_user_id(); // set by --user param

        $member_manager = new MemberManager();        
        $user_id_list = $current_user_id ? [$current_user_id] : $member_manager->get_volunteers();
        
        foreach ($user_id_list as $user_id) {
            $user = get_user_by('id', $user_id);
            \WP_CLI::line( "user: {$user->ID} - {$user->user_login}" );

            if(in_array($user->user_email, Config::MAIL_ABOUT_TASKS_SKIP_LIST)) {
                \WP_CLI::line("SKIP: user in SKIP LIST: " . $user->ID);
                continue;
            }

            \ItvAtvetka::instance()->mail('new_tasks_digest', [
                'mailto' => $user->user_email,
                'user_first_name' => $user->first_name,
                'task_list_url' => site_url("/tasks"),
                'task_list' => implode("\n", $task_list),
            ]);

            \WP_CLI::line("email sent to: " . $user->ID);
        }
    }
}

\WP_CLI::add_command('itv_inform_about_tasks', '\ITV\cli\MembersAboutTasksInformer');
