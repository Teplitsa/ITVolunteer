<?php
namespace ITV\models;

use \ITV\models\MemberTasks;
use \ITV\dao\Review;
use \ITV\models\UserXPModel;

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
        $points = (int) UserXPModel::instance()->get_user_xp($this->user_id);

        $wpdb->query('START TRANSACTION');
        try {
            for($year = self::START_YEAR; $year <= $now_year; $year++) {
                $year_count = 0;
                for($month = 1; $month <= 12; $month++) {
                    $month_str = sprintf('%02d', $month);
    
                    foreach($result as $row) {
                        if($row->action_month === $year . "-" . $month_str) {
                            $year_count += $row->solved_tasks_count;

                            $reviews_data = $this->get_reviews_data($year, $month);
                            $rating_data = [
                                'solved_tasks_count' => $year_count,
                                'points' => $points,
                            ];
                            $rating_data = array_merge($rating_data, $reviews_data);
                    
                            $this->store_rating($year, $month, $rating_data);
                            break;
                        }
                    }
                    // $this->store_month_rating($year, $month);
                }

                $reviews_data = $this->get_reviews_data($year, 0);
                $rating_data = [
                    'solved_tasks_count' => $year_count,
                    'points' => $points,
                ];
                $rating_data = array_merge($rating_data, $reviews_data);

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

        $reviews_data = $this->get_reviews_data($year, $month);
        $points = (int) UserXPModel::instance()->get_user_xp($this->user_id);
        $rating_data = [
            'solved_tasks_count' => $solved_tasks_count,
            'points' => $points,
        ];
        $rating_data = array_merge($rating_data, $reviews_data);

        $this->store_rating($year, $month, $rating_data);
    }

    public function store_all_time_rating() {
        $solved_tasks_count = $this->member_tasks_manager->calc_member_solved_tasks();

        $reviews_data = $this->get_reviews_data();
        $points = (int) UserXPModel::instance()->get_user_xp($this->user_id);
        $rating_data = [
            'solved_tasks_count' => $solved_tasks_count,
            'points' => $points,
        ];
        $rating_data = array_merge($rating_data, $reviews_data);

        $this->store_rating(0, 0, $rating_data);
    }

    public function store_rating($year, $month, $rating_data) {
        global $wpdb;

        $result_rating_data = array_merge($rating_data, [
            'user_id' => $this->user_id,
            'year' => $year,
            'month' => $month,
            'updated_at' => current_time('mysql'),
        ]);

        $res = $wpdb->replace($wpdb->prefix . self::TABLE, $result_rating_data);

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
            LEFT JOIN (
                SELECT t1.*, count(t2.user_id) AS count_before
                FROM `{$wpdb->prefix}{$table}` as t1 
                join {$wpdb->prefix}{$table} as t2 
                    on t2.year = t1.year
                        AND t2.month = t1.month
                        AND (
                            t2.solved_tasks_count > t1.solved_tasks_count
                            OR (
                                t2.solved_tasks_count = t1.solved_tasks_count 
                                AND (
                                    t2.reviews_count > t1.reviews_count
                                    OR (
                                        t2.reviews_count = t1.reviews_count
                                        AND (
                                            t2.reviews_rating > t1.reviews_rating
                                            OR (
                                                t2.reviews_rating = t1.reviews_rating
                                                AND (
                                                    t2.points > t1.points
                                                    OR (
                                                        t2.points = t1.points
                                                        AND t2.user_id < t1.user_id
                                                    )
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        )
                WHERE t1.year = %d and t1.month = %d group by t1.user_id
            ) as tstats
                on tstats.user_id = t3.user_id
                    and tstats.year = t3.year 
                    and tstats.month = t3.month
            SET t3.position = IF(tstats.count_before IS NULL, 1, tstats.count_before + 1)
            WHERE t3.year = %d and t3.month = %d";

        foreach($years as $year) {
            foreach($months as $month) {
                echo "positions for: {$year}-{$month}\n";
                $wpdb->query( $wpdb->prepare($sql, $year, $month, $year, $month) );
            }
        }
    }

    public function get_reviews_data($year = null, $month = null) {
        $query = Review::where([
            'doer_id' => $this->user_id,
        ]);

        $time_add = '';
        if($year) {
            $time_add .= $year . '-';

            if($month) {
                $time_add .= sprintf('%02d', $month) . '-';
            }
        }

        if($time_add) {
            $query->where('time_add', 'LIKE', $time_add . '%');
        }

        $ratings = [];
        $reviews_count = 0;
        $reviews_as_doer = $query->get();
        foreach ($reviews_as_doer as $review) {
            if ($review['rating']) {
                $reviews_count += 1;
                $ratings[] = $review['rating'];
            }

            if ($review['communication_rating']) {
                $ratings[] = $review['communication_rating'];
            }
        }

        $reviews_rating = !empty($ratings) ? array_sum($ratings) / count($ratings) : 0;

        return [
            'reviews_count' => $reviews_count,
            'reviews_rating' => $reviews_rating,
        ];
    }
}
