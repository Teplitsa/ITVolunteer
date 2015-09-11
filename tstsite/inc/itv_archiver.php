<?php

require_once('itv_notificator.php');

class ItvArchiver extends ItvNotificator {
	protected $tasks_to_archive_count;
	protected $tasks_archived_count;
	protected $is_skip_archiving = false;
	protected $is_debug = false;
	
	public function disable_archiving() {
		$this->is_skip_archiving = true;
	}
	
	public function enable_archiving() {
		$this->is_skip_archiving = false;
	}
	
	public function reset_counters() {
		parent::reset_counters();
		$this->tasks_to_archive_count = 0;
		$this->tasks_archived_count = 0;
	}
	
	public function print_counters() {
		parent::print_counters();
		echo sprintf("tasks_to_archive_count=%d\n", $this->tasks_to_archive_count);
		echo sprintf("tasks_archived_count=%d\n", $this->tasks_archived_count);
	}
	
	/**  Archived tasks manipulations **/
	public function archive_tasks(){
	
		$itv_config = ItvConfig::instance();
		$before_days = $itv_config->get('TASK_ARCHIVE_DAYS');
		$limit = strtotime(sprintf('-%d days', $before_days));
		
		echo 'before_limit=' . date('d.m.Y', $limit) . "\n";
	
		$args = array(
			'post_type' => 'tasks',
			'nopaging' => true,
			'post_status' => 'publish',
			'date_query' => array(
				array(
					'column' => 'post_modified',
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
			$this->pring_debug('task_ID=' . $task->ID . " post_modified=" . $task->post_modified . "\n");
			$this->move_task_to_archive($task);
		}
		$this->print_counters();
	}
	
	public function move_task_to_archive($task){
		global $wpdb;
	
		if(is_int($task))
			$task = get_post($task);
	
		if($task->post_status != 'publish') {
			$this->pring_debug("NOT_FIT: not publish\n");
			return; //only open task could be archived
		}
	
		//check
		$itv_config = ItvConfig::instance();
		$before_days = $itv_config->get('TASK_ARCHIVE_DAYS');
		$limit = strtotime(sprintf('-%d days', $before_days));
		if(date('Y-m-d', strtotime($task->post_modified)) >= $limit) {
			$this->pring_debug("NOT_FIT: by date\n");
			return; //not too old
		}
	
		$doers = tst_get_task_doers_count($task->ID, true, true);
		if($doers > 0) {
			$this->pring_debug("NOT_FIT: doers found\n");
			return; //only task without doers ??
		}
	
		$this->tasks_to_archive_count += 1;
		
		if(!$this->is_skip_archiving) {		
			//update
			$wpdb->update( $wpdb->posts, array( 'post_status' => 'archived' ),
				array( 'ID' => $task->ID )
			);
			
			wp_update_post($postarr);
			$this->pring_debug("ARCHIVED\n");
			// log archive action
			ItvLog::instance()->log_task_action($task->ID, ItvLog::$ACTION_TASK_ARCHIVE);
			$this->tasks_archived_count += 1;
		}
	}

}
