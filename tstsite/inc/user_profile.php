<?php
use ITV\models\UserXPModel;

// company logo
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
	
	if($res === null) {
		$res = array(
			'status' => 'error',
			'message' => 'unkown error',
		);
	}
	
	wp_die(json_encode($res));
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

      $img_url_data = wp_get_attachment_image_src( $image_id, 'thumbnail');
      $img_url = $img_url_data ? $img_url_data[0] : '';

			$res = array(
				'status' => 'ok',
				'image' => str_replace(array('<', '>'), '', wp_get_attachment_image( $image_id, 'logo' )),
        'imageUrl' => $img_url,
			);
		} else {
			$res = array(
				'status' => 'error',
				'message' => 'upload image error',
			);
		}
	}
	
	if($res === null) {
		$res = array(
			'status' => 'error',
			'message' => 'unkown error',
		);
	}
	
	wp_die(json_encode($res));
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

function tst_get_member_user_company_logo_src($member_id) {
    $image_id = get_user_meta($member_id, 'user_company_logo', true);
    $res = '';
    if($image_id) {
        $res = wp_get_attachment_image_src( $image_id, 'logo' );
        $res = $res ? $res[0] : '';
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
      update_user_meta($member->ID, 'user_avatar', '');
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

	if($res === null) {
		$res = array(
				'status' => 'error',
				'message' => 'unkown error',
		);
	}

	wp_die(json_encode($res));
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
			UserXPModel::instance()->register_activity_from_gui($member->ID, UserXPModel::$ACTION_UPLOAD_PHOTO);
						
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

	if($res === null) {
		$res = array(
				'status' => 'error',
				'message' => 'unkown error',
		);
	}

	wp_die(json_encode($res));
}
add_action('wp_ajax_upload-user-avatar', 'ajax_upload_user_avatar');

function ajax_upload_user_avatar_v2() {
  $member = wp_get_current_user();

  $res = null;
  if(!$member) {
    $res = array(
        'status' => 'error',
        'message' => 'restricted method',
    );
  }
  else {
    // error_log(print_r($_FILES, true));
    $image_id = media_handle_upload( 'user_avatar', 0 );
    $attach_data = wp_generate_attachment_metadata( $image_id, get_attached_file( $image_id ) );
    wp_update_attachment_metadata( $image_id,  $attach_data );
        
    if( $image_id ) {
      update_user_meta($member->ID, 'user_avatar', $image_id);
      UserXPModel::instance()->register_activity_from_gui($member->ID, UserXPModel::$ACTION_UPLOAD_PHOTO);
            
      $res = array(
          'status' => 'ok',
          'imageUrl' => itv_avatar_url( $member->ID ),
          'imageFile' => itv_get_user_file($member->ID, 'user_avatar'),
      );
    } else {
      $res = array(
          'status' => 'error',
          'message' => 'upload image error',
      );
    }
  }

  if($res === null) {
    $res = array(
        'status' => 'error',
        'message' => 'unkown error',
    );
  }

  wp_die(json_encode($res));
}
add_action('wp_ajax_upload-user-avatar-v2', 'ajax_upload_user_avatar_v2');

function ajax_upload_user_cover() {
  $member = wp_get_current_user();

  $res = null;
  if(!$member) {
    $res = array(
        'status' => 'error',
        'message' => 'restricted method',
    );
  }
  else {
    $image_id = media_handle_upload( 'user_cover', 0 );
    $attach_data = wp_generate_attachment_metadata( $image_id, get_attached_file( $image_id ) );
    wp_update_attachment_metadata( $image_id,  $attach_data );
        
    if( $image_id ) {
      update_user_meta($member->ID, 'user_cover', $image_id);
            
      $res = array(
          'status' => 'ok',
          'imageUrl' => itv_member_cover_url( $member->ID ),
          'imageFile' => itv_get_user_file($member->ID, 'user_cover'),
      );
    } else {
      $res = array(
          'status' => 'error',
          'message' => 'upload image error',
      );
    }
  }

  if($res === null) {
    $res = array(
        'status' => 'error',
        'message' => 'unkown error',
    );
  }

  wp_die(json_encode($res));
}
add_action('wp_ajax_upload-user-cover', 'ajax_upload_user_cover');

function ajax_delete_user_cover() {
  $member = wp_get_current_user();

  $res = null;
  if(!$member) {
    $res = array(
        'status' => 'error',
        'message' => 'restricted method',
    );
  }
  else {
    $image_id = get_user_meta($member->ID, 'user_cover', true);
    if( $image_id ) {
      wp_delete_attachment( $image_id, true );
      update_user_meta($member->ID, 'user_cover', '');
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

  if($res === null) {
    $res = array(
        'status' => 'error',
        'message' => 'unkown error',
    );
  }

  wp_die(json_encode($res));
}
add_action('wp_ajax_delete-user-cover', 'ajax_delete_user_cover');

// user skills
function tst_get_user_skills($member_id) {
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
	$skills_exclude_categories = array('prochee', 'materials');
	foreach($categories as $category) {
		if(array_search($category->slug, $skills_exclude_categories) === false) {
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
	<input type="checkbox" name="user_skill" class="user_skill" value="<?php echo $skill['term_id']?>" <?php if($skill['checked']):?>checked="true"<?php endif; ?> /> <?php echo $skill['cat_name']; ?>
	</label>
	</div></div>
<?php }
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

// SEO Title 
add_filter( 'wpseo_title', 'itv_user_profile_seo_title');
function itv_user_profile_seo_title($title) {
	
	if(is_single_member()){
		$tst_member = tst_get_current_member();
		if($tst_member->ID) {
			
			$title = sprintf(__('Member: %s', 'tst'), frl_page_title());
			$org = get_user_meta($tst_member->ID, 'user_workplace', true);
			if($org){
				$title .= " / ".esc_attr($org);
			}
			$title .= ' - '.get_bloginfo('name');
		}
	}
	
	return $title;

}

