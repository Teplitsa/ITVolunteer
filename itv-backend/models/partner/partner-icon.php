<?php

namespace ITV\models;

class PartnerIcon
{
    public static string $post_type = 'partner_icon';

    public static function get_icon($user_id, $user_meta_name) {
        $partner_icon_post_id = get_user_meta($user_id, $user_meta_name, true);
        $url = "";
        $title = "";
        $description = "";
        if($partner_icon_post_id) {
            $url = get_the_post_thumbnail_url( $partner_icon_post_id, 'full' );
            $post = get_post($partner_icon_post_id);
            if($post) {
                $title = $post->post_title;
                $description = strip_tags($post->post_content);
            }
        }
        return boolval($url) ? [
            'url' => $url,
            'title' => $title,
            'description' => $description,
        ] : null;
    }
}
