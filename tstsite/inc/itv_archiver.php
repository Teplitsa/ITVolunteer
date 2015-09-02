<?php

class ItvArchiver {
	private $tasks_to_archive_count;
	private $notif_sent_count;
	private $tasks_to_check_count;
	private $tasks_archived_count;
	private $is_skip_sending = false;
	private $is_skip_archiving = false;
	
	public function disable_sending() {
		$this->is_skip_sending = true;
	}
	
	public function enable_sending() {
		$this->is_skip_sending = false;
	}
	
	public function disable_archiving() {
		$this->is_skip_archiving = true;
	}
	
	public function enable_archiving() {
		$this->is_skip_archiving = false;
	}
	
	public function reset_counters() {
		$this->tasks_to_archive_count = 0;
		$this->notif_sent_count = 0;
		$this->tasks_to_check_count = 0;
		$this->tasks_archived_count = 0;
	}
	
	public function print_counters() {
		echo sprintf("tasks_to_check_count=%d\n", $this->tasks_to_check_count);
		echo sprintf("tasks_to_archive_count=%d\n", $this->tasks_to_archive_count);
		echo sprintf("tasks_archived_count=%d\n", $this->tasks_archived_count);
		echo sprintf("notif_sent_count=%d\n", $this->notif_sent_count);
	}
	
	/**  Archived tasks manipulations **/
	public function archive_tasks(){
	
		$itv_config = ItvConfig::instance();
		$before_days = $itv_config->get('TASK_ARCHIVE_DAYS') - 2;
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
	
		$this->reset_counters();
		$query = new WP_Query($args);
		foreach($query->posts as $task){
			$this->tasks_to_check_count += 1;
// 			echo '$task=' . $task->ID . "\n";
// 			echo $task->post_date . "\n";
			$this->move_task_to_archive($task);
		}
		$this->print_counters();
	}
	
	//add_action('save_post_tasks', 'tst_move_task_to_archive');
	public function move_task_to_archive($task){
	
		if(is_int($task))
			$task = get_post($task);
	
		if($task->post_status != 'publish')
			return; //only open task could be archived
	
		//check
		$itv_config = ItvConfig::instance();
		$before_days = $itv_config->get('TASK_ARCHIVE_DAYS') - 2;
		$limit = strtotime(sprintf('-%d days', $before_days));
		if(date('Y-m-d', strtotime($task->post_date)) >= $limit)
			return; //not too old
	
		$doers = tst_get_task_doers_count($task->ID);
		if($doers > 0)
			return; //only task without doers ??
	
		$this->tasks_to_archive_count += 1;
		
		if(!$this->is_skip_archiving) {		
			//update
			$postarr['ID'] = $task->ID;
			$postarr['post_status'] = 'archived';
		
			wp_update_post($postarr);
			// log archive action
			ItvLog::instance()->log_task_action($task->ID, ItvLog::$ACTION_TASK_ARCHIVE);
			$this->tasks_archived_count += 1;
		}
		
		// send email notification to owner
		$email_templates = ItvEmailTemplates::instance();
		$task_permalink = get_permalink($task);
		$user_email = get_user_by('id', $task->post_author)->user_email;
		echo sprintf("%s\n", $user_email);
		echo 'task=' . $task->ID . "\n";
		echo $task->post_date . "\n";
		
		if(!$this->is_skip_sending) {				
			try {
				wp_mail(
					$user_email,
					$email_templates->get_title('task_moved_to_archive'),
					nl2br(sprintf($email_templates->get_text('task_moved_to_archive'), $task_permalink))
				);
				$this->notif_sent_count += 1;
			}
			catch(Exception $ex) {
				error_log($ex);
			}
		}
	}

}
