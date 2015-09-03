<?php

class ItvNotificator {
	private $notif_to_send_count;
	private $notif_sent_count;
	private $tasks_to_check_count;
	private $already_sent_count;
	private $is_skip_sending = false;
	
	public function __construct() {
		global $wpdb;
		$this->sent_notifications_table = $wpdb->prefix.'sent_notifications';
	}
	
	public function disable_sending() {
		$this->is_skip_sending = true;
	}
	
	public function enable_sending() {
		$this->is_skip_sending = false;
	}
	
	public function reset_counters() {
		$this->notif_to_send_count = 0;
		$this->notif_sent_count = 0;
		$this->tasks_to_check_count = 0;
		$this->already_sent_count = 0;
	}
	
	public function print_counters() {
		echo sprintf("tasks_to_check_count=%d\n", $this->tasks_to_check_count);
		echo sprintf("notif_to_send_count=%d\n", $this->notif_to_send_count);
		echo sprintf("notif_sent_count=%d\n", $this->notif_sent_count);
		echo sprintf("already_sent_count=%d\n", $this->already_sent_count);
	}
	
	public function save_notification_fact($notif_type, $notif_id, $email) {
		global $wpdb;
		$wpdb->query(
			$wpdb->prepare(
				"
				INSERT INTO $this->sent_notifications_table
				SET time_add = NOW(), notif_type = %s, notif_id = %s, email = %s
				",
				$notif_type, $notif_id, $email
			)
		);
	}
	
	public function is_notification_sent($notif_type, $notif_id, $email) {
		global $wpdb;
		
		$sending_fact = $wpdb->get_row(
				$wpdb->prepare(
						"
						SELECT * FROM $this->sent_notifications_table
						WHERE notif_type = %s AND notif_id = %s AND email = %s
						ORDER BY time_add DESC
						",
						$notif_type, $notif_id, $email
				)
		);
		
		return $sending_fact ? true : false;
	}
	
	public function get_task_notif_key($task) {
		return md5($task->ID);
	}
	
	public function notify_about_tomorrow_archive(){
	
		$itv_config = ItvConfig::instance();
		$before_days = $itv_config->get('TASK_ARCHIVE_DAYS') - 2;
		$before_days += 1;
		$limit = strtotime(sprintf('-%d days', $before_days));
		
		echo 'before_limit=' . date('d.m.Y', $limit) . "\n";
		
		$args = array(
			'post_type' => 'tasks',
			'nopaging' => true,
			'post_status' => 'publish',
			'date_query' => array(
				array(
					'before'    => array(
						'year'  => date('Y', $limit),
						'month' => date('n', $limit),
						'day'   => date('j', $limit)
					)
				)
			)
		);
	
		$query = new WP_Query($args);
	
		$this->reset_counters();
		foreach($query->posts as $task){
			$this->tasks_to_check_count += 1;
			echo 'task_ID=' . $task->ID . " post_date=" . $task->post_date . "\n";
			$this->tomorrow_move_task_to_archive($task);
		}
		$this->print_counters();
	}
	
	public function tomorrow_move_task_to_archive($task){
			
		if(is_int($task))
			$task = get_post($task);
	
		if($task->post_status != 'publish') {
			echo "NOT_FIT: not publish\n";
			return; //only open task could be archived
		}
	
		//check
		$itv_config = ItvConfig::instance();
		$before_days = $itv_config->get('TASK_ARCHIVE_DAYS') - 2;
		$before_days += 1;
		$limit = date('Y-m-d', strtotime(sprintf('-%d days', $before_days)));
		if(date('Y-m-d', strtotime($task->post_date)) >= $limit) {
			echo "NOT_FIT: by post_date\n";
			return; //not too old
		}
	
		$doers = tst_get_task_doers_count($task->ID, true);
		if($doers > 0) {
			echo "NOT_FIT: doers found\n";
			return; //only task without doers ??
		}
	
		// send email notification to owner
		$email_templates = ItvEmailTemplates::instance();
		$task_permalink = get_permalink($task);
		$user_email = get_user_by('id', $task->post_author)->user_email;
		echo sprintf("%s\n", $user_email);
		echo 'task_ID=' . $task->ID . " post_date=" . $task->post_date . "\n";
		
		$this->notif_to_send_count += 1;
		
		if(!$this->is_notification_sent('tomorrow_move_task_to_archive', $this->get_task_notif_key($task), $user_email)) {
			if(!$this->is_skip_sending) {
				try {
					wp_mail(
					$user_email,
					$email_templates->get_title('task_will_be_moved_to_archive_tomorrow'),
					nl2br(sprintf($email_templates->get_text('task_will_be_moved_to_archive_tomorrow'), $task_permalink))
					);
					echo "SENT\n";
					$this->notif_sent_count += 1;
					$this->save_notification_fact('tomorrow_move_task_to_archive', $this->get_task_notif_key($task), $user_email);
				}
				catch(Exception $ex) {
					error_log($ex);
				}
			}
		}
		else {
			$this->already_sent_count += 1;
		}
	}
	
