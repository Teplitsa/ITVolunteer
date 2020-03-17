<?php
namespace ITV\GraphQL\Data\ItvDataSource;

use GraphQL\Deferred;

class ItvDataSource extends \WPGraphQL\Data\DataSource {
    
    public static function resolve_comment( $id, $context ) {
        
        if ( empty( $id ) || ! absint( $id ) ) {
            return null;
        }
        
        $comment_id = absint( $id );
        $context->getLoader( 'itvComment' )->buffer( [ $comment_id ] );
        
        return new Deferred(
            function() use ( $comment_id, $context ) {
                return $context->getLoader( 'itvComment' )->load( $comment_id );
            }
        );
    }
    
    public static function resolve_user( $id, $context ) {
        
        if ( empty( $id ) ) {
            return null;
        }
        $user_id = absint( $id );
        
        $context->getLoader( 'itvUser' )->buffer( [ $user_id ] );
        
        return new Deferred(
            function() use ( $user_id, $context ) {
                return $context->getLoader( 'itvUser' )->load( $user_id );
            }
        );
    }
    
}
