<?php
/**
 * Common functions and manipulations
 * (code wiil be modevd here from customizer.php and extras.php)
 ***/

use ITV\models\MailSendLogModel;
use WPGraphQL\JWT_Authentication;

/** Add SVG to allowed file uploads */

add_filter('upload_mimes', 'itv_svg_mime_type');

function itv_svg_mime_type($mimes = array())
{
    $mimes['svg']  = 'image/svg';
    $mimes['svgz'] = 'image/svg';

    return $mimes;
}

/** WPGraphQl JWT */

add_filter("graphql_jwt_auth_secret_key", function() {
    return '!aoRS- P`:Dl$swR+lx{<W+Sb%*9{G}:rn<+a_gie({xk~R-5d4c8yj2OmMkq0+P';
});

add_action("admin_init", "wp_ajax_login_by_auth_token");

function wp_ajax_login_by_auth_token()
{
    if (wp_doing_ajax() && !is_user_logged_in()) {
        switch ($_REQUEST["action"]) {
            case "publish-task":
            case "unpublish-task":
            case "approve-candidate":
            case "decline-candidate":
            case "submit-comment":
            case "like-comment":
            case "add-candidate":
            case "get-task-timeline":
            case "get-task-reviews":
            case "leave-review":
            case "leave-review-author":
            case "accept-close-date":
            case "reject-close-date":
            case "accept-close":
            case "reject-close":
            case "suggest-close-date":
            case "suggest-close-task":
            case "add-message":
                $_POST["auth_token"] = $_POST["auth_token"] ?? null;
                try {
                    $token = WPGraphQL\JWT_Authentication\Auth::validate_token($_POST["auth_token"]);
                    if (is_wp_error($token)) {
                        throw new Exception();
                    }
                    $user_id = $token->data->user->id;
                    if($user_id) {
                        wp_set_current_user($user_id);
                    }
                } catch (Exception $error) {
                    wp_die(json_encode(array(
                        "status" => "fail",
                        "message" => __("Unauthorized request.", "tst"),
                    )));
                }
                break;
        }
    }
}

/** Favicon  **/
function itv_favicon(){
	
	$favicon_test = get_template_directory(). '/favicon.ico'; //in the root not working don't know why
    if(!file_exists($favicon_test))
        return;
        
    $favicon = get_template_directory_uri(). '/favicon.ico';
	echo "<link href='{$favicon}' rel='shortcut icon' type='image/x-icon' >";
}
add_action('wp_enqueue_scripts', 'itv_favicon', 1);
add_action('admin_enqueue_scripts', 'itv_favicon', 1);
add_action('login_enqueue_scripts', 'itv_favicon', 1);


/** Default filters  **/
add_filter( 'frl_the_content', 'wptexturize'        );
add_filter( 'frl_the_content', 'convert_smilies'    );
add_filter( 'frl_the_content', 'convert_chars'      );
add_filter( 'frl_the_content', 'wpautop'            );
add_filter( 'frl_the_content', 'shortcode_unautop'  );
add_filter( 'frl_the_content', 'do_shortcode' );


add_filter( 'frl_the_title', 'wptexturize'   );
add_filter( 'frl_the_title', 'convert_chars' );
add_filter( 'frl_the_title', 'trim'          );


/** Widgets **/
function tst_custom_widgets(){

	unregister_widget('WP_Widget_Pages');
	unregister_widget('WP_Widget_Archives');
	unregister_widget('WP_Widget_Calendar');
	unregister_widget('WP_Widget_Meta');
	unregister_widget('WP_Widget_Categories');
	unregister_widget('WP_Widget_Tag_Cloud');
	unregister_widget('FrmListEntries');

}
add_action('widgets_init', 'tst_custom_widgets', 11);


/** Notification about KMS **/
add_filter('itv_notification_badge', 'itv_notification_badge_screen');
function itv_notification_badge_screen(){
	
	$content = apply_filters('itv_notification_badge_content', '');
	
	if(empty($content))
		return '';
	
	return "<span class='badge'>{$content}</span>";	
}

add_filter('itv_notification_bar', 'itv_notification_bar_screen');
function itv_notification_bar_screen(){
	
	$content = apply_filters('itv_notification_bar_content', '');
	if(empty($content))
		return '';
	
	if($request->request == 'tasks') {
		$redirect = get_post_type_archive_link('tasks');
		wp_redirect($redirect);
		exit;
	}
}


/* Query customization */
add_action('parse_query', 'tst_query_corrections');
function tst_query_corrections(WP_Query $query){
    return ITV_Query::get_instance()->query_corrections($query);
}

