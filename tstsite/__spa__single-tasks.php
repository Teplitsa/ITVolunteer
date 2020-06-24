<?php
/**
 * Template for single task 
 **/

get_header();

while ( have_posts() ) the_post();

include_once(get_template_directory() . '/partials/spa-common-data.php');

get_footer();