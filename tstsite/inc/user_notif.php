<?php

use ITV\models\UserNotifModel;

function ajax_get_user_notif_short_list() {
	if(!is_user_logged_in()) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> operation not permitted.', 'tst'),
        )));
	}
	
	$user_id = get_current_user_id(); 
	$notif_list = UserNotifModel::instance()->get_list($user_id, false);
	
	foreach($notif_list as $k => $item) {
	    $from_user = null;
	    
	    if($item->from_user_id !== null) {
	        $from_user = get_user_by('id', $item->from_user_id);
	        $item->from_user = itv_get_user_in_gql_format($from_user);
	    }
	    
	    if($item->task_id !== null) {
	        $task = get_post($item->task_id);
	        $item->task = itv_get_ajax_task_short($task);
	    }
	    
	    $dt = new DateTime($item->created_at);
	    $utcTimezone = new DateTimeZone('UTC');
	    $dt->setTimezone($utcTimezone);
	    $item->dateGmt = $dt->format("Y-m-d H:i:s");
	}
	
    wp_die(json_encode(array(
        'status' => 'ok',
        'notifList' => $notif_list,
    )));
}
add_action('wp_ajax_get_user_notif_short_list', 'ajax_get_user_notif_short_list');
add_action('wp_ajax_nopriv_get_user_notif_short_list', 'ajax_get_user_notif_short_list');


function ajax_set_user_notif_read() {
	if(!is_user_logged_in()) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> operation not permitted.', 'tst'),
        )));
	}
	
	$user_id = get_current_user_id(); 
	$notif_id_list = !empty($_POST['notifIdList']) ? $_POST['notifIdList'] : [];
	
	if(!empty($notif_id_list)) {
	    UserNotifModel::instance()->mark_read($user_id, $notif_id_list);
	}
	
    wp_die(json_encode(array(
        'status' => 'ok',
    )));
}
add_action('wp_ajax_set_user_notif_read', 'ajax_set_user_notif_read');
add_action('wp_ajax_nopriv_set_user_notif_read', 'ajax_set_user_notif_read');