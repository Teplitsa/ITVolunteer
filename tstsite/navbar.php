<?php
/**
 * The Navbar 
 */

$p = get_page(get_option('page_for_posts'));
$news_title = apply_filters('the_title', $p->post_title);
?>
	<div class="site-branding navbar-header">		
		<?php if(!is_front_page()):?>	
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home" class="navbar-brand"><?php bloginfo( 'name' ); ?></a>
		<?php else:?>
			<span class="navbar-brand"><?php bloginfo( 'name' ); ?></span>
		<?php endif;?>	
		<div class="beta-label"><?php _e('beta-version', 'tst');?></div>
	</div>
	
	<div class="collapse navbar-collapse" id="top-nav">
		
      <ul class="nav navbar-nav navbar-left" id="menu-about">        
        <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown"><?php _e('About', 'tst');?> <b class="caret"></b></a>
          <ul class="dropdown-menu">
            <li><a href="<?php echo home_url('about');?>"><?php _e('About', 'tst');?></a></li>
            <li><a href="<?php echo home_url('news');?>"><?php echo $news_title;?></a></li>
<<<<<<< HEAD
=======
             <li><a href="<?php echo home_url('sovety-dlya-nko-uspeshnye-zadachi');?>"><?php _e('Advices', 'tst');?></a></li>
>>>>>>> dev
            <li><a href="<?php echo home_url('contacts');?>"><?php _e('Contacts', 'tst');?></a></li>
          </ul>
        </li>
      </ul>
	
		<ul class="nav navbar-nav" id="menu-center">        
		  <li><a href="<?php echo home_url('tasks');?>"><?php _e('Tasks', 'tst');?></a></li>
		  <li><a href="<?php echo home_url('members');?>"><?php _e('Members', 'tst');?></a></li>
		  <li class="dropdown">
			  <a href="#" class="dropdown-toggle" data-toggle="dropdown"><?php _e('Search', 'tst');?> <b class="caret"></b></a>
			  <ul class="dropdown-menu">
				  <li>
					  <form class="navbar-form" role="search" method="get" action="<?php echo esc_url(home_url()); ?>">
						<div class="form-group">
						<input type="text" class="form-control" placeholder="<?php _e('Search', 'tst');?>" name="s" value="<?php echo esc_attr(get_search_query());?>">
						</div>
						<button type="submit" class="btn btn-default"><?php _e('Go', 'tst');?></button>
					  </form>
				  </li>				     
			  </ul>
		  </li>
		</ul>
		
		<div class="navbar-right">			
			<?php if(is_user_logged_in()) {?>
				<a href="<?php echo home_url('task-actions');?>" class="btn btn-primary navbar-btn navbar-right add-new-task-button"><?php _e('New task', 'tst');?></a>
			<?php } else {?>
				<a href="<?php echo home_url('/registration/')?>" class="btn btn-primary navbar-btn navbar-right home-registration-button" ><?php _e('Register', 'tst');?></a>
			<?php }?>
<!--		<a href="<?php echo tst_get_member_url(get_user_by('id', get_current_user_id()));?>" class="btn btn-primary navbar-btn navbar-right"><?php _e('Your profile', 'tst');?></a> -->
		</div>

		<ul class="nav navbar-nav pull-right" id="menu-actions">
		<?php if(is_user_logged_in()): global $current_user; ?>
			<li class="dropdown">
				<a href="#" class="dropdown-toggle" data-toggle="dropdown">					
					<?php echo tst_get_member_name($current_user);?> <b class="caret"></b>
					<?php echo apply_filters('itv_notification_badge', '');?>
				</a>
				<ul class="dropdown-menu">					
					<li><a href="<?php echo home_url('/member-actions/member-tasks/');?>"><?php _e('My tasks', 'tst');?></a></li>
					<li><a href="<?php echo tst_get_member_url($current_user);?>"><?php _e('My profile', 'tst');?></a>
						<?php echo apply_filters('itv_notification_badge', '');?></li>
					<li><a href="<?php echo wp_logout_url(tst_get_login_url().'&t=1');?>"><?php _e('Log out', 'tst');?></a></li>
				</ul>
			</li>
		<?php else: ?>
			<li><a href="<?php echo home_url('login/');?>"><?php _e('Log In', 'tst');?></a></li>
			<!--<li><a href="<?php echo home_url('registration/');?>"><?php _e('Register', 'tst');?></a></li>-->
		<?php endif;?>
		</ul>
	</div>