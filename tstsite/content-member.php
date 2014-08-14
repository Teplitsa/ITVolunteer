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

                <?php $role = tst_get_member_role($tst_member);
                    switch($role) {
                        case 1: $class = 'label-warning'; break;
                        case 2: $class = 'label-success'; break;
                        case 3:
                        default: $class = 'label-info';
                    }?>
				<div class="member-status"><span class="label <?php echo $class;?>"><?php echo tst_get_member_role_label($role);?></span></div>
				<h4 class="member-title"><a href="<?php echo tst_get_member_url();?>"><?php echo tst_get_member_name();?></a></h4>
				
				<!-- metas -->
				<div class="member-meta">
					<span class="member-points">
						<span><?php _e('Rating', 'tst');?>:</span> <b class="user-rating"><?php echo tst_get_user_rating($tst_member->ID);?></b>
						<span><?php _e('Tasks', 'tst');?>:</span>
						<span title="<?php _e('Created tasks / completed tasks', 'tst');?>"><?php echo count(tst_get_user_created_tasks($tst_member->ID)).'('.count(tst_get_user_created_tasks($tst_member->ID, 'closed')).')';?></span>
						<?php echo ' / '; ?>
						<b title="<?php _e('Participating in tasks / completed tasks', 'tst');?>"><?php echo count(tst_get_user_working_tasks($tst_member->ID)).'(<span>'.count(tst_get_user_working_tasks($tst_member->ID, 'closed')).'</span>)';?></b>
			
					</span>
			
					<?php $city = sanitize_text_field(tst_get_member_field('user_city', $tst_member));
					
					if($city) {?>
					<span class='city'><?php echo $city;?></span>
					<?php }?>
				</div>
							
			</div><!-- .col-md-9 -->
		</div>
	</header>
	
	
	
	<div class="member-summary"><?php echo html_entity_decode(tst_get_member_summary($tst_member, true), ENT_QUOTES, 'UTF-8');?></div>
	
	</div>
</article><!-- .member -->