<?php
/**
 * Code for ITV functions
 */

/** Add an author filtering on Tasks to exclude account-deleted's tasks */
add_action('pre_get_posts', 'tst_main_query_mods');
function tst_main_query_mods(WP_Query $query) {

    // exclude account_deleted's tasks:
    if( !is_admin() && $query->is_main_query() ) {
        if(is_tag() && !$query->get('post_type')) {

            $query->set('post_type', 'tasks');
        }

        $query->set('author', '-'.ACCOUNT_DELETED_ID);
    }

    if(isset($query->query_vars['query_id']) && @$query->query_vars['query_id'] == 'count_tasks_by_status') {
        $query->set('author', '-'.ACCOUNT_DELETED_ID);
    }
    elseif(($query->is_main_query() && $query->is_archive())
       || ($query->get('post_type') == 'tasks')
    ) {
        
        if( !empty($_GET['st']) ) {
            $query->set('post_status', $_GET['st'] == '-' ? array('publish', 'in_work', 'closed') : $_GET['st']);
        }
        if( !empty($_GET['dl']) ) {
            $metas = (array)$query->get('meta_query');
            switch($_GET['dl']) {
                case '10':
                    $metas[] = array(
                        'key' => 'deadline',
                        'value' => array(date('Ymd'), date('Ymd', strtotime('+10 days'))),
                        'compare' => 'BETWEEN',
                        'type' => 'DATE'
                    );
                    break;
                case 'lm':
                    $metas[] = array(
                        'key' => 'deadline',
                        'value' => array(date('Ymd'), date('Ymd', strtotime('+1 month'))),
                        'compare' => 'BETWEEN',
                        'type' => 'DATE'
                    );
                    break;
                case 'mm':
                    $metas[] = array(
                        'key' => 'deadline',
                        'value' => array(date('Ymd', strtotime('+1 month')), date('Ymd', strtotime('+6 months'))),
                        'compare' => 'BETWEEN',
                        'type' => 'DATE'
                    );
                    break;
            }
            $query->set('meta_query', $metas);
        }
        if( !empty($_GET['rw']) ) {
            $metas = (array)$query->get('meta_query');
            $metas[] = array(
                'key' => 'reward',
                'value' => $_GET['rw'], //'slug',
                'compare' => '=',
            );
            $query->set('meta_query', $metas);
        }
        if( !empty($_GET['tt']) ) {
            $query->set('tag_slug__in', (array)$_GET['tt']);
        }
    }
}

/** Add an author filtering to exclude account-deleted's account from users query */
add_action('pre_user_query', function(WP_User_Query $query){
    global $wpdb;
    if ( isset( $query->query_vars['query_id'] ) && 'get_members_for_members_page' == $query->query_vars['query_id'] ) {
        $query->query_fields = " SQL_CALC_FOUND_ROWS {$wpdb->users}.* ";
        $query->query_from = " FROM {$wpdb->users}
            INNER JOIN {$wpdb->usermeta} wp_usermeta ON ({$wpdb->users}.ID = wp_usermeta.user_id)
            INNER JOIN {$wpdb->usermeta} wp_usermeta2 ON ({$wpdb->users}.ID = wp_usermeta2.user_id)
        ";
        $query->query_where = " WHERE 1=1 AND wp_usermeta.meta_key = 'member_rating' AND wp_usermeta2.meta_key = 'member_order_data' ";
        $query->query_orderby = " ORDER BY wp_usermeta.meta_value DESC, wp_usermeta2.meta_value ASC";
        
        if(@$query->query_vars['itv_member_role']) {
            $member_role = (int)$query->query_vars['itv_member_role'];            
            $query->query_from .= " INNER JOIN {$wpdb->usermeta} wp_usermeta3 ON ({$wpdb->users}.ID = wp_usermeta3.user_id) ";
            $query->query_where .= " AND wp_usermeta3.meta_key = 'member_role' AND wp_usermeta3.meta_value = '{$member_role}' ";
        }
        #echo $query->query_fields . ' ' . $query->query_from . ' ' . $query->query_where . ' ' . $query->query_orderby;
    }

    if(stristr($query->query_where, 'WHERE 1=1') === false) {
        $query->query_where = 'WHERE 1=1 '.$query->query_where;
    }
    
//    if( !is_admin() ) {
//        $query->set('exclude', array(ACCOUNT_DELETED_ID));
//    }
}, 100);

add_action('post_updated', function($id, WP_Post $after_update, WP_Post $pre_update){

    if($after_update->post_type != 'tasks')
        return;

    if(current_user_can('edit_post') && $pre_update->post_author != $after_update->post_author) {
        global $wpdb;

        $wpdb->update($wpdb->prefix.'posts', array(
            'post_author' => $pre_update->post_author,
            'post_date' => $pre_update->post_date,
        ), array('ID' => $id,));
    }
//        wp_update_post(array('ID' => $id, 'post_author' => $pre_update->post_author)); // Infinite loop danger
}, 10, 3);

add_filter('wp_mail_from_name', function($original_email_from){
    return __('ITVounteer', 'tst');
});
add_filter('wp_mail_from', function($email){
    return 'support@te-st.ru';
});
add_filter('wp_mail_content_type', function(){
    return 'text/html';
});

add_filter('comment_notification_text', function($email_text, $comment){
    global $email_templates;

    return sprintf($email_templates['new_comment_task_author_notification']['text'], get_comment_link($comment));
}, 10, 2);

add_filter('get_comment_link', function($link, $comment, $args){
    return stristr($link, '-'.$comment->comment_ID) ? $link : $link.'-'.$comment->comment_ID;
}, 10, 3);

function my_task_function() {
    wp_mail('your@email.com', 'Automatic email', 'Automatic scheduled email from WordPress.');
}

