<?php

namespace ITV\models;
use function \ITV\utils\{base64url_encode, base64url_decode};

class Auth {

    public function login( $login, $password, $remember=false ) {
        error_log("login...");

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

		$secret = \ITV\Config::AUTH_SECRET_KEY;
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
        $base64_header = base64url_encode($header);
        
        $base64_payload = base64url_encode($payload);
        $signature = hash_hmac('sha256', $base64_header . "." . $base64_payload, $secret, true);
        $base64_signature = base64url_encode($signature);

        $token = $base64_header . "." . $base64_payload . "." . $base64_signature;

        return $token;
 	}

    public function parse_token_from_request() {
        $headerkey = 'HTTP_AUTHORIZATION';
        $auth = isset( $_SERVER[ $headerkey ] ) ? $_SERVER[ $headerkey ] : false;

        if( !$auth ) {
            $auth = isset( $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ) ? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] : false;
        }

        if( !$auth ) {
            throw new NoAuthHeaderException();
        }

        list($token) = sscanf( $auth, 'Bearer %s' );

        return $token;
    }

    public function validate_token( $token ) {

		list($is_valid, $payload_data) = $this->parse_token($token);

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
        ];
    }

    public function parse_token($token) {

        $parts = explode('.', $token);
        $base64_header = $parts[0];
        $base64_payload = $parts[1];

        $payload = json_decode(base64url_decode($base64_payload));

        $is_expired = $payload->exp - time() < 0;

        $secret = \ITV\Config::AUTH_SECRET_KEY;
        $signature_check = hash_hmac('sha256', $base64_header . "." . $base64_payload, $secret, true);
        $base64_signature_check = base64url_encode($signature_check);

        $token_check = $base64_header . "." . $base64_payload . "." . $base64_signature_check;
        $is_signature_valid = $token === $token_check;

        return [!$is_expired && $is_signature_valid, $payload->data];
    }
    
}

class NoAuthHeaderException extends \Exception {}
class InvalidAuthTokenException extends \Exception {}
class UserNotFoundException extends \Exception {}