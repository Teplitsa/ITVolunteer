<?php
class ItvLog {
    public static $ACTION_TASK_CREATE = 'create';
    public static $ACTION_TASK_DELETE = 'delete';
    public static $ACTION_TASK_EDIT = 'edit';
    public static $ACTION_TASK_ADD_CANDIDATE = 'add_candidate';
    public static $ACTION_TASK_REFUSE_CANDIDATE = 'refuse_candidate';
    public static $ACTION_TASK_APPROVE_CANDIDATE = 'approve_candidate';
    public static $ACTION_TASK_REMOVE_CANDIDATE = 'remove_candidate';
    public static $ACTION_TASK_PUBLISH = 'publish';
    public static $ACTION_TASK_UNPUBLISH = 'unpublish';
    public static $ACTION_TASK_INWORK = 'inwork';
    public static $ACTION_TASK_CLOSE = 'close';
    public static $ACTION_TASK_ARCHIVE = 'archive';
    public static $ACTION_TASK_NOTIF_NO_DOER_YET = 'no_doer_yes';
    public static $ACTION_TASK_NOTIF_ARCHIVE_SOON = 'archive_soon';
    
    public static $ACTION_USER_REGISTER = 'user_register';
    public static $ACTION_USER_UPDATE = 'user_update';
    public static $ACTION_USER_DELETE_PROFILE = 'user_delete_profile';
    public static $ACTION_USER_LOGIN_EMAIL = 'user_login_email';
    public static $ACTION_USER_LOGIN_LOGIN = 'user_login_login';
    public static $ACTION_USER_LOGIN_FAILED = 'user_login_failed';
    
    public static $ACTION_REVIEW_FOR_DOER = 'review_for_doer';
    public static $ACTION_REVIEW_FOR_AUTHOR = 'review_for_author';
    
    public static $ACTION_EMAIL_APPROVE_CANDIDATE_DOER = 'email_approve_candidate_doer';
    public static $ACTION_EMAIL_APPROVE_CANDIDATE_AUTHOR = 'email_approve_candidate_author';
    public static $ACTION_EMAIL_REFUSE_CANDIDATE_AUTHOR = 'email_refuse_candidate_author';
    public static $ACTION_EMAIL_ADD_CANDIDATE_AUTHOR = 'email_add_candidate_author';
    public static $ACTION_EMAIL_REMOVE_CANDIDATE_AUTHOR = 'email_remove_candidate_author';
    public static $ACTION_EMAIL_DOER_ABOUT_TASK_CLOSED = 'email_doer_about_task_closed';
    public static $ACTION_EMAIL_AUTHOR_ABOUT_TASK_CLOSED = 'email_author_about_task_closed';
    public static $ACTION_EMAIL_DOER_ABOUT_TASK_STATUS_CHANGED = 'email_doer_about_task_status_changed';
    public static $ACTION_EMAIL_CANDIDATE_ABOUT_TASK_STATUS_CHANGED = 'email_candidate_about_task_status_changed';
    
    public static $TYPE_TASK = 'task';
    public static $TYPE_USER = 'user';
    public static $TYPE_REVIEW = 'review';
    public static $TYPE_EMAIL = 'email';
    
    private $task_action_table;
    private static $_instance = NULL;
    
    public function __construct() {
        global $wpdb;
        $this->task_action_table = $wpdb->prefix . 'itv_task_actions_log';
    }
    
    public static function instance() {
        if (ItvLog::$_instance == NULL) {
            ItvLog::$_instance = new ItvLog ();
        }
        return ItvLog::$_instance;
    }
    
