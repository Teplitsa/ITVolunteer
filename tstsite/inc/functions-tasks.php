<?php
use ITV\models\UserXPModel;
use ITV\models\ResultScreenshots;
use ITV\models\TimelineModel;

/**
 * Task related utilities and manipulations
 * (code wiil be modevd here from customizer.php and extras.php)
 **/

/** Tasks custom status **/
add_action('init', 'tst_custom_task_status');
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
        'label_count'               => _n_noop('In work <span class="count">(%s)</span>', 'In work <span class="count">(%s)</span>', 'tst'),
    ));
    register_post_status('closed', array(
        'label'                     => __('Closed', 'tst'),
        'public'                    => true,
        'exclude_from_search'       => true,
        'show_in_admin_all_list'    => true,
        'show_in_admin_status_list' => true,
        'label_count'               => _n_noop('Closed <span class="count">(%s)</span>', 'Closed <span class="count">(%s)</span>', 'tst'),
    ));
	register_post_status('archived', array(
        'label'                     => __('Archived', 'tst'),
        'public'                    => true,
        'exclude_from_search'       => true,
        'show_in_admin_all_list'    => true,
        'show_in_admin_status_list' => true,
        'label_count'               => _n_noop('Archived <span class="count">(%s)</span>', 'Archived <span class="count">(%s)</span>', 'tst'),
    ));
}


/** Prevent tasks authors to be overriden **/
add_filter('wp_insert_post_data', 'tst_preserve_task_author', 2,2);
function tst_preserve_task_author($data, $postarr) {
		
	if(!empty($postarr['ID']) && $data['post_type'] == 'tasks') {
		$post_id = (int)$postarr['ID'];
		$post_before = get_post($post_id);
		$data['post_author'] = $post_before->post_author;
	}
	
	return $data;
}


/** AJAX on task edits **/
function ajax_add_edit_task(){

    $task_id = (int)$_POST['id'] > 0 ? (int)$_POST['id'] : 0;
    $itv_log = ItvLog::instance();
    
    $params = array(
        'post_type' => 'tasks',
        'post_title' => filter_var(trim($_POST['title']), FILTER_SANITIZE_STRING),
        'post_content' => filter_var(trim($_POST['descr']), FILTER_SANITIZE_STRING),
        'tags_input' => filter_var($_POST['tags'], FILTER_SANITIZE_STRING),
    );
	
	$is_new_task = false;
    if($task_id) { // Updating a task
        $params['ID'] = $task_id;

        if(isset($_POST['status']) && $_POST['status'] == 'trash') {

            wp_trash_post((int)$task_id);
            $itv_log->log_task_action($task_id, ItvLog::$ACTION_TASK_DELETE, get_current_user_id());            

            wp_die(json_encode(array(
                'status' => 'deleted',
                'message' => __('The task was successfully deleted.', 'tst'),
            )));
        } else {
            $params['post_status'] = filter_var($_POST['status'], FILTER_SANITIZE_STRING);
        }
    }
    // New task
    else {
        $is_new_task = true;
        $params['post_status'] = isset($_POST['status']) ? filter_var($_POST['status'], FILTER_SANITIZE_STRING) : 'draft';		
    }
   
	$task_id = wp_insert_post($params);
	
    if($task_id) {
        $old_is_tst_consult_needed = get_field('is_tst_consult_needed', $task_id);
        $new_is_tst_consult_needed = (int)$_POST['is_tst_consult_needed'] ? true : false;
        
		//update_field doesn't work for some reason - use native functions
		update_post_meta($task_id, 'about-author-org', filter_var(trim(isset($_POST['about_author_org']) ? $_POST['about_author_org'] : ''), FILTER_SANITIZE_STRING));
		wp_set_post_terms($task_id, (int)$_POST['reward'], 'reward');
		wp_set_post_terms($task_id, explode(',', filter_var($_POST['nko_tags'], FILTER_SANITIZE_STRING)), 'nko_task_tag');
		update_post_meta($task_id, 'is_tst_consult_needed', $new_is_tst_consult_needed);
		
		$timeline = ITV\models\TimelineModel::instance();
		
        if($is_new_task) {
            $timeline->create_task_timeline($task_id);
            tst_send_admin_notif_new_task($task_id);
        }
        
        if($new_is_tst_consult_needed) {
            if($is_new_task || !$old_is_tst_consult_needed) {
                update_field('is_tst_consult_done', false, $task_id);
                ItvConsult::create($task_id);
            }
        }
				
        if($params['post_status'] == 'draft') {
            wp_die(json_encode(array(
                'status' => 'saved',
//            'message' =>  ?
//                    __('The task was successfully saved.', 'tst') :
//                    __('The task was successfully created.', 'tst'),
                'id' => $task_id,
            )));
        } else {
            $timeline->make_future_item_current($task_id, TimelineModel::$TYPE_SEARCH_DOER);
            
            wp_die(json_encode(array(
                'status' => 'ok',
//            'message' =>  ?
//                    __('The task was successfully saved.', 'tst') :
//                    __('The task was successfully created.', 'tst'),
                'id' => $task_id
            )));
        }

    } else {

        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => empty($params['ID']) ?
                __('<strong>Error:</strong> something occured due to the task addition.', 'tst') :
                __('<strong>Error:</strong> something occured due to task edition.', 'tst'),
        )));
    }
}
add_action('wp_ajax_add-edit-task', 'ajax_add_edit_task');
add_action('wp_ajax_nopriv_add-edit-task', 'ajax_add_edit_task');