function tst_custom_task_status(){
    /**
     * Предполагаем, что:
     * draft - черновик задачи,
     * publish - задача открыта,
     * in_work - задача в работе,
     * closed - закрыта.
     */

    register_post_status('in_work', array(
        'label'                     => __('In work', 'tst'),
        'public'                    => true,
        'exclude_from_search'       => false,
        'show_in_admin_all_list'    => true,
        'show_in_admin_status_list' => true,
        'label_count'               => _n_noop('In work <span class="count">(%s)</span>', 'In work <span class="count">(%s)</span>'),
    ));
    register_post_status('closed', array(
        'label'                     => __('Closed', 'tst'),
        'public'                    => true,
        'exclude_from_search'       => true,
        'show_in_admin_all_list'    => true,
        'show_in_admin_status_list' => true,
        'label_count'               => _n_noop('Closed <span class="count">(%s)</span>', 'Closed <span class="count">(%s)</span>'),
    ));
}
add_action('init', 'tst_custom_task_status');

// Let common users (subscriber role) to edit their tasks:
add_action('init', function(){

//    $role = get_role('subscriber');
//    if( !empty($role->capabilities['edit_tasks']) )
//        return;
//
//    $role->add_cap('edit_task');
//    $role->add_cap('edit_tasks');
//    $role->add_cap('publish_own_tasks');
});

//add_filter('tasks_available_statuses', function($status_list){
//    $status_list['publish']->label = __('Opened', 'tst');
//
//    unset($status_list['future'], $status_list['pending'], $status_list['private'], $status_list['auto-draft'], $status_list['inherit'], $status_list['']);
//
//    return $status_list;
//});


add_action('init', function(){
    if ( function_exists('p2p_register_connection_type') ) {
        p2p_register_connection_type(array(
            'name' => 'task-doers',
            'from' => 'tasks',
            'to' => 'user',
            'cardinality' => 'many-to-many',
            'admin_dropdown' => 'any',
            'fields' => array(
                'is_approved' => array(
                    'title' => __('Doer approved', 'tst'),
                    'type' => 'checkbox',
                    'default' => false,
                ),
            ),
            'title' => array(
                'from' => __('Task doers', 'tst'),
                'to' => __('Tasks', 'tst'),
            ),
            'from_labels' => array(
                'singular_name' => __('Task', 'tst'),
                'search_items' => __('Search tasks', 'tst'),
                'not_found' => __('No tasks found.', 'tst'),
                'create' => __('Create connections', 'tst'),
            ),
            'to_labels' => array(
                'singular_name' => __('Doer', 'tst'),
                'search_items' => __('Search doers', 'tst'),
                'not_found' => __('No doers found.', 'tst'),
                'create' => __('Create connections', 'tst'),
            ),
        ));
    }
});

if( !wp_next_scheduled('tst_deadline_reminder_hook') ) { // For production
//    wp_clear_scheduled_hook('tst_deadline_reminder_hook'); // For debug
    wp_schedule_event(time(), 'daily', 'tst_deadline_reminder_hook');
}

add_action('tst_deadline_reminder_hook', function(){

    global $email_templates;

    foreach(get_posts(array(
        'post_type' => 'tasks',
        'post_status' => 'any', //array('draft', 'publish', 'in_work', 'closed'),
        'nopaging' => true,
    )) as $task) {
        $deadline = get_field('deadline', $task->ID); // 'field_533bef200fe90'
        $days_till_deadline = date_diff(date_create(), date_create($deadline))->days;

        if($days_till_deadline == 1 && ($task->post_status == 'publish' || $task->post_status == 'in_work')) {

            $task_permalink = get_permalink($task);
            wp_mail(
                get_user_by('id', $task->post_author)->user_email,
                $email_templates['deadline_coming_author_notification']['title'],
                nl2br(sprintf($email_templates['deadline_coming_author_notification']['text'], $task_permalink))
            );

            foreach(tst_get_task_doers($task->ID, false) as $doer) {

                if( !$doer ) // If doer deleted his account
                    continue;
                wp_mail(
                    $doer->user_email,
                    $email_templates['deadline_coming_doer_notification']['title'],
                    nl2br(sprintf($email_templates['deadline_coming_doer_notification']['text'], $task_permalink))
                );
            }
        } else if( !$days_till_deadline && $task->post_status == 'publish' && !tst_get_task_doers($task->ID, false) ) {

            wp_update_post(array('ID' => $task->ID, 'post_status' => 'draft'));
        }
    }
});


function tst_get_task_status_list() {
    return array(
        'draft' => __('Draft', 'tst'),
        'publish' => __('Opened', 'tst'),
        'in_work' => __('In work', 'tst'),
        'closed' => __('Closed', 'tst'),
    );
}

function tst_get_task_status_label($status = false) {

    if( !$status ) {
        global $post;

        if( !$post || $post->post_type != 'tasks')
            return false;

        $status = $post->post_status;
    }

    $status_list = tst_get_task_status_list();
    return isset($status_list[$status]) ? $status_list[$status] : false;
}

function tst_get_deadline_class($days) {
    $days = (int)$days;
    if($days < 10)
        return 'urgent';
    else if($days >= 10 && $days < 30)
        return 'low-urgency';
    else if($days >= 30 && $days < 90)
        return 'no-urgency';
    else
        return 'all-time-of-world';
}

function date_from_dd_mm_yy_to_yymmdd($date) {
    if(preg_match('/^\d{2}\.\d{2}\.\d{4}$/', $date)) {
        $date_arr = date_parse_from_format ( "d.m.Y" , $date );
        return sprintf("%04d%02d%02d", $date_arr['year'], $date_arr['month'], $date_arr['day']);
    }
    else {
        return $date;
    }
}

