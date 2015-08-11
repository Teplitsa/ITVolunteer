<?php

class ItvUserRegSourceDetector {
	private $_wpdb;
	
	public function run($wpdb) {
		$this->_wpdb = $wpdb;
		
		$sites_emails = $this->get_sites_users_data();
		$this->detect_and_save_reg_source($sites_emails);
	}
	
	private function get_sites_users_data() {
		$sites_emails = array();
		array_push($sites_emails, $this->itv_get_site_reg_emails(2, 87)); // paseka
		
		array_push($sites_emails, $this->itv_get_site_reg_emails(3, 86)); // kms
		array_push($sites_emails, $this->itv_get_site_reg_emails(3, 102)); // kms
		array_push($sites_emails, $this->itv_get_site_reg_emails(3, 127)); // kms
		array_push($sites_emails, $this->itv_get_site_reg_emails(3, 152)); // kms
		array_push($sites_emails, $this->itv_get_site_reg_emails(3, 99)); // kms notif
		array_push($sites_emails, $this->itv_get_site_reg_emails(3, 122)); // kms notif
		array_push($sites_emails, $this->itv_get_site_reg_emails(3, 147)); // kms notif
		
		array_push($sites_emails, $this->itv_get_site_reg_emails(4, 85)); // audit
		array_push($sites_emails, $this->itv_get_site_reg_emails(4, 93)); // audit
		
		array_push($sites_emails, $this->itv_get_site_reg_emails(5, 187)); // nn15
		array_push($sites_emails, $this->itv_get_site_reg_emails(5, 85)); // nn15
		
		array_push($sites_emails, $this->itv_get_site_reg_emails(6, 187)); // hackstart
		array_push($sites_emails, $this->itv_get_site_reg_emails(6, 85)); // hackstart
		
		array_push($sites_emails, $this->itv_get_site_reg_emails(8, 187)); // ecohack
		array_push($sites_emails, $this->itv_get_site_reg_emails(8, 85)); // ecohack
		
		array_push($sites_emails, $this->itv_get_site_reg_emails(10, 187)); // nsk
		array_push($sites_emails, $this->itv_get_site_reg_emails(10, 85)); // nsk
		
		array_push($sites_emails, $this->itv_get_site_reg_emails(11, 187)); // ulsk
		array_push($sites_emails, $this->itv_get_site_reg_emails(11, 85)); // ulsk
		
		return $sites_emails;
	}
	
	private function detect_and_save_reg_source($sites_emails) {
				
		$users_query_params = array(
				'exclude' => ACCOUNT_DELETED_ID,
				'orderby' => 'user_registered',
				'order' => 'ASC'
		);
	
		$user_query = new WP_User_Query($users_query_params);
		
		$users_count_portion = 0;
		foreach ($user_query->results as $user) {
			$blog_id = $this->itv_get_user_reg_source($user, $sites_emails);
			if ($blog_id) {
				tstmu_save_user_reg_source($user->ID, $blog_id);
			} else {
				tstmu_save_user_reg_source($user->ID, 1);
			}
			$users_count_portion += 1;
		}
	}

	private function itv_get_user_reg_source($user, $sites_emails) {
		foreach ($sites_emails as $site_form_emails) {
			if ($this->itv_is_email_reg_on_site_earlier($user, $site_form_emails)) {
				return $site_form_emails['site_id'];
			}
		}
		return 0;
	}
	
	private function itv_is_email_reg_on_site_earlier($user, $site_emails) {
		if ($site_emails['emails'] && is_array($site_emails['emails'])) {
			foreach ($site_emails['emails'] as $field) {
				if ($field->meta_value == $user->user_email && strtotime($field->created_at) <= strtotime($user->user_registered)) {
					return true;
				}
			}
		}
		return false;
	}
	
	private function itv_get_site_reg_emails($site_id, $field_id) {
		$wpdb = $this->_wpdb;
	
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
	
		return $kms_data;
	}
	
}
