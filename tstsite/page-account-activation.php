<?php
/**
 * Template Name: Account activation
 *
 **/

if(get_current_user_id() || empty($_GET['uid'])) {
    wp_redirect(home_url());
    die();
}

$user = get_user_by('id', (int)$_GET['uid']);



get_header();?>
<?php while ( have_posts() ) : the_post(); ?>

<header class="page-heading">

	<div class="row">
		<div class="col-md-12">
			<nav class="page-breadcrumbs"><?php echo frl_breadcrumbs();?></nav>
			<h1 class="page-title"><?php echo frl_page_title();?></h1>
		</div>
		
	</div>

</header>

<div class="page-body">
<div class="row in-single">   
        
    <div class="col-md-8">    

        <div class="activation-message">
            <?php if( !$user ) {?>

                <div class="alert alert-danger"><?php _e('User account not found.', 'tst');?></div>

            <?php } elseif(empty($_GET['code']) || get_user_meta($user->ID, 'activation_code', true) != $_GET['code']) {?>

                <div class="alert alert-danger"><?php _e('Wrong data given.', 'tst');?></div>

            <?php } else {
                update_user_meta($user->ID, 'activation_code', '');

                global $email_templates;

                wp_mail(
                    $user->user_email,
                    $email_templates['account_activated_notice']['title'],
                    sprintf($email_templates['account_activated_notice']['text'], $user->user_login, home_url('/login/'))
                );

                $link = '<a href="'.tst_get_login_url().'" class="alert-link">'.__('Enter on site', 'tst').'</a>';?>

                <div class="alert alert-success"><?php printf(__('Your account is active now! Please %s.', 'tst'), $link);?></div>

            <?php }?>
        </div>
        
    </div> <!-- .col-md-8 -->
    
    <div class="col-md-4">&nbsp;</div>
    
</div><!-- .row -->
</div>

<?php endwhile; ?>
<?php get_footer(); ?>