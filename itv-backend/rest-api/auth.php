<?php

function itv_determine_current_user($user_id) {

    $rest_api_slug = rest_get_url_prefix();
    $valid_api_uri = strpos($_SERVER['REQUEST_URI'], $rest_api_slug);

    if (!$valid_api_uri) {

        return $user_id;
    }

    $auth_token = $_POST['auth_token'] ?? $_GET['auth_token'] ?? '';

    if(!$auth_token && in_array( $_SERVER['REQUEST_METHOD'], ['POST', 'PUT', 'DELETE'] ) )  {

        $input_json = file_get_contents('php://input');

        if($input_json) {

            $input = json_decode($input_json, true);
        }

        $auth_token = $input['auth_token'] ?? '';
    }

    if($auth_token) {

        $token = WPGraphQL\JWT_Authentication\Auth::validate_token($auth_token);

        if (!is_wp_error($token)) {

            $user_id = $token->data->user->id;
        }
    }

    if($user_id) {
        global $wp_rest_auth_cookie;
        $wp_rest_auth_cookie = 0;
    }

    return $user_id;
}
add_filter( 'determine_current_user', 'itv_determine_current_user' );