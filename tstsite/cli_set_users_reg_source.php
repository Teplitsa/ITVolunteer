<?php

include('cli_common.php');

global $sites_emails;

$sites_emails = array();
array_push($sites_emails, itv_get_site_reg_emails(2, 87));	// paseka

array_push($sites_emails, itv_get_site_reg_emails(3, 86));	// kms
array_push($sites_emails, itv_get_site_reg_emails(3, 102));	// kms
array_push($sites_emails, itv_get_site_reg_emails(3, 127));	// kms
array_push($sites_emails, itv_get_site_reg_emails(3, 152));	// kms
array_push($sites_emails, itv_get_site_reg_emails(3, 99));	// kms notif
array_push($sites_emails, itv_get_site_reg_emails(3, 122));	// kms notif
array_push($sites_emails, itv_get_site_reg_emails(3, 147));	// kms notif

array_push($sites_emails, itv_get_site_reg_emails(4, 85));	// audit
array_push($sites_emails, itv_get_site_reg_emails(4, 93));	// audit

array_push($sites_emails, itv_get_site_reg_emails(5, 187));	// nn15
array_push($sites_emails, itv_get_site_reg_emails(5, 85));	// nn15

array_push($sites_emails, itv_get_site_reg_emails(6, 187));	// hackstart
array_push($sites_emails, itv_get_site_reg_emails(6, 85));	// hackstart

array_push($sites_emails, itv_get_site_reg_emails(8, 187));	// ecohack
array_push($sites_emails, itv_get_site_reg_emails(8, 85));	// ecohack

array_push($sites_emails, itv_get_site_reg_emails(10, 187));	// nsk
array_push($sites_emails, itv_get_site_reg_emails(10, 85));	// nsk

array_push($sites_emails, itv_get_site_reg_emails(11, 187));	// ulsk
array_push($sites_emails, itv_get_site_reg_emails(11, 85));	// ulsk

$per_page = 100;
$offset = 0;
$is_stop = false;
while(!$is_stop) {

		
	$users_query_params = array(
			'exclude' => ACCOUNT_DELETED_ID,
			'orderby' => 'user_registered',
			'order' => 'ASC'
	);
	
	$login = @$argv[2];
	if($login) {
		$users_query_params['search'] = $login;
		$users_query_params['search_columns'] = array('user_email');
	}
	
	$user_query = new WP_User_Query($users_query_params);

	$users_count_portion = 0;
		
	
	foreach($user_query->results as $user) {


		$reg_source = tstmu_get_user_reg_source($user->ID);
			$blog_id = itv_get_user_reg_source($user);
			if($blog_id) {
				tstmu_save_user_reg_source($user->ID, $blog_id);
				echo "source name: " . tstmu_get_user_reg_source_name($user->ID) . "\n";
			}
			else {
				tstmu_save_user_reg_source($user->ID, 1);
			}
        
		$users_count_portion += 1;
	}
	
	if($users_count_portion == 0) {
		die("user not found!\n");
	}
		
 	$is_stop = true;	// testing
 	
	if(!$users_count_portion) {
		$is_stop = true;
	}
		
	$offset += $per_page;
}

function itv_get_user_reg_source($user) {
	global $sites_emails;
	foreach($sites_emails as $site_form_emails) {
		if(itv_is_email_reg_on_site_earlier($user, $site_form_emails)) {
			return $site_form_emails['site_id'];
		}
	}
	return 0;
}

function itv_is_email_reg_on_site_earlier($user, $site_emails) {
	if($site_emails['emails'] && is_array($site_emails['emails'])) {
		foreach($site_emails['emails'] as $field) {
			if($field->meta_value == $user->user_email && strtotime($field->created_at) <= strtotime($user->user_registered)) {
				return true;
			}
		}
	}
	return false;
}


function itv_get_site_reg_emails($site_id, $field_id) {
	global $wpdb;

	$kms_data = array('site_id' => $site_id, 'emails' => array());
	$kms_emails = $wpdb->get_results($wpdb->prepare(
			"
			SELECT *
			FROM `str_{$site_id}_frm_item_metas`
			WHERE field_id = %d
	",
	$field_id)
	);
	$kms_data['emails'] = $kms_emails;

	$emails = array();
	foreach($kms_emails as $field) {
		$emails[] = $field->meta_value;
	}


	return $kms_data;
}
