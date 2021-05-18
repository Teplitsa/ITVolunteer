<?php
namespace ITV\models;

use \ITV\models\MemberTasks;

class MemberRatingDoers {
    const START_YEAR = 2014;
    const TABLE = 'itv_rating_doers';
    private $user_id = null;
    private $member_tasks_manager = null;

    public function __construct($user_id) {
        $this->user_id = $user_id;
        $this->member_tasks_manager = new MemberTasks($this->user_id);
    }    

    public function store_all_periods_rating() {
        $now_year = intval(date('Y'));
        for($year = self::START_YEAR; $year <= $now_year; $year++) {
            for($month = 0; $month <= 12; $month++) {
                $this->store_month_rating($year, $month);
            }
        }
    }

    public function store_month_rating($year, $month) {
        if($month) {
            $solved_tasks_count = $this->member_tasks_manager->calc_member_solved_tasks_in_month($year, $month);
        }
        else {
            $solved_tasks_count = $this->member_tasks_manager->calc_member_solved_tasks_in_year($year);
        }

        $this->store_rating($year, $month, $solved_tasks_count);
    }

    public function store_all_time_rating() {
        $solved_tasks_count = $this->member_tasks_manager->calc_member_solved_tasks();
        $this->store_rating(0, 0, $solved_tasks_count);
    }

    public function store_rating($year, $month, $solved_tasks_count) {
        global $wpdb;

        $res = $wpdb->replace($wpdb->prefix . self::TABLE, [
            'user_id' => $this->user_id,
            'year' => $year,
            'month' => $month,
            'solved_tasks_count' => $solved_tasks_count,
            'updated_at' => current_time('mysql'),
        ]);

        if($res === false) {
            \WP_CLI::error($wpdb->last_error);
        }
    }

    public static function recalculate_positions($year = null, $month = null) {
        global $wpdb;

        if($year === null) {
            $years = [];
            $now_year = intval(date('Y'));
            for($year = self::START_YEAR; $year <= $now_year; $year++) {
                $years[] = $year;
            }

        }
        else {
            $years = [intval($year)];
        }

        if($month === null) {
            $months = [];
            for($month = 0; $month <= 12; $month++) {
                $months[] = $month;
            }
        }
        else {
            $months = [intval($month)];
        }

        $table = self::TABLE;
        $sql = "update `{$wpdb->prefix}{$table}` as t3 
            left join (
                SELECT t1.*, count(t2.user_id) + 1 AS count_before
                FROM `{$wpdb->prefix}{$table}` as t1 
                left join {$wpdb->prefix}{$table} as t2 
                    on t2.year = t1.year
                        and t2.month = t1.month
                        and (t2.solved_tasks_count > t1.solved_tasks_count
                        OR (
                            t2.solved_tasks_count = t1.solved_tasks_count 
                            AND t2.user_id > t1.user_id
                        ))
                WHERE t1.year = %d and t1.month = %d group by t1.user_id
            ) as tstats
                on tstats.user_id = t3.user_id
                    and tstats.year = t3.year 
                    and tstats.month = tstats.month
            SET t3.position = tstats.count_before
            WHERE t3.year = %d and t3.month = %d";

        foreach($years as $year) {
            foreach($months as $month) {
                $wpdb->query( $wpdb->prepare($sql, $year, $month, $year, $month) );
            }
        }
    }
}
