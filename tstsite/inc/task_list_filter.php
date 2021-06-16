<?php

class TaskListFilter {
	
	public function __construct() {
	}

    public function get_terms_with_subterms($tax, $parent_id=0, $with_sub_terms=true) {
        return array_map(function($term) use ($tax, $with_sub_terms) {
            return [
                'id' => $term->term_id,
                'title' => $term->name,
                'slug' => $term->slug,
                'task_count' => $this->count_tasks_in_filter_option([
                    'tax_query' => array(
                        array(
                            'taxonomy' => $tax,
                            'field'    => 'term_id',
                            'terms'    => $term->term_id,
                        ),
                    ),                                
                ]),
                'subterms' => $with_sub_terms ? $this->get_terms_with_subterms($tax, $term->term_id, false) : [],
            ];
        }, array_values(get_terms([
            'taxonomy' => $tax,
            'hide_empty' => boolval($parent_id) ? true : false,
            'hierarchical' => true,
            'parent' => $parent_id, 
        ])));        
    }
	
	public function create_filter_with_stats() {
        $sections = [];
        
        $sections[] = [
            'id' => 'tags',
            'title' => 'Категории',
            'items' => $this->get_terms_with_subterms('post_tag'),
        ];
    
        $sections[] = [
            'id' => 'ngo_tags',
            'title' => 'Специализация',
            'items' => $this->get_terms_with_subterms('nko_task_tag'),
        ];
        
        $sections[] = [
            'id' => 'task_type',
            'title' => 'Тип задачи',
            'items' => [
                [
                    'id' => 'no-responses',
                    'title' => 'Нет откликов на задачу',
                    'task_count' => $this->count_tasks_in_filter_option_no_reponses(),
                ],
                [
                    'id' => 'reward-exist',
                    'title' => 'Есть вознаграждение',
                    'task_count' => $this->count_tasks_in_filter_option([
                        'tax_query' => array(
                            array(
                                'taxonomy' => 'reward',
                                'field'    => 'slug',
                                'terms'    => ITV_TASK_FILTER_REWARD_EXIST_TERMS,
                            ),
                        ),                                
                    ]),
                ],
    //             [
    //                 'id' => 'deadline-exist',
    //                 'title' => 'Есть дедлайн',
    //                 'task_count' => $this->count_tasks_in_filter_option(), // all tasks have deadline
    //             ],
            ],
        ];
    
        $sections[] = [
            'id' => 'author_type',
            'title' => 'Заказчики',
            'items' => [
                [
                    'id' => 'author-checked',
                    'title' => 'Заказчик проверен',
                    'task_count' => $this->count_tasks_in_filter_option_author_checked(),
                ],
                [
                    'id' => 'for-paseka-members',
                    'title' => 'Только для Пасеки',
                    'task_count' => $this->count_tasks_in_filter_option([
                        'meta_query' => [
                            [
                                'key' => ITV_POST_META_FOR_PASEKA_ONLY,
                                'value' => 1,
                            ]
                        ]
                    ]),
                ],
            ],
        ];
        
        return $sections;
	}
	
    protected function count_tasks_in_filter_option_no_reponses() {
        global $wpdb;
    
        $sql = "SELECT COUNT(posts.ID) 
    FROM {$wpdb->posts} AS posts 
    LEFT JOIN {$wpdb->prefix}p2p AS p2p 
        ON p2p.p2p_from = posts.ID 
            AND p2p.p2p_type = 'task-doers'
    WHERE posts.post_type = 'tasks' 
        AND posts.post_status IN ('publish', 'in_work', 'closed')
        AND posts.post_author NOT IN (%s) 
        AND p2p.p2p_id IS NULL";
        return $wpdb->get_var($wpdb->prepare($sql, ACCOUNT_DELETED_ID));
    }
	
	protected function count_tasks_in_filter_option($args = array()) {
        $args = array_merge([
            'post_type' => 'tasks',
            'post_status' => array('publish', 'in_work', 'closed'),
            'author__not_in', array(ACCOUNT_DELETED_ID),
            'posts_per_page' => -1,
        ], $args);
        $query = new WP_Query($args);
        return $query->found_posts;
    }

    protected function count_tasks_in_filter_option_author_checked() {
        global $wpdb;
    
        $sql = "SELECT COUNT(posts.ID) 
    FROM {$wpdb->posts} AS posts 
    LEFT JOIN {$wpdb->prefix}usermeta AS um 
        ON um.user_id = posts.post_author 
            AND um.meta_key = 'activation_code' 
    WHERE (um.meta_value = '' OR um.meta_value IS NULL) AND posts.post_author NOT IN (%s) ";
        return $wpdb->get_var($wpdb->prepare($sql, ACCOUNT_DELETED_ID));
    }
    
