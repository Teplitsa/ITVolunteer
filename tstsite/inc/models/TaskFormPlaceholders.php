<?php
namespace ITV\models;

require_once 'ITVModel.php';

class TaskFormPlaceholders extends ITVSingletonModel {
    protected static $_instance = null;

    public static $post_type = 'task_placeholder';
    public static $post_name_prefix = 'task_field_placeholders_for_';

    public function get_placeholders() {
        $params = array(
            'post_type' => self::$post_type,
            'suppress_filters' => true,
            'nopaging' => true,
        );

        $query = new \WP_Query($params);
        $posts = $query->get_posts();
        $fields_placeholders = [];

        foreach($posts as $k => $post) {
            $placeholders = [];
            if ( has_blocks( $post->post_content ) ) {
                $blocks = parse_blocks( $post->post_content );
                foreach($blocks as $bi => $block) {
                    $block_text = trim( strip_tags( $blocks[$bi]['innerHTML'] ) );
                    if($block_text) {
                        $placeholders[] = $block_text;
                    }
                }
            }

            $phkey = str_replace(self::$post_name_prefix, '', $post->post_name);
            $fields_placeholders[$phkey] = $placeholders;
        }

        return $fields_placeholders;
    }
}
