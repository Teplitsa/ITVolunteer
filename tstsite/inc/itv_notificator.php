<?php

class ItvNotificator {
    protected $notif_to_send_count;
    protected $notif_sent_count;
    protected $tasks_to_check_count;
    protected $already_sent_count;
    protected $is_skip_sending = false;
    protected $is_debug = false;
    protected $stats_by_actions = [];
    
    public function __construct() {
        global $wpdb;
        $this->sent_notifications_table = $wpdb->prefix . 'sent_notifications';
    }
    
    public function pring_debug($text) {
        if ($this->is_debug) {
            echo $text;
        }
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
        echo sprintf ( "tasks_to_check_count=%d\n", $this->tasks_to_check_count );
        echo sprintf ( "notif_to_send_count=%d\n", $this->notif_to_send_count );
        echo sprintf ( "notif_sent_count=%d\n", $this->notif_sent_count );
        echo sprintf ( "already_sent_count=%d\n", $this->already_sent_count );
        
        foreach ( $this->stats_by_actions as $action_key => $stats ) {
            foreach ( $stats as $stats_key => $stats_val) {
                echo sprintf("$action_key - $stats_key=%d\n", $stats_val);
            }
        }
    }
    
    public function save_notification_fact($notif_type, $notif_id, $email) {
        global $wpdb;
        $wpdb->query ( $wpdb->prepare ( "
            INSERT INTO $this->sent_notifications_table
            SET time_add = NOW(), notif_type = %s, notif_id = %s, email = %s
            ", $notif_type, $notif_id, $email ) );
    }
    
    public function is_notification_sent($notif_type, $notif_id, $email) {
        global $wpdb;
        
        $sending_fact = $wpdb->get_row ( $wpdb->prepare ( "
            SELECT * FROM $this->sent_notifications_table
            WHERE notif_type = %s AND notif_id = %s AND email = %s
            ORDER BY time_add DESC
            ", $notif_type, $notif_id, $email ) );
        
        return $sending_fact ? true : false;
    }
    
    public function get_task_notif_key($task) {
        return md5 ( $task->ID );
    }
    
    public function get_task_last_edit_notif_key($task) {
        return md5 ( implode ( '_', array (
            $task->ID,
            $task->post_modified 
        ) ) );
    }
    
    public function fill_template($template, $data) {
        return itv_fill_template($template, $data);
    }
    
    /**
     * Notify about still no doer *
     */
    public function notif_no_tasks_doer_yet() {
        $itv_config = ItvConfig::instance ();
        $before_days = $itv_config->get ( 'TASK_NO_DOER_NOTIF_DAYS' );
        if ($before_days < 0) {
            $before_days = 0;
        }
        $after_days = $before_days + 2;
        
        $before_limit = strtotime ( sprintf ( '-%d days', $before_days ) );
        $after_limit = strtotime ( sprintf ( '-%d days', $after_days ) );
        echo 'before_limit=' . date ( 'd.m.Y', $before_limit ) . "\n";
        echo 'after_limit=' . date ( 'd.m.Y', $after_limit ) . "\n";
        
        $args = array (
            'post_type' => 'tasks',
            'nopaging' => true,
            'post_status' => 'publish',
            'date_query' => array (
                array (
                    'column' => 'post_modified',
                    'before' => array (
                        'year' => date ( 'Y', $before_limit ),
                        'month' => date ( 'n', $before_limit ),
                        'day' => date ( 'j', $before_limit ) 
                    ),
                    'after' => array (
                        'year' => date ( 'Y', $after_limit ),
                        'month' => date ( 'n', $after_limit ),
                        'day' => date ( 'j', $after_limit ) 
                    ) 
                ) 
            ) 
        );
        
        $query = new WP_Query ( $args );
        
        $this->reset_counters ();
        foreach ( $query->posts as $task ) {
            $this->tasks_to_check_count += 1;
            $this->pring_debug ( 'task_ID=' . $task->ID . " post_modified=" . $task->post_modified . "\n" );
            $this->notif_no_task_doer_yet ( $task );
        }
        $this->print_counters ();
    }
    
    public function notif_no_task_doer_yet($task) {
        if (is_int ( $task ))
            $task = get_post ( $task );
        
        if ($task->post_status != 'publish') {
            $this->pring_debug ( "NOT_FIT: not publish\n" );
            return; // only open task could be archived
        }
        
        // check
        $itv_config = ItvConfig::instance ();
        $before_days = $itv_config->get ( 'TASK_NO_DOER_NOTIF_DAYS' );
        if ($before_days < 0) {
            $before_days = 0;
        }
        $after_days = $before_days + 2;
        
        $before_time = strtotime ( sprintf ( '-%d days', $before_days ) );
        $after_time = strtotime ( sprintf ( '-%d days', $after_days ) );
        $task_time = strtotime ( $task->post_modified );
        
        $before_date = date ( 'Y-m-d', $before_time );
        $after_date = date ( 'Y-m-d', $after_time );
        $task_date = date ( 'Y-m-d', strtotime ( $task->post_modified ) );
        
        if ($task_date >= $before_date || $task_date <= $after_date) {
            $this->pring_debug ( "NOT_FIT: by date\n" );
            return; // not in period
        }
        
        $doers = tst_get_task_doers_count ( $task->ID, true, true );
        if ($doers > 0) {
            $this->pring_debug ( "NOT_FIT: doers found\n" );
            return; // only task without doers ??
        }
        
        // send email notification to owner
        $email_templates = ItvEmailTemplates::instance ();
        $task_permalink = get_permalink ( $task );
        $days_left = $itv_config->get ( 'TASK_NO_DOER_NOTIF_DAYS' );
        
        $user = get_user_by ( 'id', $task->post_author );
        if (! $user) {
            $this->pring_debug ( "NOT_FIT: author not found\n" );
            return;
        }
        $user_email = $user->user_email;
        $user_nicename = $user->user_nicename;
        
        $this->pring_debug ( sprintf ( "%s\n", $user_email ) );
        
        $this->notif_to_send_count += 1;
        
        if (! $this->is_notification_sent ( 'notif_no_task_doer_yet', $this->get_task_notif_key ( $task ), $user_email )) {
            if (! $this->is_skip_sending) {
                try {
                    do_action('atv_email_notification', 'task_no_doer_notif', [
                        'to' => $user_email,
                        'username' => $user_nicename,
                        'task_link' => $task_permalink, 
                    ]);
                    
                    $this->pring_debug ( "SENT\n" );
                    $this->save_notification_fact ( 'notif_no_task_doer_yet', $this->get_task_notif_key ( $task ), $user_email );
                    
                    $itv_log = ItvLog::instance ();
                    $itv_log->log_task_action ( $task->ID, ItvLog::$ACTION_TASK_NOTIF_NO_DOER_YET, $user ? $user->ID : 0 );
                    
                    $this->notif_sent_count += 1;
                } catch ( Exception $ex ) {
                    error_log ( $ex );
                }
            }
        } else {
            $this->already_sent_count += 1;
        }
    }
    
    /* notify candidate about task status change */
    function notif_candidate_about_task_status_change($user, $task) {
        $task_status_message = __ ( 'Task status become ' . $task->post_status, 'tst' );
        $task_permalink = get_permalink ( $task );
        
        /* notice to candidate: */
        do_action('atv_email_notification', 'account_activated_notice', [
            'to' => $user->user_email,
            'username' => $user->user_nicename,
            'task_title' => $task->post_title,
            'status_message' => $task_status_message,
            'task_link' => $task_permalink 
        ]);
        
        ItvLog::instance()->log_email_action(ItvLog::$ACTION_EMAIL_CANDIDATE_ABOUT_TASK_STATUS_CHANGED, $user->ID, ItvEmailTemplates::instance()->get_title('task_status_changed'), $task ? $task->ID : 0);
    }
    
    function notif_doer_about_task_status_change($user, $task) {
        $task_status_message = __ ( 'Task status become ' . $task->post_status, 'tst' );
        $task_permalink = get_permalink ( $task );
        
        /* notice to candidate: */
        do_action('atv_email_notification', 'task_status_changed_doer', [
            'to' => $user->user_email,
            'username' => $user->user_nicename,
            'task_title' => $task->post_title,
            'status_message' => $task_status_message,
            'task_link' => $task_permalink
        ]);
        ItvLog::instance()->log_email_action(ItvLog::$ACTION_EMAIL_DOER_ABOUT_TASK_STATUS_CHANGED, $user->ID, ItvEmailTemplates::instance()->get_title('task_status_changed_doer'), $task ? $task->ID : 0);
    }
    
    /* notify author about task status change */
    function notif_author_about_task_closed($user, $task) {
        $task_permalink = get_permalink ( $task );
        $task_permalink .= '#leave_review_for_doer';
    
        do_action('atv_email_notification', 'task_status_closed_author', [
            'to' => $user->user_email,
            'username' => $user->user_nicename,
            'task_title' => $task->post_title,
            'task_link' => $task_permalink
        ]);
        ItvLog::instance()->log_email_action(ItvLog::$ACTION_EMAIL_AUTHOR_ABOUT_TASK_CLOSED, $user->ID, ItvEmailTemplates::instance()->get_title('task_status_closed_author'), $task ? $task->ID : 0);
    }
    
    /* notify doer about task status change */
    function notif_doer_about_task_closed($user, $task) {
        $task_permalink = get_permalink ( $task );
        $task_permalink .= '#leave_review_for_author';
        
        do_action('atv_email_notification', 'task_status_closed_doer', [
            'to' => $user->user_email,
            'username' => $user->user_nicename,
            'task_title' => $task->post_title,
            'task_link' => $task_permalink
        ]);
        
        ItvLog::instance()->log_email_action(ItvLog::$ACTION_EMAIL_DOER_ABOUT_TASK_CLOSED, $user->ID, ItvEmailTemplates::instance()->get_title('task_status_closed_doer'), $task ? $task->ID : 0);
    }
    
    /**
     * Notify about move to archive
     */
    public function notif_tasks_soon_archive($notif_key, $task_status, $task_notif_days, $log_action, $is_check_doers) {
        
        $this->stats_by_actions[$notif_key] = [];
        $this->stats_by_actions[$notif_key]['notif_to_send_count'] = 0;
        $this->stats_by_actions[$notif_key]['notif_sent_count'] = 0;
        $this->stats_by_actions[$notif_key]['already_sent_count'] = 0;
        $this->stats_by_actions[$notif_key]['tasks_to_check_count'] = 0;
        
        $before_days = $task_notif_days;
        $before_days -= 1;
        $limit = strtotime ( sprintf ( '-%d days', $before_days ) );
    
        echo 'before_limit=' . date ( 'd.m.Y', $limit ) . "\n";
    
        $args = array (
            'post_type' => 'tasks',
            'nopaging' => true,
            'post_status' => $task_status,
            'date_query' => array (
                array (
                    'column' => 'post_modified',
                    'before' => array (
                        'year' => date ( 'Y', $limit ),
                        'month' => date ( 'n', $limit ),
                        'day' => date ( 'j', $limit )
                    )
                )
            )
        );
    
        $query = new WP_Query ( $args );
    
        $this->reset_counters ();
        foreach ( $query->posts as $task ) {
            $this->tasks_to_check_count += 1;
            $this->stats_by_actions[$notif_key]['tasks_to_check_count'] += 1;
            $this->pring_debug ( 'task_ID=' . $task->ID . " post_modified=" . $task->post_modified . "\n" );
            $this->task_soon_archive ( $task, $task_status, $task_notif_days, $notif_key, $log_action, $is_check_doers );
        }
        $this->print_counters ();
    }
    
    /*
     * general notif task author method
     */
    public function task_soon_archive($task, $task_status, $task_notif_days, $notif_key, $log_action, $is_check_doers = true) {
        if (is_int ( $task ))
            $task = get_post ( $task );
    
        if ($task->post_status != $task_status) {
            $this->pring_debug ( "NOT_FIT: not $task_status\n" );
            return; // check task status
        }
    
        // check
        $before_days = $task_notif_days;
        $before_days -= 1;
        $limit = date ( 'Y-m-d', strtotime ( sprintf ( '-%d days', $before_days ) ) );
        if (date ( 'Y-m-d', strtotime ( $task->post_modified ) ) >= $limit) {
            $this->pring_debug ( "NOT_FIT: by date\n" );
            return; // not too old
        }
        
        if($is_check_doers) {
            $doers = tst_get_task_doers_count ( $task->ID, true, true );
            if ($doers > 0) {
                $this->pring_debug ( "NOT_FIT: doers found\n" );
                return; // only task without doers ??
            }
        }
        
        // send email notification to owner
        $email_templates = ItvEmailTemplates::instance ();
        $task_permalink = get_permalink ( $task );
    
        $user = get_user_by ( 'id', $task->post_author );
        if (! $user) {
            $this->pring_debug ( "NOT_FIT: author not found\n" );
            return;
        }
        $user_email = $user->user_email;
        $user_nicename = $user->user_nicename;
    
        $this->pring_debug ( sprintf ( "%s\n", $user_email ) );
    
        $this->notif_to_send_count += 1;
        $this->stats_by_actions[$notif_key]['notif_to_send_count'] += 1;
    
        if (! $this->is_notification_sent ( $notif_key, $this->get_task_last_edit_notif_key ( $task ), $user_email )) {
            if (! $this->is_skip_sending) {
                try {
                    
                    do_action('atv_email_notification', $notif_key, [
                        'to' => $user_email,
                        'username' => $user_nicename,
                        'task_link' => $task_permalink,
                        'days_in_status' => $task_notif_days,
                    ]);
                    
                    $this->pring_debug ( "SENT\n" );
                    $this->notif_sent_count += 1;
                    $this->stats_by_actions[$notif_key]['notif_sent_count'] += 1;
                    
                    $this->save_notification_fact ( $notif_key, $this->get_task_last_edit_notif_key ( $task ), $user_email );
    
                    $itv_log = ItvLog::instance ();
                    $itv_log->log_task_action ( $task->ID, $log_action, $user ? $user->ID : 0 );
                } catch ( Exception $ex ) {
                    error_log ( $ex );
                }
            }
        } else {
            $this->already_sent_count += 1;
            $this->stats_by_actions[$notif_key]['already_sent_count'] += 1;
        }
    }
    
}