function date_from_yymmdd_to_dd_mm_yy($date) {
    if(preg_match('/^\d{8}$/', $date)) {
        $date_arr = date_parse_from_format ( "Ymd" , $date );
        return sprintf("%02d.%02d.%04d", $date_arr['day'], $date_arr['month'], $date_arr['year']);
    }
    else {
        return $date;
    }
}

function ajax_add_edit_task(){

    $_POST['id'] = (int)$_POST['id'] > 0 ? (int)$_POST['id'] : 0;

    $params = array(
        'post_type' => 'tasks',
        'post_title' => htmlentities(trim($_POST['title']), ENT_COMPAT, 'UTF-8'),
        'post_content' => htmlentities(trim($_POST['descr']), ENT_COMPAT, 'UTF-8'),
        'tags_input' => $_POST['tags'],
    );
	
	$is_new_task = false;
    if($_POST['id']) { // Updating a task
        $params['ID'] = $_POST['id'];

        if(isset($_POST['status']) && $_POST['status'] == 'trash') {

            wp_trash_post($_POST['id']);

            die(json_encode(array(
                'status' => 'deleted',
                'message' => __('The task was successfully deleted.', 'tst'),
            )));
        } else
            $params['post_status'] = $_POST['status'];

    }
    // New task
    else {
        $is_new_task = true;
        $params['post_status'] = isset($_POST['status']) ? $_POST['status'] : 'draft';        
    }

    $_POST['id'] = wp_insert_post($params);
    if($_POST['id']) {
        $old_is_tst_consult_needed = get_field(ITV_ACF_TASK_is_tst_consult_needed, $_POST['id']);
        $new_is_tst_consult_needed = (int)$_POST['is_tst_consult_needed'] ? true : false;

        update_field('field_533bebda0fe8d', htmlentities(trim($_POST['expecting']), ENT_COMPAT, 'UTF-8'), $_POST['id']);
        update_field('field_533bec930fe8e', htmlentities(trim(@$_POST['about-reward']), ENT_COMPAT, 'UTF-8'), $_POST['id']);
        update_field('field_533beee40fe8f', htmlentities(trim($_POST['about-author-org']), ENT_COMPAT, 'UTF-8'), $_POST['id']);
        update_field('field_533bef200fe90', date_from_dd_mm_yy_to_yymmdd($_POST['deadline']), $_POST['id']);
        update_field('field_533bef600fe91', (int)$_POST['reward'], $_POST['id']);
        update_field(ITV_ACF_TASK_is_tst_consult_needed, $new_is_tst_consult_needed, $_POST['id']);
		
        if($is_new_task) {
            tst_send_admin_notif_new_task($_POST['id']);
        }
        
        if($new_is_tst_consult_needed) {
            if($is_new_task || !$old_is_tst_consult_needed) {
                update_field(ITV_ACF_TASK_is_tst_consult_done, false, $_POST['id']);
                tst_send_admin_notif_consult_needed($_POST['id']);
                tst_send_user_notif_consult_needed($_POST['id']);
            }
        }

        if($params['post_status'] == 'draft') {
            die(json_encode(array(
                'status' => 'saved',
//            'message' =>  ?
//                    __('The task was successfully saved.', 'tst') :
//                    __('The task was successfully created.', 'tst'),
                'id' => $_POST['id'],
            )));
        } else
            die(json_encode(array(
                'status' => 'ok',
//            'message' =>  ?
//                    __('The task was successfully saved.', 'tst') :
//                    __('The task was successfully created.', 'tst'),
                'id' => $_POST['id'],
                'is_already_published' => empty($params['ID']) ? 0 : 1,
            )));

    } else {

        die(json_encode(array(
            'status' => 'fail',
            'message' => empty($params['ID']) ?
                __('<strong>Error:</strong> something occured due to the task addition.', 'tst') :
                __('<strong>Error:</strong> something occured due to task edition.', 'tst'),
        )));
    }
}
add_action('wp_ajax_add-edit-task', 'ajax_add_edit_task');
add_action('wp_ajax_nopriv_add-edit-task', 'ajax_add_edit_task');

/** Publish task */
function ajax_publish_task() {
    $_POST['nonce'] = empty($_POST['nonce']) ? '' : trim($_POST['nonce']);

    if(
        empty($_POST['task-id'])
        || empty($_POST['nonce'])
        || !wp_verify_nonce($_POST['nonce'], 'task-publish-by-author')
    ) {
        die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> wrong data given.', 'tst'),
        )));
    }

//    wp_publish_post($_POST['task-id']);
    wp_update_post(array('ID' => $_POST['task-id'], 'post_status' => 'publish'));
    tst_actualize_current_member_role();

    die(json_encode(array(
        'status' => 'ok',
        'permalink' => get_permalink($_POST['task-id'])
    )));
}
add_action('wp_ajax_publish-task', 'ajax_publish_task');
add_action('wp_ajax_nopriv_publish-task', 'ajax_publish_task');

/** Remove task from publication */
function ajax_unpublish_task() {
    $_POST['nonce'] = empty($_POST['nonce']) ? '' : trim($_POST['nonce']);

    if(
        empty($_POST['task-id'])
        || empty($_POST['nonce'])
        || !wp_verify_nonce($_POST['nonce'], 'task-unpublish-by-author')
    ) {
        die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> wrong data given.', 'tst'),
        )));
    }

    wp_update_post(array('ID' => $_POST['task-id'], 'post_status' => 'draft'));
    tst_actualize_current_member_role();

    die(json_encode(array(
        'status' => 'ok',
    )));
}
add_action('wp_ajax_unpublish-task', 'ajax_unpublish_task');
add_action('wp_ajax_nopriv_unpublish-task', 'ajax_unpublish_task');

