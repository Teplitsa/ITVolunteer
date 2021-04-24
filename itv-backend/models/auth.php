<?php

namespace ITV\models;
use function \ITV\utils\{base64url_encode, base64url_decode};

class Auth {

    public function login( $login, $password, $remember=false ) {
        // error_log("login...");

        $user = wp_authenticate( $login, $password );

        if ( is_wp_error( $user ) ) {
            return $user;
        }

        $token = $this->generate_token( $user );
        $user_data = itv_get_user_in_gql_format($user);
        $user_data = itv_append_user_private_data($user_data, $user);        

        setcookie('itv-token', $token, $remember ? time() + ( DAY_IN_SECONDS * \ITV\Config::AUTH_EXPIRE_DAYS ) : 0, '/');

        return [
            'token' => $token,
            'user' => $user_data,
        ];
    }

    public function logout( $user_id ) {
        setcookie('itv-token', "", time() - 3600, '/');
    }

	public function generate_token( $user ) {

		$secret = \ITV\Plugin\Auth::AUTH_SECRET_KEY;
		$expire = time() + ( DAY_IN_SECONDS * \ITV\Config::AUTH_EXPIRE_DAYS );

		$payload = json_encode([
			'iss' => get_bloginfo( 'url' ),
			'exp' => $expire,
			'data' => [
				'user' => [
					'id' => $user->ID,
                ],
            ],
        ]);

        $header = json_encode([
            'typ' => 'JWT',
            'alg' => 'HS256'
        ]);
        $base64_header = \ITV\Plugin\utils\base64url_encode($header);
        
        $base64_payload = \ITV\Plugin\utils\base64url_encode($payload);
        $signature = hash_hmac('sha256', $base64_header . "." . $base64_payload, $secret, true);
        $base64_signature = \ITV\Plugin\utils\base64url_encode($signature);

        $token = $base64_header . "." . $base64_payload . "." . $base64_signature;

        return $token;
 	}

    public function validate_token( $token ) {

		list($is_valid, $payload_data) = \ITV\Plugin\Auth::parse_token($token);
        // error_log("token: is_valid" . print_r($is_valid, true));
        // error_log("token: payload_data" . print_r($payload_data, true));

        if(!$is_valid) {
            throw new InvalidAuthTokenException();
        }

        $user = get_user_by('ID', $payload_data->user->id);

        if( !$user ) {
            throw new UserNotFoundException();
        }
        
        $user_data = itv_get_user_in_gql_format($user);
        $user_data = itv_append_user_private_data($user_data, $user);        
        
        return [
            'is_valid' => $is_valid, 
            'user' => $user_data,
            'token' => $token,
        ];
    }
}

class InvalidAuthTokenException extends \Exception {}
class UserNotFoundException extends \Exception {}