<?php
/**
 * The Header for our theme
 */
?><!DOCTYPE html>

<html class="no-js" <?php language_attributes(); ?>>

<head>

    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" >

    <link rel="profile" href="https://gmpg.org/xfn/11">

    <?php wp_head(); ?>

    <meta name="yandex-verification" content="804eab4aa1555391" />
    
</head>

<?php flush(); ?>

<?php $home_body_class = is_front_page() ? 'itv-home-body' : '';?>
<body id="top" <?php body_class($home_body_class); ?>>

<div id="itv-spa-container"></div>
