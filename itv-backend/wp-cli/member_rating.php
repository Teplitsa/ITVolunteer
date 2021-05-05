<?php

namespace ITV\cli;

use ITV\models\{Task, MongoClient, MemberManager, MemberRatingDoers};

if (!class_exists('\WP_CLI')) {
    return;
}

class MemberRating
{
    public function setup()
    {
        global $wpdb;

        try {
            $time_start = microtime(true);
            \WP_CLI::line('Memory before anything: ' . memory_get_usage(true));

            $table = MemberRatingDoers::TABLE;
            $sql = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}{$table} (
                `user_id` bigint(20) NOT NULL,
                `month` bigint(20) NOT NULL,
                `year` bigint(20) NOT NULL,
                `solved_tasks_count` int(20) NOT NULL,
                `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
                PRIMARY KEY (`user_id`, `month`, `year`),
                KEY (`month`, `year`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";

            // \WP_CLI::line($sql);
            
            $res = $wpdb->query($sql);
            
            if($res === false) {
                \WP_CLI::error($wpdb->last_error);
            }

            // fultext index
            $sql = "CREATE FULLTEXT INDEX display_name_IDX ON {$wpdb->users} (display_name)";
            $res = $wpdb->query($sql);
            
            if($res === false) {
                \WP_CLI::error($wpdb->last_error);
            }
            
            \WP_CLI::line('DONE');
        
            //Final
            \WP_CLI::line('Memory ' . memory_get_usage(true));
            \WP_CLI::line('Total execution time in sec: ' . (microtime(true) - $time_start));

            \WP_CLI::success(__('Table created.', 'itv-backend'));
            
        }
        catch (Exception $ex) {
            \WP_CLI::error($ex);
        }        
    }

    public function build_month_doers($args, $assoc_args)
    {
        \WP_CLI::line("assoc_args=" . print_r($assoc_args, true));

        $assoc_args_name = ["month", "year", "all"];
        foreach($assoc_args_name as $arg_name) {
            if(isset($assoc_args[$arg_name])) {
                $$arg_name = $assoc_args[$arg_name];
            }
            else {
                $$arg_name = null;
            }
        }

        $current_user_id = \get_current_user_id(); // set by --user param

        if ($month && !is_numeric($month)) {

            \WP_CLI::warning(__('Month must be a valid int.', 'itv-backend'));

            return;
        }

        if($year && !is_numeric($year)) {

            \WP_CLI::warning(__('Year must be a valid int.', 'itv-backend'));

            return;
        }

        $month = intval($month);
        $year = intval($year);

        \WP_CLI::line("month=" . $month);
        \WP_CLI::line("year=" . $year);
        \WP_CLI::line("user=" . $current_user_id);
        \WP_CLI::line("all=" . $all);

        global $wpdb;

        $user_id_list = $current_user_id ? [$current_user_id] : $wpdb->get_col( $wpdb->prepare( 
            "SELECT users.ID
                FROM        {$wpdb->users} users
                INNER JOIN  {$wpdb->usermeta} key1 
                        ON  key1.user_id = users.ID
                        AND key1.meta_key = %s 
                WHERE       key1.meta_value = %s
                ORDER BY    users.id",
            MemberManager::$meta_role, 
            MemberManager::$ROLE_DOER
        ));
        // \WP_CLI::line(print_r(array_slice($user_id_list, 0, 10), true));

        foreach($user_id_list as $user_id) {
            $rating_calculator = new MemberRatingDoers($user_id);

            if($all) {
                $rating_calculator->store_all_periods_rating();
                $rating_calculator->store_all_time_rating();
            }
            else {
                $rating_calculator->store_month_rating($year, $month);
            }
        }

        \WP_CLI::success(__('The task is successfully updated.', 'itv-backend'));
    }

}

\WP_CLI::add_command('itv_member_rating', '\ITV\cli\MemberRating');
