<?php

function find_wordpress_base_path()
{
    $dir = dirname(__FILE__);
    do {
        if (file_exists($dir . "/wp-config.php")) {
            return $dir;
        }
    } while ($dir = realpath("$dir/.."));
    return null;
}

function echo_start_text()
{
    date_default_timezone_set('Europe/Moscow');
    echo "datetime: " . date('Y-m-d H:i:s') . "\n";
}

function echo_end_text()
{
    date_default_timezone_set('Europe/Moscow');
    echo "done: " . date('Y-m-d H:i:s') . "\n";
}

function itv_get_post($post_id, $post_type = 'post')
{
    global $wpdb;
    $post = null;
    if (preg_match('/^\d+$/', $post_id)) {
        $post = get_post($post_id, OBJECT);
    } else {
        $post_id = $wpdb->get_var(
            $wpdb->prepare(
                "SELECT ID FROM {$wpdb->posts} WHERE post_name = %s AND post_type = %s LIMIT 1 ",
                $post_id,
                $post_type
            )
        );
        if ($post_id) {
            $post = get_post($post_id, OBJECT);
        }
    }
    return $post;
}

function itv_set_theme_mod_safe($name, $val, $force = false)
{
    if (!get_theme_mod($name) || ITV_FORCE_THEME_MOD_SETUP || $force) {
        set_theme_mod($name, $val);
    }
}

class Itv_Setup_Utils
{

    public static function setup_posts_data($posts_data, $post_type = 'post')
    {
        $post_id_list = array();
        foreach ($posts_data as $post_data) {
            $post_id = self::setup_post_data($post_data, $post_type);
            $post_id_list[] = $post_id;
        }

        return $post_id_list;
    }

    public static function setup_post_data($post_data, $post_type = 'post')
    {
        global $wpdb;

        $post_data['post_type'] = $post_type;
        $post_data['post_status'] = 'publish';

        $post_name = empty($post_data['post_name']) ? sanitize_title($post_data['post_title']) : $post_data['post_name'];
        $exist_post = itv_get_post($post_name, $post_type);

        if ($exist_post) {
            $post_data['ID'] = $exist_post->ID;
        }

        $post_id = wp_insert_post($post_data);

        if (!empty($post_data['post_content_raw'])) {
            $wpdb->update(
                $wpdb->posts,
                array(
                    'post_content' => $post_data['post_content_raw'],
                ),
                array('ID' => $post_id),
                array(
                    '%s',
                ),
                array('%d')
            );
        }

        if (!empty($post_data['meta'])) {
            foreach ($post_data['meta'] as $k => $v) {
                update_post_meta($post_id, $k, $v);
            }
        }

        if (!empty($post_data['thumbnail_path'])) {
            $attachment_id = TST_Import::get_instance()->maybe_import_local_file(get_template_directory() . $post_data['thumbnail_path']);
            echo get_template_directory() . $post_data['thumbnail_path'] . "\n";
            echo "attachment_id=$attachment_id\n";
            set_post_thumbnail($post_id, $attachment_id);
        }

        if (!empty($post_data['tax_terms'])) {
            foreach ($post_data['tax_terms'] as $tax => $terms) {
                wp_set_object_terms($post_id, $terms, $tax, true);
            }
        }

        return $post_id;
    }

    public static function setup_terms_data($terms_data, $tax)
    {
        foreach ($terms_data as $category) {
            $term = get_term_by('slug', $category['slug'], $tax);
            if ($term === false) {
                $term_id = wp_insert_term($category['name'], $tax, $category);
            } else {
                $term_id = $term->term_id;
            }

            if (!empty($category['meta'])) {
                foreach ($category['meta'] as $k => $v) {
                    update_term_meta($term_id, $k, $v);
                }
            }
        }
    }

    public static function upload_locale_media(string $src, string $alt = "", string $attachment_title = "", int $attachment_parent_id = 0): int
    {
        $filename = basename($src);

        $upload_file = wp_upload_bits($filename, null, file_get_contents($src));

        if (!$upload_file['error']) {
            $wp_filetype = wp_check_filetype($filename, null);

            $attachment = array(
                'post_mime_type' => $wp_filetype['type'],
                'post_parent'    => $attachment_parent_id,
                'post_title'     => $attachment_title ? $attachment_title : ($alt ? $alt : preg_replace('/\.[^.]+$/', '', $filename)),
                'post_content'   => '',
                'post_status'    => 'inherit'
            );

            $attachment_id = wp_insert_attachment($attachment, $upload_file['file'], $attachment_parent_id);

            if (!is_wp_error($attachment_id)) {
                require_once(ABSPATH . "wp-admin" . '/includes/image.php');

                $attachment_data = wp_generate_attachment_metadata($attachment_id, $upload_file['file']);

                wp_update_attachment_metadata($attachment_id,  $attachment_data);

                update_post_meta(
                    $attachment_id,
                    '_wp_attachment_image_alt',
                    $alt
                );

                return $attachment_id;
            }

            return 0;
        }

        return 0;
    }
}

