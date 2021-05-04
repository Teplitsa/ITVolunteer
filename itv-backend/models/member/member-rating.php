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
            for($month = 1; $month <= 12; $month++) {
                $this->store_month_rating($year, $month);
            }
        }
    }

    public function store_month_rating($year, $month) {
        $solved_tasks_count = $this->member_tasks_manager->calc_member_solved_tasks_in_month($year, $month);
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
}