	/**  Notify about moving to archive soon **/
	public function notif_archive_soon_tasks(){
	
		$itv_config = ItvConfig::instance();
		$before_days = $itv_config->get('TASK_ARCHIVE_SOON_NOTIF_DAYS') - 2;
		if($before_days < 0) {
			$before_days = 0;
		}
		$after_days = $before_days + 2;
	
		$before_limit = strtotime(sprintf('-%d days', $before_days));
		$after_limit = strtotime(sprintf('-%d days', $after_days));
	
		echo 'before_limit=' . date('d.m.Y', $before_limit) . "\n";
		echo 'after_limit=' . date('d.m.Y', $after_limit) . "\n";
		
		$args = array(
			'post_type' => 'tasks',
			'nopaging' => true,				
			'post_status' => 'publish',
			'date_query' => array(
				array(
					'before'    => array(
						'year'  => date('Y', $before_limit),
						'month' => date('n', $before_limit),
						'day'   => date('j', $before_limit)
					),
					'after'    => array(
						'year'  => date('Y', $after_limit),
						'month' => date('n', $after_limit),
						'day'   => date('j', $after_limit)
					),
				)
			)
		);
	
		$query = new WP_Query($args);
	
		$this->reset_counters();
		foreach($query->posts as $task){
			$this->tasks_to_check_count += 1;
			echo 'task_ID=' . $task->ID . " post_date=" . $task->post_date . "\n";
			$this->notif_archive_soon_task($task);
		}
		$this->print_counters();
	}
	
	public function notif_archive_soon_task($task){
		if(is_int($task))
			$task = get_post($task);
	
		if($task->post_status != 'publish') {
			echo "NOT_FIT: not publish\n";
			return; //only open task could be archived
		}
	
		//check
		$itv_config = ItvConfig::instance();
		$before_days = $itv_config->get('TASK_ARCHIVE_SOON_NOTIF_DAYS') - 2;
		if($before_days < 0) {
			$before_days = 0;
		}
		$after_days = $before_days + 2;
			
		$before_time = strtotime(sprintf('-%d days', $before_days));
		$after_time = strtotime(sprintf('-%d days', $after_days));
		$task_time = strtotime($task->post_date);
	
		$before_date = date('Y-m-d', $before_time);
		$after_date = date('Y-m-d', $after_time);
		$task_date = date('Y-m-d', strtotime($task->post_date));
	
		if($task_date >= $before_date || $task_date < $after_date) {
			echo "NOT_FIT: by post_date\n";
			return; //not in period
		}
	
		$doers = tst_get_task_doers_count($task->ID, true);
		if($doers > 0) {
			echo "NOT_FIT: doers found\n";
			return; //only task without doers ??
		}
	
		// send email notification to owner
		$email_templates = ItvEmailTemplates::instance();
		$task_permalink = get_permalink($task);
		$days_till_archive = $itv_config->get('TASK_ARCHIVE_DAYS') - $itv_config->get('TASK_ARCHIVE_SOON_NOTIF_DAYS');
		$user_email = get_user_by('id', $task->post_author)->user_email;
		echo sprintf("%s\n", $user_email);
		
		$this->notif_to_send_count += 1;
		
		if(!$this->is_notification_sent('notif_archive_soon_task', $this->get_task_notif_key($task), $user_email)) {
			if(!$this->is_skip_sending) {
				try {
					wp_mail(
						$user_email,
						$email_templates->get_title('task_archive_soon_notif'),
						nl2br(sprintf($email_templates->get_text('task_archive_soon_notif'), $days_till_archive, $task_permalink))
					);
					echo "SENT\n";
					$this->save_notification_fact('notif_archive_soon_task', $this->get_task_notif_key($task), $user_email);
					$this->notif_sent_count += 1;
				}
				catch(Exception $ex) {
					error_log($ex);
				}
			}
		}
		else {
			$this->already_sent_count += 1;
		}
				
	}
	
