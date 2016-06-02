<?php
use ITV\models\UserXPModel;
use ITV\models\MailSendLogModel;
use ITV\models\ResultScreenshots;

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
    public static $ACTION_TASK_LONG_WORK_ARCHIVE_NOTIF = 'long_work_archive_soon';
    public static $ACTION_TASK_LONG_WORK_ARCHIVE = 'long_work_archive';
    public static $ACTION_TASK_RES_SCREEN_UPLOAD = 'task_res_screen_upload';
    
    public static $ACTION_USER_REGISTER = 'user_register';
    public static $ACTION_USER_UPDATE = 'user_update';
    public static $ACTION_USER_DELETE_PROFILE = 'user_delete_profile';
    public static $ACTION_USER_LOGIN_EMAIL = 'user_login_email';
    public static $ACTION_USER_LOGIN_LOGIN = 'user_login_login';
    public static $ACTION_USER_LOGIN_FAILED = 'user_login_failed';
    public static $ACTION_USER_THANKYOU = 'user_thankyou';
    
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
    
    private $list_log_record_types = array('task', 'user', 'review', 'email');
    private $list_log_actions = array('create', 'inwork', 'close', 'task_res_screen_upload', 'user_register', 'delete', 'edit', 'add_candidate', 'refuse_candidate', 'approve_candidate', 'remove_candidate', 'publish', 'unpublish', 
        'archive', 'long_work_archive', 'no_doer_yes', 'archive_soon', 'long_work_archive_soon', 'user_update', 'user_delete_profile', 'user_login_email', 'user_login_login', 'user_login_failed', 
        'review_for_doer', 'review_for_author', 'user_thankyou',
        'email_approve_candidate_doer', 'email_approve_candidate_author', 'email_refuse_candidate_author', 'email_add_candidate_author', 'email_remove_candidate_author', 'email_doer_about_task_closed', 
        'email_author_about_task_closed', 'email_doer_about_task_status_changed', 'email_candidate_about_task_status_changed', 
    );
    
    private $task_action_table;
    private $filter = null;
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
            ORDER BY action_time DESC, id DESC
            ", $task_id, static::$TYPE_TASK ) );
        
        return $actions;
    }
    
    public function get_all_tasks_log($offset = 0, $limit = 5) {
        global $wpdb;
        
        $offset = ( int ) $offset;
        $limit = ( int ) $limit;
        $extra_where = $this->get_all_log_extra_where();
        
        $sql = "
            SELECT * FROM $this->task_action_table
            WHERE 1 $extra_where
            ORDER BY action_time DESC, id DESC
            LIMIT $offset, $limit
        ";
        
        $actions = $wpdb->get_results ( $sql );
        
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
        
        $extra_where = $this->get_all_log_extra_where();
        
        $sql = "
			SELECT COUNT(*) FROM $this->task_action_table WHERE 1 $extra_where
		";
        
        $actions = $wpdb->get_var ( $sql );
        
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
            
            echo "<td class='itv-stats-task-title' title='" . get_user_meta ( $user_id, 'last_login_time', true ) . "'>" . $this->humanize_action ( $log->action, $user_text ) . "</td>";
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
    
    public function get_filters() {
        $ret = '<form action="" method="get">';
        $ret .= '<input type="hidden" name="page" value="itv_all_tasks_log_page" />';
        $ret .= $this->get_filter_by_action();
        $ret .= $this->get_filter_by_type();
        $ret .= $this->get_filter_by_user();
        $ret .= $this->get_filter_by_task();
        $ret .= '<input type="submit" name="filter" value="Выбрать" />';
        $ret .= '</form>';
        return $ret;
    }
    
    private function set_filter_from_request_params() {
        if($this->filter === null && isset($_GET['filter'])) {
            $this->filter = array();
            if(isset($_GET['log_action']) && in_array($_GET['log_action'], $this->list_log_actions)) {
                $this->filter['log_action'] = $_GET['log_action'];
            }
    
            if(isset($_GET['log_record_type']) && in_array($_GET['log_record_type'], $this->list_log_record_types)) {
                $this->filter['log_record_type'] = $_GET['log_record_type'];
            }
    
            if(isset($_GET['log_user_name']) && trim($_GET['log_user_name'])) {
                $this->filter['log_user_name'] = filter_var(trim($_GET['log_user_name']), FILTER_SANITIZE_STRING);
            }
    
            if(isset($_GET['log_task_title']) && trim($_GET['log_task_title'])) {
                $this->filter['log_task_title'] = filter_var(trim($_GET['log_task_title']), FILTER_SANITIZE_STRING);
            }
            
            if(isset($_GET['from_date']) && trim($_GET['from_date'])) {
                $this->filter['from_date'] = filter_var(trim($_GET['from_date']), FILTER_SANITIZE_STRING);
            }
            
            if(isset($_GET['to_date']) && trim($_GET['to_date'])) {
                $this->filter['to_date'] = filter_var(trim($_GET['to_date']), FILTER_SANITIZE_STRING);
            }
            
        }
    }
    
    private function get_all_log_extra_where() {
        global $wpdb;
        
        $this->set_filter_from_request_params();
        $extra_where = '';
        if(is_array($this->filter)) {
            if(isset($this->filter['log_action'])) {
                $extra_where .= " AND action = '".esc_sql($this->filter['log_action'])."' ";
            }
            
            if(isset($this->filter['log_record_type'])) {
                $extra_where .= " AND `type` = '".esc_sql($this->filter['log_record_type'])."' ";
            }
            
            if(isset($this->filter['log_user_name'])) {
                $users = get_users( array('search' => trim($this->filter['log_user_name']), 'fields' => array('ID')) );
                $users_id = array();
                foreach($users as $user) {
                    $users_id[] = (int)$user->ID;
                }
                if(!count($users_id)) {
                    $users_id[] = '-1';
                }
                $extra_where .= " AND (assoc_user_id IN (".implode(', ', $users_id).") OR to_user_id IN (".implode(', ', $users_id).")) ";
            }
            
            if(isset($this->filter['log_task_title'])) {
                $sql_title = esc_sql(trim($this->filter['log_task_title']));
                $sql_title = preg_replace('/^\*/', '%', $sql_title);
                $sql_title = preg_replace('/\*$/', '%', $sql_title);
                
                $tasks_id = $wpdb->get_col("select ID from $wpdb->posts where post_title like '".$sql_title."' AND post_type = 'tasks' AND post_status IN ('publish', 'draft', 'in_work', 'closed', 'trash') ");
                if(!count($tasks_id)) {
                    $tasks_id[] = '-1';
                }
                $extra_where .= " AND task_id IN (".implode(', ', $tasks_id).") ";
            }
            
            if(isset($this->filter['from_date'])) {
                $extra_where .= " AND action_time >= '".esc_sql($this->filter['from_date'])." 00:00:00' ";
            }
            
            if(isset($this->filter['to_date'])) {
                $extra_where .= " AND action_time < '".esc_sql($this->filter['to_date'])." 00:00:00' ";
            }
            
        }
        
        return $extra_where;
    }
    
    public function get_filter_by_task() {
        $ret = '<input type="text" name="log_task_title" placeholder="'.__('Task title', 'tst').'" value="'.(isset($_GET['log_task_title']) ? filter_var($_GET['log_task_title'], FILTER_SANITIZE_STRING) : '').'" />';
        return $ret;
    }
    
    public function get_filter_by_user() {
        $ret = '<input type="text" name="log_user_name" placeholder="'.__('Username or email', 'tst').'" value="'.(isset($_GET['log_user_name']) ? filter_var($_GET['log_user_name'], FILTER_SANITIZE_STRING) : '').'" />';
        return $ret;
    }
    
    public function get_filter_by_action() {
        $screen = get_current_screen();
        $ret = '';
        if($screen && $screen->id == 'tools_page_itv_all_tasks_log_page') {
            $ret = '<select name="log_action" class="itv-log-select-filter"><option>'.__('Any log action', 'tst').'</option>';
            
            $log_action = '';
            if(isset($_GET['filter'])) {
                if(isset($_GET['log_action']) && in_array($_GET['log_action'], $this->list_log_actions)) {
                    $log_action = $_GET['log_action'];
                }
            }
            
            foreach($this->list_log_actions as $type) {
                $ret .= '<option value="'.$type.'" '.($log_action == $type ? 'selected="selected" ' : '').'>' . str_replace(' %s', '', __( 'itv_task_actions_log_' . $type, 'tst' )) . '</option>';
            }
            $ret .= '</select>';
        }
        
        return $ret;
    }
    
    public function get_filter_by_type() {
        $screen = get_current_screen();
        $ret = '';
        if($screen && $screen->id == 'tools_page_itv_all_tasks_log_page') {
            $ret = '<select name="log_record_type" class="itv-log-select-filter"><option>'.__('Any log record type', 'tst').'</option>';
    
            $log_record_type = '';
            if(isset($_GET['filter'])) {
                if(isset($_GET['log_record_type']) && in_array($_GET['log_record_type'], $this->list_log_record_types)) {
                    $log_record_type = $_GET['log_record_type'];
                }
            }
    
            foreach($this->list_log_record_types as $type) {
                $ret .= '<option value="'.$type.'" '.($log_record_type == $type ? 'selected="selected" ' : '').'>' . str_replace(' %s', '', __( 'itv_log_record_type_' . $type, 'tst' )) . '</option>';
            }
            $ret .= '</select>';
        }
        
        return $ret;
    }
    
    public function get_general_stats() {
        $stats = array();
        $now_date = date('Y-m-d');
        foreach($this->list_log_actions as $log_action) {
            $this->filter = array('log_action' => $log_action);
            $all_count = $this->get_all_tasks_log_records_count();
            
            $this->filter = array('log_action' => $log_action, 'from_date' => $now_date);
            $day_count = $this->get_all_tasks_log_records_count();
            
            $stats[$log_action] = array(
                'all' => $all_count,
                'all_link' => 'tools.php?page=itv_all_tasks_log_page&filter=1&log_action='.$log_action,
                'day' => $day_count,
                'day_link' => 'tools.php?page=itv_all_tasks_log_page&filter=1&log_action='.$log_action.'&from_date=' . $now_date,
                'title' => str_replace(' %s', '', __( 'itv_task_actions_log_' . $log_action, 'tst' )),
                'action' => $log_action,
            );
        }
        
        $stats = $this->add_user_xp_stats($stats, 'day', $now_date);
        
        return $stats;
    }
    
    public function get_weekly_stats_for_email($from_date, $to_date) {
        $stats = array();
        foreach($this->list_log_actions as $log_action) {
            $this->filter = array('log_action' => $log_action);
            $all_count = $this->get_all_tasks_log_records_count();
    
            $this->filter = array('log_action' => $log_action, 'from_date' => $from_date, 'to_date' => $to_date);
            $week_count = $this->get_all_tasks_log_records_count();
    
            $stats[$log_action] = array(
                'all' => $all_count,
                'all_link' => 'tools.php?page=itv_all_tasks_log_page&filter=1&log_action='.$log_action,
                'week' => $week_count,
                'week_link' => 'tools.php?page=itv_all_tasks_log_page&filter=1&log_action='.$log_action.'&from_date=' . $from_date . '&to_date=' . $to_date,
                'title' => str_replace(' %s', '', __( 'itv_task_actions_log_' . $log_action, 'tst' )),
                'action' => $log_action,
            );
        }
        
        return $stats;
    }
    
    public function add_user_xp_stats($stats, $period_name, $from_date, $to_date = '') {
        $new_stats = [];
        
        $log_action = 'user_xp';
        $new_stats[$log_action] = [
            'all' => UserXPModel::instance()->get_site_total_abs_xp(),
            'all_link' => '',
            $period_name => UserXPModel::instance()->get_xp_for_period($from_date, $to_date),
            $period_name . '_link' => '',
            'title' => __('Collected user xp', 'tst'),
            'action' => $log_action,
        ];
        $stats = array_merge($new_stats, $stats);
        
        return $stats;
    }
    
    public function get_users_stats($from_date, $to_date) {
        $users_stats = [];
        $result = count_users();
        $users_stats['total_count'] = $result['total_users'];
        $users_stats['total_active_count'] = tst_get_active_members_count();
        $users_stats['new_count'] = tst_get_new_members_count($from_date, $to_date);
        $users_stats['new_active_count'] = tst_get_new_active_members_count($from_date, $to_date);
        $users_stats['hero_count'] = tst_get_members_counter('hero');
        $users_stats['donee_count'] = tst_get_members_counter('donee');
        $users_stats['week_user_xp'] = UserXPModel::instance()->get_xp_for_period($from_date, $to_date);
        $users_stats['total_user_xp'] = UserXPModel::instance()->get_site_total_abs_xp();
        return $users_stats;
    }
    
    public function show_general_stats() {
        $stats = $this->get_general_stats();
        echo '<table class="log-stats-table"><col width="70%"><col width="15%"><col width="15%">';
        echo '<tr>';
        echo "<th></th>";
        echo "<th>".__('For a day', 'tst')."</th>";
        echo "<th>".__('For all time', 'tst')."</th>";
        echo '</tr>';
        $i = 0;
        foreach($stats as $stats_item) {
            $i++;
            echo '<tr class="'.($i % 2 == 0 ? "alternate" : '').'">';
            echo '<td class="log-stats-title">'.$stats_item['title'].'</td>';
            echo '<td><a href="'.admin_url($stats_item['day_link']).'" title="'.__('For a day', 'tst').'">'.$stats_item['day'].'</a></td>';
            echo '<td><a href="'.admin_url($stats_item['all_link']).'" title="'.__('For all time', 'tst').'">'.$stats_item['all'].'</a></td>';
            echo '</tr>';
        }
        echo '</table>';
    }
    
    public function show_weekly_stats($stats) {
        echo '<table class="log-stats-table"><col width="70%"><col width="15%"><col width="15%">';
        echo '<tr>';
        echo "<th></th>";
        echo "<th>".__('For last week', 'tst')."</th>";
        echo "<th>".__('For all time', 'tst')."</th>";
        echo '</tr>';
        $i = 0;
        foreach($stats as $stats_item) {
            $i++;
            echo '<tr class="'.($i % 2 == 0 ? "alternate" : '').'">';
            echo '<td class="log-stats-title">'.$stats_item['title'].'</td>';
            echo '<td>'.($stats_item['week_link'] ? '<a href="'.admin_url($stats_item['week_link']).'" title="'.__('For a day', 'tst').'">'.$stats_item['week'].'</a>' : $stats_item['week']).'</td>';
            echo '<td>'.($stats_item['all_link'] ? '<a href="'.admin_url($stats_item['all_link']).'" title="'.__('For all time', 'tst').'">'.$stats_item['all'].'</a>' : $stats_item['all']).'</td>';
            echo '</tr>';
        }
        echo '</table>';
    }
    
    public function show_weekly_users_stats($stats) {
        echo '<table class="log-stats-table"><col width="85%"><col width="15%">';
        $i = 0;
        foreach($stats as $key => $stat_value) {
            $i++;
            echo '<tr class="'.($i % 2 == 0 ? "alternate" : '').'">';
            echo '<td class="log-stats-title">'.__('itv_users_weekly_stats_' . $key, 'tst').'</td>';
            echo '<td>'.$stat_value.'</td>';
            echo '</tr>';
        }
        echo '</table>';
    }
    
    public function send_weekly_stats_email() {
        $itv_config = ItvConfig::instance ();
        $last_sunday_time = strtotime('last Sunday');
        $from_date = date( 'Y-m-d', $last_sunday_time - ($itv_config->get('WEEKLY_STATS_EMAIL')['PERIOD_DAYS'] - 1) * 3600 * 24 );
        $to_date = date( 'Y-m-d', $last_sunday_time + 3600 * 24 );
        $last_sunday_date = date( 'Y-m-d', $last_sunday_time );
        
        $week_stats = $this->get_weekly_stats_for_email($from_date, $to_date);
        
        ob_start();
        $this->show_weekly_stats($week_stats);
        $stats_html = ob_get_clean();
        
        $users_stats = $this->get_users_stats($from_date, $to_date);
        
        $send_mail_count = MailSendLogModel::instance()->get_send_email_count_for_week($from_date, $to_date);
        $users_stats['week_mail_sent'] = $send_mail_count;
        
        $res_screens_count = ResultScreenshots::instance()->count_screens_uploaded_for_week($from_date, $to_date);
        $users_stats['week_res_screen_uploaded'] = $res_screens_count;
        
        ob_start();
        $this->show_weekly_users_stats($users_stats);
        $users_stats_html = ob_get_clean();
        
        $email_from = $itv_config->get('EMAIL_FROM');
        $to = $itv_config->get('WEEKLY_STATS_EMAIL')['TO_EMAIL'];
        $other_emails = $itv_config->get('WEEKLY_STATS_EMAIL')['CC_EMAILS'];
        
        $subject = __('itv_email_weekly_stats_subject', 'tst');
        $message = __('itv_email_weekly_stats_message', 'tst');
        
        $week_number = $this->get_project_live_week_number();
        $week_closed_tasks_count = $this->get_closed_tasks_count_from_week_stats($week_stats);
        
        $data_subject = array(
            'week_number' => $week_number,
            'week_closed_tasks_count' => $week_closed_tasks_count,
        );
        $subject = itv_fill_template($subject, $data_subject);

        $data = array(
            'stats_html' => $stats_html,
            'users_stats_html' => $users_stats_html,
            'from_date' => $from_date,
            'to_date' => $last_sunday_date,
            'week_number' => $week_number,
            'week_closed_tasks_count' => $week_closed_tasks_count,
        );
        $message = nl2br($message);
        $message = itv_fill_template($message, $data);
        
        $headers  = 'MIME-Version: 1.0' . "\r\n";
        $headers .= 'Content-type: text/html; charset=UTF-8' . "\r\n";
        $headers .= 'From: ' . __('ITVounteer', 'tst') . ' <'.$email_from.'>' . "\r\n";
        if(count($other_emails) > 0) {
            $headers .= 'Cc: ' . implode(', ', $other_emails) . "\r\n";
        }
        
        wp_mail($to, $subject, $message, $headers);
    }
    
    public function get_project_live_week_number() {
        global $wpdb;
        
        $sql = "
        SELECT post_date FROM $wpdb->posts WHERE post_type = 'tasks' ORDER BY post_date ASC LIMIT 1
        ";
        $task_add_date = $wpdb->get_var ( $sql );
        
        $now_datetime = new DateTime();
        $first_task_datetime = DateTime::createFromFormat('Y-m-d H:i:s', $task_add_date);
        $datetime_diff = $now_datetime->diff($first_task_datetime);
        
        $days_number = $datetime_diff->format('%a');
        $week_number = floor($days_number / 7);
        
        return $week_number;
    }
    
    public function get_closed_tasks_count_from_week_stats($week_stats) {
        $closed_tasks_count = 0;
        try {
            $closed_tasks_count = $week_stats['close']['week'];
        }
        catch(Exception $ex) {
        }
        return $closed_tasks_count;
    }
    
}
