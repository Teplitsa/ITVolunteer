<?php
namespace ITV\models;

require_once 'ITVModel.php';
require_once dirname(__FILE__) . '/../dao/ITVDAO.php';
require_once dirname(__FILE__) . '/../dao/UserXP.php';
require_once dirname(__FILE__) . '/../dao/Review.php';

require_once dirname(__FILE__) . '/../itv_log.php';

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
    
    private $AMOUNT_K = 1;
    
    private $terms_rewards = [];
    private $terms_rewards_count = 0;
    
    private $terms_tags = [];
    private $terms_tags_count = 0;
    
    private $created_users_count = 0;
    private $created_tasks_count = 0;
    private $stats_step = 1000;
    
    public function __construct() {
        $itv_config = \ItvConfig::instance();
        
        $this->USERS_AMOUNT = $this->USERS_AMOUNT * $this->AMOUNT_K;
        $this->TASKS_AMOUNT = $this->TASKS_AMOUNT * $this->AMOUNT_K;
        $this->COMMENTS_AMOUNT = $this->COMMENTS_AMOUNT * $this->AMOUNT_K;
        $this->REVIEWS_AMOUNT = $this->REVIEWS_AMOUNT * $this->AMOUNT_K;
        
        $this->terms_rewards = get_terms('reward');
        $this->terms_rewards_count = count($this->terms_rewards);
        
        $this->terms_tags = get_terms('post_tag');
        $this->terms_tags_count = count($this->terms_tags);
    }
    
    public function set_stats_step($step) {
        if((int)$step) {
            $this->stats_step = (int)$step;
        }
    }
    
    public function set_amount($amount) {
        $this->USERS_AMOUNT = (int)$amount;
        $this->TASKS_AMOUNT = (int)$amount;
        $this->COMMENTS_AMOUNT = floor((int)$amount / 2);
        $this->REVIEWS_AMOUNT = floor((int)$amount / 2);
    }
    
    public function generate_data() {
        $start = microtime(true);
        
        echo "will generate:\n";
        echo "users: " . $this->USERS_AMOUNT . "\n";
        echo "tasks: " . $this->TASKS_AMOUNT . "\n";
        echo "doer_connections: " . 5 * $this->TASKS_AMOUNT . "\n";
        echo "comments: " . $this->COMMENTS_AMOUNT . "\n";
        echo "reviews: " . 2 * $this->TASKS_AMOUNT . "\n";
        
        $this->created_tasks_count = 0;
        $this->created_users_count = 0;
        
        $start001 = microtime(true);
        $this->generate_users($this->USERS_AMOUNT);
        echo "users: ".(microtime(true) - $start001) . " sec.\n";
        
        $start001 = microtime(true);
        $this->generate_tasks($this->TASKS_AMOUNT);
        echo "tasks: ".(microtime(true) - $start001) . " sec.\n";
        
        $start001 = microtime(true);
        $this->generate_comments($this->COMMENTS_AMOUNT);
        echo "comments: ".(microtime(true) - $start001) . " sec.\n";
        
//         $start001 = microtime(true);
//         $this->generate_reviews_for_doer($this->REVIEWS_AMOUNT);
//         echo "review_for_doer: ".(microtime(true) - $start001) . " sec.\n";
        
//         $start001 = microtime(true);
//         $this->generate_reviews_for_author($this->REVIEWS_AMOUNT);
//         echo "review_for_author: ".(microtime(true) - $start001) . " sec.\n";
        
        echo "total: ".(microtime(true) - $start) . " sec.\n";
    }
    
    public function generate_users($amount) {
        $db = DB::instance();
        $wpdb = $db->db;
        
        $start001 = microtime(true);
        for($i = 0; $i < $amount; $i++) {
            $name = 'test' . sprintf("%'.09d", $i);
            
            $user = new User();
            $user->timestamps = false;
            
            $user->user_login = $name;
            $user->user_pass = '';
            $user->user_nicename = $name;
            $user->user_email = $name . '@ngo2.ru';
            $user->user_url = "http://te-st.ru/";
            $user->user_registered = current_time('mysql');
            $user->user_activation_key = '';
            $user->user_status = 0;
            $user->display_name = $name;
            $user->spam = 0;
            $user->deleted = 0;
            
            $user->save();
            
            \ItvLog::instance()->log_user_action(\ItvLog::$ACTION_USER_REGISTER, $user->ID);
            
            $this->created_users_count += 1;
            if($this->created_users_count % $this->stats_step == 0) {
                echo "gen users: ".($this->created_users_count) . "\n";
                echo "spent: ".(microtime(true) - $start001) . " sec.\n";
            }
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
    
    public function generate_review_for_doer($doer, $author, $task = null) {
        
        $author_id = 0;
        if(is_object($author)) {
            $author_id = $author->ID;
        }
        else {
            $author_id = (int)$author;
        }
        
        if($author_id) {
            $rating = rand(0, 5);
            
            $review = new Review();
            $review->task_id = $task ? $task->ID : 0;
            $review->message = static::$SHORT_TEXT . " " . $this->generate_random_string();
            $review->author_id = $author_id;
            $review->doer_id = $doer->ID;
            $review->time_add = current_time('mysql');
            $review->rating = $rating;
            $review->save();
            
            \ItvLog::instance()->log_review_action(\ItvLog::$ACTION_REVIEW_FOR_DOER, $author_id, $doer->ID, 0, $rating);
        }
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
                
                $this->generate_review_for_doer($rand_doer, $rand_user);
            }
        }
    }
    
    public function generate_review_for_author($author, $doer, $task = null) {
        
        $author_id = 0;
        if(is_object($author)) {
            $author_id = $author->ID;
        }
        else {
            $author_id = (int)$author;
        }
        
        if($author_id) {
            $rating = rand(0, 5);
            $review = new ReviewAuthor();
            $review->task_id = $task ? $task->ID : 0;
            $review->message = static::$SHORT_TEXT . " " . $this->generate_random_string();
            $review->author_id = $author_id;
            $review->doer_id = $doer->ID;
            $review->time_add = current_time('mysql');
            $review->rating = $rating;
            $review->save();
            
            \ItvLog::instance()->log_review_action(\ItvLog::$ACTION_REVIEW_FOR_AUTHOR, $doer->ID, $author_id, 0, $rating);
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
                
                $this->generate_review_for_author($rand_author, $rand_user);
            }
        }
    }
    
    public function set_task_reward($task) {
        $reward = $this->terms_rewards[rand(0, $this->terms_rewards_count - 1)];
        wp_set_post_terms( (int)$task->ID, $reward->term_id, 'reward');
    }
    
    public function set_task_tags($task) {
        $tag1 = $this->terms_tags[rand(0, $this->terms_tags_count - 1)];
        $tag2 = $this->terms_tags[rand(0, $this->terms_tags_count - 1)];
        $tag3 = $this->terms_tags[rand(0, $this->terms_tags_count - 1)];
        wp_set_post_terms( (int)$task->ID, [$tag1->term_id, $tag2->term_id, $tag3->term_id], 'post_tag');
    }
    
    public function set_task_candidates($task, $users, $users_portion_count) {
        $to_approve_index = rand(0, 4);
        
        for($i = 0; $i < 5; $i++) {
            $user_index = rand(0, $users_portion_count - 1);
            $rand_cand = $users[$user_index];
            
            if($to_approve_index == $i) {
                p2p_type('task-doers')->connect($task->ID, $rand_cand->ID, array('is_approved' => true));
                \ItvLog::instance()->log_task_action($task->ID, \ItvLog::$ACTION_TASK_ADD_CANDIDATE, get_current_user_id());
                \ItvLog::instance()->log_task_action($task->ID, \ItvLog::$ACTION_TASK_APPROVE_CANDIDATE, $rand_cand->ID);
                
                $this->generate_review_for_author($task->post_author, $rand_cand, $task);
                $this->generate_review_for_doer($rand_cand, $task->post_author, $task);
            }
            else {
                p2p_type('task-doers')->connect($task->ID, $rand_cand->ID, array());
                \ItvLog::instance()->log_task_action($task->ID, \ItvLog::$ACTION_TASK_ADD_CANDIDATE, $rand_cand->ID);
            }
        }
    }
    
    public function generate_task($users, $users_portion_count) {
        $user_index = rand(0, $users_portion_count - 1);
        $rand_user = $users[$user_index];
        
        $task_rand_string = $this->generate_random_string();
        
        $time = current_time('mysql');
        
        $task = new Post();
        $task->post_author = $rand_user->ID;
        $task->post_date = $time;
        $task->post_date_gmt = $time;
        $task->post_content = static::$LONG_TEXT;
        $task->post_title = static::$TITLE . " " . $task_rand_string;
        $task->post_excerpt = '';
        $task->post_status = 'publish';
        $task->comment_status = 'open';
        $task->ping_status = 'closed';
        $task->post_password = '';
        $task->post_name = static::$SLUG . "_" . $task_rand_string;
        $task->to_ping = '';
        $task->pinged = '';
        $task->post_modified = $time;
        $task->post_modified_gmt = $time;
        $task->post_content_filtered = '';
        $task->post_parent = 0;
        $task->guid = '';
        $task->menu_order = 0;
        $task->post_type = 'tasks';
        $task->post_mime_type = '';
        $task->comment_count = 0;
        
        $task->save();
        \ItvLog::instance()->log_task_action($task->ID, \ItvLog::$ACTION_TASK_CREATE, $rand_user->ID);
        
        $this->set_task_reward($task);
        $this->set_task_tags($task);
        $this->set_task_candidates($task, $users, $users_portion_count);
        
        $this->created_tasks_count += 1;
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
        
        $start001 = microtime(true);
        for($iter = 0; $iter < $iterations; $iter++) {
            $users = $this->get_users($users_portion);
            $users_portion_count = count($users);
            for($i = 0; $i < $amount_portion; $i++) {
                
                if($iter * $amount_portion + $i > $amount) {
                    break;
                }
                
                $this->generate_task($users, $users_portion_count);
                
                if($this->created_tasks_count % $this->stats_step == 0) {
                    echo "gen tasks: ".($this->created_tasks_count) . "\n";
                    echo "spent: ".(microtime(true) - $start001) . " sec.\n";
                }
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