/** Correct tags calculations for tasks */
add_action('edited_term_taxonomy', 'tst_correct_tag_count', 2, 2);
function tst_correct_tag_count($term_taxonomy_id, $taxonomy){
	global $wpdb;
	
	if($taxonomy != 'post_tag')
		return;
	
	if(is_object($term_taxonomy_id))
		$term_taxonomy_id = (int)$term_taxonomy_id->term_taxonomy_id;
		

	$count = (int) $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM $wpdb->term_relationships, $wpdb->posts WHERE $wpdb->posts.ID = $wpdb->term_relationships.object_id AND post_status IN ('publish', 'in_work', 'closed', 'archived') AND post_type IN ('tasks') AND term_taxonomy_id = %d", $term_taxonomy_id ));
		
	$wpdb->update($wpdb->term_taxonomy, compact( 'count' ), array( 'term_taxonomy_id' => $term_taxonomy_id ) );
}

/* Update task metas when number of volunteers changed volunteers */
function tst_get_task_doers($task_id, $only_approved = false) {

    $arr = array(
        'connected_type' => 'task-doers',
        'connected_items' => $task_id,
    );
	
    if($only_approved) {
        $arr['connected_meta'] = array('is_approved' => true);
        $result = get_users($arr);
		
    } else {
		
		$total = get_users($arr);
		$result = $queue = array();
		
		foreach($total as $i => $user){ 
			if(p2p_get_meta($user->p2p_id, 'is_approved', true)){
				$result[$user->ID] = $user;
			}
			else {
				$queue[$user->ID] = $user;
			}
		}
		
        $result = array_merge($result, $queue);
    }

    return $result;
}

function tst_get_task_doers_count($task_id, $only_approved = false, $update = false) {
	
	if(isset($_GET['update']) && $_GET['update'] == 1)
		$update = true;
	
	$key = ($only_approved) ? 'upproved_candidates_number' : 'candidates_number';
	
	if(!$update){ //try to get from meta				
		$num = get_post_meta($task_id, $key, true);
		if(false !== $num)
			return (int)$num;
	}
		
	$num = count(tst_get_task_doers($task_id, $only_approved));
	
	if($update) {
		update_post_meta($task_id, $key, $num);
	}	
	
    return $num;
}

function tst_is_user_already_candidate($candidate_user_id, $task_id) {
    $is_already_candidate = false;
    $task_doers = tst_get_task_doers($task_id);
    foreach ($task_doers as $user_id => $user) {
        if( $candidate_user_id == $user->ID) {
            $is_already_candidate = true;
            break;
        }
    }
    
    return $is_already_candidate;
}


add_action('update_task_stats', 'tst_actualize_task_stats'); //store numbers as metas
function tst_actualize_task_stats($task) {
	
	tst_get_task_doers_count($task->ID, false, true);
	tst_get_task_doers_count($task->ID, true, true);
}

