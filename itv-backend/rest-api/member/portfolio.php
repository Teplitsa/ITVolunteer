<?php

use \ITV\models\PortfolioWorkManager;

function portfolio_api_init($server) {

    register_rest_route( 'wp/v2', '/portfolio_work/slug:(?P<slug>[- _0-9a-zA-Z]+)', [
        'methods' => WP_REST_Server::ALLMETHODS,
        'callback' => function($request) {
            $slug = $request->get_param('slug');

            $args = array(
                'name'         => $slug,
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
add_action( 'rest_api_init', 'portfolio_api_init' );
