<?php
namespace ITV\models;

require_once 'ITVModel.php';
require_once dirname(__FILE__) . '/../dao/ITVDAO.php';
require_once dirname(__FILE__) . '/../dao/UserXP.php';
require_once dirname(__FILE__) . '/../dao/Review.php';

use \ITV\models\ITVSingletonModel;
use \ITV\dao\UserXP;
use \ITV\dao\UserXPActivity;
use \ITV\dao\Review;
use \ITV\dao\ReviewAuthor;
use \WeDevs\ORM\WP\User as User; 
use \WeDevs\ORM\WP\Post as Post; 
use \WeDevs\ORM\Eloquent\Database as DB;
use ITV\dao\UserXPAlerts;

class BigDataGenerator extends ITVSingletonModel {
    private static $LONG_TEXT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec facilisis vel ligula eu tempor. Mauris porttitor velit eget nibh varius, eu scelerisque neque ullamcorper. Curabitur laoreet auctor condimentum. Aliquam eget hendrerit justo, at aliquam libero. Praesent nec cursus sapien, a consequat mauris. Fusce vel erat eu sem scelerisque dapibus. Ut eu tellus ac leo mollis bibendum. Aliquam vel placerat nunc. Ut augue diam, scelerisque id interdum eu, luctus ac dolor. Ut pretium lorem et dolor malesuada, sit amet sollicitudin orci vestibulum.

Ut rhoncus orci eu lorem efficitur rhoncus. Nulla sed rhoncus neque. Vivamus porta vehicula blandit. Ut accumsan ligula sit amet nunc blandit, id semper dolor ultricies. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nulla facilisi. Nam purus metus, consectetur at risus sit amet, porta ullamcorper erat. Vivamus rhoncus auctor sapien eget auctor. Donec vel ornare sem. Quisque quis nunc ac leo porta dapibus. Quisque lectus ante, lacinia tincidunt suscipit vitae, condimentum et nulla. Sed tristique vulputate ornare. Proin id velit massa. Integer sem justo, rutrum id lacus sed, pellentesque vehicula lorem.';
    
    private static $SHORT_TEXT = "Cras condimentum vel tellus et aliquam. Duis id purus vel nisl posuere aliquam eget at neque. Maecenas fringilla consectetur maximus. Aenean dictum odio a enim ornare, id accumsan nulla lobortis. Vivamus quis nisl eu eros iaculis ultrices. Donec volutpat, tellus ut condimentum lobortis, metus ante aliquam mi, id porta sapien quam vitae sapien. Mauris velit magna, lacinia ac dignissim nec, porttitor vitae mi.";
    private static $TITLE = "Vivamus purus lacus, maximus nec est nec";
    private static $SLUG = "vivamus_purus_lacus_maximus_nec_est_nec";
    
    private static $USERS_PORTION = 500;
    
    private $USERS_AMOUNT = 10;
    private $TASKS_AMOUNT = 10;
    private $COMMENTS_AMOUNT = 5;
    private $REVIEWS_AMOUNT = 5;
    
    private $AMOUNT_K = 100;
    
    public function __construct() {
        $itv_config = \ItvConfig::instance();
        
        $this->USERS_AMOUNT = $this->USERS_AMOUNT * $this->AMOUNT_K;
        $this->TASKS_AMOUNT = $this->TASKS_AMOUNT * $this->AMOUNT_K;
        $this->COMMENTS_AMOUNT = $this->COMMENTS_AMOUNT * $this->AMOUNT_K;
        $this->REVIEWS_AMOUNT = $this->REVIEWS_AMOUNT * $this->AMOUNT_K;
    }
    
