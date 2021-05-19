<?php

namespace ITV\models;

class RewardManager
{
    public static $taxonomy = 'reward';

    public function get_all_rewards()
    {
        $terms = get_terms( array(
            'taxonomy' => self::$taxonomy,
            'hide_empty' => false,
        ) );
    
        return $terms;
    }


}

class RewardsV2Setup
{
    public static $v2_v1_mapping = [
        'drink' => 'gift', 
        'food' => 'gift',
        'selfie' => 'action',
        'bolshoj-chelovecheskij-spasib' => 'promotion', 
        'link' => 'promotion', 
        'upominanie-na-sajte' => 'promotion', 
    ];

    public static $new_rewards = [
        ['slug' => 'gift', 'name' => 'Символические подарки'],
        ['slug' => 'action', 'name' => 'Впечатления и интересные события'],
        ['slug' => 'useful-service', 'name' => 'Полезные услуги'],
        ['slug' => 'promotion', 'name' => 'Отзывы и продвижение'],
        ['slug' => 'symbol', 'name' => 'Небольшое денежное вознаграждение/ небольшой гонорар'],
        ['slug' => 'from-grant', 'name' => 'Денежное вознаграждение/ бюджет'],
    ];

    public function create_rewards()
    {
        foreach(RewardsV2Setup::$new_rewards as $reward_data) {
            $exist_reward = get_term_by( 'slug', $reward_data['slug'], RewardManager::$taxonomy );

            if($exist_reward) {
                \WP_CLI::line("update reward: " . $reward_data['name']);
                wp_update_term($exist_reward->term_id, RewardManager::$taxonomy, $reward_data);
            }
            else {
                \WP_CLI::line("create reward: " . $reward_data['name']);
                wp_insert_term($reward_data['name'], RewardManager::$taxonomy, $reward_data);
            }
        }
    }

    public function update_tasks_rewards()
    {
        $reward_manager = new RewardManager();

        $terms = $reward_manager->get_all_rewards();

        foreach($terms as $reward) {
            if(!isset(RewardsV2Setup::$v2_v1_mapping[$reward->slug])) {
                continue;
            }
    
            $posts_array = get_posts(
                array(
                    'posts_per_page' => -1,
                    'post_type' => \ITV\models\TaskManager::$post_type,
                    'post_status' => ['publish', 'closed', 'in_work', 'archived'],
                    'tax_query' => array(
                        array(
                            'taxonomy' => RewardManager::$taxonomy,
                            'field' => 'term_id',
                            'terms' => $reward->term_id,
                        )
                    )
                )
            );
    
            foreach($posts_array as $task) {
                \WP_CLI::line("update task: " . $task->post_name);

                $task_rewards = wp_get_object_terms( $task->ID, RewardManager::$taxonomy );
                $new_task_rewards = [];
                foreach($task_rewards as $task_reward) {
                    if(isset(RewardsV2Setup::$v2_v1_mapping[$reward->slug])) {
                        \WP_CLI::line("change reward: " . $reward->slug);
                        $new_task_rewards[] = RewardsV2Setup::$v2_v1_mapping[$reward->slug];
                    }
                    else {
                        \WP_CLI::line("keep reward: " . $reward->slug);
                        $new_task_rewards[] = $reward->slug;
                    }
                }
                
                if(count($new_task_rewards) > 0) {
                    \WP_CLI::line("set rewards list: " . print_r($new_task_rewards, true));
                    wp_set_object_terms($task->ID, $new_task_rewards, RewardManager::$taxonomy, false);
                }
            }
        }

    }

    public function delete_useless_rewards()
    {
        foreach(RewardsV2Setup::$v2_v1_mapping as $useless_slug => $mapped_slug) {
            $exist_reward = get_term_by( 'slug', $useless_slug, RewardManager::$taxonomy );
            if($exist_reward) {
                wp_delete_term( $exist_reward->term_id, RewardManager::$taxonomy );
            }
        }
    }
}