function itv_fill_template($template, $data) {
    return preg_replace_callback ( '/\{\{(\w+)\}\}/i', function($matches) use($data) {
        return isset($matches[1]) && isset($data[$matches[1]]) ? $data[$matches[1]] : '';
    }, $template );
}

/* seo meta fixes */
add_filter( 'wpseo_canonical', 'itv_wpseo_canonical', 10, 1 );
function itv_wpseo_canonical( $canonical ) {
    if( is_single_member() ) {
        $tst_member = tst_get_current_member();
        if($tst_member) {
            $canonical = tst_get_member_url($tst_member);
        }
    }
    return $canonical;
}

add_filter( 'wpseo_metadesc', 'itv_wpseo_metadesc', 10, 1 );
function itv_wpseo_metadesc( $desc ) {
    if( is_single_member() ) {
        $tst_member = tst_get_current_member();
        if($tst_member) {
            $desc = trim(tst_get_member_field('user_bio', $tst_member));
            $desc .= ' ' . sprintf(__('User can do %s', 'tst'), tst_get_member_user_skills_string($tst_member->ID));
            $desc = trim($desc);
        }
    }
    return $desc;
}

add_filter( 'wpseo_opengraph_author_facebook', 'itv_wpseo_author_link', 10, 1 );
function itv_wpseo_author_link( $link ) {
    $author_url = false;
    if( is_single_member() ) {
        $tst_member = tst_get_current_member();
        if($tst_member) {
            $author_url = get_user_meta($tst_member->ID, 'facebook', true);
            if(!$author_url) {
                $author_url = tst_get_member_url($tst_member);
            }
        }
    }
    return $author_url;
}

/* html email with cc */
function itv_html_email_with_cc($to, $subject, $message, $other_emails = [], $email_from = '') {
    if(!$email_from) {
        $email_from = \ItvConfig::instance()->get('EMAIL_FROM');
    }
    $headers  = 'MIME-Version: 1.0' . "\r\n";
    $headers .= 'Content-type: text/html; charset=UTF-8' . "\r\n";
    $headers .= 'From: ' . __('ITVounteer', 'tst') . ' <'.$email_from.'>' . "\r\n";
    
    if(is_array($to)) {
        $other_emails = array_slice($to, 1);
        $to = $to[0];
    }
    
    if(count($other_emails) > 0) {
        $headers .= 'Cc: ' . implode(', ', $other_emails) . "\r\n";
    }
    
    return wp_mail($to, $subject, $message, $headers);
}

function itv_notify_user( $user, $notification_id, $params, $task = NULL ) {
    ItvAtvetka::instance()->mail($notification_id, array_merge([
        'mailto' => $user->user_email,
    ], $params));
    
    $itv_log = ItvLog::instance ();
    $itv_log->log_email_action( 'email_' . $notification_id, $user->ID, ItvEmailTemplates::instance()->get_title($notification_id), $task ? $task->ID : 0 );
}

function itv_wp_mail_log( $args ) {
    MailSendLogModel::instance()->log_send_action( $args );
}
add_filter( 'wp_mail', 'itv_wp_mail_log' );

function itv_show_404() {
	status_header( 404 );
	nocache_headers();
	get_template_part( '404' );
	die();
}

function ajax_upload_file() {
  $member = wp_get_current_user();
  
  $res = null;
  if(!$member) {
    $res = array(
      'status' => 'error',
      'message' => 'restricted method',
    );
  }
  else {
    $files = [];

    $file_counter = 0;
    while(!empty($_FILES['file_' . $file_counter])) {
      $image_id = media_handle_upload( 'file_' . $file_counter, 0 );
      if( $image_id ) {
        $files[] = array(
          'file_id' => $image_id,
          'file_url' => wp_get_attachment_url( $image_id ),
        );
      }
      $file_counter += 1;
    }

    if(empty($files)) {
      $res = array(
        'status' => 'error',
        'message' => 'upload error',
      );
    }
    else {
      $res = array(
        'status' => 'ok',
        'files' => $files,
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
add_action('wp_ajax_upload-file', 'ajax_upload_file');

function itv_urls2links($text) {
  preg_match_all("/(http[s]?:\/\/\S*)/", $text, $matches);

  $offset = 0;
  foreach($matches[1] as $url) {
    $url_len = strlen($url);
    $url_pos = strpos($text, $url, $offset);
    $a_tag = "<a href=\"$url\" target=\"_blank\">$url</a>";
    $a_tag_len = strlen($a_tag);

    $text = substr_replace($text, $a_tag, $url_pos, $url_len);
    $offset = $url_pos + $a_tag_len;
  }

  return $text;
}