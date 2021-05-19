<?php
namespace ITV\models;

use \ITV\models\MemberTasks;

class MemberRatingDoers {
    const START_YEAR = 2015;
    const TABLE = 'itv_rating_doers';
    private $user_id = null;
    private $member_tasks_manager = null;

    public function __construct($user_id) {
        $this->user_id = $user_id;
        $this->member_tasks_manager = new MemberTasks($this->user_id);
    }    

    public function store_all_periods_rating() {
        global $wpdb;
        
        $sql = "SELECT COUNT(posts.ID) AS solved_tasks_count, SUBSTRING(tact.action_time, 1, 7) AS action_month 
        FROM {$wpdb->posts} AS posts
        INNER JOIN {$wpdb->prefix}p2p AS p2p
            ON p2p.p2p_from = posts.ID
        INNER JOIN {$wpdb->prefix}p2pmeta AS p2pmeta
            ON p2p.p2p_id = p2pmeta.p2p_id
        JOIN {$wpdb->prefix}itv_task_actions_log AS tact
            ON tact.task_id = posts.ID
                AND tact.action = 'close'
        WHERE posts.post_type = 'tasks' AND posts.post_status = 'closed'
            AND p2p.p2p_type = 'task-doers' AND posts.ID = p2p.p2p_from
            AND p2p.p2p_to = %d AND p2pmeta.meta_key = 'is_approved'
            AND CAST(p2pmeta.meta_value AS CHAR) = '1'
        group by action_month";

        $result = $wpdb->get_results( $wpdb->prepare($sql, $this->user_id) );
        
        $now_year = intval(date('Y'));
        $wpdb->query('START TRANSACTION');
        try {
            for($year = self::START_YEAR; $year <= $now_year; $year++) {
                $year_count = 0;
                for($month = 0; $month <= 12; $month++) {
                    $month_str = sprintf('%02d', $month);
    
                    foreach($result as $row) {
                        if($row->action_month === $year . "-" . $month_str) {
                            $year_count += $row->solved_tasks_count;
                            $this->store_rating($year, $month, $row->solved_tasks_count);
                            break;
                        }
                    }
                    // $this->store_month_rating($year, $month);
                }

                $this->store_rating($year, 0, $year_count);
            }
        }
        catch(Exception $ex) {
            $wpdb->query('ROLLBACK');
        }
        $wpdb->query('COMMIT');
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
            join (
                SELECT t1.*, count(t2.user_id) AS count_before
                FROM `{$wpdb->prefix}{$table}` as t1 
                join {$wpdb->prefix}{$table} as t2 
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
                    and tstats.month = t3.month
            SET t3.position = tstats.count_before + 1
            WHERE t3.year = %d and t3.month = %d";

        $sql_champion = "update `{$wpdb->prefix}{$table}` 
            SET position = 1
            WHERE year = %d 
                AND month = %d
                AND solved_tasks_count > 0
                AND position = 0";

        foreach($years as $year) {
            foreach($months as $month) {
                $wpdb->query( $wpdb->prepare($sql, $year, $month, $year, $month) );
                $wpdb->query( $wpdb->prepare($sql_champion, $year, $month) );
            }
        }
    }
}
