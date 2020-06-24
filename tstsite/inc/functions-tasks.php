<?php
use ITV\models\UserXPModel;
use ITV\models\ResultScreenshots;
use ITV\models\TimelineModel;
use ITV\models\CommentsLikeModel;
use ITV\models\UserNotifModel;

/**
 * Task related utilities and manipulations
 * (code wiil be modevd here from customizer.php and extras.php)
 **/
define('ITV_TASK_FILTER_REWARD_EXIST_TERMS', ['from-grant', 'symbol']);
define('ITV_POST_META_FOR_PASEKA_ONLY', 'itv_for_paseka_only');

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
		
		if(!$timeline->get_first_item($task_id)) {
            $timeline->create_task_timeline($task_id);		    
		}
		
        if($is_new_task) {
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
//     error_log("call itv_ajax_submit_task_comment...");

    $task_identity = \GraphQLRelay\Relay::fromGlobalId( $_POST['task_gql_id'] );
    $task_id = !empty($task_identity['id']) ? (int)$task_identity['id'] : 0;
    
    $parent_comment_identity = !empty($_POST['parent_comment_id']) ? \GraphQLRelay\Relay::fromGlobalId( $_POST['parent_comment_id'] ) : null;
    $parent_comment_id = !empty($parent_comment_identity['id']) ? (int)$parent_comment_identity['id'] : 0;
    $user_id = get_current_user_id();
    
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
        
        //
        $task = get_post($task_id);
        UserNotifModel::instance()->push_notif($task->post_author, UserNotifModel::$TYPE_POST_COMMENT_TASKAUTHOR, ['task_id' => $task_id, 'from_user_id' => $user_id]);
        UserNotifModel::instance()->push_notif($user_id, UserNotifModel::$TYPE_POST_COMMENT_USER, ['task_id' => $task_id, 'from_user_id' => $user_id]);
        
        wp_die(json_encode(array(
            'status' => 'ok',
            'comment' => [
                'id' => \GraphQLRelay\Relay::toGlobalId( 'comment', $comment->comment_ID ),
                'content' => $comment->comment_content,
                'date' => $comment->comment_date,
                'dateGmt' => $comment->comment_date_gmt,
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
//     error_log("call itv_ajax_submit_task_comment...");

    $task_identity = \GraphQLRelay\Relay::fromGlobalId( $_POST['task_gql_id'] );
    $task_id = !empty($task_identity['id']) ? (int)$task_identity['id'] : 0;
    
    if($task_id) {
        
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
	$last_task_doer = null;
	foreach(tst_get_task_doers($task->ID, true) as $doer) {
		if( !$doer ) // If doer deleted his account
			continue;
		
		$last_task_doer = $doer;
		if($doer_id == $doer->ID) {
			$task_doer = $doer;
			break;
		}
	}
	
	if(!$task_doer) {
	    $task_doer = $last_task_doer;
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
    if($task->post_author == get_current_user_id()) {
        $close_timeline_item = $timeline->get_first_item($task->ID, TimelineModel::$TYPE_CLOSE);
        $reviews_timeline_item = $timeline->get_first_item($task->ID, TimelineModel::$TYPE_REVIEW);
        
        if($close_timeline_item && $reviews_timeline_item) {
            itv_close_task($task, get_current_user_id());
            
            $timeline->complete_current_items($task->ID);
            
            $close_timeline_item->status = TimelineModel::$STATUS_PAST;
            $close_timeline_item->message = $message;
            $close_timeline_item->save();
            
            $reviews_timeline_item->status = TimelineModel::$STATUS_CURRENT;
            $reviews_timeline_item->save();
            
            //
            UserNotifModel::instance()->push_notif($task->post_author, UserNotifModel::$TYPE_TASK_CLOSING_TASKAUTHOR, ['task_id' => $task_id]);
            UserNotifModel::instance()->push_notif($task_doer->ID, UserNotifModel::$TYPE_TASK_CLOSING_TASKDOER, ['task_id' => $task_id, 'from_user_id' => $task->post_author]);
        }
    }
    else {
        $timeline->add_current_item($task_id, TimelineModel::$TYPE_CLOSE_SUGGEST, ['doer_id' => $doer_id, 'message' => $message]);
    }

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

	if(!is_user_logged_in()) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> operation not permitted.', 'tst'),
        )));
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
	
    //
	$timeline = ITV\models\TimelineModel::instance();
    $timeline->add_current_item($task_id, TimelineModel::$TYPE_DATE_SUGGEST, ['doer_id' => $doer_id, 'message' => $message, 'due_date' => $due_date]);
    
    //
    UserNotifModel::instance()->push_notif($task->post_author, UserNotifModel::$TYPE_SUGGEST_NEW_DEADLINE_TO_TASKAUTHOR, ['task_id' => $task_id, 'from_user_id' => $task_doer->ID]);
    UserNotifModel::instance()->push_notif($task_doer->ID, UserNotifModel::$TYPE_SUGGEST_NEW_DEADLINE_TO_TASKDOER, ['task_id' => $task_id, 'from_user_id' => $task_doer->ID]);

    wp_die(json_encode(array(
        'status' => 'ok',
    )));
}
add_action('wp_ajax_suggest-close-date', 'ajax_suggest_close_date');
add_action('wp_ajax_nopriv_suggest-close-date', 'ajax_suggest_close_date');

function itv_get_ajax_task_short($task) {
    $author = get_user_by('id', $task->post_author);
    
    return [
        'id' => \GraphQLRelay\Relay::toGlobalId( 'task', $task->ID ),
        'databaseId' => $task->ID,
        'title' => get_the_title($task->ID),
        'content' => get_the_content($task->ID),
        'slug' => $task->post_name,
        'date' => $task->post_date,
        'dateGmt' => $task->post_date_gmt,
        'viewsCount' => pvc_get_post_views($task->ID),
        'doerCandidatesCount' => tst_get_task_doers_count($task->ID),
        'status' => $task->post_status,
        'pemalink' => get_permalink($task),
        'pemalinkPath' => str_replace(site_url(), "", get_permalink($task)),
        'tags' => ['nodes' => wp_get_post_terms( $task->ID, 'post_tag')],
        'ngoTaskTags' => ['nodes' => wp_get_post_terms( $task->ID, 'nko_task_tag')],
        'rewardTags' => ['nodes' => wp_get_post_terms( $task->ID, 'reward')],
        'author' => itv_get_user_in_gql_format($author),
        'isApproved' => boolval(get_post_meta($task->ID, 'itv-approved', true)),
//         'nonceContactForm' => wp_create_nonce('we-are-receiving-a-letter-goshujin-sama'),
    ];
}

function add_task_list_filter_tax($args, $tax, $term_id) {
    if(empty($args['tax_query'])) {
        $args['tax_query'] = [];
    }
    
    $tqi = null;
    foreach($args['tax_query'] as $i => $tq) {
        if($tq['taxonomy'] == $tax) {
            $tqi = $i;
            break;
        }
    }
    
    if($tqi === null) {
        $args['tax_query'][] = [
            'taxonomy' => $tax,
            'field'    => 'term_id',
            'terms'    => [$term_id],
        ];    
    }
    else {
        $args['tax_query'][$tqi]['terms'][] = $term_id;
    }
    
    return $args;
}

function add_task_list_filter_param($args, $section_id, $item_id, $value) {
    if($section_id === 'tags') {
        $args = add_task_list_filter_tax($args, 'post_tag', $item_id);
    }
    elseif($section_id === 'ngo_tags') {
        $args = add_task_list_filter_tax($args, 'nko_task_tag', $item_id);
    }
    elseif($section_id === 'status') {
        if(in_array($value, array('publish', 'in_work', 'closed'))) {
            $args['post_status'] = $value; 
        }
    }
    elseif($section_id === 'task_type') {
        if($item_id === 'reward-exist') {
            if(empty($args['tax_query'])) {
                $args['tax_query'] = [];
            }
            
            $args['tax_query'][] = [
                'taxonomy' => 'reward',
                'field'    => 'slug',
                'terms'    => ITV_TASK_FILTER_REWARD_EXIST_TERMS,
            ];
//             error_log(print_r($args, true));
        }
    }
    elseif($section_id === 'author_type') {
        if($item_id === 'for-paseka-members') {
            if(empty($args['meta_query'])) {
                $args['meta_query'] = [];
            }
            
            $args['meta_query'][] = [
                'key' => ITV_POST_META_FOR_PASEKA_ONLY,
                'value' => true,
            ];
            
        }
    }
    
    return $args;
}

function ajax_get_task_list() {
    $page = !empty($_POST['page']) ? (int)$_POST['page'] : 1;
    if($page < 1) {
        $page = 1;
    }
    
    $filter = [];    
    if(!empty($_POST['filter'])) {
        $filter_json_str = stripslashes($_POST['filter']);
        
        try {
            $filter = json_decode($filter_json_str, true);
        }
        catch (Exception $ex) {
            error_log("json_decode error: " . $filter_json_str);
        }
    }
    
    $args = array(
        'query_id' => "itv_filtered_task_list",
        'post_type' => 'tasks',
        'post_status' => 'publish',
        'author__not_in' => array(ACCOUNT_DELETED_ID),
        'paged' => $page,
    );
    
    if(!empty($filter)) {
        $tlf = new TaskListFilter();
        $filter_options = $tlf->get_task_list_filter_options();
        foreach($filter_options as $key => $section) {
            if(!empty($section['items'])) {
                foreach($section['items'] as $ik => $item) {
                    foreach($filter as $fk => $fv) {
                        if($fv && $fk === $section['id'] . "." . $item['id']) {
                            $args = add_task_list_filter_param($args, $section['id'], $item['id'], $fv);
                        }
                    }
                }
            }
            elseif(!empty($filter[$section['id']])) {
                $args = add_task_list_filter_param($args, $section['id'], null, $filter[$section['id']]);                
            }
        }
    }
    
//     error_log(print_r($args, true));
    
    $task_list = [];
    $GLOBALS['wp_query'] = new WP_Query($args);
    
    while ( $GLOBALS['wp_query']->have_posts() ) {
        $GLOBALS['wp_query']->the_post();
        $post = get_post();
        
        if($post) {
            $task_list[] = itv_get_ajax_task_short($post);
        }
    }
    
    wp_die(json_encode(array(
        'status' => 'ok',
        'taskList' => $task_list,
    )));
}
add_action('wp_ajax_get-task-list', 'ajax_get_task_list');
add_action('wp_ajax_nopriv_get-task-list', 'ajax_get_task_list');

function ajax_get_task_status_stats() {
    
    $tlf = new TaskListFilter();
    $stats = $tlf->get_task_status_stats();
    
    wp_die(json_encode(array(
        'status' => 'ok',
        'stats' => $stats,
    )));
}
add_action('wp_ajax_get-task-status-stats', 'ajax_get_task_status_stats');
add_action('wp_ajax_nopriv_get-task-status-stats', 'ajax_get_task_status_stats');


function ajax_accept_close_date() {
	if(
		empty($_POST['task-id'])
	    || empty($_POST['timeline-item-id'])
	) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> wrong data given.', 'tst'),
        )));
	}

	$task_id = (int)$_POST['task-id'];
	$timeline_item_id = (int)$_POST['timeline-item-id'];
	$task = get_post($task_id);
	$author_id = get_current_user_id();
	
	$task_doer = null;
	foreach(tst_get_task_doers($task->ID, true) as $doer) {
		$task_doer = $doer;
		break;
	}
	
	if(!is_user_logged_in()) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> operation not permitted.', 'tst'),
        )));
	}

	if(!$task_doer) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> task doer not found.', 'tst'),
        )));
	}
	

	if(!$task) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> task not found.', 'tst'),
        )));
	}

	if($task->post_author != $author_id) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> operation not permitted.', 'tst'),
        )));
	}

    $timeline = ITV\models\TimelineModel::instance();
    $suggest_timeline_item = $timeline->get_item($timeline_item_id);
    $close_timeline_item = $timeline->get_first_item($task->ID, TimelineModel::$TYPE_CLOSE);
    $reviews_timeline_item = $timeline->get_first_item($task->ID, TimelineModel::$TYPE_REVIEW);
    
    if($suggest_timeline_item && $close_timeline_item && $reviews_timeline_item) {
        $close_timeline_item->due_date = $suggest_timeline_item->due_date;
        $close_timeline_item->save();
        
        $suggest_timeline_item->decision = TimelineModel::$DECISION_ACCEPT;
        $suggest_timeline_item->save();
        
        $reviews_timeline_item->due_date = $timeline->get_next_checkpoint_date($suggest_timeline_item->due_date, TimelineModel::$TYPE_REVIEW);
        $reviews_timeline_item->save();
        
        $timeline->add_current_item($task_id, TimelineModel::$TYPE_DATE_DECISION, ['doer_id' => $task_doer->ID, 'decision' => TimelineModel::$DECISION_ACCEPT]);
        $timeline->add_current_item($task_id, TimelineModel::$TYPE_WORK, ['doer_id' => $task_doer->ID]);
    }
    
    //
    UserNotifModel::instance()->push_notif($author_id, UserNotifModel::$TYPE_DEADLINE_UPDATE_TASKAUTHOR, ['task_id' => $task->ID, 'from_user_id' => $task_doer->ID]);
    UserNotifModel::instance()->push_notif($task_doer->ID, UserNotifModel::$TYPE_DEADLINE_UPDATE_TASKDOER, ['task_id' => $task->ID, 'from_user_id' => $task_doer->ID]);
    
    wp_die(json_encode(array(
        'status' => 'ok',
    )));    
}
add_action('wp_ajax_accept-close-date', 'ajax_accept_close_date');
add_action('wp_ajax_nopriv_accept-close-date', 'ajax_accept_close_date');