	/**  Notify about still no doer **/
	public function notif_no_tasks_doer_yet(){
	
		$itv_config = ItvConfig::instance();
		$before_days = $itv_config->get('TASK_NO_DOER_NOTIF_DAYS') - 2;
		if($before_days < 0) {
			$before_days = 0;
		}
		$after_days = $before_days + 2;
	
		$before_limit = strtotime(sprintf('-%d days', $before_days));
		$after_limit = strtotime(sprintf('-%d days', $after_days));
		echo 'before_limit=' . date('d.m.Y', $before_limit) . "\n";
		echo 'after_limit=' . date('d.m.Y', $after_limit) . "\n";
	
		$args = array(
			'post_type' => 'tasks',
			'nopaging' => true,
			'post_status' => 'publish',
			'date_query' => array(
				array(
					'before'    => array(
						'year'  => date('Y', $before_limit),
						'month' => date('n', $before_limit),
						'day'   => date('j', $before_limit)
					),
					'after'    => array(
						'year'  => date('Y', $after_limit),
						'month' => date('n', $after_limit),
						'day'   => date('j', $after_limit)
					),
				)
			)
		);
	
		$query = new WP_Query($args);
	
		$this->reset_counters();
		foreach($query->posts as $task){
			$this->tasks_to_check_count += 1;
			echo 'task_ID=' . $task->ID . " post_date=" . $task->post_date . "\n";
			$this->notif_no_task_doer_yet($task);
		}
		$this->print_counters();
	}
	
	public function notif_no_task_doer_yet($task){
	
		if(is_int($task))
			$task = get_post($task);
	
		if($task->post_status != 'publish') {
			echo "NOT_FIT: not publish\n";
			return; //only open task could be archived
		}
	
		//check
		$itv_config = ItvConfig::instance();
		$before_days = $itv_config->get('TASK_NO_DOER_NOTIF_DAYS') - 2;
		if($before_days < 0) {
			$before_days = 0;
		}
		$after_days = $before_days + 2;
	
		$before_time = strtotime(sprintf('-%d days', $before_days));
		$after_time = strtotime(sprintf('-%d days', $after_days));
		$task_time = strtotime($task->post_date);
	
		$before_date = date('Y-m-d', $before_time);
		$after_date = date('Y-m-d', $after_time);
		$task_date = date('Y-m-d', strtotime($task->post_date));
	
		if($task_date >= $before_date || $task_date <= $after_date) {
			echo "NOT_FIT: by post_date\n";
			return; //not in period
		}
	
		$doers = tst_get_task_doers_count($task->ID, true);
		if($doers > 0) {
			echo "NOT_FIT: doers found\n";
			return; //only task without doers ??
		}
	
		// send email notification to owner
		$email_templates = ItvEmailTemplates::instance();
		$task_permalink = get_permalink($task);
		$days_left = $itv_config->get('TASK_NO_DOER_NOTIF_DAYS');
		$user_email = get_user_by('id', $task->post_author)->user_email;
		echo sprintf("%s\n", $user_email);
		
		$this->notif_to_send_count += 1;
		
		if(!$this->is_notification_sent('notif_no_task_doer_yet', $this->get_task_notif_key($task), $user_email)) {
			if(!$this->is_skip_sending) {
				try {
					wp_mail(
						$user_email,
						$email_templates->get_title('task_no_doer_notif'),
						nl2br(sprintf($email_templates->get_text('task_no_doer_notif'), $days_left, $task_permalink))
					);
					echo "SENT\n";
					$this->save_notification_fact('notif_no_task_doer_yet', $this->get_task_notif_key($task), $user_email);
					$this->notif_sent_count += 1;
				}
				catch(Exception $ex) {
					error_log($ex);
				}
			}
		}
		else {
			$this->already_sent_count += 1;
		}
	}
}
