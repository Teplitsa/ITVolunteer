<?php

use ITV\models\UserNotifModel;
use ITV\models\MemberNotifManager;

function ajax_get_user_notif_short_list() {
	if(!is_user_logged_in()) {
        wp_die(json_encode(array(
            'status' => 'fail',
            'message' => __('<strong>Error:</strong> operation not permitted.', 'tst'),
        )));
	}
	
	$user_id = get_current_user_id(); 
	$newer_than_id = !empty($_GET['newer_than_id']) ? intval($_GET['newer_than_id']) : null;
	$notif_list = UserNotifModel::instance()->get_list($user_id, false, $newer_than_id);
    
    $member_notif_manager = new MemberNotifManager();
    $notif_list = $member_notif_manager->extend_list_with_connected_data($notif_list);
	
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