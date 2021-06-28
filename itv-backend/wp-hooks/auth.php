<?php

function itv_logout( $user_id ) {
    $auth = new \ITV\models\Auth();
    $auth->logout( $user_id );
}
add_action( 'wp_logout', 'itv_logout' );

function itv_logout_without_confirmation($action, $result) {
    // allow logout without confirmation
    if ($action == "log-out" && !isset($_GET['itv-logout'])) {
        $redirect_to = isset($_REQUEST['redirect_to']) ? $_REQUEST['redirect_to'] : '/login';
        $location = str_replace('&amp;', '&', wp_logout_url($redirect_to) . '&itv-logout=1');
        wp_redirect($location);
        exit;
    }
}
add_action('check_admin_referer', 'itv_logout_without_confirmation', 10, 2);

function itv_setup_ajax_auth_user($param) {
    if(!(defined('DOING_AJAX') && DOING_AJAX)) {
        return;
    }

    global $current_user;

    if ( is_object( $current_user ) && isset( $current_user->ID ) && $current_user->ID) {
        return;
    }

    $current_user = null;
}
add_filter('admin_init', 'itv_setup_ajax_auth_user');
