<?php
/**
 * Template Name: Techpage
 * 
 */
 
get_header();
if(current_user_can( 'manage_options' )) {
?>

<br />
***********************************
<br /><br />

<?php

$users_query_params = array(
    'number' => $per_page,
    'offset' => $offset,
    'exclude' => ACCOUNT_DELETED_ID,
);
	
$user_query = new WP_User_Query($users_query_params);

$to_fix_count = 0;
foreach($user_query->results as $user) {
	$is_to_fix = 0;
	
	$member_role = get_user_meta($user->ID, 'member_role', true);
	
	$is_to_fix = 1;
	if(empty($member_role)) {
		$is_to_fix = 1;
	}
	
	if($is_to_fix) {
		$to_fix_count++;
	}
	
	$new_member_role = tst_get_member_role($user);
	if($is_to_fix && @$_GET['update'] == 'ok') {
		tst_actualize_member_role($user->ID);
	}
	
	echo count(tst_get_user_created_tasks($user->ID)) . "**********<br />";
	echo count(tst_get_user_working_tasks($user->ID)) . "**********<br />";
	
	echo $user->user_login . ' - ' . ($is_to_fix ? 'EMPTY' : 'OK') . "; old_role= " . $member_role . "; new_role=" . $new_member_role . "<br />";
}

echo "<br />to_fix_count=" . $to_fix_count . "<br />";

?>
<br />
***********************************
<br /><br /><br /><br /><br /><br />

<?php 
}
get_footer();
?>