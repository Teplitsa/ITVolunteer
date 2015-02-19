<br />
***********************************
<br /><br />

<?php

$user_login = @$_GET['user'];

$users_query_params = array(
    'number' => $per_page,
    'offset' => $offset,
    'exclude' => ACCOUNT_DELETED_ID,
);

if($user_login) {
	$users_query_params['search'] = $user_login;
	$users_query_params['search_columns'] = array('user_login', 'user_nicename');
}

$user_query = new WP_User_Query($users_query_params);

$to_fix_count = 0;
foreach($user_query->results as $user) {
	echo "==========" . $user->user_login . "<br />";
	
	$is_to_fix = 0;
	
	$member_role = get_user_meta($user->ID, 'member_role', true);
	
	if(empty($member_role)) {
		$is_to_fix = 1;
	}
	
	if($is_to_fix) {
		$to_fix_count++;
	}
	
	$new_member_role = tst_get_member_role($user);
	$is_to_fix = 1;	# always fix
	if($is_to_fix && @$_GET['update'] == 'ok') {
		tst_actualize_member_role($user->ID);
		echo 'actualized.<br />';
	}
	
	echo 'member_order_data=' . get_user_meta($user->ID, 'member_order_data', true) . "<br />";
	echo 'member_rating=' . get_user_meta($user->ID, 'member_rating', true) . "<br />";
	echo 'tst_get_user_rating=' . tst_get_user_rating($user) . "<br />";
	echo 'member_role=' . get_user_meta($user->ID, 'member_role', true) . "<br />";
	echo 'new_member_role=' . tst_get_member_role($user) . "<br />";
	echo 'user_created_tasks=' . count(tst_get_user_created_tasks($user->ID)) . "**********<br />";
	echo 'user_working_tasks=' . count(tst_get_user_working_tasks($user->ID)) . "**********<br />";
	
}

echo "<br />to_fix_count=" . $to_fix_count . "<br />";

?>
<br />
***********************************
<br /><br /><br /><br /><br /><br />
