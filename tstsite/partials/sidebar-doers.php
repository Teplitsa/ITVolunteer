<?php

/** Volunteers list item **/
function frl_task_candidate_markup(WP_User $candidate, $mode = 1) {
	
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
	<?php if(p2p_get_meta($candidate->p2p_id, 'is_approved', true)) {?>

		<span class="candidate-approved">
			<span class="c-status-app btn btn-success btn-xs"><span class="glyphicon glyphicon-ok"></span></span>
		</span>

		<?php if($mode >= 1 && $mode <= 2) {?>
		 
		<span class="candidate-refuse" data-link-id="<?php echo $candidate->p2p_id;?>" data-doer-id="<?php echo $candidate->ID;?>" data-task-id="<?php the_ID();?>" data-nonce="<?php echo wp_create_nonce($candidate->p2p_id.'-candidate-refuse-'.$candidate->ID);?>">
			<span class="btn btn-danger btn-xs"><?php _e('Disapprove', 'tst');?></span>
		</span>

		<?php
		} elseif($mode == 3 && !ItvReviews::instance()->is_review_for_doer_and_task($candidate->ID, get_the_ID())) {?>
				 
		<span class="leave-review" data-doer-id="<?php echo $candidate->ID;?>" data-task-id="<?php the_ID();?>">
			<span class="btn btn-primary btn-xs" title="<?php _e('Leave review', 'tst');?>"><span class="glyphicon glyphicon-bullhorn"></span></span>
		</span>
		
		<?php }
				
	} else { ?>
	
		<span class="candidate-li">
			<span class="c-status-napp btn btn-success btn-xs"><span class="glyphicon glyphicon-ok"></span></span>
		</span>
	
		<?php if($mode == 1) {?>

		<span class="candidate-ok" data-link-id="<?php echo $candidate->p2p_id;?>" data-doer-id="<?php echo $candidate->ID;?>" data-task-id="<?php the_ID();?>" data-nonce="<?php echo wp_create_nonce($candidate->p2p_id.'-candidate-ok-'.$candidate->ID);?>">
			<span class="btn btn-default btn-xs"><?php _e('Approve', 'tst');?></span>
		</span>
		<?php } ?>

	<?php }?>
</div>
<?php
}

/** Volunteers list **/

if( !$cur_user_id ) {?>

        <?php if($post->post_status != 'draft' && $candidates) {?>
        <div class="connected-users">
            <h5><?php _e('Оffered their help', 'tst');?></h5>
            <ul>
            <?php foreach($candidates as $candidate) {?>
                <li><?php frl_task_candidate_markup($candidate, 4);?></li>
            <?php }?>
            </ul>
        </div>
        <?php }?>        
 

<?php } elseif($is_curr_users_task && $post->post_status == 'publish' && $candidates) {?>

	<div class="connected-users">
		<h5><?php _e('Оffered their help', 'tst');?></h5>
		<ul>
		<?php foreach($candidates as $candidate) {?>
			<li><?php frl_task_candidate_markup($candidate, 1);?></li>
		<?php }?>
		</ul>
	</div>

<?php } else if($is_curr_users_task && $post->post_status == 'in_work') {?>

	<div class="connected-users">
		<?php
		if($candidates) {?>

		<h5><?php _e('Оffered their help', 'tst');?></h5>
		<ul>
			<?php foreach($candidates as $candidate) {?>
				<li><?php frl_task_candidate_markup($candidate, 2);?></li>
			<?php }?>
		</ul>

		<?php } else
			_e('No doers found.', 'tst');?>
	</div>

<?php } else if($is_curr_users_task && $post->post_status == 'closed') {?>

    <div class="connected-users">
        <h5><?php _e('Оffered their help', 'tst');?></h5>
        <ul>
        <?php foreach($candidates as $candidate) {?>
            <li><?php frl_task_candidate_markup($candidate, 3);?></li>
        <?php }?>
        </ul>
    </div>

<?php } elseif( !$is_curr_users_task && !tst_is_user_candidate() ) {?>

	<?php if($post->post_status != 'draft' && $candidates) {?>
	<div class="connected-users">
		<h5><?php _e('Оffered their help', 'tst');?></h5>
		<ul>
		<?php foreach($candidates as $candidate) {?>
			<li><?php frl_task_candidate_markup($candidate, 4);?></li>
		<?php }?>
		</ul>
	</div>
	<?php }?>


<?php } elseif( !$is_curr_users_task && tst_is_user_candidate() >= 1 ) {?>

	<div class="connected-users">
		<h5><?php _e('Оffered their help', 'tst');?></h5>
		<ul>
			<?php foreach($candidates as $candidate) {?>
				<li><?php frl_task_candidate_markup($candidate, 5);?></li>
			<?php }?>
		</ul>
	</div>

<?php }