<?php

# company logo
function ajax_delete_user_company_logo() {
	$member = wp_get_current_user();
	
	$res = null;
	if(!$member) {
		$res = array(
			'status' => 'error',
			'message' => 'restricted method',
		);
	}
	else {
		$image_id = get_user_meta($member->ID, 'user_company_logo', true);
		if( $image_id ) {
			wp_delete_attachment( $image_id, true );
			$res = array(
				'status' => 'ok',
			);
		} else {
			$res = array(
				'status' => 'error',
				'message' => 'image not found',
			);
		}
	}
	
	if(!$res) {
		$res = array(
			'status' => 'error',
			'message' => 'unkown error',
		);
	}
	
	die(json_encode($res));
}
add_action('wp_ajax_delete-user-company-logo', 'ajax_delete_user_company_logo');

function ajax_upload_user_company_logo() {
	$member = wp_get_current_user();
	
	$res = null;
	if(!$member) {
		$res = array(
			'status' => 'error',
			'message' => 'restricted method',
		);
	}
	else {
		$image_id = media_handle_upload( 'user_company_logo', 0 );
		if( $image_id ) {
			update_user_meta($member->ID, 'user_company_logo', $image_id);
			$res = array(
				'status' => 'ok',
				'image' => str_replace(array('<', '>'), '', wp_get_attachment_image( $image_id, 'logo' )),
			);
		} else {
			$res = array(
				'status' => 'error',
				'message' => 'upload image error',
			);
		}
	}
	
	if(!$res) {
		$res = array(
			'status' => 'error',
			'message' => 'unkown error',
		);
	}
	
	die(json_encode($res));
}
add_action('wp_ajax_upload-user-company-logo', 'ajax_upload_user_company_logo');

function tst_get_member_user_company_logo($member_id) {
	$image_id = get_user_meta($member_id, 'user_company_logo', true);
	$res = '';
	if($image_id) {
		$res = wp_get_attachment_image( $image_id, 'logo' );
	}
	return $res;
}

# user avatar
function ajax_delete_user_avatar() {
	$member = wp_get_current_user();

	$res = null;
	if(!$member) {
		$res = array(
				'status' => 'error',
				'message' => 'restricted method',
		);
	}
	else {
		$image_id = get_user_meta($member->ID, 'user_avatar', true);
		if( $image_id ) {
			wp_delete_attachment( $image_id, true );
			$res = array(
					'status' => 'ok',
			);
		} else {
			$res = array(
					'status' => 'error',
					'message' => 'image not found',
			);
		}
	}

	if(!$res) {
		$res = array(
				'status' => 'error',
				'message' => 'unkown error',
		);
	}

	die(json_encode($res));
}
add_action('wp_ajax_delete-user-avatar', 'ajax_delete_user_avatar');

function ajax_upload_user_avatar() {
	$member = wp_get_current_user();

	$res = null;
	if(!$member) {
		$res = array(
				'status' => 'error',
				'message' => 'restricted method',
		);
	}
	else {
		$image_id = media_handle_upload( 'user_avatar', 0 );
		$attach_data = wp_generate_attachment_metadata( $image_id, get_attached_file( $image_id ) );
		wp_update_attachment_metadata( $image_id,  $attach_data );
				
		if( $image_id ) {
			update_user_meta($member->ID, 'user_avatar', $image_id);
			$res = array(
					'status' => 'ok',
					'image' => str_replace(array('<', '>'), '', wp_get_attachment_image( $image_id, 'avatar' )),
			);
		} else {
			$res = array(
					'status' => 'error',
					'message' => 'upload image error',
			);
		}
	}

	if(!$res) {
		$res = array(
				'status' => 'error',
				'message' => 'unkown error',
		);
	}

	die(json_encode($res));
}
add_action('wp_ajax_upload-user-avatar', 'ajax_upload_user_avatar');


# user skills
$ITV_USER_SKILLS_EXCLUDE_CATEGORIES = array('prochee', 'materials');

function tst_get_user_skills($member_id) {
	global $ITV_USER_SKILLS_EXCLUDE_CATEGORIES;
	$user_skills = get_user_meta($member_id, 'user_skills', true);
	if(!is_array($user_skills)) {
		$user_skills = $user_skills ? array($user_skills) : array();
	}
	
	$categories = get_categories(array(
		'taxonomy' => 'category',
		'hide_empty' => 0,
	));
	
	$categories_filtered = array();
	$parent_categories = array();
	foreach($categories as $category) {
		if(array_search($category->slug, $ITV_USER_SKILLS_EXCLUDE_CATEGORIES) === false) {
			$category_hash = (array)$category;
			$category_hash['checked'] = array_search($category->term_id, $user_skills) === false ? false : true;
			if($category->parent) {
				$parent_categories[$category->parent] = 1;
			}
			$categories_filtered[] = $category_hash;
		}
	}
	
	$categories = array();
	foreach($categories_filtered as $category) {
		if(!isset($parent_categories[$category['term_id']])) {
			$categories[] = $category;
		}
	}
	
	usort($categories, function($a, $b){
		return $a['parent'] > $b['parent'] ? -1 : 1;
	});
	
	return $categories;
}

function tst_show_user_skills($skills) {
	foreach($skills as $skill) {
		?>
			<div class="form-group"><div class="checkbox">
			<label>		
			<input type="checkbox" name="user_skill" class="user_skill" value="<?=$skill['term_id']?>" <?if($skill['checked']):?>checked="true"<?endif?> /> <?=$skill['cat_name']?>
			</label>
			</div></div>
		<?
	}
}

function tst_get_member_user_skills_string($member_id) {
	$user_skills = tst_get_user_skills($member_id);
	$actual_user_skills = array();
	foreach($user_skills as $skill) {
		if($skill['checked']) {
			$actual_user_skills[] = $skill['cat_name'];
		}
	}
	return implode(', ', $actual_user_skills);
}


/* SEO Title */
add_filter( 'wpseo_title', 'itv_user_profile_seo_title');
function itv_user_profile_seo_title($title) {
	
	if(is_single_member()){
		$tst_member = get_user_by('slug', get_query_var('membername'));
		if($tst_member ) {
			
			$title = sprintf(__('Member: %s', 'tst'), frl_page_title());
			$org = get_user_meta($tst_member->__get('ID'), 'user_workplace', true);
			if($org){
				$title .= " / ".esc_attr($org);
			}
			$title .= ' - '.get_bloginfo('name');
		}
	}
	
	return $title;
}
