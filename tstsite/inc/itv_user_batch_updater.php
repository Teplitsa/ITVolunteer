<?php

class ItvUserBatchUpdater {
	public function run($wpdb) {
		$users_query_params = array('exclude' => ACCOUNT_DELETED_ID);
		$user_query = new WP_User_Query($users_query_params);
		
		$users_with_site = 0;
		$users_with_new_site = 0;
		foreach($user_query->results as $user) {
			$new_website = $user->user_url;
			if($new_website) {
				$users_with_new_site++;
			}
				
			$old_website = get_user_meta($user->ID, 'user_website', true);
			if($old_website) {
				echo $user->user_nicename . " -- " . $old_website . "\n";
				$users_with_site++;
				$params = array(
						'ID' => $user->ID,
						'user_url' => $old_website,
				);
 				wp_update_user($params);
			}
		}
		
		echo 'users_with_old_site=' . $users_with_site . "\n";
		echo 'users_with_new_site=' . $users_with_new_site . "\n";
	}
}