/** Send task to work */
function ajax_task_to_work() {
    $_POST['nonce'] = empty($_POST['nonce']) ? '' : trim($_POST['nonce']);

    if(
        empty($_POST['task-id'])
        || empty($_POST['nonce'])
        || !wp_verify_nonce($_POST['nonce'], 'task-send-to-work')
    ) {
        die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> wrong data given.', 'tst'),
        )));
    }

    wp_update_post(array('ID' => $_POST['task-id'], 'post_status' => 'in_work'));
    
    $task = get_post($_POST['task-id']);
    if($task) {
        $users = get_users( array(
          'connected_type' => 'task-doers',
          'connected_items' => $task
        ));
        
        foreach($users as $user) {
            if(tst_is_user_candidate($user->ID, $task->ID)) {
                tst_actualize_member_role($user);    
            }
        }
    }
    
    /** @todo Send emails to all task doers... */

    die(json_encode(array(
        'status' => 'ok',
    )));
}
add_action('wp_ajax_task-in-work', 'ajax_task_to_work');
add_action('wp_ajax_nopriv_task-in-work', 'ajax_task_to_work');

/** Close task */
function ajax_close_task() {
    $_POST['nonce'] = empty($_POST['nonce']) ? '' : trim($_POST['nonce']);

    if(
        empty($_POST['task-id'])
        || empty($_POST['nonce'])
        || !wp_verify_nonce($_POST['nonce'], 'task-close-by-author')
    ) {
        die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> wrong data given.', 'tst'),
        )));
    }

    wp_update_post(array('ID' => $_POST['task-id'], 'post_status' => 'closed'));
    $task = get_post($_POST['task-id']);
    if($task) {
        $users = get_users( array(
          'connected_type' => 'task-doers',
          'connected_items' => $task
        ));
        
        foreach($users as $user) {
            if(tst_is_user_candidate($user->ID, $task->ID)) {
                tst_actualize_member_role($user);    
            }
        }
    }

    /** @todo Send emails to all task doers... */

    die(json_encode(array(
        'status' => 'ok',
    )));
}
add_action('wp_ajax_close-task', 'ajax_close_task');
add_action('wp_ajax_nopriv_close-task', 'ajax_close_task');

/** Approve candidate as task doer */
function ajax_approve_candidate() {
    $_POST['nonce'] = empty($_POST['nonce']) ? '' : trim($_POST['nonce']);

    if(
        empty($_POST['link-id'])
        || empty($_POST['doer-id'])
        || empty($_POST['task-id'])
        || empty($_POST['nonce'])
        || !wp_verify_nonce($_POST['nonce'], $_POST['link-id'].'-candidate-ok-'.$_POST['doer-id'])
    ) {
        die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> wrong data given.', 'tst'),
        )));
    }

//    wp_update_post(array('ID' => $_POST['task-id'], 'post_status' => 'closed'));
    p2p_update_meta($_POST['link-id'], 'is_approved', true);

    // Send email to the task doer:
    $task = get_post($_POST['task-id']);
    $doer = get_user_by('id', $_POST['doer-id']);
    $task_author = get_user_by('id', $task->post_author);
    
    tst_actualize_member_role($doer);    
    tst_actualize_member_role($task_author);    

    // Notice to doer:
    global $email_templates;
    wp_mail(
        $doer->user_email,
        $email_templates['approve_candidate_doer_notice']['title'],
        nl2br(sprintf(
            $email_templates['approve_candidate_doer_notice']['text'],
            $doer->first_name,
            $task->post_title,
            $task_author->user_email,
            $task_author->user_email,
            home_url('members/'.$task_author->user_login.'/')
        ))
    );

    // Notice to author:
    wp_mail(
        $task_author->user_email,
        $email_templates['approve_candidate_author_notice']['title'],
        nl2br(sprintf(
            $email_templates['approve_candidate_author_notice']['text'],
            $task_author->first_name,
            $task->post_title,
            $doer->user_email,
            $doer->user_email,
            home_url('members/'.$doer->user_login.'/')
        ))
    );

    // Task is automatically switched "to work":
    wp_update_post(array('ID' => $_POST['task-id'], 'post_status' => 'in_work'));

    die(json_encode(array(
        'status' => 'ok',
    )));
}
add_action('wp_ajax_approve-candidate', 'ajax_approve_candidate');
add_action('wp_ajax_nopriv_approve-candidate', 'ajax_approve_candidate');

/** Refuse candidate as task doer */
function ajax_refuse_candidate() {
    $_POST['nonce'] = empty($_POST['nonce']) ? '' : trim($_POST['nonce']);

    if(
        empty($_POST['link-id'])
        || empty($_POST['doer-id'])
        || empty($_POST['task-id'])
        || empty($_POST['nonce'])
        || !wp_verify_nonce($_POST['nonce'], $_POST['link-id'].'-candidate-refuse-'.$_POST['doer-id'])
    ) {
        die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> wrong data given.', 'tst'),
        )));
    }

    p2p_update_meta($_POST['link-id'], 'is_approved', false);

    // Send email to the task doer:
    $task = get_post($_POST['task-id']);
    $doer = get_user_by('id', $_POST['doer-id']);
    tst_actualize_member_role($_POST['doer-id']);

    global $email_templates;
//    add_filter('wp_mail_content_type', function(){
//        return 'text/html';
//    });

    wp_mail(
        get_user_by('id', $_POST['doer-id'])->user_email,
        $email_templates['refuse_candidate_doer_notice']['title'],
        nl2br(sprintf(
            $email_templates['refuse_candidate_doer_notice']['text'],
            $doer->first_name,
            $task->post_title
        ))
    );

    // Task is automatically switched "publish":
    wp_update_post(array('ID' => $_POST['task-id'], 'post_status' => 'publish'));
	
    die(json_encode(array(
        'status' => 'ok',
    )));
}
add_action('wp_ajax_refuse-candidate', 'ajax_refuse_candidate');
add_action('wp_ajax_nopriv_refuse-candidate', 'ajax_refuse_candidate');