    public function log_task_action($task_id, $action, $action_assoc_user_id = 0) {
        global $wpdb;
        
        $task = get_post ( $task_id );
        
        $wpdb->query ( $wpdb->prepare ( "
            INSERT INTO $this->task_action_table
            SET task_id = %d, action = %s, assoc_user_id = %d, action_time = NOW(), task_status = %s, `type` = %s
            ", $task_id, $action, $action_assoc_user_id, $task->post_status, static::$TYPE_TASK ) );
    }
    
    public function is_user_action($action) {
        return preg_match ( '/^user_.*/', $action );
    }
    
    public function log_user_action($action, $user_id = 0, $user_login = '', $text_data = null) {
        if (! $user_login) {
            $user = get_user_by ( 'id', $user_id );
            if ($user) {
                $user_login = $user->user_login;
            }
        }
        
        global $wpdb;
        $wpdb->query ( $wpdb->prepare ( "
            INSERT INTO $this->task_action_table
            SET task_id = 0, action = %s, assoc_user_id = %d, action_time = NOW(), task_status = %s, data = %s, `type` = %s
            ", $action, $user_id, $user_login, $text_data, static::$TYPE_USER ) );
    }
    
    public function log_review_action($action, $from_user_id, $to_user_id, $task_id, $rating) {
        global $wpdb;
        $wpdb->query ( $wpdb->prepare ( "
                INSERT INTO $this->task_action_table
                SET task_id = %s, action = %s, assoc_user_id = %d, to_user_id = %d, action_time = NOW(), `type` = %s, data = %s
                ", $task_id, $action, $from_user_id, $to_user_id, static::$TYPE_REVIEW, $rating ) );
    }
    
    public function log_email_action($action, $user_id, $subject, $task_id = 0) {
        global $wpdb;
        $task = $task_id ? get_post ( $task_id ) : null;
        $task_status = $task ? $task->post_status : '';
        $wpdb->query ( $wpdb->prepare ( "
                INSERT INTO $this->task_action_table
                SET task_id = %s, action = %s, assoc_user_id = %d, action_time = NOW(), `type` = %s, data = %s, task_status = %s
                ", $task_id, $action, $user_id, static::$TYPE_EMAIL, $subject, $task_status) );
    }
    
    public function get_task_log($task_id) {
        global $wpdb;
        
        $actions = $wpdb->get_results ( $wpdb->prepare ( "
            SELECT * FROM $this->task_action_table
            WHERE task_id = %d AND `type` = %s
            ORDER BY action_time DESC
            ", $task_id, static::$TYPE_TASK ) );
        
        return $actions;
    }
    
    public function get_all_tasks_log($offset = 0, $limit = 5) {
        global $wpdb;
        
        $offset = ( int ) $offset;
        $limit = ( int ) $limit;
        
        $actions = $wpdb->get_results ( "
            SELECT * FROM $this->task_action_table
            WHERE 1
            ORDER BY action_time DESC
            LIMIT $offset, $limit
            " );
        
        return $actions;
    }
    
    public function get_task_inwork_time($task_id) {
        return $this->get_task_status_time ( $task_id, 'in_work' );
    }
    
    public function get_task_close_time($task_id) {
        return $this->get_task_status_time ( $task_id, 'closed' );
    }
    
    public function get_task_status_time($task_id, $task_status) {
        $logs = $this->get_task_log ( $task_id );
        $res_log = null;
        foreach ( $logs as $log ) {
            if ($log->task_status == $task_status) {
                $res_log = $log;
            } elseif ($res_log) {
                break;
            }
        }
        return $res_log ? $res_log->action_time : '';
    }
    
    public function get_all_tasks_log_records_count() {
        global $wpdb;
        
        $actions = $wpdb->get_var ( "
				SELECT COUNT(*) FROM $this->task_action_table
				" );
        
        return $actions;
    }
    
    public function humanize_action($action, $user_text) {
        return sprintf ( __( 'itv_task_actions_log_' . $action, 'tst' ), $user_text );
    }
    
    public function show_log_record($log) {
        if($log->type == static::$TYPE_USER || $this->is_user_action ( $log->action )) {
            $user_id = $log->assoc_user_id;
            $user_login = $log->task_status;
            
            $user = $user_id ? get_user_by ( 'id', $user_id ) : NULL;
            $user_link = $user ? tst_get_member_url ( $user ) : get_edit_user_link ( $user_id );
            $edit_user_link = get_edit_user_link ( $user_id );
            
            $user_text = "<a href='" . $user_link . "' title='" . get_user_last_login_time ( $user ) . "'>" . $user_login . "</a>";
            $user_text .= "<a href='" . $edit_user_link . "' class='dashicons-before dashicons-edit itv-log-edit-user' > </a>";
            
            echo "<td class='itv-stats-task-title' title='" . get_user_meta ( $user->ID, 'last_login_time', true ) . "'>" . $this->humanize_action ( $log->action, $user_text ) . "</td>";
            echo "<td class='itv-stats-time'>" . $log->action_time . "</td>";
            echo "<td class='itv-stats-time'>" . "</td>";
            echo "<td>" . $user_text . "</td>";
            echo "<td>" . $log->data . "</td>";
        } elseif ($log->type == static::$TYPE_REVIEW) {
            $from_user_id = $log->assoc_user_id;
            $from_user = $from_user_id ? get_user_by ( 'id', $from_user_id ) : NULL;
            $from_user_link = $from_user ? tst_get_member_url ( $from_user ) : get_edit_user_link ( $from_user_id );
            $from_edit_user_link = get_edit_user_link ( $from_user_id );
            
            $from_user_text = "<a target='_blank' href='" . $from_user_link . "' title='" . get_user_last_login_time ( $from_user ) . "'>" . ($from_user ? $from_user->user_login : __('Unknown user', 'tst')) . "</a>";
            $from_user_text .= "<a target='_blank' href='" . $from_edit_user_link . "' class='dashicons-before dashicons-edit itv-log-edit-user' > </a>";
            
            $to_user_id = $log->to_user_id;
            $to_user = $to_user_id ? get_user_by ( 'id', $to_user_id ) : NULL;
            $to_user_link = $to_user ? tst_get_member_url ( $to_user ) : get_edit_user_link ( $to_user_id );
            $to_edit_user_link = get_edit_user_link ( $to_user_id );
            
            $to_user_text = "<a target='_blank' href='" . $to_user_link . "' title='" . get_user_last_login_time ( $to_user ) . "'>" . ($to_user ? $to_user->user_login : __('Unknown user', 'tst')) . "</a>";
            $to_user_text .= "<a target='_blank' href='" . $to_edit_user_link . "' class='dashicons-before dashicons-edit itv-log-edit-user' > </a>";
            
            $task = get_post ( $log->task_id );
            $task_text = $this->get_task_text_link($task);
            
            echo "<td class='itv-stats-task-title'>" . $this->humanize_action ( $log->action, $task_text ) . "</td>";
            echo "<td class='itv-stats-time'>" . $log->action_time . "</td>";
            echo "<td></td>";
            echo "<td>" . sprintf( __('Review log from %s to %s', 'tst'), $from_user_text, $to_user_text) . "</td>";
            echo "<td>" . sprintf( __('Vote: %s', 'tst'), $log->data) . "</td>";
        } elseif ($log->type == static::$TYPE_EMAIL) {
            $user_id = $log->assoc_user_id;
            
            $user = $user_id ? get_user_by ( 'id', $user_id ) : NULL;
            $user_link = $user ? tst_get_member_url ( $user ) : get_edit_user_link ( $user_id );
            $edit_user_link = get_edit_user_link ( $user_id );
            
            $user_text = "<a href='" . $user_link . "' title='" . get_user_last_login_time ( $user ) . "'>" . ($user ? $user->user_login : __('Unknown user', 'tst')) . "</a>";
            $user_text .= "<a href='" . $edit_user_link . "' class='dashicons-before dashicons-edit itv-log-edit-user' > </a>";

            $task_text = '';
            if($log->task_id) {
                $task = get_post ( $log->task_id );
                $task_text = $this->get_task_text_link($task);
            }
        
            echo "<td class='itv-stats-task-title'>" . ($task_text ? sprintf(__( 'Email for task: %s', 'tst'), $task_text ) : __( 'Email log item', 'tst')) . "</td>";
            echo "<td class='itv-stats-time'>" . $log->action_time . "</td>";
            echo "<td class='itv-stats-time'>" . tst_get_task_status_label ( $log->task_status ) . "</td>";
            echo "<td>" . sprintf( __('Email for user %s', 'tst'), $user_text) . "</td>";
            echo "<td>" . $log->data . "</td>";
        } else {
            $user = $log->assoc_user_id ? get_user_by ( 'id', $log->assoc_user_id ) : NULL;
            $user_text = '';
            if ($user) {
                $user_link = tst_get_member_url ( $user );
                $edit_user_link = get_edit_user_link ( $user->ID );
                $user_text = "<a target='_blank' href='" . $user_link . "'>" . $user->display_name . "</a>";
                $user_text .= "<a target='_blank' href='" . $edit_user_link . "' class='dashicons-before dashicons-edit itv-log-edit-user' > </a>";
            } else {
                $user_text = __ ( 'Unknown user', 'tst' );
            }
            
            $task = get_post ( $log->task_id );
            $task_text = $this->get_task_text_link($task);
            
            echo "<td class='itv-stats-task-title'>" . $task_text . "</td>";
            echo "<td class='itv-stats-time'>" . $log->action_time . "</td>";
            echo "<td class='itv-stats-time'>" . tst_get_task_status_label ( $log->task_status ) . "</td>";
            echo "<td>" . $this->humanize_action ( $log->action, $user_text ) . "</td>";
            echo "<td>" . $log->data . "</td>";
        }
    }
    
    public function get_task_text_link($task) {
        $task_text = '';
        if ($task) {
            $task_text = "<a href='" . get_post_permalink ( $task->ID ) . "' target='_blank'>" . $task->post_title . "</a>";
            $task_text .= "<a href='" . get_edit_post_link( $task->ID ) . "' target='_blank' class='dashicons-before dashicons-edit itv-log-edit-user' > </a>";
        } else {
            $task_text = __ ( 'Unknown task', 'tst' );
        }
        return $task_text;
    }
}

__ ( 'itv_task_actions_log_create', 'tst' );
__ ( 'itv_task_actions_log_delete', 'tst' );
__ ( 'itv_task_actions_log_edit', 'tst' );
__ ( 'itv_task_actions_log_add_candidate', 'tst' );
__ ( 'itv_task_actions_log_refuse_candidate', 'tst' );
__ ( 'itv_task_actions_log_approve_candidate', 'tst' );
__ ( 'itv_task_actions_log_remove_candidate', 'tst' );
__ ( 'itv_task_actions_log_publish', 'tst' );
__ ( 'itv_task_actions_log_unpublish', 'tst' );
__ ( 'itv_task_actions_log_inwork', 'tst' );
__ ( 'itv_task_actions_log_close', 'tst' );
__ ( 'itv_task_actions_log_archive', 'tst' );

__ ( 'itv_task_actions_log_no_doer_yes', 'tst' );
__ ( 'itv_task_actions_log_archive_soon', 'tst' );

__ ( 'itv_task_actions_log_user_register', 'tst' );
__ ( 'itv_task_actions_log_user_update', 'tst' );
__ ( 'itv_task_actions_log_user_delete_profile', 'tst' );
__ ( 'itv_task_actions_log_user_login_login', 'tst' );
__ ( 'itv_task_actions_log_user_login_email', 'tst' );
__ ( 'itv_task_actions_log_user_login_failed', 'tst' );
__ ( 'itv_task_actions_log_review_for_doer', 'tst' );
__ ( 'itv_task_actions_log_review_for_author', 'tst' );
