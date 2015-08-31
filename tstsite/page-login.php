<?php
/**
 * Template Name: Login
 *
 **/

$refer = empty($_GET['redirect_to']) ?
    (stristr(wp_get_referer(), $_SERVER['REQUEST_URI']) !== false ? home_url() : wp_get_referer()) :
    $_GET['redirect_to'];
$back_url = $refer ? $refer : home_url();

if(get_current_user_id()) {
    wp_redirect($back_url);
    exit;
}

get_header();?>

<article class="member-actions">
    <header class="page-heading">

        <div class="row">
            <div class="col-md-8">
                <nav class="page-breadcrumbs"><?php echo frl_breadcrumbs();?></nav>
                <h1 class="page-title"><?php echo frl_page_title();?></h1>
            </div>

            <div class="col-md-4">
                <div class="status-block-member in-action">
                    <div class="row-top">
                    <?php //... ?>
                    </div>
                </div>
            </div>
        </div><!-- .row -->

    </header>

    <div class="page-body">
		<?php if(isset($_GET['t'])) {
			switch($_GET['t']) {
				case 1: echo '<div class="alert alert-success">'.__('You have been successfully logged out. Hope you\'ll come back soon', 'tst').'</div>';
				default:
			}
		}?>
	
        <div class="row in-single">

           

            <div class="col-md-8">

                <div class="row">
                    <div class="col-md-3">
				<span class="thumbnail">
					<?php tst_login_avatar();?>
				</span>
                    </div>

                    <div class="col-md-9">
                        <div class="login-form">
                            <form id="login-form" method="post" action="<?php echo esc_url(site_url('wp-login.php', 'login_post'));?>" name="loginform"  role="form">
                                <?php wp_nonce_field('user-login');?>

                                <div class="form-group">
                                    <label for="user_login"><?php _e('Username', 'tst');?></label>
                                    <input type="text" size="20" value="" class="form-control" id="user_login" name="log">
                                </div>
                                <div class="form-group">
                                    <label for="user_pass"><?php _e('Password', 'tst');?></label>
                                    <input type="password" size="20" value="" class="form-control" id="user_pass" name="pwd">
                                </div>

                                <div class="checkbox">
                                    <label>
                                        <input type="checkbox" value="forever" id="rememberme" name="rememberme"><?php _e('Remember Me', 'tst');?>
                                    </label>
                                </div>

                                <div class="form-group">
                                    <input type="submit" id="do-login" value="<?php _e('Log In', 'tst');?>" class="btn btn-primary" id="wp-submit" name="wp-submit">
                                    <input type="hidden" value="<?php echo $back_url;?>" id="redirect_to" name="redirect_to" />
                                    <div id="login-message" class="alert alert-danger" style="display: none;"></div>
                                </div>
                            </form>
                        </div>
                    </div>

                </div><!-- .row -->
            </div><!-- .col-md-8 -->

            <div class="col-md-4">
                <div class="panel panel-default"><div class="panel-body">
                        <h4><?php _e("Don't have an account?", 'tst');?></h4>
                        <p>
                            <?php
                            $register = tst_get_register_url();
                            $register = "<a href='{$register}'>".__('Register a new account.', 'tst')."</a>";
                            printf(__("No problem. %s It will take just a few minutes.", 'tst'), $register);
                            ?>
                        </p>
                </div></div>
            </div><!-- .col-md-4 -->

        </div><!-- .row -->
</div> <!-- .page-body -->

</article>

<?php get_footer(); ?>
