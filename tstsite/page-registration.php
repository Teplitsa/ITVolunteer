<?php
/**
 * Template Name: Registration
 *
 **/

if(get_current_user_id()) {
    $refer = stristr(wp_get_referer(), $_SERVER['REQUEST_URI']) !== false ? home_url() : wp_get_referer();
    $back_url = $refer ? $refer : home_url();

    wp_redirect($back_url);
    die();
}

get_header();?>

<article class="member-actions">
<?php while ( have_posts() ) : the_post();?>


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
<div class="row in-single">

<div class="col-md-8">
	
	<div class="row">
        <div class="col-md-3">
			<span class="thumbnail">
				<?php tst_login_avatar();?>
			</span>
		</div>
		
		<div class="col-md-9">
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
		
					<!--<a href="<?php echo wp_get_referer() ? wp_get_referer() : home_url();?>" class="cancel-reg text-danger"><?php _e('Cancel profile creation', 'tst');?></a>-->
				</div>
	
			</div>
			</div>
		
			</form>
			
			
			
			
		</div><!-- .col-md-9-->
	</div><!-- .row -->
	
</div><!-- .col-md-8 -->
	
<div class="col-md-4">
	<div class="panel panel-default"><div class="panel-body">
			<h4><?php _e('Already have an account?', 'tst');?></h4>
			<p>
			<?php
				$login = tst_get_login_url();
				$login = "<a href='{$login}'>".__('Enter on site', 'tst')."</a>";
				printf(__("Please, %s.", 'tst'), $login);
				?>
			</p>
	</div></div>
</div><!-- .col-md-4 -->
	
	
</div><!-- .row -->
</div> <!-- .page-body -->

<?php endwhile; // end of the loop. ?>
</article>

<?php get_footer(); ?>