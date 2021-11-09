<?php

namespace ITV\Plugin;

class Auth {
    const AUTH_SECRET_KEY = '';
    
    public static function parse_token_from_request() {
        $headerkey = 'HTTP_AUTHORIZATION';
        $auth_header = isset( $_SERVER[ $headerkey ] ) ? $_SERVER[ $headerkey ] : false;

        if( !$auth_header ) {
            $auth_header = isset( $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ) ? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] : false;
        }

        if( !$auth_header ) {
            throw new \ITV\Plugin\NoAuthHeaderException();
        }

        list($token) = sscanf( $auth_header, 'Bearer %s' );

        if(!isset($token) || $token === 'undefined') {
            // error_log("token not set in header");
            $token = "";
        }

        return $token;
    }

    public static function parse_token($token) {

        $parts = explode('.', $token);

        if(empty($parts) || count($parts) !== 3) {
            return [false, null];
        }

        $base64_header = $parts[0];
        $base64_payload = $parts[1];

        $payload = json_decode(\ITV\Plugin\utils\base64url_decode($base64_payload));

        $is_expired = $payload->exp - time() < 0;

        $secret = self::AUTH_SECRET_KEY;
        $signature_check = hash_hmac('sha256', $base64_header . "." . $base64_payload, $secret, true);
        $base64_signature_check = \ITV\Plugin\utils\base64url_encode($signature_check);

        $token_check = $base64_header . "." . $base64_payload . "." . $base64_signature_check;
        $is_signature_valid = $token === $token_check;

        return [!$is_expired && $is_signature_valid, $payload->data];
    }

    public static function determine_current_user( $user_id ) {
        // error_log("tps_determine_current_user...");
        // error_log("input user_id=" . $user_id);
        // error_log("is_admin:" . is_admin());
        // error_log("wp_doing_ajax:" . wp_doing_ajax());        
    
        if((strpos($_SERVER['REQUEST_URI'], "/tps/v1/auth/") !== false)
            || strpos($_SERVER['REQUEST_URI'], "wp-cron.php") !== false 
            || (defined('WP_CLI') && boolval(WP_CLI)) 
            || (
                (is_admin()
                    || (strpos($_SERVER['REQUEST_URI'], "/simsim") !== false)
                    || (strpos($_SERVER['REQUEST_URI'], "/wp-admin") !== false)
                ) && !wp_doing_ajax()
            )
        ) {
            // error_log("return original user_id...");
            return $user_id;
        }
	
        if($user_id !== false) {
            return $user_id;
        }	

        $valid_token = null;
        try {
            $token = self::parse_token_from_request();
            if($token) {
                list($is_valid, $payload_data) = self::parse_token($token);
                if($is_valid) {
                    $user_id = $payload_data->user->id;
                }
            }
        }
        catch(\Exception $ex) {}

        // error_log("result user_id=" . $user_id);
        return $user_id;
    }
    
    public static function rest_cookie_collect_status($cookie_elements) {
        global $wp_rest_auth_cookie;
        $wp_rest_auth_cookie = false;
    }

}
add_filter( 'determine_current_user', '\ITV\Plugin\Auth::determine_current_user' );
add_filter( 'auth_cookie_valid', '\ITV\Plugin\Auth::rest_cookie_collect_status', 100 );

class NoAuthHeaderException extends \Exception {}