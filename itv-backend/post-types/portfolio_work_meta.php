<?php

use \ITV\models\PortfolioWorkManager;

function portfolio_work_meta_init() {
    register_meta( 'post', PortfolioWorkManager::$meta_image_id, array(
        'object_subtype' => PortfolioWorkManager::$post_type,
        'type' => 'integer',
        'description' => 'main portfolio image',
        'single' => true,
        'show_in_rest' => true,
    ));
}
add_action( 'init', 'portfolio_work_meta_init' );
