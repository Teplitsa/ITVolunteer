<?php
/**
 * Members related template tags
 **/



function tst_members_filters_menu(){
	global $wp_query;
	
	$current = ($wp_query->get('member_role')) ? trim($wp_query->get('member_role')) : '';
?>
<ul class="members-filters">
	<li class="benef<?php if($current == 'publish') echo ' active';?>">
	<a href="<?php echo tst_members_filters_link('benef'); ?>" class="ga-event-trigger" <?php tst_ga_event_data('tl_tf_open');?>>
		<?php _e('New tasks:', 'tst')?> <?php echo tst_get_new_tasks_count();?>
	</a>
	</li>
	<li class="activist<?php if($current == 'in_work') echo ' active';?>">
	<a href="<?php echo tst_members_filters_link('activist'); ?>" class="ga-event-trigger" <?php tst_ga_event_data('tl_tf_work');?>>
		<?php _e('In work tasks:', 'tst')?> <?php echo tst_get_work_tasks_count();?>
	</a>
	</li>
	<li class="hero<?php if($current == 'closed') echo ' active';?>">
	<a href="<?php echo tst_members_filters_link('hero'); ?>" class="ga-event-trigger" <?php tst_ga_event_data('tl_tf_close');?>>
		<?php _e('Closed tasks:', 'tst')?> <?php echo tst_get_closed_tasks_count();?>
	</a>
	</li>
</ul>
<?php	
}


function tst_members_filters_link($role = 'benef') {	
	
	$roles = array('benef', 'activist', 'hero');
	
	if(!in_array($role, $roles))
		$status = 'activist';
		
	$url = home_url("/tasks/$status/"); 
	
	return $url;	
}