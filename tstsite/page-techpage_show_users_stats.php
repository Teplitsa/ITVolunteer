
<br />
***********************************
<br /><br />

<?php

add_action('pre_user_query', function(WP_User_Query $query){
	
	if(@$_GET['user']) {
		return;
	}
	
	global $wpdb;
	
	$query->query_fields = " SQL_CALC_FOUND_ROWS {$wpdb->users}.* ";
	$query->query_from = " FROM {$wpdb->users}
	INNER JOIN {$wpdb->usermeta} wp_usermeta ON ({$wpdb->users}.ID = wp_usermeta.user_id)
	INNER JOIN {$wpdb->usermeta} wp_usermeta2 ON ({$wpdb->users}.ID = wp_usermeta2.user_id)
	";
	$query->query_where = " WHERE 1=1 AND wp_usermeta.meta_key = 'member_rating' AND wp_usermeta2.meta_key = 'member_order_data' ";
	$query->query_orderby = " ORDER BY wp_usermeta.meta_value DESC, wp_usermeta2.meta_value ASC";

}, 100);


$user_login = @$_GET['user'];

$users_query_params = array(
    'number' => 10,
    'offset' => $offset,
    'exclude' => ACCOUNT_DELETED_ID,
);

if($user_login) {
	$users_query_params['search'] = $user_login;
	$users_query_params['search_columns'] = array('user_login', 'user_nicename');
}

$user_query = new WP_User_Query($users_query_params);

foreach($user_query->results as $user) {
	
	echo "==========" . $user->user_login . "<br />";
	echo 'member_order_data=' . get_user_meta($user->ID, 'member_order_data', true) . "<br />";
	echo 'member_rating=' . get_user_meta($user->ID, 'member_rating', true) . "<br />";
	echo 'tst_get_user_rating=' . tst_get_user_rating($user) . "<br />";
	echo 'member_role=' . get_user_meta($user->ID, 'member_role', true) . "<br />";
	echo 'new_member_role=' . tst_get_member_role($user) . "<br />";
	echo 'user_created_tasks=' . count(tst_get_user_created_tasks($user->ID)) . "**********<br />";
	echo 'user_working_tasks=' . count(tst_get_user_working_tasks($user->ID)) . "**********<br />";
	
}

?>
<br />
***********************************
<br /><br /><br /><br /><br /><br />
