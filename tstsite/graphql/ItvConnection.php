<?php
namespace ITV\GraphQL\Connection;

use WPGraphQL\Connection;

class ItvComments extends \WPGraphQL\Connection\Comments {
    
    public static function register_connections() {
        
        register_graphql_connection( self::get_connection_config() );
        register_graphql_connection( self::get_connection_config( [ 'fromType' => 'User' ] ) );
        register_graphql_connection(
            self::get_connection_config(
                [
                    'fromType'      => 'ItvComment',
                    'fromFieldName' => 'children',
                ]
                )
            );
        
        /**
         * Register Connections from all existing PostObject Types to Comments
         */
        $allowed_post_types = \WPGraphQL::get_allowed_post_types();
        if ( ! empty( $allowed_post_types ) && is_array( $allowed_post_types ) ) {
            foreach ( $allowed_post_types as $post_type ) {
                $post_type_object = get_post_type_object( $post_type );
                if ( post_type_supports( $post_type_object->name, 'comments' ) ) {
                    register_graphql_connection(
                        self::get_connection_config(
                            [
                                'fromType'      => $post_type_object->graphql_single_name,
                                'toType'        => 'ItvComment',
                                'fromFieldName' => 'itvComments',
                            ]
                            )
                        );
                }
            }
        }
    }
    
    public static function get_connection_config( $args = [] ) {
        $defaults = [
            'fromType'       => 'RootQuery',
            'toType'         => 'ItvComment',
            'fromFieldName'  => 'itvComments',
            'connectionArgs' => self::get_connection_args(),
            'resolveNode'    => function( $id, $args, $context, $info ) {
                return \ITV\GraphQL\Data\ItvDataSource\ItvDataSource::resolve_comment( $id, $context );
            },
            'resolve'        => function( $root, $args, $context, $info ) {
                return \ITV\GraphQL\Data\ItvDataSource\ItvDataSource::resolve_comments_connection( $root, $args, $context, $info );
            },
            ];
        
        return array_merge( $defaults, $args );
    }
    
}