    public function generate_data() {
        $start = microtime(true);

        $start001 = microtime(true);
        $this->generate_users($this->USERS_AMOUNT);
        echo "users: ".(microtime(true) - $start001) . " sec.\n";
        
        $start001 = microtime(true);
        $this->generate_tasks($this->TASKS_AMOUNT);
        echo "tasks: ".(microtime(true) - $start001) . " sec.\n";
        
        $start001 = microtime(true);
        $this->generate_comments($this->COMMENTS_AMOUNT);
        echo "comments: ".(microtime(true) - $start001) . " sec.\n";
        
        $start001 = microtime(true);
        $this->generate_reviews_for_doer($this->REVIEWS_AMOUNT);
        echo "review_for_doer: ".(microtime(true) - $start001) . " sec.\n";
        
        $start001 = microtime(true);
        $this->generate_reviews_for_author($this->REVIEWS_AMOUNT);
        echo "review_for_author: ".(microtime(true) - $start001) . " sec.\n";
        
        echo "total: ".(microtime(true) - $start) . " sec.\n";
    }
    
    public function generate_users($amount) {
        for($i = 0; $i < $amount; $i++) {
            $userdata = array(
                'user_login'  =>  'test' . sprintf("%'.09d", $i),
                'user_url'    =>  "http://te-st.ru/",
                'user_pass'   =>  NULL,
            );
            $user_id = wp_insert_user( $userdata );
        }
    }
    
    public function generate_comments($amount) {
        $users_portion = static::$USERS_PORTION;
        $users_count = get_user_count();
        $iterations = (int)floor($users_count / $users_portion);
        $amount_portion = (int)floor($amount / $iterations);
        if($amount_portion < 1) {
            $amount_portion = $amount;
            $iterations = 1;
        }
        
        $iterations += ceil(($amount - ($amount_portion * $iterations)) / $amount_portion);

        remove_action( 'wp_insert_comment', 'comment_inserted', 99 );
        for($iter = 0; $iter < $iterations; $iter++) {
            $users = $this->get_users($users_portion);
            $users_portion_count = count($users);
            
            $posts = $this->get_users($users_portion);
            $posts_portion_count = count($posts);
            
            for($i = 0; $i < $amount_portion; $i++) {
                
                if($iter * $amount_portion + $i > $amount) {
                    break;
                }
                
                $user_index = rand(0, $users_portion_count - 1);
                $rand_user = $users[$user_index];
                
                $post_index = rand(0, $posts_portion_count - 1);
                $rand_post = $posts[$post_index];
                
                $this->generate_comment($rand_user, $rand_post);
            }
        }
    }
    