    function get_task_list_filter_options() {
        $sections = [];
        
        $sections[] = [
            'id' => 'tags',
            'title' => 'Категории',
            'items' => array_map(function($term){
                return [
                    'id' => $term->term_id,
                    'title' => $term->name,
                ];
            }, array_values(get_terms([
                'taxonomy' => 'post_tag',
                'hide_empty' => false,
            ]))),
        ];
    
        $sections[] = [
            'id' => 'ngo_tags',
            'title' => 'Специализация',
            'items' => array_map(function($term){
                return [
                    'id' => $term->term_id,
                    'title' => $term->name,
                ];
            }, array_values(get_terms([
                'taxonomy' => 'nko_task_tag',
                'hide_empty' => false,
            ]))),
        ];
        
        $sections[] = [
            'id' => 'task_type',
            'title' => 'Тип задачи',
            'items' => [
                [
                    'id' => 'no-responses',
                    'title' => 'Нет откликов на задачу',
                ],
                [
                    'id' => 'reward-exist',
                    'title' => 'Есть вознаграждение',
                ],
    //             [
    //                 'id' => 'deadline-exist',
    //                 'title' => 'Есть дедлайн',
    //             ],
            ],
        ];
    
        $sections[] = [
            'id' => 'author_type',
            'title' => 'Заказчики',
            'items' => [
                [
                    'id' => 'author-checked',
                    'title' => 'Заказчик проверен',
                ],
                [
                    'id' => 'for-paseka-members',
                    'title' => 'Только для Пасеки',
                ],
            ],
        ];
        
        $sections[] = [
            'id' => 'status',
            'items' => [],
        ];
        
        return $sections;
    }

    function get_task_status_stats() {
        $filter = [];
        
        if(!empty($_POST['filter'])) {
            $filter_json_str = stripslashes($_POST['filter']);
            
            try {
                $filter = json_decode($filter_json_str, true);
            }
            catch (Exception $ex) {
                error_log("json_decode error: " . $filter_json_str);
            }
        }
        
        $args = array(
            'query_id' => "itv_filtered_task_list",
            'post_type' => 'tasks',
            'author__not_in' => array(ACCOUNT_DELETED_ID),
            'posts_per_page' => -1,
        );
        
        if(!empty($filter)) {
            $tlf = new TaskListFilter();
            $filter_options = $tlf->get_task_list_filter_options();
            // error_log("filter:" . print_r($filter, true));

            foreach($filter_options as $key => $section) {
                foreach($section['items'] as $ik => $item) {
                    foreach($filter as $fk => $fv) {
                        if($fv && $fk === $section['id'] . "." . $item['id']) {
                            $args = add_task_list_filter_param($args, $section['id'], $item['id'], $fv);
                        }
                    }
                }
            }
        }

        // error_log("args:" . print_r($args, true));
        
        $stats = [];
        $status_list = ["publish", "in_work", "closed"];
        foreach($status_list as $status) {
            $args['post_status'] = $status;
            $query = new WP_Query($args);
            $stats[$status] = $query->found_posts;
        }
        
        return $stats;
    }
}


class TaskListFilterWPActionHandler {
    
    public function modify_task_list_filter_sql($request, $query) {
        global $wpdb;
        
        if(empty($query->query['query_id'])) {
            return $request;
        }
        
        if($query->query['query_id'] !== "itv_filtered_task_list") {
            return $request;
        }
        
        $filter = [];    
        if(!empty($_POST['filter'])) {
            $filter_json_str = stripslashes($_POST['filter']);
            
            try {
                $filter = json_decode($filter_json_str, true);
            }
            catch (Exception $ex) {
                error_log("json_decode error: " . $filter_json_str);
            }
        }
        
        $custom_join_list = [];
        $custom_where_list = [];
        
        #TODO: fix when real itv_author_checked meta will be added for user 
        if(!empty($filter['author_type.checked'])) {
            $custom_join_list["user_meta.author_checked"] = "
LEFT JOIN {$wpdb->prefix}usermeta AS um_author_checked 
    ON um_author_checked.user_id = str_posts.post_author 
        AND um_author_checked.meta_key = 'activation_code' 
";
            
            $custom_where_list[] = " (um_author_checked.meta_value = '' OR um_author_checked.meta_value IS NULL) ";
        }
    
        if(!empty($filter['task_type.no-responses'])) {
            $custom_join_list["p2p.task_doers"] = "
LEFT JOIN {$wpdb->prefix}p2p AS p2p 
    ON p2p.p2p_from = str_posts.ID
        AND p2p.p2p_type = 'task-doers'
";
            
            $custom_where_list[] = " (p2p.p2p_id IS NULL) ";
        }
        
        
        if(count($custom_join_list) > 0) {
            $request = str_replace("FROM str_posts", "FROM str_posts " . implode(" ", $custom_join_list) . " ", $request);
        }
        
        if(count($custom_where_list) > 0) {
            $request = str_replace("WHERE 1=1 ", "WHERE 1=1 AND ".implode(" AND ", $custom_where_list)." ", $request);
        }
        
        return $request;
    }
}


add_filter('posts_request', function($request, $query) {
    $ah = new TaskListFilterWPActionHandler();
    $request = $ah->modify_task_list_filter_sql($request, $query);    
    return $request;
}, 10, 2 );
