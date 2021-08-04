<?php

use \ITV\models\PortfolioWorkManager;

function portfolio_api_add_routes($server) {

    register_rest_route( 'wp/v2', '/portfolio_work/slug:(?P<slug>[- _0-9a-zA-Z]+)', [
        'methods' => WP_REST_Server::ALLMETHODS,
        'callback' => function($request) {
            $slug = $request->get_param('slug');

            $args = array(
                'name'              => $slug,
                'post_type'         => PortfolioWorkManager::$post_type,
                'suppress_filters'  => true,
                'post_status'       => 'any',
                'posts_per_page'    => 1,
                'fields'            => 'ids',
            );
            $posts = get_posts($args);
            $post_id = $posts[0] ?? 0;

            $request->set_param('id', $post_id);
            $request->set_route('/wp/v2/portfolio_work/' . $post_id);

            return rest_do_request( $request );
        },
    ] );
}
add_action( 'rest_api_init', 'portfolio_api_add_routes' );


function portfolio_api_register_fields($server) {
    $pw_manager = new PortfolioWorkManager();

    register_rest_field( PortfolioWorkManager::$post_type, PortfolioWorkManager::$FIELD_NEXT_WORK_SLUG, [ 
        'get_callback' => [ $pw_manager, 'get_property' ], 
        'context' => [ 'view' ] 
    ] );

    register_rest_field( PortfolioWorkManager::$post_type, PortfolioWorkManager::$FIELD_PREV_WORK_SLUG, [ 
        'get_callback' => [ $pw_manager, 'get_property' ], 
        'context' => [ 'view' ] 
    ] );

}
add_action( 'rest_api_init', 'portfolio_api_register_fields', 11 );


function portfolio_api_fix_seo_integration($server) {

    global $wp_rest_additional_fields;

    // remove yoast fields
    $wp_rest_additional_fields[ PortfolioWorkManager::$post_type ][ 'yoast_head' ]['context'] = [ 'view', 'edit', 'embed' ];
}
add_action( 'rest_api_init', 'portfolio_api_fix_seo_integration', 11 );


function portfolio_api_change_item_scheme($scheme) {

    $scheme['properties']['slug']['context'][] = PortfolioWorkManager::$rest_context_portfolio_edit;
    $scheme['properties']['id']['context'][] = PortfolioWorkManager::$rest_context_portfolio_edit;

    return $scheme;
}
add_filter( 'rest_' . PortfolioWorkManager::$post_type . '_item_schema', 'portfolio_api_change_item_scheme', 11 );


function portfolio_api_prepare_response($response, $post, $request) {

    if( $request['context'] !== PortfolioWorkManager::$rest_context_portfolio_edit ) {
        return $response;
    }

    foreach ($response->get_links() as $rel => $link) {
        $response->remove_link($rel);
    }

    return $response;
}
add_filter( 'rest_prepare_' . PortfolioWorkManager::$post_type, 'portfolio_api_prepare_response', 10, 3 );


function portfolio_api_after_insert($post, $request, $is_creating) {
    if($request->get_param( 'context' ) === 'edit') {
        $request->set_param( 'context', PortfolioWorkManager::$rest_context_portfolio_edit );
    }
}
add_action( 'rest_after_insert_' . PortfolioWorkManager::$post_type, 'portfolio_api_after_insert', 10, 3 );