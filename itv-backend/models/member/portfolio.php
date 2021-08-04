<?php
namespace ITV\models;

class PortfolioWork {
    public $post;

    public function __construct($post) {

        if((is_int($post) || is_string($post)) && absint($post)) {

            $post = absint($post);
            $this->post = get_post($post);

            if( !$this->post || $this->post->post_type !== PortfolioWorkManager::$post_type ) {
                return null;
            }

        } else if(is_a($post, 'WP_Post')) {

            if($post->post_type !== PortfolioWorkManager::$post_type) {
                return null;
            }

            $this->post = $post;

        } else {
            return null;
        }
    }    
}

class PortfolioWorkManager {
    public static $post_type = 'portfolio_work';

    // meta
    public static $meta_image_id = 'portfolio_image_id';

    public static $FIELD_NEXT_WORK_SLUG = 'next_work_slug';
    public static $FIELD_PREV_WORK_SLUG = 'prev_work_slug';

    public static $rest_context_portfolio_edit = 'portfolio_edit';

    public function get_property($response_data, $property_name, $request) {
        $value = null;
        $post_id = $response_data['id'];
        $post_author_id = $response_data['author'];
        $post_date = $response_data['date'];

        switch($property_name) {
            case self::$FIELD_NEXT_WORK_SLUG:
                $next_post = $this->get_author_next_work( $post_date, $post_author_id );
                $value = $next_post ? $next_post->post_name : "";
                break;

            case self::$FIELD_PREV_WORK_SLUG:
                $prev_post = $this->get_author_prev_work( $post_date, $post_author_id );
                $value = $prev_post ? $prev_post->post_name : "";
                break;
        }
        
        return $value;
    }

    public function get_author_next_work($post_date, $post_author_id) {
        $args = array(
            'post_type'         => self::$post_type,
            'author'            => $post_author_id,
            'posts_per_page'    => 1,
            'date_query' => [
                'before' => $post_date,
            ],
        );

        $posts = get_posts($args);

        return $posts[0] ?? null;
    }

    public function get_author_prev_work($post_date, $post_author_id) {
        $args = array(
            'post_type'         => self::$post_type,
            'author'            => $post_author_id,
            'posts_per_page'    => 1,
            'date_query' => [
                'after' => $post_date,
            ],
            'orderby' => ['date', 'id'],
            'order' => ['ASC', 'ASC'],
        );

        $posts = get_posts($args);

        return $posts[0] ?? null;        
    }
    
    public function count_member_portfolio_works($user_id) {
        $args = array(
            'post_author'       => $user_id,
            'post_type'         => PortfolioWorkManager::$post_type,
            'suppress_filters'  => true,
            'post_status'       => 'any',
            'posts_per_page'    => 1,
            'fields'            => 'ids',
        );
            
        $query = new WP_Query($args);
        return $query->found_posts;    
    }
}


function itv_add_xp_for_portfolio($post_id, $post, $update) {
    $doer_id = get_current_user_id();
    if(!$update && $doer_id) {
        UserXPModel::instance()->register_activity_from_gui($doer_id, UserXPModel::$ACTION_ADD_PORTFOLIO);
    }
}
add_action( "save_post_" . PortfolioWorkManager::$post_type, "\ITV\models\itv_add_xp_for_portfolio", 10, 3 );