/** Add new candidate */
function ajax_add_candidate() {
    $_POST['nonce'] = empty($_POST['nonce']) ? '' : trim($_POST['nonce']);

    if(
        empty($_POST['task-id'])
        || empty($_POST['nonce'])
        || !wp_verify_nonce($_POST['nonce'], 'task-add-candidate')
    ) {
        die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> wrong data given.', 'tst'),
        )));
    }

    $task = get_post($_POST['task-id']);
    $task_author = get_user_by('id', $task->post_author);

    p2p_type('task-doers')->connect($_POST['task-id'], get_current_user_id(), array());
    tst_actualize_current_member_role();

    // Send email to the task doer:
    global $email_templates;
//    add_filter('wp_mail_content_type', function(){
//        return 'text/html';
//    });

    wp_mail(
        $task_author->user_email,
        $email_templates['add_candidate_author_notice']['title'],
        nl2br(sprintf(
            $email_templates['add_candidate_author_notice']['text'],
            $task_author->first_name,
            $task->post_title,
            htmlentities($_POST['candidate-message'], ENT_COMPAT, 'UTF-8'),
            get_permalink($_POST['task-id'])
        ))
    );

    die(json_encode(array(
        'status' => 'ok',
    )));
}
add_action('wp_ajax_add-candidate', 'ajax_add_candidate');
add_action('wp_ajax_nopriv_add-candidate', 'ajax_add_candidate');

/** Remove a candidate */
function ajax_remove_candidate() {
    $_POST['nonce'] = empty($_POST['nonce']) ? '' : trim($_POST['nonce']);

    if(
        empty($_POST['task-id'])
        || empty($_POST['nonce'])
        || !wp_verify_nonce($_POST['nonce'], 'task-remove-candidate')
    ) {
        die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> wrong data given.', 'tst'),
        )));
    }

    $task = get_post($_POST['task-id']);
    $task_author = get_user_by('id', $task->post_author);

    p2p_type('task-doers')->disconnect($_POST['task-id'], get_current_user_id());
    tst_actualize_current_member_role();

    // Send email to the task doer:
    global $email_templates;
//    add_filter('wp_mail_content_type', function(){
//        return 'text/html';
//    });

    wp_mail(
        $task_author->user_email,
        $email_templates['refuse_candidate_author_notice']['title'],
        nl2br(sprintf(
            $email_templates['refuse_candidate_author_notice']['text'],
            $task_author->first_name,
            $task->post_title,
            $_POST['candidate-message']
        ))
    );

    // Task is automatically switched "publish":
    wp_update_post(array('ID' => $_POST['task-id'], 'post_status' => 'publish'));
	
    die(json_encode(array(
        'status' => 'ok',
    )));
}
add_action('wp_ajax_remove-candidate', 'ajax_remove_candidate');
add_action('wp_ajax_nopriv_remove-candidate', 'ajax_remove_candidate');

/** Add a new login check - is account active or not: */
add_filter('authenticate', function($user, $username, $password){
    if( !is_wp_error($user) && get_user_meta($user->ID, 'activation_code', true)) {
        $err = new WP_Error('user-inactive', __('Your account is not active yet! Please check out your email.', 'tst'));
        return $err;
    }
    return $user;
}, 30, 3);

/** User logging in: */
function ajax_login() {
    $_POST['nonce'] = empty($_POST['nonce']) ? '' : trim($_POST['nonce']);

    if(
        empty($_POST['login'])
        || empty($_POST['nonce'])
        || !wp_verify_nonce($_POST['nonce'], 'user-login')
    ) {
        die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> wrong data given.', 'tst'),
        )));
    }

    $user = wp_signon(array(
        'user_login' => $_POST['login'],
        'user_password' => $_POST['pass'],
        'remember' => $_POST['remember'],
    ));
    if(is_wp_error($user)) {
        die(json_encode(array(
            'status' => 'fail',
            'message' => $user->get_error_message($user->get_error_code()),
        )));
    }

    die(json_encode(array(
        'status' => 'ok',
    )));
}
add_action('wp_ajax_login', 'ajax_login');
add_action('wp_ajax_nopriv_login', 'ajax_login');

//add_filter('login_errors', function($message){
//    return str_replace( sprintf(__('<strong>ERROR</strong>: Invalid username. <a href="%s" title="Password Lost and Found">Lost your password</a>?'), site_url('wp-login.php?action=lostpassword', 'login')), 'Your message here.', $message );
//});