function ajax_reject_close_date() {
	if(
		empty($_POST['task-id'])
	    || empty($_POST['timeline-item-id'])
	) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> wrong data given.', 'tst'),
        )));
	}

	$task_id = (int)$_POST['task-id'];
	$timeline_item_id = (int)$_POST['timeline-item-id'];
	$task = get_post($task_id);
	$author_id = get_current_user_id();
	
	$task_doer = null;
	foreach(tst_get_task_doers($task->ID, true) as $doer) {
		$task_doer = $doer;
		break;
	}

	if(!is_user_logged_in()) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> operation not permitted.', 'tst'),
        )));
	}

	if(!$task_doer) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> task doer not found.', 'tst'),
        )));
	}
	

	if(!$task) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> task not found.', 'tst'),
        )));
	}

	if($task->post_author != $author_id) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> operation not permitted.', 'tst'),
        )));
	}

    $timeline = ITV\models\TimelineModel::instance();
    $suggest_timeline_item = $timeline->get_item($timeline_item_id);
    if($suggest_timeline_item) {
        $suggest_timeline_item->decision = TimelineModel::$DECISION_REJECT;
        $suggest_timeline_item->save();
        
        $timeline->add_current_item($task_id, TimelineModel::$TYPE_DATE_DECISION, ['doer_id' => $task_doer->ID, 'decision' => TimelineModel::$DECISION_REJECT]);
        $timeline->add_current_item($task_id, TimelineModel::$TYPE_WORK, ['doer_id' => $task_doer->ID]);        
    }

    wp_die(json_encode(array(
        'status' => 'ok',
    )));    
}
add_action('wp_ajax_reject-close-date', 'ajax_reject_close_date');
add_action('wp_ajax_nopriv_reject-close-date', 'ajax_reject_close_date');


