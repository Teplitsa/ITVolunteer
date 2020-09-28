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
	
	<script>
		function itvSwitchToV2(){
			Cookies.remove('itvOldDesign');
			document.location.reload();
			return false;
		}
		
		function itvSwitchToV1(){
			Cookies.set('itvOldDesign', "true", {"period": 30});
			document.location.reload();
			return false;
		}
	</script>
	
	<style type="text/css">
        .itv-switch-to-new-design-bar {
            background-color: #0EA36C;
        }
	   
        .itv-switch-to-new-design-bar .container {
            display: flex;
            justify-content: center;
            align-items: center;
            background-image: url('<?php echo get_template_directory_uri() . '/src_spa/src/img/pic-switch-to-new-design.svg'; ?>');
            background-size: 360px 96px;
            background-position: 7% center;
            background-repeat: no-repeat;
            height: 96px;
        }
	   
        .itv-switch-to-new-design-bar .text {
            color: #FFFFFF;
            display: flex;
            align-items: center;
            cursor: pointer;
            height: 45px;
        }
        
        .itv-switch-to-new-design-bar .text > span {
            display: block;
            font-style: normal;
            font-weight: 500;
            font-size: 30px;
            line-height: 40px;
            display: flex;
            align-items: center;
            letter-spacing: -0.01em;
            margin-right: 24px;
            margin-left: 24px;            
        }

        .itv-switch-to-new-design-bar .text > .text-arrow {
            background-image: url('<?php echo get_template_directory_uri() . '/src_spa/src/img/icon-arrow-right-white.svg'; ?>');            
            background-size: 32px 32px;
            background-position: center center;
            background-repeat: no-repeat;
            border-radius: 42px;
            width: 42px;
            height: 42px;
            border: 2px solid #FFFFFF;
        }
        
        #page {
            padding-top: 142px;
        }
        
        @media only screen and (max-width: 991.98px) {
            .itv-switch-to-new-design-bar .container {
                flex-wrap: wrap;
                background-image: none;
            }
            
            .itv-switch-to-new-design-bar .text {
                flex-direction: column;
                height: auto;
            }
            
            .itv-switch-to-new-design-bar .text > span {
                font-size: 20px;
                line-height: 25px;
                margin-right: 0px;
                margin-left: 0px;            
            }
            
            .itv-switch-to-new-design-bar .text > .text-arrow {
                background-size: 16px 16px;
                border-radius: 24px;
                width: 24px;
                height: 24px;
                margin-top: 12px;
            }
        }        
    </style>
		
</head>
<?php flush(); ?>

<?php $home_body_class = is_front_page() ? 'itv-home-body' : '';?>
<body id="top" <?php body_class($home_body_class); ?>>

<div class="site-layout-container">
<nav id="site_navigation" class="site-navigation" role="navigation">
	<?php if(!empty($_COOKIE["itvOldDesign"])):?>
	<div class="itv-switch-to-new-design-bar">
		<div class="container">
			<div class="text ga-event-trigger" onclick="return itvSwitchToV2();" <?php tst_ga_event_data('ge_switch_desing_to_new');?>>
				<span>Переходите на новый дизайн</span>
				<div class="text-arrow"> </div>
			</div>
		</div>
	</div>
	<?php endif;?>
	<div class="container">
		<?php get_template_part('partials/navbar');?>
	</div>
</nav><!-- #site-navigation -->

<div class="site-layout">
<div id="page" class="hfeed site">

<div class="container">
<?php
	if(is_front_page()) {
		get_template_part('partials/home', 'well');
	}
?>	
<div class="page-decor"><?php //echo apply_filters('itv_notification_bar', '');?>