/** Register a new user */
function ajax_user_register() {
    $_POST['nonce'] = empty($_POST['nonce']) ? '' : trim($_POST['nonce']);

    if( !wp_verify_nonce($_POST['nonce'], 'user-reg') ) {
        die(json_encode(array(
            'status' => 'fail',
            'message' => '<div class="alert alert-danger">'.__('<strong>Error:</strong> wrong data given.', 'tst').'</div>',
        )));
    } else if(username_exists($_POST['login'])) {
        die(json_encode(array(
            'status' => 'fail',
            'message' => '<div class="alert alert-danger">'.__('Username already exists!', 'tst').'</div>',
        )));
    } else if(email_exists($_POST['email'])) {
        die(json_encode(array(
            'status' => 'fail',
            'message' => '<div class="alert alert-danger">'.__('Email already exists!', 'tst').'</div>',
        )));
    } else {
        $user_id = wp_insert_user(array(
            'user_login' => $_POST['login'],
            'user_email' => $_POST['email'],
            'user_pass' => $_POST['pass'],
            'first_name' => $_POST['first_name'],
            'last_name' => $_POST['last_name'],
            'role' => 'author',
        ));
        if(is_wp_error($user_id)) {
            die(json_encode(array(
                'status' => 'fail',
                'message' => '<div class="alert alert-danger">'.__('We are very sorry :( Some error occured while registering your account.', 'tst').'</div>',
            )));
        } else {
            /** @var $user_id integer */
            $activation_code = sha1($user_id.'-activation-'.time());
            update_user_meta($user_id, 'activation_code', $activation_code);
            tst_actualize_member_role($user_id);
            
            global $email_templates;
//            add_filter('wp_mail_content_type', function(){
//                return 'text/html';
//            });

            wp_mail(
                $_POST['email'],
                $email_templates['activate_account_notice']['title'],
                nl2br(sprintf($email_templates['activate_account_notice']['text'], home_url("/account-activation/?uid=$user_id&code=$activation_code")))
            );

            die(json_encode(array(
                'status' => 'ok',
                'message' => '<div class="alert alert-success">'.__('Your registration is complete! Please check out the email you gave us for our activation message.', 'tst').'</div>',
            )));
        }
    }
}
add_action('wp_ajax_user-register', 'ajax_user_register');
add_action('wp_ajax_nopriv_user-register', 'ajax_user_register');


/** Register a new user */
function ajax_update_profile() {
    $_POST['nonce'] = empty($_POST['nonce']) ? '' : trim($_POST['nonce']);
    $member = wp_get_current_user();

    if( !wp_verify_nonce($_POST['nonce'], 'member_action') ) {
        die(json_encode(array(
            'status' => 'fail',
            'message' => '<div class="alert alert-danger">'.__('<strong>Error:</strong> wrong data given.', 'tst').'</div>',
        )));
    } else if($member->user_email != $_POST['email'] && email_exists($_POST['email'])) {
        die(json_encode(array(
            'status' => 'fail',
            'message' => '<div class="alert alert-danger">'.__('Email already exists!', 'tst').'</div>',
        )));
    } else {
        $params = array(
            'ID' => $_POST['id'],
            'user_email' => $_POST['email'],
            'first_name' => $_POST['first_name'],
            'last_name' => $_POST['last_name'],
        );
        if( !empty($_POST['pass']) )
            $params['user_pass'] = $_POST['pass'];

        $user_id = wp_update_user($params);
        if(is_wp_error($user_id)) {
            die(json_encode(array(
                'status' => 'fail',
                'message' => '<div class="alert alert-danger">'.__('We are very sorry :( Some error occured while updating your profile.', 'tst').'</div>',
            )));
        } else {

            // Update another fields...
            update_user_meta($member->ID, 'description', htmlentities($_POST['bio'], ENT_QUOTES, 'UTF-8'));
            update_user_meta($member->ID, 'user_city', htmlentities($_POST['city'], ENT_QUOTES, 'UTF-8'));
            update_user_meta($member->ID, 'user_workplace', htmlentities(@$_POST['user_workplace'], ENT_QUOTES, 'UTF-8'));
            update_user_meta($member->ID, 'user_speciality', htmlentities($_POST['spec'], ENT_QUOTES, 'UTF-8'));
            update_user_meta($member->ID, 'user_professional', htmlentities($_POST['pro'], ENT_QUOTES, 'UTF-8'));
            update_user_meta($member->ID, 'user_contacts', htmlentities($_POST['user_contacts_text'], ENT_QUOTES, 'UTF-8'));
            update_user_meta($member->ID, 'user_website', htmlentities($_POST['user_website'], ENT_QUOTES, 'UTF-8'));
            update_user_meta($member->ID, 'user_skype', htmlentities($_POST['user_skype'], ENT_QUOTES, 'UTF-8'));
            update_user_meta($member->ID, 'twitter', htmlentities($_POST['twitter'], ENT_QUOTES, 'UTF-8'));
            update_user_meta($member->ID, 'facebook', htmlentities($_POST['facebook'], ENT_QUOTES, 'UTF-8'));
            update_user_meta($member->ID, 'vk', htmlentities($_POST['vk'], ENT_QUOTES, 'UTF-8'));
            update_user_meta($member->ID, 'googleplus', htmlentities($_POST['googleplus'], ENT_QUOTES, 'UTF-8'));
            update_user_meta($member->ID, 'user_skills', @$_POST['user_skills']);
            tst_actualize_member_role($member);            

            die(json_encode(array(
                'status' => 'ok',
                'message' => '<div class="alert alert-success">'.sprintf(__('Your profile is successfully updated! <a href="%s" class="alert-link">View it</a>', 'tst'), tst_get_member_url($member)).'</div>',
            )));
        }
    }
}
add_action('wp_ajax_update-member-profile', 'ajax_update_profile');
add_action('wp_ajax_nopriv_update-member-profile', 'ajax_update_profile');

function ajax_delete_profile() {
    $_POST['nonce'] = empty($_POST['nonce']) ? '' : trim($_POST['nonce']);
    $_POST['id'] = (int)$_POST['id'];

    if( !wp_verify_nonce($_POST['nonce'], 'member_action') || !$_POST['id'] ) {
        die(json_encode(array(
            'status' => 'fail',
            'message' => '<div class="alert alert-danger">'.__('<strong>Error:</strong> wrong data given.', 'tst').'</div>',
        )));
    }

    if(wp_delete_user($_POST['id'], ACCOUNT_DELETED_ID)) {
        die(json_encode(array(
            'status' => 'ok',
        )));
    } else {
        die(json_encode(array(
            'status' => 'fail',
            'message' => '<div class="alert alert-danger">'.__('<strong>Error:</strong> something wrong happens when we deleted your account. We are already looking to it.', 'tst').'</div>',
        )));
    }
}
add_action('wp_ajax_delete-profile', 'ajax_delete_profile');
add_action('wp_ajax_nopriv_delete-profile', 'ajax_delete_profile');