function itv_close_task($task, $user_id) {
    wp_update_post(array('ID' => $task->ID, 'post_status' => 'closed'));
    
    ItvLog::instance()->log_task_action($task->ID, ItvLog::$ACTION_TASK_CLOSE, $user_id);
    UserXPModel::instance()->register_activity_from_gui($user_id, UserXPModel::$ACTION_MY_TASK_DONE);
    
    $doers = tst_get_task_doers($task->ID, true);
    $doer = array_shift($doers);
    if($doer) {
        UserXPModel::instance()->register_activity_from_gui($doer->ID, UserXPModel::$ACTION_TASK_DONE);
    }
    
    tst_send_admin_notif_task_complete($task->ID);
    
	if($task) {
		$users = tst_get_task_doers($task->ID);
		$users[] = get_user_by('id', $task->post_author);;	
		do_action('update_member_stats', $users);
	}	
}


function ajax_accept_close() {
	if(
		empty($_POST['task-id'])
	    || empty($_POST['timeline-item-id'])
	) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> wrong data given.', 'tst'),
        )));
	}

	$task_id = (int)$_POST['task-id'];
	$timeline_item_id = (int)$_POST['timeline-item-id'];
	$task = get_post($task_id);
	$author_id = get_current_user_id();
	
	$task_doer = null;
	foreach(tst_get_task_doers($task->ID, true) as $doer) {
		$task_doer = $doer;
		break;
	}
	
	if(!is_user_logged_in()) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> operation not permitted.', 'tst'),
        )));
	}

	if(!$task_doer) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> task doer not found.', 'tst'),
        )));
	}
	

	if(!$task) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> task not found.', 'tst'),
        )));
	}

	if($task->post_author != $author_id) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> operation not permitted.', 'tst'),
        )));
	}

    $timeline = ITV\models\TimelineModel::instance();
    $suggest_timeline_item = $timeline->get_item($timeline_item_id);
    $close_timeline_item = $timeline->get_first_item($task->ID, TimelineModel::$TYPE_CLOSE);
    $reviews_timeline_item = $timeline->get_first_item($task->ID, TimelineModel::$TYPE_REVIEW);
    
    if($suggest_timeline_item && $close_timeline_item && $reviews_timeline_item) {
        $timeline->add_current_item($task_id, TimelineModel::$TYPE_CLOSE_DECISION, ['doer_id' => $task_doer->ID, 'decision' => TimelineModel::$DECISION_ACCEPT]);
        itv_close_task($task, get_current_user_id());
        
        $timeline->complete_current_items($task->ID);
        
        $close_timeline_item->status = TimelineModel::$STATUS_PAST;
        $close_timeline_item->save();
        
        $suggest_timeline_item->decision = TimelineModel::$DECISION_ACCEPT;
        $suggest_timeline_item->save();
        
        $reviews_timeline_item->status = TimelineModel::$STATUS_CURRENT;
        $reviews_timeline_item->save();
        
        //
        UserNotifModel::instance()->push_notif($task->post_author, UserNotifModel::$TYPE_TASK_CLOSING_TASKAUTHOR, ['task_id' => $task_id, 'from_user_id' => $task_doer->ID]);
        UserNotifModel::instance()->push_notif($task_doer->ID, UserNotifModel::$TYPE_TASK_CLOSING_TASKDOER, ['task_id' => $task_id, 'from_user_id' => $task_doer->ID]);
    }

    wp_die(json_encode(array(
        'status' => 'ok',
    )));    
}
add_action('wp_ajax_accept-close', 'ajax_accept_close');
add_action('wp_ajax_nopriv_accept-close', 'ajax_accept_close');


