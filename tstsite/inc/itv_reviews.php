<?php

class ItvReviews {
	private static $_instance = NULL;
	
	public function __construct() {
		global $wpdb;
		$this->db_table = $wpdb->prefix.'reviews';
	}
	
	public static function instance() {
		if(ItvReviews::$_instance == NULL) {
			ItvReviews::$_instance = new ItvReviews();
		}
		return ItvReviews::$_instance;
	}
	
	public function add_review($author_id, $doer_id, $task_id, $message) {
		global $wpdb;
		
		$wpdb->query(
				$wpdb->prepare(
						"
						INSERT INTO $this->db_table
						SET author_id = %d, doer_id = %d, task_id = %d, message = %s, time_add = NOW()
						",
						$author_id, $doer_id, $task_id, $message
				)
		);
	}
	
	public function get_doer_reviews_short_list($doer_id) {
		global $wpdb;
	
		$actions = $wpdb->get_results(
				$wpdb->prepare(
						"
						SELECT * FROM $this->db_table
						WHERE doer_id = %d
						ORDER BY time_add DESC
						LIMIT 10
						",
						$doer_id
				)
		);
	
		return $actions;
	}
	
	public function is_review_for_doer_and_task($doer_id, $task_id) {
		global $wpdb;
		return intval($wpdb->get_var(
				$wpdb->prepare(
				"
				SELECT COUNT(*) FROM $this->db_table
				WHERE doer_id = %d AND task_id = %d
				",
				$doer_id, $task_id
				)
		)) > 0 ? true : false;
	}
	
	public function count_reviews_for_doer($doer_id) {
		global $wpdb;
		return intval($wpdb->get_var(
				$wpdb->prepare(
						"
						SELECT COUNT(*) FROM $this->db_table
						WHERE doer_id = %d
						",
						$doer_id
				)
		));
	}
	
	public function get_doer_reviews($doer_id, $offset = 0, $limit = 5) {
		global $wpdb;
		
		$offset = (int)$offset;
		$limit = (int)$limit;
		
		$reviews = $wpdb->get_results(
				$wpdb->prepare(
					"
					SELECT * FROM $this->db_table
					WHERE doer_id = %d
					ORDER BY time_add DESC
					LIMIT %d, %d
					",
					$doer_id, $offset, $limit
				)
		);
		
		return $reviews;
	}
}
