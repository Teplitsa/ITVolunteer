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
    public static $meta_image_id = 'portfolio_image_id';   

    public static $rest_context_portfolio_edit = 'portfolio_edit';
}