<?php

namespace ITV\REST;

function auth_api_add_routes($server) {

    register_rest_route( 'itv/v1', '/auth/login', [
        'methods' => \WP_REST_Server::EDITABLE,
        'callback' => function($request) {
            $login = $request->get_param('login');
            $password = $request->get_param('pass');
            $remember = $request->get_param('remember');

            if(!$login || !$password) {
                return new \WP_Error(
                    'invalid_params',
                    __( 'Invalid params', 'itv-backend' ),
                    array( 'status' => 400 )
                );
            }

            $auth = new \ITV\models\Auth();
            $auth_result = $auth->login($login, $password, $remember);

            if ( is_wp_error( $auth_result ) ) {
                $error_code = $auth_result->get_error_code();
    
                return new \WP_REST_Response(
                    array(
                        'code'       => $error_code,
                        'message'    => strip_tags( $auth_result->get_error_message( $error_code ) ),
                    ),
                    403
                );
            }
            
            return $auth_result;
        },
    ] );

    register_rest_route( 'itv/v1', '/auth/validate-token', [
        'methods' => \WP_REST_Server::EDITABLE,
        'callback' => function($request) {
            $token = $request->get_param('token');
            
            $auth = new \ITV\models\Auth();

            try {
                $token = $auth->parse_token_from_request();
            }
            catch(\ITV\models\NoAuthHeaderException $ex) {
                return new \WP_REST_Response(
                    array(
                        'code' => 'no_auth_header',
                        'message' => __( 'No auth header', 'itv-backend' ),
                    ),
                    400
                );
            }

            if ( !$token ) {
                return new \WP_REST_Response(
                    array(
                        'code' => 'bad_auth_header',
                        'message' => __( 'Bad auth header', 'itv-backend' ),
                    ),
                    400
                );
            }
    
            try {
                return $auth->validate_token($token);
            }
            catch(\ITV\models\InvalidAuthTokenException $ex) {
                return new \WP_REST_Response(
                    array(
                        'code' => 'invalid_auth_token',
                        'message' => __( 'Invalid auth token', 'itv-backend' ),
                    ),
                    403
                );
            }
            catch(\ITV\models\UserNotFoundException $ex) {
                return new \WP_REST_Response(
                    array(
                        'code' => 'user_not_found',
                        'message' => __( 'User not found', 'itv-backend' ),
                    ),
                    403
                );
            }
        },
    ] );

}
add_action( 'rest_api_init', 'ITV\REST\auth_api_add_routes' );