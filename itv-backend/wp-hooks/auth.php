<?php

function itv_determine_current_user( $user_id ) {
    error_log("itv_determine_current_user...");
    error_log("input user_id=" . $user_id);

    if((strpos($_SERVER['REQUEST_URI'], "/itv/v1/auth/") !== false) || (defined('WP_CLI') && boolval(WP_CLI))) {
        return $user_id;
    }

    $valid_token = null;
    try {
        $auth = new \ITV\models\Auth();
        $token = $auth->parse_token_from_request();
        $valid_token = $auth->validate_token($token);
    }
    catch(Exception $ex) {}

    if($valid_token && $valid_token['is_valid']) {
        $user_id = $valid_token['user']['databaseId'];
    }

    error_log("result user_id=" . $user_id);
    return $user_id;
}
add_filter( 'determine_current_user', 'itv_determine_current_user' );

function itv_logout( $user_id ) {
    $auth = new \ITV\models\Auth();
    $auth->logout( $user_id );
}
add_action( 'wp_logout', 'itv_logout' );