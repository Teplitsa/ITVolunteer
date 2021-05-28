<?php

namespace ITV\models;

use \Pelago\Emogrifier\CssInliner;

class Mail
{
    public function setup_atvetka_email($email_name)
    {
        $tax = 'atv_notif_events';
        $source_file_name = $email_name . '.json';
        $source = file_get_contents(get_stylesheet_directory() . '/init/mail/' . $source_file_name);

        if (!$source) {
            \WP_CLI::error(sprintf(__('Failed to get the source file: %s.', 'itv-backend'), $source_file_name));
        }
    
        $email = json_decode($source, true);
    
        if (is_null($email)) {
            \WP_CLI::error(sprintf(__('Failed to decode the %s mail data.', 'itv-backend'), $email_name));
        }        

        $message_title = $email['subject'];
        $message_content = $email['message'];
        $message_content = wpautop( $message_content );	    

        ob_start();
        include(get_template_directory() . '/mail/message_template.php');
        $message_content = ob_get_clean();

        $message_content = CssInliner::fromHtml($message_content)->inlineCss()->render();
        $message_content = preg_replace('/[\r\n]/', '', $message_content);
        $message_content = preg_replace('/%7D/', '}', $message_content);
        $message_content = preg_replace('/%7B/', '{', $message_content);
	    
        $posts_data[] = [
            'post_title' => $message_title,
            'post_content' => $message_content,
            'post_content_raw' => $message_content,
            'post_name' => $email_name,
            'tax_terms' => array(
                $tax => array($email_name),
            ),
        ];

        $terms = array(
            array('slug' => $email_name, 'name' => $email_name,),
        );
	
        \Itv_Setup_Utils::setup_terms_data($terms, $tax);
        \Itv_Setup_Utils::setup_posts_data($posts_data, \ATV_Email_Notification::POST_TYPE);
    }

    public static function replace_password_change_email(array $pass_change_email, array $user, array $userdata)
    {
        $email_data = [
            'email_placeholders' => [
                '{username}' => $user['display_name'],
                '{admin_email}' => \get_option('admin_email'),
                '{user_email}' => $user['user_email'],
                '{mail_icon_url}' => get_template_directory_uri() . "/assets_email/img",
            ],
            'user_id' => $user['ID'],
        ];

        $atv = \ATV_Email_Core::get_instance();

        $emails  = $atv->get_emails( 'change_password' );
        if(empty($emails[0])) {
            return $pass_change_email;
        }

        $email = $emails[0];
        $subject = $email->post_title;
        $message = $atv->handle_placeholders( $email->post_content, $email_data );

        $pass_change_email['subject'] = $subject;
        $pass_change_email['message'] = $message;

        return $pass_change_email;
    }

    public static function replace_retrieve_password_email_message(string $message, string $key, string $user_login, \WP_User $user_data)
    {
        $email_data = [
            'email_placeholders' => [
                '{user_login}' => $user_login,
                '{reset_password_url}' => site_url(sprintf("/reset-password-set?key=%s&login=%s", $key, $user_login)),
                '{mail_icon_url}' => get_template_directory_uri() . "/assets_email/img",
            ],
            'user_id' => $user_data->ID,
        ];

        $atv = \ATV_Email_Core::get_instance();

        $emails  = $atv->get_emails( 'retrieve_password' );
        if(empty($emails[0])) {
            return $message;
        }

        $email = $emails[0];
        $subject = $email->post_title;
        $message = $atv->handle_placeholders( $email->post_content, $email_data );

        return $message;
    }

    public static function replace_retrieve_password_email_subject(string $title, string $user_login, \WP_User $user_data)
    {
        $atv = \ATV_Email_Core::get_instance();

        $emails  = $atv->get_emails( 'retrieve_password' );
        if(empty($emails[0])) {
            return $title;
        }

        $email = $emails[0];
        $title = $email->post_title;

        return $title;
    }
}
