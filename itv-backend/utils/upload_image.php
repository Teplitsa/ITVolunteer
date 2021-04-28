<?php

namespace ITV\utils;

function upload_image(array $image_props): ?int
{
    ['url' => $url, 'attached_to' => $attached_to, 'desc' => $desc] = $image_props;

    $url_filename = basename(parse_url($url, PHP_URL_PATH));

    $upload_file = \wp_upload_bits($url_filename, null, file_get_contents(\get_stylesheet_directory() . $url));

    if (!$upload_file['error']) {

        $mime = \wp_check_filetype($url_filename, null);

        $attachment = array(
            'post_mime_type' => $mime['type'],
            'post_parent'    => $attached_to,
            'post_title'     => $desc,
            'post_content'   => '',
            'post_status'    => 'inherit'
        );

        $attachment_id = \wp_insert_attachment($attachment, $upload_file['file'], $attached_to);

        if (!\is_wp_error($attachment_id)) {

            require_once(ABSPATH . "wp-admin" . '/includes/image.php');

            $attachment_data = \wp_generate_attachment_metadata($attachment_id, $upload_file['file']);

            \wp_update_attachment_metadata($attachment_id, $attachment_data);

            return $attachment_id;
        }
    }

    return null;
}
