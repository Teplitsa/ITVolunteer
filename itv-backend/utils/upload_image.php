<?php

namespace ITV\utils;

function upload_image(array $image_props): ?int
{
    ['url' => $url, 'attached_to' => $attached_to, 'desc' => $desc] = $image_props;

    require_once ABSPATH . 'wp-admin/includes/media.php';
    require_once ABSPATH . 'wp-admin/includes/file.php';
    require_once ABSPATH . 'wp-admin/includes/image.php';

    $img_id = media_sideload_image(get_stylesheet_directory_uri() . $url, $attached_to, $desc, 'id');

    if (!is_wp_error($img_id)) {
        return $img_id;
    }

    return null;
}