add_action('wp_insert_comment','comment_inserted',99,2);
function comment_inserted($comment_id, $comment_object) {
    UserXPModel::instance()->register_activity_from_gui(get_current_user_id(), UserXPModel::$ACTION_ADD_COMMENT);
}

# result screenshots
function ajax_delete_result_screenshot() {
    $member = wp_get_current_user();
    $screen_id = isset($_GET['screen_id']) ? (int)$_GET['screen_id'] : 0;

    $res = null;
    try {
        $res = ResultScreenshots::instance()->ajax_delete_screenshot($member, $screen_id);
    }
    catch (\Exception $ex) {
        error_log($ex);
    
        $res = array(
            'status' => 'error',
            'message' => 'unkown error',
        );
    }
    
    wp_die(json_encode($res));
}
add_action('wp_ajax_delete-result-screenshot', 'ajax_delete_result_screenshot');

function ajax_upload_result_screenshot() {
    $member = wp_get_current_user();
    $task_id = isset($_POST['task_id']) ? (int)$_POST['task_id'] : 0;

    $res = null;
    try {
        $res = ResultScreenshots::instance()->ajax_upload_screenshot($member, $task_id);
    }
    catch (\Exception $ex) {
        error_log($ex);
        
        $res = array(
            'status' => 'error',
            'message' => 'unkown error',
        );
    }

    wp_die(json_encode($res));
}
add_action('wp_ajax_upload-result-screenshot', 'ajax_upload_result_screenshot');

function itv_ajax_submit_task_comment(){
    error_log("call itv_ajax_submit_task_comment...");

    $task_identity = \GraphQLRelay\Relay::fromGlobalId( $_POST['task_gql_id'] );
    $task_id = !empty($task_identity['id']) ? (int)$task_identity['id'] : 0;
    
    $parent_comment_identity = !empty($_POST['parent_comment_id']) ? \GraphQLRelay\Relay::fromGlobalId( $_POST['parent_comment_id'] ) : null;
    $parent_comment_id = !empty($parent_comment_identity['id']) ? (int)$parent_comment_identity['id'] : 0;
    
    $itv_log = ItvLog::instance();
    
    if($task_id && is_user_logged_in()) {

        $comment_data = array(
            'comment' => filter_var(trim($_POST['comment_body']), FILTER_SANITIZE_STRING),
            'comment_parent' => $parent_comment_id,
            'comment_post_ID' => $task_id,
        );

        $comment = wp_handle_comment_submission($comment_data);
        
        if(is_wp_error($comment)) {
            wp_die(json_encode(array(
                'status' => 'error',
                'message' => $comment->get_error_message(),
            )));
        }
        
        wp_die(json_encode(array(
            'status' => 'ok',
            'comment' => [
                'id' => \GraphQLRelay\Relay::toGlobalId( 'comment', $comment->comment_ID ),
                'content' => $comment->comment_content,
                'date' => $comment->comment_date,
            ],
        )));
        
    } else {
        wp_die(json_encode(array(
            'status' => 'error',
            'message' => __('Error!', 'tst'),
        )));
    }
}
add_action('wp_ajax_submit-comment', 'itv_ajax_submit_task_comment');
add_action('wp_ajax_nopriv_submit-comment', 'itv_ajax_submit_task_comment');

function itv_ajax_get_task_timeline(){
    error_log("call itv_ajax_submit_task_comment...");

    $task_identity = \GraphQLRelay\Relay::fromGlobalId( $_POST['task_gql_id'] );
    $task_id = !empty($task_identity['id']) ? (int)$task_identity['id'] : 0;
    
    if($task_id && is_user_logged_in()) {
        
        $timeline = ITV\models\TimelineModel::instance()->get_task_timeline($task_id);
        $res = [];
        foreach($timeline as $k => $ti) {
            $ti_data = $ti->attributesToArray();
            if($ti_data['due_date'] == '0000-00-00') {
                $ti_data['due_date'] = null;
            }
            
            if(in_array($ti->type, [TimelineModel::$TYPE_CLOSE_SUGGEST])) {
                $ti_data['timeline_date'] = $ti_data['created_at'];
            }
            else {
                $ti_data['timeline_date'] = $ti_data['due_date'] ? $ti_data['due_date'] : $ti_data['created_at'];
            }
            
            $res[] = $ti_data;
        }
        
        wp_die(json_encode(array(
            'status' => 'ok',
            'timeline' => $res,
        )));
        
    } else {
        wp_die(json_encode(array(
            'status' => 'error',
            'message' => __('Error!', 'tst'),
        )));
    }
}
add_action('wp_ajax_get-task-timeline', 'itv_ajax_get_task_timeline');
add_action('wp_ajax_nopriv_get-task-timeline', 'itv_ajax_get_task_timeline');

