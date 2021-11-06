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
                `user_id` bigint NOT NULL,
                `month` TINYINT NOT NULL,
                `year` SMALLINT NOT NULL,
                `solved_tasks_count` int NOT NULL,
                `position` int NOT NULL DEFAULT 0,
                `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (`user_id`, `month`, `year`),
                KEY period (`month`, `year`)
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

    public function update_db_reviews_points()
    {
        global $wpdb;

        try {
            $time_start = microtime(true);
            \WP_CLI::line('Memory before anything: ' . memory_get_usage(true));

            $table = MemberRatingDoers::TABLE;
            $sql = "ALTER TABLE {$wpdb->prefix}{$table}
                ADD `reviews_count` INT NOT NULL DEFAULT '0' AFTER `solved_tasks_count`, 
                ADD `reviews_rating` DECIMAL(10,4) NOT NULL DEFAULT '0.0000' AFTER `reviews_count`, 
                ADD `points` INT NOT NULL DEFAULT '0' AFTER `reviews_rating`";

            // \WP_CLI::line($sql);
            
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

    public function reset()
    {
        global $wpdb;

        try {
            $time_start = microtime(true);
            \WP_CLI::line('Memory before anything: ' . memory_get_usage(true));

            $table = MemberRatingDoers::TABLE;
            $sql = "DROP TABLE {$wpdb->prefix}{$table}";

            // \WP_CLI::line($sql);
            
            $res = $wpdb->query($sql);
            
            if($res === false) {
                \WP_CLI::error($wpdb->last_error);
            }

            // fultext index
            $sql = "DROP INDEX display_name_IDX ON {$wpdb->users}";
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

        $role = MemberManager::$ROLE_DOER;
        $user_id_list = $current_user_id ? [$current_user_id] : $wpdb->get_col( $wpdb->prepare( 
            "SELECT users.ID
                FROM        {$wpdb->users} users
                INNER JOIN  {$wpdb->usermeta} key1 
                        ON  key1.user_id = users.ID
                        AND key1.meta_key = %s 
                WHERE       key1.meta_value LIKE '%\"{$role}\"%'
                ORDER BY    users.id",
            $wpdb->prefix . "capabilities"
        ));
        // \WP_CLI::line(print_r(array_slice($user_id_list, 0, 10), true));

        if(!$month) {
            $month = intval(date('m', time() - 24 * 3600));
        }
        \WP_CLI::line("calc for month=" . $month);

        if(!$year) {
            $year = intval(date('Y', time() - 24 * 3600));
        }
        \WP_CLI::line("calc for year=" . $year);

        foreach($user_id_list as $user_id) {
            \WP_CLI::line("user: " . $user_id);

            $rating_calculator = new MemberRatingDoers($user_id);

            if($all) {
                $rating_calculator->store_all_periods_rating();
                $rating_calculator->store_all_time_rating();
            }
            else {
                $rating_calculator->store_month_rating($year, $month);
            }
        }

        \WP_CLI::line("recalc positions...");

        if($all) {
            MemberRatingDoers::recalculate_positions();
        }
        else {
            MemberRatingDoers::recalculate_positions($year, $month);
        }
        MemberRatingDoers::recalculate_positions(0, 0);

        \WP_CLI::success(__('Done.', 'itv-backend'));
    }

}

\WP_CLI::add_command('itv_member_rating', '\ITV\cli\MemberRating');
