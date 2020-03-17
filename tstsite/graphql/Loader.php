<?php
namespace ITV\GraphQL\Data\Loader;

use GraphQL\Deferred;
use WPGraphQL\Model\User;

class ItvCommentLoader extends \WPGraphQL\Data\Loader\AbstractDataLoader {

	public function loadKeys( array $keys ) {

		if ( empty( $keys ) ) {
			return $keys;
		}

		$loaded = [];

		$args = [
			'comment__in'   => $keys,
			'orderby'       => 'comment__in',
			'number'        => count( $keys ),
			'no_found_rows' => true,
			'count'         => false,
		];

		$query = new \WP_Comment_Query( $args );
		$query->get_comments();

		foreach ( $keys as $key ) {

			$comment_object = \WP_Comment::get_instance( $key );

			$loaded[ $key ] = new Deferred(
				function() use ( $comment_object ) {

					if ( ! $comment_object instanceof \WP_Comment ) {
						  return null;
					}

					return new \ITV\GraphQL\Model\ItvComment( $comment_object );
				}
			);
		}

		return ! empty( $loaded ) ? $loaded : [];

	}

}

class ItvUserLoader extends \WPGraphQL\Data\Loader\AbstractDataLoader {
    
    public function loadKeys( array $keys ) {
        
        if ( empty( $keys ) ) {
            return $keys;
        }
        
        $args = [
            'include'     => $keys,
            'number'      => count( $keys ),
            'orderby'     => 'include',
            'count_total' => false,
            'fields'      => 'all_with_meta',
        ];
        
        $query = new \WP_User_Query( $args );
        $query->get_results();
        
        foreach ( $keys as $key ) {
            $user = get_user_by( 'id', $key );
            if ( $user instanceof \WP_User ) {
                $loaded_users[ $user->ID ] = new \ITV\GraphQL\Model\ItvUser( $user );
            } elseif ( ! isset( $all_users[0] ) ) {
                $loaded_users[0] = null;
            }
        }
        return ! empty( $loaded_users ) ? $loaded_users : [];
        
    }
    
}
