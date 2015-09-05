<?php
/**
 * The Navbar 
 */
?>
	<div class="site-branding">		
		<a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home" class="logo"><?php bloginfo( 'name' ); ?></a>				
	</div>

<?php if(!is_page('registration')) { ?>

<div id="menu-trigger" class="menu-toggle"><span class="glyphicon glyphicon-menu-hamburger"></span></div>	
<div class="site-navigation-area">
	<ul id="content_menu" class="content-menu">
		<li class="important-item">
			<a href="<?php echo tst_tasks_filters_link('publish');?>" class="ga-event-trigger" <?php tst_ga_event_data('m_tf_list');?>>
				<?php _e('Tasks', 'tst');?> (<span class="count "><?php echo tst_get_new_tasks_count();?></span>)
			</a>
		</li>
		<li class="important-item-2">
			<a href="<?php echo home_url('members/hero');?>" class="ga-event-trigger" <?php tst_ga_event_data('m_mb_list');?>>
				<?php _e('Members', 'tst');?> <span class="count ">( <?php echo tst_get_active_members_count();?> )</span>
			</a>
		</li>	
		
        <li class="has-children">
          <a href="<?php echo home_url('about');?>" class="ga-event-trigger" <?php tst_ga_event_data('m_about');?>><?php _e('About', 'tst');?> <b class="caret"></b></a>
          <ul class="submenu">
            <li><a href="<?php echo home_url('about');?>"><?php _e('About', 'tst');?></a></li>
            <li><a href="<?php echo home_url('news');?>"><?php _e('News', 'tst');?></a></li>
            <li><a href="<?php echo home_url('sovety-dlya-nko-uspeshnye-zadachi');?>"><?php _e('Advices', 'tst');?></a></li>
            <li><a href="<?php echo home_url('contacts');?>"><?php _e('Contacts', 'tst');?></a></li>
          </ul>
        </li>
    </ul>
		
	<ul id="actions_menu" class="actions-menu">
	<?php if(is_user_logged_in()): global $current_user; ?>
		<li class="has-children">
		<?php $user_url = tst_get_member_url($current_user);?>
			<a href="<?php echo $user_url;?>" class="ga-event-trigger" <?php tst_ga_event_data('m_profile');?>>					
				<?php echo tst_get_member_name($current_user);?> <b class="caret"></b>
				<?php echo apply_filters('itv_notification_badge', '');?>
			</a>
			<ul class="submenu">			
				<li><a href="<?php echo home_url('/member-actions/member-tasks/');?>"><?php _e('My tasks', 'tst');?></a></li>
				<li><a href="<?php echo tst_get_member_url($current_user);?>"><?php _e('My profile', 'tst');?></a>
					<?php echo apply_filters('itv_notification_badge', '');?></li>
				<li><a href="<?php echo wp_logout_url(tst_get_login_url().'&t=1');?>"><?php _e('Log out', 'tst');?></a></li>
			</ul>
		</li>
	<?php else: ?>
		<li><a href="<?php echo home_url('/registration/');?>" class="ga-event-trigger" <?php tst_ga_event_data('m_login');?>><?php _e('Log In', 'tst');?></a></li>			
	<?php endif;?>
	
	<?php if(is_user_logged_in()) {?>
	<li class="important-item">	
		<a href="<?php echo home_url('task-actions');?>" class="ga-event-trigger" <?php tst_ga_event_data('m_ntask');?>><?php _e('New task', 'tst');?></a></li>
	</li>
	<?php }?>
	
	</ul>	
</div>
<?php } ?>
