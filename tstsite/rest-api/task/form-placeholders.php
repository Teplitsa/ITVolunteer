<?php

add_action( 'rest_api_init', function () {
    register_rest_route( 'itv/v1', '/task/form-placeholders', [
        'methods' => 'GET',
        'callback' => function($args) {
            return \ITV\models\TaskFormPlaceholders::instance()->get_placeholders();
        },
    ] );
} );