    public function generate_comment($user, $post) {
        $time = current_time('mysql');
        $data = array(
            'comment_post_ID' => $post->ID,
            'comment_author' => $user->display_name,
            'comment_author_email' => $user->user_email,
            'comment_author_url' => 'http://te-st.ru/',
            'comment_content' => static::$SHORT_TEXT,
            'comment_type' => '',
            'comment_parent' => 0,
            'user_id' => $user->ID,
            'comment_author_IP' => '127.0.0.1',
            'comment_agent' => 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.0.10) Gecko/2009042316 Firefox/3.0.10 (.NET CLR 3.5.30729)',
            'comment_date' => $time,
            'comment_approved' => 1,
        );
        wp_insert_comment($data);
    }

    public function generate_reviews_for_doer($amount) {
        $users_portion = static::$USERS_PORTION;
        $users_count = get_user_count();
        $iterations = (int)floor($users_count / $users_portion);
        $amount_portion = (int)floor($amount / $iterations);
        if($amount_portion < 1) {
            $amount_portion = $amount;
            $iterations = 1;
        }
        
        $iterations += ceil(($amount - ($amount_portion * $iterations)) / $amount_portion);

        for($iter = 0; $iter < $iterations; $iter++) {
            $users = $this->get_users($users_portion);
            $users_portion_count = count($users);
        
            for($i = 0; $i < $amount_portion; $i++) {
                
                if($iter * $amount_portion + $i > $amount) {
                    break;
                }
                
                $user_index = rand(0, $users_portion_count - 1);
                $rand_user = $users[$user_index];
                
                $doer_index = rand(0, $users_portion_count - 1);
                $rand_doer = $users[$doer_index];
                
                $review = new Review();
                $review->task_id = 0;
                $review->message = static::$SHORT_TEXT . " " . $this->generate_random_string();
                $review->author_id = $rand_user->ID;
                $review->doer_id = $rand_doer->ID;
                $review->time_add = current_time('mysql');
                $review->rating = rand(0, 5);
                $review->save();
                
            }
        }
    }
    
    public function generate_reviews_for_author($amount) {
        $users_portion = static::$USERS_PORTION;
        $users_count = get_user_count();
        $iterations = (int)floor($users_count / $users_portion);
        $amount_portion = (int)floor($amount / $iterations);
        if($amount_portion < 1) {
            $amount_portion = $amount;
            $iterations = 1;
        }
        
        $iterations += ceil(($amount - ($amount_portion * $iterations)) / $amount_portion);
                
        for($iter = 0; $iter < $iterations; $iter++) {
            $users = $this->get_users($users_portion);
            $users_portion_count = count($users);
        
            for($i = 0; $i < $amount_portion; $i++) {
                
                if($iter * $amount_portion + $i > $amount) {
                    break;
                }
                
                $user_index = rand(0, $users_portion_count - 1);
                $rand_user = $users[$user_index];
                
                $author_index = rand(0, $users_portion_count - 1);
                $rand_author = $users[$author_index];
                
                $review = new ReviewAuthor();
                $review->task_id = 0;
                $review->message = static::$SHORT_TEXT . " " . $this->generate_random_string();
                $review->author_id = $rand_author->ID;
                $review->doer_id = $rand_user->ID;
                $review->time_add = current_time('mysql');
                $review->rating = rand(0, 5);
                $review->save();
            }
        }
    }
    
    public function generate_task($rand_user) {
        $task_rand_string = $this->get_rand_for_post(static::$TITLE, 'tasks');
        wp_insert_post(
            array(
                'comment_status'    => 'open',
                'ping_status'   => 'closed',
                'post_author'   => $rand_user->ID,
                'post_name'     => static::$SLUG . "_" . $task_rand_string,
                'post_title'    => static::$TITLE . " " . $task_rand_string,
                'post_status'   => 'publish',
                'post_type'     => 'tasks',
            )
        );
    }
    
    public function generate_tasks($amount) {
        $users_portion = static::$USERS_PORTION;
        $users_count = get_user_count();
        $iterations = (int)floor($users_count / $users_portion);
        $amount_portion = (int)floor($amount / $iterations);
        if($amount_portion < 1) {
            $amount_portion = $amount;
            $iterations = 1;
        }
        
        $iterations += ceil(($amount - ($amount_portion * $iterations)) / $amount_portion);
        
        remove_action( 'save_post', 'tst_task_saved' );
        for($iter = 0; $iter < $iterations; $iter++) {
            $users = $this->get_users($users_portion);
            $users_portion_count = count($users);
            for($i = 0; $i < $amount_portion; $i++) {
                
                if($iter * $amount_portion + $i > $amount) {
                    break;
                }
                
                $user_index = rand(0, $users_portion_count - 1);
                $rand_user = $users[$user_index];
                $this->generate_task($rand_user);
            }
        }
    }
    
    private function get_users($limit) {
        $user_query = new \WP_User_Query( array ( 'orderby' => 'post_count', 'order' => 'ASC', 'number' => $limit ) );
        return $user_query->get_results();
    } 
    
    private function get_rand_for_post($title, $post_type) {
        $random_string = $this->generate_random_string();
        while( null !== get_page_by_title( $title . " " . $random_string, "OBJECT", $post_type )) {
            $random_string = $this->generate_random_string();
        }
        return $random_string;
    }
    
    private function generate_random_string($length = 10) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }
    
}
