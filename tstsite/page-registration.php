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
		exit;
	} 

get_header();?>

<article class="register-actions">
<?php while ( have_posts() ) : the_post();?>

<div class="page-body register-page-body">
	
<div id="register_content">
<div class="row">
	<div class="col-sm-5">
		<h2 class="login-title"><?php echo frl_page_title();?></h2>
		<!-- login form -->
		<div class="login-form">
			
		<form id="login-form" method="post" action="<?php echo esc_url(site_url('wp-login.php', 'login_post'));?>" name="loginform"  role="form">
			<?php wp_nonce_field('user-login');?>
	
			<div class="form-group">				
				<input type="text" size="20" value="" class="form-control input-sm" id="user_login" name="log" placeholder="<?php _e('Username or Email', 'tst');?>">				
			</div>
			
			<div class="row">
				<div class="col-xs-8">
					<div class="form-group">				
						<input type="password" size="20" value="" class="form-control input-sm" id="user_pass" name="pwd" placeholder="<?php _e('Password', 'tst');?>">
					</div>					
				</div><!-- .col-  -->				
				<div class="col-xs-4">
					<div class="form-group">
						<input type="submit" id="do-login" <?php tst_ga_event_data('reg_login');?> value="<?php _e('Log In', 'tst');?>" class="btn btn-primary btn-sm ga-event-trigger" name="wp-submit">
						<input type="hidden" value="<?php echo $back_url;?>" id="redirect_to" name="redirect_to" />						
					</div>
				</div><!-- .col-  -->
			</div><!-- .row -->	
			
			<div class="checkbox">
				<label>
					<input type="checkbox" value="forever" id="rememberme" name="rememberme" checked="checked"><?php _e('Remember Me', 'tst');?></label>&nbsp;&nbsp;&middot;&nbsp;&nbsp;<span class="lost-psw "><a title="Восстановление пароля" href="<?php echo wp_lostpassword_url();?>">Забыли пароль?</a>				
				</span>
			</div>
			
			<div id="login-message" class="rl-error" style="display: none;"></div>
		</form>
		
		</div><!-- .login-form -->		
	</div><!-- .col- -->
	
	<div class="col-sm-7">		
		
		<form id="user-reg" action="#">
		<?php wp_nonce_field('user-reg');?>
	
		<div class="panel panel-default register-form">
		<div class="panel-heading"><?php _e('Register new account', 'tst');?></div>
		
		<div class="panel-body">
			<div id="register-form-message" class="validation-message" style="display: none"></div>
			<div id="reg-form-fields">
				<!--<div class="form-group">
					<label for="user_login"><?php _e('Username (login)', 'tst');?></label>
					<input type="text" name="user_login" id="user_login" value="" class="form-control" maxlength="15" />			
					<div id="user_login_vm" class="validation-message" style="display: none"></div>
				</div>-->
				<div class="row">
					<div class="col-xs-5 col-md-4">
						<div class="form-group">						
							<input type="text" class="form-control input-sm" name="first_name" id="first_name" value="" placeholder="<?php _e('First name', 'tst');?>"/>					
							<div id="first_name_vm" class="validation-message rl-error" style="display: none"></div>
						</div>				
					</div>
					
					<div class="col-xs-7 col-md-8">
						<div class="form-group">						
							<input type="text" class="form-control input-sm" name="last_name" id="last_name" value=""  placeholder="<?php _e('Last name', 'tst');?>"/>					
							<div id="last_name_vm" class="validation-message rl-error" style="display: none"></div>
						</div>
					</div>
				</div>	<!-- .row -->		
				
				<div class="form-group">				
					<input type="text" name="email" id="email" value="" class="form-control input-sm" placeholder="<?php _e('Email', 'tst');?>"/>
					<div id="user_email_vm" class="validation-message rl-error" style="display: none"></div>
				</div>

				<div class="row">
					<div class="col-sm-7 col-md-8">
						<div class="form-group">				
						<input class="hidden" value=" " /><!-- #24364 workaround -->
						<input type="password" name="pass1" id="pass1" class="form-control input-sm" value="" autocomplete="off" placeholder="<?php _e('Password', 'tst');?>"/>
						<div id="user_pass_vm" class="validation-message rl-error" style="display: none"></div>
					</div>
					</div>
					<div class="col-sm-5 col-md-4">
					<div class="form-group register-action">
							<input type="submit" value="<?php _e('Register', 'tst');?>" <?php tst_ga_event_data('reg_reg');?> class="btn btn-primary btn-sm ga-event-trigger" id="do-register" name="do-register">				
						</div>
					</div>
				</div>
				
				<div class="checkbox">
				    <label id="itv_agree_process_data_label">
    					<input type="checkbox" name="agree_personal_data" id="agree_personal_data" value="agree" />
    					 <?php _e('Agree process personal data', 'tst');?>
				    </label>
    				<div id="agree_personal_data_vm" class="validation-message rl-error" style="display: none"></div>
			    </div>
				
				<!--<div class="form-group">
					<label for="pass2"><?php _e('Repeat password', 'tst');?></label>			
					<input name="pass2" type="password" id="pass2" class="form-control" value="" autocomplete="off" />
					<div id="user_pass_vm" class="validation-message" style="display: none"></div>
				</div>-->
			</div>

		</div>
		</div>
	
		</form>
		
	</div><!-- .col-md-7-->
</div><!-- .row -->
</div>	

</div> <!-- .page-body -->

<?php endwhile; // end of the loop. ?>
</article>

<?php get_footer(); ?>