function ajax_reject_close() {
	if(
		empty($_POST['task-id'])
	    || empty($_POST['timeline-item-id'])
	) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> wrong data given.', 'tst'),
        )));
	}

	$task_id = (int)$_POST['task-id'];
	$timeline_item_id = (int)$_POST['timeline-item-id'];
	$task = get_post($task_id);
	$author_id = get_current_user_id();
	
	$task_doer = null;
	foreach(tst_get_task_doers($task->ID, true) as $doer) {
		$task_doer = $doer;
		break;
	}

	if(!is_user_logged_in()) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> operation not permitted.', 'tst'),
        )));
	}

	if(!$task_doer) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> task doer not found.', 'tst'),
        )));
	}
	

	if(!$task) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> task not found.', 'tst'),
        )));
	}

	if($task->post_author != $author_id) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> operation not permitted.', 'tst'),
        )));
	}

    $timeline = ITV\models\TimelineModel::instance();
    $suggest_timeline_item = $timeline->get_item($timeline_item_id);
    if($suggest_timeline_item) {
        $suggest_timeline_item->decision = TimelineModel::$DECISION_REJECT;
        $suggest_timeline_item->save();
        
        $timeline->add_current_item($task_id, TimelineModel::$TYPE_CLOSE_DECISION, ['doer_id' => $task_doer->ID, 'decision' => TimelineModel::$DECISION_REJECT]);
    }

    wp_die(json_encode(array(
        'status' => 'ok',
    )));    
}
add_action('wp_ajax_reject-close', 'ajax_reject_close');
add_action('wp_ajax_nopriv_reject-close', 'ajax_reject_close');


