<?php

if(!$candidates || empty($candidates))
	return;

/** Volunteers list item **/
function frl_task_candidate_markup(WP_User $candidate, $actionable = false, $response = false) {
	
$member_url = trailingslashit(site_url('/members/'.$candidate->user_login));
?>
<div class="c-img">
	<?php tst_temp_avatar($candidate);?>
</div>
<div class="c-name">
	<a href="<?php echo $member_url;?>"><?php echo $candidate->first_name.' '.$candidate->last_name;?></a>
	<div class="user-rating"><?php echo __('Rating', 'tst').': <span>'.tst_get_user_rating($candidate->ID).'</span>';?></div>
</div>

<div class="c-actions">
	
<?php if($actionable) { ?>
	<div class="approvable"><div class="pretty-checkbox for-approve">
		<input type="checkbox" id="is_approved" name="is_approved" data-link-id="<?php echo $candidate->p2p_id;?>" data-doer-id="<?php echo $candidate->ID;?>" data-task-id="<?php the_ID();?>" data-nonce="<?php echo wp_create_nonce($candidate->p2p_id.'-candidate-'.$candidate->ID);?>"value="1" <?php checked(p2p_get_meta($candidate->p2p_id, 'is_approved', true));?>>
		<label for="is_approved"></label>
	</div></div>
<?php
} else { $checked = (p2p_get_meta($candidate->p2p_id, 'is_approved', true)) ? ' checked' : ''; ?>
	<div class="approvable"><span class="chk-btn<?php echo $checked;?>"><span class="glyphicon glyphicon-ok"></span></span></div>
<?php } ?>

<?php if($response) { ?>
	<div class="response">
		<span class="leave-review" data-doer-id="<?php echo $candidate->ID;?>" data-task-id="<?php the_ID();?>">
			<span class="btn btn-primary btn-xs" title="<?php _e('Leave review', 'tst');?>">
				<span class="glyphicon glyphicon-bullhorn"></span>
			</span>
		</span>
	</div>
<?php }?>

</div>
<?php
}


/** Volunteers list **/

	$actionable = false;
	$response = false;
	
	if($is_curr_users_task && $post->post_status == 'publish') {
		$actionable = true;
	} elseif($is_curr_users_task && $post->post_status == 'closed') {
		$response = true;
	}

?>
<div class="connected-users">
	<h5><?php _e('Оffered their help', 'tst');?></h5>
	<ul>
	<?php foreach($candidates as $candidate) {?>
		<li><?php frl_task_candidate_markup($candidate, $actionable, $response);?></li>
	<?php }?>
	</ul>
</div>