function ajax_add_message() {

    if(empty($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'we-are-receiving-a-letter-goshujin-sama')) {
        die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> wrong data given.', 'tst'),
        )));
    }

    global $email_templates;

    $success = wp_mail(
        get_option('admin_email'),
        $email_templates['message_added_notification']['title'],
        nl2br(sprintf(
            $email_templates['message_added_notification']['text'],
            @$_POST['page_url'], $_POST['name'], $_POST['email'], $_POST['message']
        ))
    );

    if($success) {
        die(json_encode(array(
            'status' => 'ok',
            'message' => __('Your message has been sent! Thanks a lot :)', 'tst'),
        )));
    } else {
//        die(json_encode(array(
//            'status' => 'fail',
//            'message' => __('<strong>Error:</strong> message not processed.', 'tst'),
//        )));
    }
}
add_action('wp_ajax_add-message', 'ajax_add_message');
add_action('wp_ajax_nopriv_add-message', 'ajax_add_message');

add_filter('retrieve_password_message', function($message, $key){

    return nl2br(str_replace(array('>', '<'), array('', ''), $message));
//
//    global $email_templates;
//
//    if(empty($_POST['user_login']))
//        return $message;
//    elseif(strpos($_POST['user_login'], '@')) {
//
//        $user_data = get_user_by('email', trim($_POST['user_login']));
//        if( !$user_data )
//            return $message;
//        else
//            $_POST['user_login'] = $user_data->user_login;
//
//    } else
//        $_POST['user_login'] = trim($_POST['user_login']);
//
//    return nl2br(sprintf(
//        $email_templates['password_reset_notice']['text'],
//        $_POST['user_login'],
//        home_url("wp-login.php?action=rp&key=$key&login=".rawurlencode($_POST['user_login']))
//    ));
});



function tst_get_days_until_deadline($deadline) {

    if(date_create($deadline) > date_create())
        return date_diff(date_create(), date_create($deadline))->days;
    else
        return 0;

}

function tst_get_task_doers($task_id = false, $only_approved = false) {

    if( !$task_id ) {
        global $post;
        $task_id = $post->ID;
    }

    $arr = array(
        'connected_type' => 'task-doers',
        'connected_items' => $task_id,
    );

    if($only_approved) {
        $arr['connected_meta'] = array('is_approved' => true);
        $result = get_users($arr);
    } else {
        $arr['connected_meta']['is_approved'] = true;
        $result = get_users($arr);
        foreach($result as $key => $value) {
            unset($result[$key]);
            $result[$value->ID] = $value;
        }

        unset($arr['connected_meta']); //['is_approved']
        foreach(get_users($arr) as $key => $value) {
            unset($result[$key]); // if( !isset($result[$value->ID]) )
            $result[$value->ID] = $value;
        }
    }

    return $result;
}

function tst_get_task_doers_count($task_id = false, $only_approved = false) {

    return count(tst_get_task_doers($task_id, $only_approved));
}

function tst_get_user_created_tasks($user, $status = array()) {
    if(preg_match('/^\d+$/', $user) && (int)$user > 0) {
        $user = get_user_by('id', $user);
        if(!$user) {
            $user = get_user_by('login', $user);
        }
    }
    else {
        $user = get_user_by('login', $user);
    }
    $user = $user ? $user->ID : $user;
#    $user = (int)$user <= 0 ? get_user_by('login', $user)->ID : $user;

    if( !$status )
        $status = array('publish', 'in_work', 'closed',);

    $params = array(
        'post_type' => 'tasks',
        'author' => $user,
        'nopaging' => true,
    );

    if($status && (is_array($status) || strlen($status)))
        $params['post_status'] = $status;

    $query = new WP_Query($params);

    return $query->get_posts();
}

function tst_get_user_working_tasks($user, $status = array()) {

    if(preg_match('/^\d+$/', $user) && (int)$user > 0) {
        $user = get_user_by('id', $user);
        if(!$user) {
            $user = get_user_by('login', $user);
        }
    }
    else {
        $user = get_user_by('login', $user);
    }

#    $user = (int)$user <= 0 ? get_user_by('login', $user) : get_user_by('id', $user);
	
    if( !$status )
        $status = array('publish', 'in_work', 'closed',);

    $params = array(
        'connected_type' => 'task-doers',
        'connected_items' => $user->ID,
        'suppress_filters' => false,
        'nopaging' => true
    );

    if($status && (is_array($status) || strlen($status)))
        $params['post_status'] = $status;

    return get_posts($params);
}

function tst_get_user_rating($user) {
    if(is_object($user)) {
    	;
    }
    elseif(preg_match('/^\d+$/', $user) && (int)$user > 0) {
        $user = get_user_by('id', $user);
        if(!$user) {
        	$user = get_user_by('login', $user);
        }
    }
    else {
        $user = get_user_by('login', $user);
    }
    
#    $user = (int)$user <= 0 ? get_user_by('login', $user) : get_user_by('id', $user);

    return $user ? count(get_posts(array(
        'connected_type' => 'task-doers',
        'connected_items' => $user->ID,
        'post_status' => 'closed',
        'suppress_filters' => false,
        'nopaging' => true
    ))) : 0;
}