function ajax_suggest_close_task() {
	if(
			empty($_POST['task-id'])
	) {
		wp_die(json_encode(array(
		'status' => 'fail',
		'message' => __('<strong>Error:</strong> wrong data given.', 'tst'),
		)));
	}

	$task_id = (int)$_POST['task-id'];
	$task = get_post($task_id);
	$doer_id = get_current_user_id();

	if(!$task) {
		wp_die(json_encode(array(
		'status' => 'fail',
		'message' => __('<strong>Error:</strong> task not found.', 'tst'),
		)));
	}

	$task_doer = null;
	foreach(tst_get_task_doers($task->ID, true) as $doer) {
		if( !$doer ) // If doer deleted his account
			continue;
		if($doer_id == $doer->ID) {
			$task_doer = $doer;
			break;
		}
	}

	if(!$task_doer) {
		wp_die(json_encode(array(
		'status' => 'fail',
		'message' => __('<strong>Error:</strong> task doer not found.', 'tst'),
		)));
	}

	$message = filter_var(trim(isset($_POST['message']) ? $_POST['message'] : ''), FILTER_SANITIZE_STRING);
	if(!$message) {
		wp_die(json_encode(array(
		'status' => 'fail',
		'message' => __('<strong>Error:</strong> empty message.', 'tst'),
		)));
	}
	
    $timeline = ITV\models\TimelineModel::instance();
    $timeline->add_current_item($task_id, TimelineModel::$TYPE_CLOSE_SUGGEST, ['doer_id' => $doer_id, 'message' => $message]);

    wp_die(json_encode(array(
        'status' => 'ok',
    )));
}
add_action('wp_ajax_suggest-close-task', 'ajax_suggest_close_task');
add_action('wp_ajax_nopriv_suggest-close-task', 'ajax_suggest_close_task');

function ajax_suggest_close_date() {
	if(
			empty($_POST['task-id'])
	) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> wrong data given.', 'tst'),
        )));
	}

	$task_id = (int)$_POST['task-id'];
	$task = get_post($task_id);
	$doer_id = get_current_user_id();

	if(!$task) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> task not found.', 'tst'),
        )));
	}

	$task_doer = null;
	foreach(tst_get_task_doers($task->ID, true) as $doer) {
		if( !$doer ) // If doer deleted his account
			continue;
		if($doer_id == $doer->ID) {
			$task_doer = $doer;
			break;
		}
	}

	if(!$task_doer) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> task doer not found.', 'tst'),
        )));
	}

	$message = filter_var(trim(isset($_POST['message']) ? $_POST['message'] : ''), FILTER_SANITIZE_STRING);
	if(!$message) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> empty message.', 'tst'),
        )));
	}

	$due_date = filter_var(trim(isset($_POST['due_date']) ? $_POST['due_date'] : ''), FILTER_SANITIZE_STRING);
	$due_date = date('Y-m-d H:i:s', strtotime($due_date));
	
	if(!$message) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> wrong data given.', 'tst'),
        )));
	}
	
    $timeline = ITV\models\TimelineModel::instance();
    $timeline->add_current_item($task_id, TimelineModel::$TYPE_DATE_SUGGEST, ['doer_id' => $doer_id, 'message' => $message, 'due_date' => $due_date]);

    wp_die(json_encode(array(
        'status' => 'ok',
    )));
}
add_action('wp_ajax_suggest-close-date', 'ajax_suggest_close_date');
add_action('wp_ajax_nopriv_suggest-close-date', 'ajax_suggest_close_date');