function ajax_like_comment() {
	if(
	    empty($_POST['comment_gql_id'])
	) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> wrong data given.', 'tst'),
        )));
	}

    $comment_identity = \GraphQLRelay\Relay::fromGlobalId( $_POST['comment_gql_id'] );
    $comment_id = !empty($comment_identity['id']) ? (int)$comment_identity['id'] : 0;
    $user_id = get_current_user_id();

	if(!$comment_id) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> wrong data given.', 'tst'),
        )));
	}
    
	if(!is_user_logged_in()) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> operation not permitted.', 'tst'),
        )));
	}
	
    $likesCount = get_comment_meta($comment_id, 'itv_likes_count', true);
    if(!$likesCount) {
        $likesCount = 0;
    }
    
	$comments_like = ITV\models\CommentsLikeModel::instance();
	if(!$comments_like->is_user_comment_like($user_id, $comment_id)) {
	    $likesCount += 1;
        $comments_like->add_user_comment_like($user_id, $comment_id);
	    update_comment_meta($comment_id, 'itv_likes_count', $likesCount);
	}

    wp_die(json_encode(array(
        'status' => 'ok',
        'likesCount' => $likesCount,
    )));    
}
add_action('wp_ajax_like-comment', 'ajax_like_comment');
add_action('wp_ajax_nopriv_like-comment', 'ajax_like_comment');


