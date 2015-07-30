<?php
/**
 * Template Name: Registration
 *
 **/

 
$refer = empty($_GET['redirect_to']) ?
    (stristr(wp_get_referer(), $_SERVER['REQUEST_URI']) !== false ? home_url() : wp_get_referer()) :
    $_GET['redirect_to'];
	$back_url = $refer ? $refer : home_url();

	if(get_current_user_id()) {
		wp_redirect($back_url);
		die();
	} 

get_header();?>

<article class="member-actions">
<?php while ( have_posts() ) : the_post();?>


<header class="page-heading complex-login no-breadcrumbs">

	<div class="row">
		<div class="col-md-8">			
			<h1 class="page-title"><?php echo frl_page_title();?></h1>			
		</div>

		<div class="col-md-4"></div>
	</div><!-- .row -->

</header>

<div class="page-body">

	
<div class="row">
	<div class="col-md-5">		
		<h4><?php _e('LogIn into your account', 'tst');?></h4>
		
		<!-- login form -->
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
		</div><!-- .login-form -->
		
	</div>
	
	<div class="col-md-7">
		<h4><?php _e('Register New Account', 'tst');?></h4>
		
		<div id="register-form-message" class="validation-message" style="display: none"></div>
		<form id="user-reg" action="#">
		<?php wp_nonce_field('user-reg');?>
	
		<div class="panel panel-default register-form">
		<div class="panel-heading"><small><?php _e('All fields are required', 'tst');?></small></div>
	
		<div class="panel-body">
			<div class="form-group">
				<label for="user_login"><?php _e('Username (login)', 'tst');?></label>
				<input type="text" name="user_login" id="user_login" value="" class="form-control" maxlength="15" />
				<small class="help-block"><?php _e('Username can\'t be changed in the future. It must consist of only latin alphabet symbols.', 'tst');?></small>
				<div id="user_login_vm" class="validation-message" style="display: none"></div>
			</div>
			
			<div class="form-group">
				<label for="email"><?php _e('Email', 'tst');?></label>
				<input type="text" name="email" id="email" value="" class="form-control" />
				<div id="user_email_vm" class="validation-message" style="display: none"></div>
			</div>
			
			<div class="form-group">
				<label for="pass1"><?php _e('Password', 'tst');?></label>
				<input class="hidden" value=" " /><!-- #24364 workaround -->
				<input type="password" name="pass1" id="pass1" class="form-control" value="" autocomplete="off" />
			</div>
			
			<div class="form-group">
				<label for="pass2"><?php _e('Repeat password', 'tst');?></label>			
				<input name="pass2" type="password" id="pass2" class="form-control" value="" autocomplete="off" />
				<div id="user_pass_vm" class="validation-message" style="display: none"></div>
			</div>
	
			<div class="form-group">
				<label for="first_name"><?php _e('First name', 'tst');?></label>
				<input type="text" class="form-control" name="first_name" id="first_name" value="" />
				<small class="help-block"><?php _e('Please provide your first name', 'tst');?></small>
				<div id="first_name_vm" class="validation-message" style="display: none"></div>
			</div>
	
			<div class="form-group">
				<label for="last_name"><?php _e('Last name', 'tst');?></label>
				<input type="text" class="form-control" name="last_name" id="last_name" value="" />
				<small class="help-block"><?php _e('Please provide your last name', 'tst');?></small>
				<div id="last_name_vm" class="validation-message" style="display: none"></div>
			</div>
			
			<div class="form-group">
				<input type="submit" value="<?php _e('Register', 'tst');?>" class="btn btn-primary" id="do-register" name="do-register">				
			</div>

		</div>
		</div>
	
		</form>
		
	</div><!-- .col-md-7-->
</div><!-- .row -->
	

</div> <!-- .page-body -->

<?php endwhile; // end of the loop. ?>
</article>

<?php get_footer(); ?>