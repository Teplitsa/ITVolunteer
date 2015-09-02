<?php

class ItvNotificator {
	public function notify_about_tomorrow_archive(){
	
		$itv_config = ItvConfig::instance();
		$before_days = $itv_config->get('TASK_ARCHIVE_SOON_NOTIF_DAYS');
		$before_days += 1;
		$limit = strtotime(sprintf('-%d days', $before_days));
		$args = array(
			'post_type' => 'tasks',
			'post_per_page' => -1,
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
		if(!$query->have_posts())
			return;
	
		foreach($query->posts as $task){
			$this->tomorrow_move_task_to_archive($task);
		}
	}
	
	public function tomorrow_move_task_to_archive($task){
			
		if(is_int($task))
			$task = get_post($task);
	
		if($task->post_status != 'publish')
			return; //only open task could be archived
	
		//check
		$itv_config = ItvConfig::instance();
		$before_days = $itv_config->get('TASK_ARCHIVE_SOON_NOTIF_DAYS');
		$before_days += 1;
		$limit = date('Y-m-d', strtotime(sprintf('-%d days', $before_days)));
		if(date('Y-m-d', strtotime($task->post_date)) >= $limit)
			return; //not too old
	
		$doers = tst_get_task_doers_count($task->ID);
		if($doers > 0)
			return; //only task without doers ??
	
		//update
		$postarr['ID'] = $task->ID;
		$postarr['post_status'] = 'archived';
	
		wp_update_post($postarr);
	
		// log archive action
		ItvLog::instance()->log_task_action($task->ID, ItvLog::$ACTION_TASK_ARCHIVE);
	
		// send email notification to owner
		$email_templates = ItvEmailTemplates::instance();
		$task_permalink = get_permalink($task);
		try {
			wp_mail(
				get_user_by('id', $task->post_author)->user_email,
				$email_templates->get_title('task_will_be_moved_to_archive_tomorrow'),
				nl2br(sprintf($email_templates->get_text('task_will_be_moved_to_archive_tomorrow'), $task_permalink))
			);
		}
		catch(Exception $ex) {
			error_log($ex);
		}
	}
	
	/**  Notify about moving to archive soon **/
	public function notif_archive_soon_tasks(){
	
		$itv_config = ItvConfig::instance();
		$before_days = $itv_config->get('TASK_ARCHIVE_SOON_NOTIF_DAYS');
		$after_days = $before_days + 10;
	
		$before_limit = strtotime(sprintf('-%d days', $before_days));
		$after_limit = strtotime(sprintf('-%d days', $after_days));
	
		$args = array(
			'post_type' => 'tasks',
			'post_per_page' => -1,
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
		if(!$query->have_posts())
			return;
	
		foreach($query->posts as $task){
			$this->notif_archive_soon_task($task);
		}
	}
	
	public function notif_archive_soon_task($task){
		echo "try notif: " . $task->ID . "\n";
	
		if(is_int($task))
			$task = get_post($task);
	
		if($task->post_status != 'publish')
			return; //only open task could be archived
	
		//check
		$itv_config = ItvConfig::instance();
		$before_days = $itv_config->get('TASK_ARCHIVE_SOON_NOTIF_DAYS');
		$after_days = $before_days + 1;
	
		$before_time = strtotime(sprintf('-%d days', $before_days));
		$after_time = strtotime(sprintf('-%d days', $after_days));
		$task_time = strtotime($task->post_date);
	
		$before_date = date('Y-m-d', $before_time);
		$after_date = date('Y-m-d', $after_time);
		$task_date = date('Y-m-d', strtotime($task->post_date));
	
		if($task_date >= $before_date || $task_date < $after_date)
			return; //not in period
	
		$doers = tst_get_task_doers_count($task->ID);
		if($doers > 0)
			return; //only task without doers ??
	
		// send email notification to owner
		$email_templates = ItvEmailTemplates::instance();
		$task_permalink = get_permalink($task);
		$days_till_archive = $itv_config->get('TASK_ARCHIVE_DAYS') - $itv_config->get('TASK_ARCHIVE_SOON_NOTIF_DAYS');
		echo "notif: " . $task->ID;
		try {
			wp_mail(
				get_user_by('id', $task->post_author)->user_email,
				$email_templates->get_title('task_archive_soon_notif'),
				nl2br(sprintf($email_templates->get_text('task_archive_soon_notif'), $days_till_archive, $task_permalink))
			);
		}
		catch(Exception $ex) {
			error_log($ex);
		}
	}
	
	/**  Notify about still no doer **/
	public function notif_no_tasks_doer_yet(){
	
		$itv_config = ItvConfig::instance();
		$before_days = $itv_config->get('TASK_NO_DOER_NOTIF_DAYS');
		$after_days = $before_days + 1;
	
		$before_limit = strtotime(sprintf('-%d days', $before_days));
		$after_limit = strtotime(sprintf('-%d days', $after_days));
	
		$args = array(
			'post_type' => 'tasks',
			'post_per_page' => -1,
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
		if(!$query->have_posts())
			return;
	
		foreach($query->posts as $task){
			$this->notif_no_task_doer_yet($task);
		}
	}
	
	public function notif_no_task_doer_yet($task){
	
		if(is_int($task))
			$task = get_post($task);
	
		if($task->post_status != 'publish')
			return; //only open task could be archived
	
		//check
		$itv_config = ItvConfig::instance();
		$before_days = $itv_config->get('TASK_NO_DOER_NOTIF_DAYS');
		$after_days = $before_days + 1;
	
		$before_time = strtotime(sprintf('-%d days', $before_days));
		$after_time = strtotime(sprintf('-%d days', $after_days));
		$task_time = strtotime($task->post_date);
	
		$before_date = date('Y-m-d', $before_time);
		$after_date = date('Y-m-d', $after_time);
		$task_date = date('Y-m-d', strtotime($task->post_date));
	
		if($task_date >= $before_date || $task_date < $after_date)
			return; //not in period
	
		$doers = tst_get_task_doers_count($task->ID);
		if($doers > 0)
			return; //only task without doers ??
	
		// send email notification to owner
		$email_templates = ItvEmailTemplates::instance();
		$task_permalink = get_permalink($task);
		$days_left = $itv_config->get('TASK_NO_DOER_NOTIF_DAYS');
		try {
			wp_mail(
				get_user_by('id', $task->post_author)->user_email,
				$email_templates->get_title('task_no_doer_notif'),
				nl2br(sprintf($email_templates->get_text('task_no_doer_notif'), $days_left, $task_permalink))
			);
		}
		catch(Exception $ex) {
			error_log($ex);
		}
	}
	
}
