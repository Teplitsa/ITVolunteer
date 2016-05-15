<?php

function itv_standalone_enqueue_cssjs() {
    $url = get_template_directory_uri();
    wp_enqueue_style('front-custom', $url.'/style.css', array(), '1.0.0');	
}
add_action( 'wp_enqueue_scripts', 'itv_standalone_enqueue_cssjs' );
