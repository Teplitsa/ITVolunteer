<?php

namespace ITV\cli;

use ITV\models\{MemberManager, TaskManager, TaskStats};

if (!class_exists('\WP_CLI')) {
    return;
}

class MailInactiveUsers
{
    private const IS_TEST_MODE = false;

    private static $unsubscribe_url = 'mailto:zakirova@te-st.org?subject=%D0%A3%D0%B4%D0%B0%D0%BB%D0%B8%D1%82%D0%B5 %D0%BC%D0%BE%D0%B9 %D0%B0%D0%BA%D0%BA%D0%B0%D1%83%D0%BD%D1%82'; // subject=Удалите мой аккаунт

    private static $dummy_users = [
        [
            'user_id'    => 331,
            'user_name'  => 'Влад Лавриченко',
            'user_email' => 'vlad@te-st.org',
            'user_link'  => 'https://itvist.org/members/vladtest'
        ],
        [
            'user_id'    => 7201,
            'user_name'  => 'Мария Селявко',
            'user_email' => 'maria.seliavko@gmail.com',
            'user_link'  => 'https://itvist.org/members/selyavko'
        ],
        [
            'user_id'    => 7504,
            'user_name'  => 'Алексей Есев',
            'user_email' => 'alekseyesev@live.ru',
            'user_link'  => 'https://itvist.org/members/esev'
        ],
        [
            'user_id'    => 7568,
            'user_name'  => 'zakirovalena',
            'user_email' => 'zakirova@te-st.org', // ZakirovaET@gmail.com
            'user_link'  => 'https://itvist.org/members/zakirovalena'
        ],
    ];

    /***
     * Usage examples:
     * wp mail_inactive_users authors_with_no_tasks --registered_earlier_in_months=1
     */
    public function authors_with_no_tasks($args, $assoc_args): void
    {
        $authors = self::IS_TEST_MODE ? self::$dummy_users : MemberManager::get_authors_with_no_tasks($assoc_args['registered_earlier_in_months'] ?? null, $assoc_args['registered_later_in_months'] ?? null);

        if ($authors) {
            \WP_CLI::line(sprintf(__('Number of authors is %d.', 'itv_backend'), count($authors)));

            $template_props = [
                'create_task_url' => \get_home_url() . '/task-create',
            ];

            foreach ($authors as $user_index => ['user_id' => $user_id, 'user_name' => $user_name, 'user_email' => $user_email]) {
                $user_index += 1;

                \WP_CLI::line("user #{$user_index}: {$user_id} {$user_name}");

                $template_props['mailto'] = $user_email;
                $template_props['user_display_name'] = $user_name;
                $template_props['unsubscribe_url'] = self::$unsubscribe_url;

                \ItvAtvetka::instance()->mail('authors_no_tasks_more_than_a_month_ago', $template_props);
            }

            \WP_CLI::success(__('Authors with no tasks have got their mails.', 'itv-backend'));
        } else {
            \WP_CLI::warning(__('There are no authors matched your criteria.', 'itv-backend'));
        }
    }

    /***
     * Usage examples:
     * wp mail_inactive_users volunteers_with_no_activity --registered_earlier_in_months=1
     */
    public function volunteers_with_no_activity($args, $assoc_args): void
    {
        $volunteers = self::IS_TEST_MODE ? self::$dummy_users : MemberManager::get_volunteers_with_no_activity($assoc_args['registered_earlier_in_months'] ?? null, $assoc_args['registered_later_in_months'] ?? null);

        if ($volunteers) {
            \WP_CLI::line(sprintf(__('Number of volunteers is %d.', 'itv_backend'), count($volunteers)));

            $template_props = [
                'task_list_url' => \get_home_url() . '/tasks',
            ];

            foreach ($volunteers as $user_index => ['user_id' => $user_id, 'user_name' => $user_name, 'user_email' => $user_email]) {
                $user_index += 1;

                \WP_CLI::line("user #{$user_index}: {$user_id} {$user_name}");

                $template_props['mailto'] = $user_email;
                $template_props['user_display_name'] = $user_name;
                $template_props['unsubscribe_url'] = self::$unsubscribe_url;

                \ItvAtvetka::instance()->mail('volunteers_no_activity_more_than_a_month_ago', $template_props);
            }

            \WP_CLI::success(__('Volunteers with no activity have got their mails.', 'itv-backend'));
        } else {
            \WP_CLI::warning(__('There are no volunteers matched your criteria.', 'itv-backend'));
        }
    }