function tst_is_user_candidate($user_id = false, $task_id = false) {

    $user_id = $user_id ? $user_id : get_current_user_id();
    if( !$user_id )
        return false;

    if( !$task_id ) {
        global $post;
        $task_id = $post->ID;
    }

    $p2p_id = p2p_type('task-doers')->get_p2p_id($user_id, $task_id);

    if($p2p_id) // connection exists
        return (int)p2p_get_meta($p2p_id, 'is_approved', true) ? 2 : 1;
    return 0;
}

function tst_send_admin_notif_new_task($post_id) {
    # disabled function
    return;
	global $ITV_ADMIN_EMAILS, $ITV_EMAIL_FROM;
	$task = get_post($post_id);
	
	if($task && count($ITV_ADMIN_EMAILS) > 0) {
		$to = $ITV_ADMIN_EMAILS[0];
		$other_emails = array_slice($ITV_ADMIN_EMAILS, 1);
		$message = __('itv_email_new_task_added_message', 'tst');
		$data = array(
			'{{task_url}}' => '<a href="' . get_permalink($post_id) . '">' . get_permalink($post_id) . '</a>',
			'{{task_title}}' => get_the_title($post_id),
			'{{task_content}}' => $task->post_content
		);
		$message = str_replace(array_keys($data), $data, $message);
		$message = str_replace("\\", "", $message);
		$message = nl2br($message);
		
		$subject = __('itv_email_new_task_added_subject', 'tst');
		
		$headers  = 'MIME-Version: 1.0' . "\r\n";
		$headers .= 'Content-type: text/html; charset=UTF-8' . "\r\n";
		$headers .= 'From: ' . __('ITVounteer', 'tst') . ' <'.$ITV_EMAIL_FROM.'>' . "\r\n";
		if(count($other_emails) > 0) {
			$headers .= 'Cc: ' . implode(', ', $other_emails) . "\r\n";
		}
		wp_mail($to, $subject, $message, $headers);
	}
}

function tst_send_admin_notif_consult_needed($post_id) {
    global $ITV_CONSULT_EMAILS, $ITV_EMAIL_FROM;
    $task = get_post($post_id);
    
    if($task && count($ITV_CONSULT_EMAILS) > 0) {
            $to = $ITV_CONSULT_EMAILS[0];
            $other_emails = array_slice($ITV_CONSULT_EMAILS, 1);
            $message = __('itv_email_test_consult_needed_message', 'tst');
            $data = array(
                    '{{task_url}}' => '<a href="' . get_permalink($post_id) . '">' . get_permalink($post_id) . '</a>',
                    '{{task_title}}' => get_the_title($post_id),
                    '{{task_content}}' => $task->post_content
            );
            $message = str_replace(array_keys($data), $data, $message);
            $message = str_replace("\\", "", $message);
            $message = nl2br($message);
            
            $subject = __('itv_email_test_consult_needed_subject', 'tst');
            
            $headers  = 'MIME-Version: 1.0' . "\r\n";
            $headers .= 'Content-type: text/html; charset=UTF-8' . "\r\n";
            $headers .= 'From: ' . __('ITVounteer', 'tst') . ' <'.$ITV_EMAIL_FROM.'>' . "\r\n";
            if(count($other_emails) > 0) {
                    $headers .= 'Cc: ' . implode(', ', $other_emails) . "\r\n";
            }
            wp_mail($to, $subject, $message, $headers);
    }
}

function tst_send_user_notif_consult_needed($post_id) {
    global $ITV_EMAIL_FROM;
    
    $task = get_post($post_id);
    $task_author = (isset($task->post_author)) ? get_user_by('id', $task->post_author) : false;
    if($task_author) {
        $to = $task_author->user_email;
        
        $message = __('itv_email_test_consult_needed_notification', 'tst');
        $data = array(
                '{{task_url}}' => '<a href="' . get_permalink($post_id) . '">' . get_permalink($post_id) . '</a>',
                '{{task_title}}' => get_the_title($post_id),
        );
        $message = str_replace(array_keys($data), $data, $message);
        $message = str_replace("\\", "", $message);
        $message = nl2br($message);
        
        $subject = __('itv_email_test_consult_needed_notification_subject', 'tst');
        
        $headers  = 'MIME-Version: 1.0' . "\r\n";
        $headers .= 'Content-type: text/html; charset=UTF-8' . "\r\n";
        $headers .= 'From: ' . __('ITVounteer', 'tst') . ' <'.$ITV_EMAIL_FROM.'>' . "\r\n";
        
        wp_mail($to, $subject, $message, $headers);
    }
    
}


function tst_post_updated( $post_id ) {
    remove_action( 'save_post', 'tst_post_updated' );
    $post = get_post( $post_id );
    if($post) {
        tst_actualize_member_role($post->post_author);
    }
}
add_action( 'save_post', 'tst_post_updated' );

function tst_consult_column( $column, $post_id ) {
    switch ( $column ) {
	case 'is_tst_consult_needed' :
            $is_tst_consult_needed = get_field(ITV_ACF_TASK_is_tst_consult_needed, $post_id);
            if($is_tst_consult_needed) {
                $is_tst_consult_done = get_field(ITV_ACF_TASK_is_tst_consult_done, $post_id);
                if($is_tst_consult_done) {
                    echo "<b class='itv-admin-test-consult-done'>".__('Done', 'tst')."</b>";
                }
                else {
                    echo "<b class='itv-admin-test-consult-needed'>".__('Needed!', 'tst')."</b>";
                }
            }
            break;
    }
}
add_action( 'manage_posts_custom_column' , 'tst_consult_column', 10, 2 );


function add_tst_consult_column( $columns, $post_type ) {
    
    if($post_type == 'tasks'){
        $columns = array_merge( $columns, array( 'is_tst_consult_needed' => __( 'Te-st consulting', 'tst' ) ) );
    }    
    
    return $columns;
}
add_action( 'manage_posts_columns' , 'add_tst_consult_column', 2,2);