function ajax_get_task_list_filter() {
    
    $filter_data = get_transient( DataCache::$DATA_TASK_LIST_FILTER );
    if($filter_data === false) {
        $tlf = new TaskListFilter();
        $filter_data = $tlf->create_filter_with_stats();
        set_transient( DataCache::$DATA_TASK_LIST_FILTER, $filter_data, HOUR_IN_SECONDS );
    }
    
    wp_die(json_encode(array(
        'status' => 'ok',
        'sections' => $filter_data,
    )));    
}
add_action('wp_ajax_get-task-list-filter', 'ajax_get_task_list_filter');
add_action('wp_ajax_nopriv_get-task-list-filter', 'ajax_get_task_list_filter');


function ajax_subscribe_task_list() {
	if(
	    empty($_POST['filter'])
	) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> wrong data given.', 'tst'),
        )));
	}

	$user_id = get_current_user_id();
	
	$filter = [];
    if(!empty($_POST['filter'])) {
        $filter_json_str = stripslashes($_POST['filter']);
        
        try {
            $filter = json_decode($filter_json_str, true);
        }
        catch (Exception $ex) {
            error_log("json_decode error: " . $filter_json_str);
        }
    }
    
	if(!is_user_logged_in()) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> operation not permitted.', 'tst'),
        )));
	}
	
	update_user_meta( $user_id, 'itv_subscribe_task_list', $filter );

    wp_die(json_encode(array(
        'status' => 'ok',
    )));        
}
add_action('wp_ajax_subscribe-task-list', 'ajax_subscribe_task_list');
add_action('wp_ajax_nopriv_subscribe-task-list', 'ajax_subscribe_task_list');