    /***
     * Usage examples:
     * wp mail_inactive_users authors_created_a_task --created_earlier_in_months=12
     * wp mail_inactive_users authors_created_a_task --created_earlier_in_months=1 --created_later_in_months=6
     * wp mail_inactive_users authors_created_a_task --created_later_in_months=1
     */
    public function authors_created_a_task($args, $assoc_args): void
    {
        $created_earlier_in_months = $assoc_args['created_earlier_in_months'] ?? null;
        $created_later_in_months = $assoc_args['created_later_in_months'] ?? null;

        $mail_templates = [
            '12_' => 'authors_create_a_task_more_than_12_months_ago',
            '1_6' => 'authors_create_a_task_2_6_months_ago',
            '_1'  => 'authors_create_a_task_less_than_a_month_ago',
        ];

        $authors = self::IS_TEST_MODE ? self::$dummy_users : MemberManager::get_authors_created_a_task($created_earlier_in_months, $created_later_in_months);

        if ($authors) {
            \WP_CLI::line(sprintf(__('Number of authors is %d.', 'itv_backend'), count($authors)));

            if (!isset($mail_templates["{$created_earlier_in_months}_{$created_later_in_months}"])) {
                \WP_CLI::error(\__('Failed to find a mail template.', 'itv-backend'));

                return;
            }

            $template_props = [
                'create_task_url' => \get_home_url() . '/task-create',
            ];

            if ("{$created_earlier_in_months}_{$created_later_in_months}" === "_1") {
                $template_props['advices_for_npo_url'] = \get_home_url() . '/sovety-dlya-nko-uspeshnye-zadachi';
            }

            foreach ($authors as $user_index => ['user_id' => $user_id, 'user_name' => $user_name, 'user_email' => $user_email]) {
                $user_index += 1;

                \WP_CLI::line("user #{$user_index}: {$user_id} {$user_name}");

                $template_props['mailto'] = $user_email;
                $template_props['user_display_name'] = $user_name;
                $template_props['unsubscribe_url'] = self::$unsubscribe_url;

                \ItvAtvetka::instance()->mail($mail_templates["{$created_earlier_in_months}_{$created_later_in_months}"], $template_props);
            }

            \WP_CLI::success(__('Authors created a task have got their mails.', 'itv-backend'));
        } else {
            \WP_CLI::warning(__('There are no authors matched your criteria.', 'itv-backend'));
        }
    }

    /***
     * Usage examples:
     * wp mail_inactive_users volunteers_become_candidates --become_earlier_in_months=12
     * wp mail_inactive_users volunteers_become_candidates --become_earlier_in_months=1 --become_later_in_months=6
     * wp mail_inactive_users volunteers_become_candidates --become_later_in_months=1
     */
    public function volunteers_become_candidates($args, $assoc_args): void
    {
        $become_earlier_in_months = $assoc_args['become_earlier_in_months'] ?? null;
        $become_later_in_months = $assoc_args['become_later_in_months'] ?? null;

        $mail_templates = [
            '12_' => 'volunteers_become_candidates_more_than_12_months_ago',
            '1_6' => 'volunteers_become_candidates_2_6_months_ago',
            '_1'  => 'volunteers_become_candidates_less_than_a_month_ago',
        ];

        $volunteers = self::IS_TEST_MODE ? self::$dummy_users : MemberManager::get_volunteers_become_candidates($become_earlier_in_months, $become_later_in_months);

        if ($volunteers) {
            \WP_CLI::line(sprintf(__('Number of volunteers is %d.', 'itv_backend'), count($volunteers)));

            if (!isset($mail_templates["{$become_earlier_in_months}_{$become_later_in_months}"])) {
                \WP_CLI::error(\__('Failed to find a mail template.', 'itv-backend'));

                return;
            }

            $template_props = [
                'task_list_url' => \get_home_url() . '/tasks',
            ];

            if (in_array("{$become_earlier_in_months}_{$become_later_in_months}", ["_1", "1_6"])) {

                for ($i = 1; $i <= 5; $i++) {
                    $template_props["task_list_top_{$i}_url"] = "";
                    $template_props["task_list_top_{$i}_title"] = "";
                }

                $task_list_top = new \WP_Query([
                    'post_type'      => TaskManager::$post_type,
                    'post_status'    => 'publish',
                    'fields'         => 'ids',
                    'posts_per_page' => 5
                ]);

                if ($task_list_top->post_count > 0) {
                    foreach ($task_list_top->posts as $task_index => $task_id) {
                        $task_index += 1;
                        $template_props["task_list_top_{$task_index}_url"] = \get_home_url() . '/' . \get_post_field('post_name', $task_id);
                        $template_props["task_list_top_{$task_index}_title"] = \get_the_title($task_id);
                    }
                }
            }

            if ("{$become_earlier_in_months}_{$become_later_in_months}" === "_1") {
                $template_props['published_task_count'] = TaskStats::get_list(['publish'])['publish'];
            }

            foreach ($volunteers as $user_index => ['user_id' => $user_id, 'user_name' => $user_name, 'user_email' => $user_email, 'user_link' => $user_link]) {
                $user_index += 1;

                \WP_CLI::line("user #{$user_index}: {$user_id} {$user_name}");

                $template_props['mailto'] = $user_email;
                $template_props['user_display_name'] = $user_name;
                $template_props['unsubscribe_url'] = self::$unsubscribe_url;

                if ("{$become_earlier_in_months}_{$become_later_in_months}" === "_1") {
                    $template_props['member_account_url'] = $user_link;
                }

                \ItvAtvetka::instance()->mail($mail_templates["{$become_earlier_in_months}_{$become_later_in_months}"], $template_props);
            }

            \WP_CLI::success(__('Volunteers become candidates have got their mails.', 'itv-backend'));
        } else {
            \WP_CLI::warning(__('There are no volunteers matched your criteria.', 'itv-backend'));
        }
    }
}

\WP_CLI::add_command('mail_inactive_users', '\ITV\cli\MailInactiveUsers');
