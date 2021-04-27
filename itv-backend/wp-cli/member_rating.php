<?php

namespace ITV\cli;

use ITV\models\{Task, MongoClient, MemberManager};

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

            $sql = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}itv_rating (
`id` bigint(20) NOT NULL AUTO_INCREMENT,
`user_id` bigint(20) NULL DEFAULT NULL,
`month` bigint(20) NOT NULL,
`year` bigint(20) NOT NULL,
`updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
PRIMARY KEY (`id`),
CONSTRAINT `user_comment` UNIQUE (`user_id`, `month`, `year`),
) ENGINE=MyISAM DEFAULT CHARSET=utf8";
            
            $res = $wpdb->query($sql);
            
            if(is_wp_error($res)) {
                echo $res->get_message();
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
        ["month" => $month, "year" => $year] = $assoc_args;

        if (!is_numeric($month)) {

            \WP_CLI::warning(__('Int month number is required.', 'itv-backend'));

            return;
        }

        if (!is_numeric($year)) {

            \WP_CLI::warning(__('Int year is required.', 'itv-backend'));

            return;
        }

        $month = (int) $month;
        $year = (int) $year;

        \WP_CLI::line("month=" . $month);
        \WP_CLI::line("year=" . $year);

        global $wpdb;

        $user_id_list = $wpdb->get_col( $wpdb->prepare( 
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

        \WP_CLI::line(print_r(array_slice($user_id_list, 0, 10), true));

        \WP_CLI::success(__('The task is successfully updated.', 'itv-backend'));
    }

}

\WP_CLI::add_command('itv_member_rating', '\ITV\cli\MemberRating');
