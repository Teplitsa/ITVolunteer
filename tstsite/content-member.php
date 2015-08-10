<?php
/**
 * this is temp member layout
 **/

global $tst_member;?>

<article class="member col-md-6">
	
	<div class="border-card">
		
	<header class="member-header">
		<div class="row">
			<div class="col-md-3">
				<a href="<?php echo tst_get_member_url();?>" class="thumbnail">
					<?php tst_temp_avatar();?>
				</a>
			</div>
			<div class="col-md-9">

                <?php
                    $is_user_test_employee = get_user_meta($tst_member->ID, 'user_test_employee', true);
					$is_user_test_partner = get_user_meta($tst_member->ID, 'user_test_partner', true);
                    $role = tst_get_member_role_key($tst_member);
					
					$activity = tst_get_member_activity($tst_member);					
                ?>
				<div class="member-status">
					<span class="label <?php echo esc_attr($role);?>"><?php echo tst_get_role_name($role);?></span>
					<span class="label-from"> <?php _e('from', 'tst');?> <?php echo date("d.m.Y", strtotime(get_userdata($tst_member->ID)->user_registered)); ?></span>
					
					<?php if($is_user_test_employee):?><img class="itv-test-employee" title="<?php _e('Te-st employee', 'tst');?>" alt="<?php _e('Te-st employee', 'tst');?>" src="<?=content_url('themes/tstsite/img/te-st-logo.jpg')?>" /><?endif?>
					<?php if($is_user_test_partner):?><img class="itv-test-partner" title="<?php _e('Te-st partner', 'tst');?>" alt="<?php _e('Te-st partner', 'tst');?>" src="<?=content_url('themes/tstsite/img/logo-v.png')?>" /><?endif?>
				</div>
				<h4 class="member-title"><a href="<?php echo tst_get_member_url();?>"><?php echo tst_get_member_name();?></a></h4>
				
				<!-- metas -->
				<div class="member-meta">
					<span class="member-points">
						<?php if($place_of_work = tst_get_member_field('user_workplace')):?>
						<span><?php _e('Place of work', 'tst');?>:</span> <b class="user-rating"><?=$place_of_work?></b><br />
						<?php endif?>
						
						<span><?php _e('Rating', 'tst');?>:</span> <b class="user-rating"><?php echo (int)$activity['solved'];?></b>
						
						<span><?php _e('Tasks', 'tst');?>:</span>
						<b title="<?php _e('Participating in tasks / completed tasks', 'tst');?>"><?php echo (int)$activity['joined'].'(<span>'.(int)$activity['solved'].'</span>)';?></b>
						<?php echo ' / '; ?>
						<span title="<?php _e('Created tasks / completed tasks', 'tst');?>"><?php echo (int)$activity['created'].'('.(int)$activity['created_closed'].')';?></span>
			
					</span>
			
					<?php $city = sanitize_text_field(tst_get_member_field('user_city', $tst_member));					
					if($city) {?>
						<span class='city'><?php echo $city;?></span>
					<?php }?>
				</div>
							
			</div><!-- .col-md-9 -->
		</div>
	</header>
	
	
	
	<div class="member-summary">
		<?php echo html_entity_decode(tst_get_member_summary($tst_member, true), ENT_QUOTES, 'UTF-8'); ?>
	</div>
	
	</div>
</article><!-- .member -->