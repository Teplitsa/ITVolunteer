<?php if( !defined('WPINC') ) die;

function tstmu_save_user_reg_source($user_id, $site_id) {
	update_user_meta($user_id, 'reg_source', $site_id);
}

function tstmu_get_user_reg_source($user_id) {
	return get_user_meta($user_id, 'reg_source', true);
}

function tstmu_get_user_reg_source_name($user_id, $sites = null) {
	global $wpdb;
	
	$source_id = tstmu_get_user_reg_source($user_id);
	
	$name = false;
	if($sites && $source_id) {
		foreach($sites as $site) {
			if($site->blog_id == $source_id) {
				$name = $site->path;
				break;
			}
		}
	}
	elseif($source_id) {
		$site = $wpdb->get_row($wpdb->prepare(
				"
				SELECT *
				FROM `str_blogs`
				WHERE blog_id = %d
				",
				$source_id)
		);
		if($site) {
			$name = $site->path;
		}
	}
	
	if($name) {
		if($name == '/') {
			$name = 'itv';
		}
		$name = preg_replace('/^\//', '', $name);
		$name = preg_replace('/\/$/', '', $name);
	}
	else {
		$name = 'unknown';
	}
	
	return $name;
}

