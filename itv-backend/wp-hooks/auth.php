<?php

function itv_determine_current_user( $user_id ) {
    if(strpos($_SERVER['REQUEST_URI'], "wp-cron.php") !== false) {
        return $user_id;
    }

    // error_log("itv_determine_current_user...");
    // ob_start();
    // // debug_print_backtrace();
    // var_dump($user_id);
    // $trace = ob_get_clean();
    // // error_log($trace);
    // error_log("input user_id=" . $trace);
    // error_log("REQUEST_URI:" . $_SERVER['REQUEST_URI'] . "                      REQ_ID:" . @$_GET['rid']);
    // error_log("HTTP_AUTHORIZATION:" . @$_SERVER['HTTP_AUTHORIZATION']);
    // error_log("REDIRECT_HTTP_AUTHORIZATION:" . $_SERVER['REDIRECT_HTTP_AUTHORIZATION']);
    // error_log("REDIRECT_HTTP_AUTHORIZATION:" . $_SERVER['REDIRECT_HTTP_AUTHORIZATION']);

    if((strpos($_SERVER['REQUEST_URI'], "/itv/v1/auth/") !== false) || (defined('WP_CLI') && boolval(WP_CLI))) {
        return $user_id;
    }

    if($user_id !== false) {
        return $user_id;
    }

    $valid_token = null;
    try {
        $auth = new \ITV\models\Auth();
        $token = $auth->parse_token_from_request();
        if($token) {
            list($is_valid, $payload_data) = $auth->parse_token($token);
            if($is_valid) {
                $user_id = $payload_data->user->id;
            }
        }
    }
    catch(Exception $ex) {}

    // error_log("result user_id=" . $user_id);
    return $user_id;
}
error_log("REQUEST_URI:" . @$_SERVER['REQUEST_URI']);
error_log('ADD HOOK: determine_current_user');
add_filter( 'determine_current_user', 'itv_determine_current_user' );

function itv_logout( $user_id ) {
    $auth = new \ITV\models\Auth();
    $auth->logout( $user_id );
}
add_action( 'wp_logout', 'itv_logout' );

function itv_logout_without_confirmation($action, $result) {
    // allow logout without confirmation
    if ($action == "log-out" && !isset($_GET['_wpnonce'])) {
        $redirect_to = isset($_REQUEST['redirect_to']) ? $_REQUEST['redirect_to'] : '/login';
        $location = str_replace('&amp;', '&', wp_logout_url($redirect_to));
        wp_redirect($location);
        exit;
    }
}
add_action('check_admin_referer', 'itv_logout_without_confirmation', 10, 2);