function ajax_unsubscribe_task_list() {
	$user_id = get_current_user_id();
	
	if(!is_user_logged_in()) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> operation not permitted.', 'tst'),
        )));
	}
	
	delete_user_meta( $user_id, 'itv_subscribe_task_list' );

    wp_die(json_encode(array(
        'status' => 'ok',
    )));        
}
add_action('wp_ajax_unsubscribe-task-list', 'ajax_unsubscribe_task_list');
add_action('wp_ajax_nopriv_unsubscribe-task-list', 'ajax_unsubscribe_task_list');


function ajax_get_task_list_subscription() {
	$user_id = get_current_user_id();
	
	if(!is_user_logged_in()) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> operation not permitted.', 'tst'),
        )));
	}
	
	$filter = get_user_meta( $user_id, 'itv_subscribe_task_list', true );

    wp_die(json_encode(array(
        'status' => 'ok',
        'filter' => !$filter ? null : $filter,
    )));        
}
add_action('wp_ajax_get-task-list-subscription', 'ajax_get_task_list_subscription');
add_action('wp_ajax_nopriv_get-task-list-subscription', 'ajax_get_task_list_subscription');


function ajax_approve_task() {
	if(
		empty($_POST['task_gql_id'])
	) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> wrong data given.', 'tst'),
        )));
	}

    $task_identity = \GraphQLRelay\Relay::fromGlobalId( $_POST['task_gql_id'] );
    $task_id = !empty($task_identity['id']) ? (int)$task_identity['id'] : 0;
    $task = get_post($task_id);
	
	if(!is_user_logged_in() || !current_user_can('manage_options')) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> operation not permitted.', 'tst'),
        )));
	}

	if(!$task) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> task not found.', 'tst'),
        )));
	}
	
// 	wp_update_post([
// 	    'ID' => $task_id,
// 	    'post_status' => 'publish',
// 	]);
	update_post_meta($task_id, 'itv-approved', true);

    wp_die(json_encode(array(
        'status' => 'ok',
    )));    
}
add_action('wp_ajax_approve-task', 'ajax_approve_task');


function ajax_decline_task() {
	if(
		empty($_POST['task_gql_id'])
	) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> wrong data given.', 'tst'),
        )));
	}

    $task_identity = \GraphQLRelay\Relay::fromGlobalId( $_POST['task_gql_id'] );
    $task_id = !empty($task_identity['id']) ? (int)$task_identity['id'] : 0;
    $task = get_post($task_id);
	
	if(!is_user_logged_in() || !current_user_can('manage_options')) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> operation not permitted.', 'tst'),
        )));
	}

	if(!$task) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> task not found.', 'tst'),
        )));
	}
	
	delete_post_meta($task_id, 'itv-approved');
	wp_update_post([
	    'ID' => $task_id,
	    'post_status' => 'draft',
	]);
	
	$task_author = get_user_by('id', $task->post_author);
    ItvAtvetka::instance()->mail('your_task_declined', [
        'user_id' => $task_author->ID,
        'username' => $task_author->first_name,        
        'task_title' => $task->post_title,
        'task_url' => get_permalink($task->ID),
    ]);
	
    wp_die(json_encode(array(
        'status' => 'ok',
    )));    
}
add_action('wp_ajax_decline-task', 'ajax_decline_task');


function ajax_get_general_stats() {
    $basic_stats = [
        'activeMemebersCount' => tst_get_active_members_count(),
        'closedTasksCount' => tst_get_closed_tasks_count(),
        'workTasksCount' => tst_get_work_tasks_count(),
        'newTasksCount' => tst_get_new_tasks_count(),
    ];
    
    wp_die(json_encode(array(
        'status' => 'ok',
        'stats' => $basic_stats,
    )));    
}
add_action('wp_ajax_get_general_stats', 'ajax_get_general_stats');
add_action('wp_ajax_nopriv_get_general_stats', 'ajax_get_general_stats');