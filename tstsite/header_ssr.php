<?php
/**
 * The Header for our theme
 */
?><!doctype html>
<!--[if lt IE 7 ]> <html <?php language_attributes(); ?> class="no-js ie6" xmlns:fb="http://ogp.me/ns/fb#"> <![endif]-->
<!--[if IE 7 ]>    <html <?php language_attributes(); ?> class="no-js ie7" xmlns:fb="http://ogp.me/ns/fb#"> <![endif]-->
<!--[if IE 8 ]>    <html <?php language_attributes(); ?> class="no-js ie8" xmlns:fb="http://ogp.me/ns/fb#"> <![endif]-->
<!--[if IE 9 ]>    <html <?php language_attributes(); ?> class="no-js ie9" xmlns:fb="http://ogp.me/ns/fb#"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <html <?php language_attributes(); ?> class="no-js"> <!--<![endif]-->
<head>
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta charset="<?php bloginfo('charset'); ?>">    
	<meta name="viewport" content="width=device-width" >
	<link rel="profile" href="http://gmpg.org/xfn/11">
		
	<title><?php wp_title( '|', true, 'right' ); ?></title>

	<?php wp_head(); ?>
	<!--Microsoft -->
    <meta http-equiv="cleartype" content="on">
    <meta name="yandex-verification" content="804eab4aa1555391" />
		
</head>
<?php flush(); ?>

<?php $home_body_class = is_front_page() ? 'itv-home-body itv-v2-header-footer' : 'itv-v2-header-footer';?>
<body id="top" <?php body_class($home_body_class); ?>>

<?php include_once(get_template_directory() . '/partials/spa-common-data.php');?>
<div id="itv-wp-pages-header-container"></div>

<div class="site-layout">
<div id="page" class="hfeed site">

<div class="container">
<?php
	if(is_front_page()) {
		get_template_part('partials/home', 'well');
	}
?>	
<div class="page-decor"><?php //echo apply_filters('itv_notification_bar', '');?>
