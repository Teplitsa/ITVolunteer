<?php

class ItvConsult {
    public static function init_consult() {
        // consults
        register_taxonomy ( 'consult_source', array (
            'consult' 
        ), array (
            'labels' => array (
                'name' => __ ( 'Consult sources', 'tst' ),
                'singular_name' => __ ( 'Consult source', 'tst' ),
                'menu_name' => __ ( 'Consult sources', 'tst' ),
                'all_items' => __ ( 'All consult sources', 'tst' ),
                'edit_item' => __ ( 'Edit consult source', 'tst' ),
                'view_item' => __ ( 'View consult source', 'tst' ),
                'update_item' => __ ( 'Update consult source', 'tst' ),
                'add_new_item' => __ ( 'Add new consult source', 'tst' ),
                'new_item_name' => __ ( 'New consult source name', 'tst' ),
                'parent_item' => __ ( 'Parent consult source', 'tst' ),
                'parent_item_colon' => __ ( 'Parent consult source:', 'tst' ),
                'search_items' => __ ( 'Search consult sources', 'tst' ),
                'popular_items' => __ ( 'Popular consult sources', 'tst' ),
                'separate_items_with_commas' => __ ( 'Separate with commas', 'tst' ),
                'add_or_remove_items' => __ ( 'Add or remove consult source', 'tst' ),
                'choose_from_most_used' => __ ( 'Choose from most used consult sources', 'tst' ),
                'not_found' => __ ( 'Not found consult sources', 'tst' ) 
            ),
            'hierarchical' => true,
            'show_ui' => true,
            'show_in_nav_menus' => true,
            'show_admin_column' => true,
            'query_var' => true,
            'rewrite' => array (
                'slug' => 'consult_source',
                'with_front' => false 
            ) 
        ) );
        
        register_taxonomy ( 'consult_state', array (
            'consult' 
        ), array (
            'labels' => array (
                'name' => __ ( 'Consult states', 'tst' ),
                'singular_name' => __ ( 'Consult state', 'tst' ),
                'menu_name' => __ ( 'Consult states', 'tst' ),
                'all_items' => __ ( 'All consult states', 'tst' ),
                'edit_item' => __ ( 'Edit consult state', 'tst' ),
                'view_item' => __ ( 'View consult state', 'tst' ),
                'update_item' => __ ( 'Update consult state', 'tst' ),
                'add_new_item' => __ ( 'Add new consult state', 'tst' ),
                'new_item_name' => __ ( 'New consult state name', 'tst' ),
                'parent_item' => __ ( 'Parent consult state', 'tst' ),
                'parent_item_colon' => __ ( 'Parent consult state:', 'tst' ),
                'search_items' => __ ( 'Search consult states', 'tst' ),
                'popular_items' => __ ( 'Popular consult states', 'tst' ),
                'separate_items_with_commas' => __ ( 'Separate with commas', 'tst' ),
                'add_or_remove_items' => __ ( 'Add or remove consult state', 'tst' ),
                'choose_from_most_used' => __ ( 'Choose from most used consult states', 'tst' ),
                'not_found' => __ ( 'Not found consult states', 'tst' ) 
            ),
            'hierarchical' => true,
            'show_ui' => true,
            'show_in_nav_menus' => true,
            'show_admin_column' => true,
            'query_var' => true,
            'rewrite' => array (
                'slug' => 'consult_state',
                'with_front' => false 
            ) 
        ) );
        
        register_post_type ( 'consult', array (
            'labels' => array (
                'name' => __ ( 'Consults', 'tst' ),
                'singular_name' => __ ( 'Consult', 'tst' ),
                'menu_name' => __ ( 'Consult', 'tst' ),
                'name_admin_bar' => __ ( 'Add consult', 'tst' ),
                'add_new' => __ ( 'Add new consult', 'tst' ),
                'add_new_item' => __ ( 'Add consult', 'tst' ),
                'new_item' => __ ( 'New consult', 'tst' ),
                'edit_item' => __ ( 'Edit consult', 'tst' ),
                'view_item' => __ ( 'View consult', 'tst' ),
                'all_items' => __ ( 'All consults', 'tst' ),
                'search_items' => __ ( 'Search consults', 'tst' ),
                'parent_item_colon' => __ ( 'Parent consult', 'tst' ),
                'not_found' => __ ( 'No consults found', 'tst' ),
                'not_found_in_trash' => __ ( 'No consults found in Trash', 'tst' ) 
            ),
            'public' => true,
            'exclude_from_search' => true,
            'publicly_queryable' => false,
            'show_ui' => true,
            'show_in_nav_menus' => false,
            'show_in_menu' => true,
            'show_in_admin_bar' => true,
            'capability_type' => 'post',
            'hierarchical' => false,
            'menu_position' => 6,
            'menu_icon' => 'dashicons-editor-help',
            'supports' => array (
                'title',
                'editor',
                'author' 
            ),
            'taxonomies' => array (
                'consult_type' 
            ) 
        ) );
        
        if (function_exists ( 'p2p_register_connection_type' )) {
            p2p_register_connection_type ( array (
                'name' => 'task-consult',
                'from' => 'tasks',
                'to' => 'consult',
                'cardinality' => 'many-to-many',
                'admin_column' => false,
                'title' => array (
                    'from' => __ ( 'Consult', 'tst' ),
                    'to' => __ ( 'Task', 'tst' ) 
                ),
                'from_labels' => array (
                    'singular_name' => __ ( 'Task', 'tst' ),
                    'search_items' => __ ( 'Search tasks', 'tst' ),
                    'not_found' => __ ( 'No tasks found', 'tst' ),
                    'create' => __ ( 'Create connections', 'tst' ) 
                ),
                'to_labels' => array (
                    'singular_name' => __ ( 'Consult', 'tst' ),
                    'search_items' => __ ( 'Search consults', 'tst' ),
                    'not_found' => __ ( 'No consults found', 'tst' ),
                    'create' => __ ( 'Create connections', 'tst' ) 
                ) 
            ) );
            
            p2p_register_connection_type ( array (
                'name' => 'consult-consultant',
                'from' => 'consult',
                'to' => 'user',
                'cardinality' => 'many-to-many',
                'admin_column' => 'from',
                'title' => array (
                    'from' => __ ( 'Consultant', 'tst' ),
                    'to' => __ ( 'Consult', 'tst' ) 
                ),
                'from_labels' => array (
                    'singular_name' => __ ( 'Consult', 'tst' ),
                    'search_items' => __ ( 'Search consults', 'tst' ),
                    'not_found' => __ ( 'No consults found', 'tst' ),
                    'create' => __ ( 'Create connections', 'tst' ) 
                ),
                'to_labels' => array (
                    'singular_name' => __ ( 'Consultant', 'tst' ),
                    'search_items' => __ ( 'Search consultants', 'tst' ),
                    'not_found' => __ ( 'No consultants found', 'tst' ),
                    'create' => __ ( 'Create connections', 'tst' ) 
                ) 
            ) );
        }
        // end consults
    }
    
    public static function filter_consult_by_state() {
        global $typenow;
        
        if ($typenow == 'consult') {
            
            # add consult_state filter
            $taxonomy  = 'consult_state';
            $selected = isset($_GET[$taxonomy]) ? $_GET[$taxonomy] : '';
            if($selected && !is_numeric($selected)) {
                $term = get_term_by('slug', $selected, $taxonomy);
                $selected = $term->term_id;
            }
            $info_taxonomy = get_taxonomy($taxonomy);
            wp_dropdown_categories(array(
                'show_option_all' => __("Show All Consult States", 'tst'),
                'taxonomy'        => $taxonomy,
                'name'            => $taxonomy,
                'orderby'         => 'name',
                'selected'        => $selected,
                'show_count'      => true,
                'hide_empty'      => false,
            ));
            
            # add consult_source filter
            $taxonomy  = 'consult_source';
            $selected = isset($_GET[$taxonomy]) ? $_GET[$taxonomy] : '';
            if($selected && !is_numeric($selected)) {
                $term = get_term_by('slug', $selected, $taxonomy);
                $selected = $term->term_id;
            }
            $info_taxonomy = get_taxonomy($taxonomy);
            wp_dropdown_categories(array(
                'show_option_all' => __("Show All Consult Sources", 'tst'),
                'taxonomy'        => $taxonomy,
                'name'            => $taxonomy,
                'orderby'         => 'name',
                'selected'        => $selected,
                'show_count'      => true,
                'hide_empty'      => false,
            ));
            
            # add consultant filter
            $selected = isset($_GET['user']) ? filter_var($_GET['user'], FILTER_SANITIZE_STRING) : '';
            static::show_consultants_dropdown($selected, false);
        };
    }
    
    public static function convert_term_id_to_term_slug_in_query($query) {
        global $pagenow;
        $post_type = 'consult';
        
        # apply consult_state filter
        $taxonomy  = 'consult_state';
        $query_vars = $query->query_vars;
        if( $pagenow == 'edit.php' && isset($query_vars['post_type']) && $query_vars['post_type'] == $post_type
                && isset($query_vars[$taxonomy]) && is_numeric($query_vars[$taxonomy]) && $query_vars[$taxonomy] != 0 )
        {
            $term = get_term_by('id', $query_vars[$taxonomy], $taxonomy);
            $query->query_vars[$taxonomy] = $term->slug;
        }
        
        # apply consult_source filter
        $taxonomy  = 'consult_source';
        $query_vars = $query->query_vars;
        if( $pagenow == 'edit.php' && isset($query_vars['post_type']) && $query_vars['post_type'] == $post_type
                && isset($query_vars[$taxonomy]) && is_numeric($query_vars[$taxonomy]) && $query_vars[$taxonomy] != 0 )
        {
            $term = get_term_by('id', $query_vars[$taxonomy], $taxonomy);
            $query->query_vars[$taxonomy] = $term->slug;
        }
        
        # apply consult_source filter
        $taxonomy  = 'user';
        $query_vars = $query->query_vars;
        if( $pagenow == 'edit.php' && isset($query_vars['post_type']) && $query_vars['post_type'] == $post_type
                && isset($_GET[$taxonomy]) && is_numeric($_GET[$taxonomy]) && $_GET[$taxonomy] != 0 )
        {
            $query->query_vars['connected_type'] = 'consult-consultant';
            $query->query_vars['connected_direction'] = 'to';
            $query->query_vars['connected_items'] = $_GET[$taxonomy];
        }
    }
    
    public static function show_consultants_dropdown($selected = false, $skip_show_all = true, $custom_args = false) {
        $users_id_list = static::get_consultants_id_list();
        $args = array(
            'show_option_all' => !$skip_show_all ? __("Show All Consultants", 'tst') : false,
            'include' => implode(',', $users_id_list),
            'selected' => $selected,
        );
        if($custom_args) {
            $args = array_merge($args, $custom_args);
        }
        wp_dropdown_users($args);
    }
    
    public static function get_consultants_id_list() {
        $consultant_email_groups = ItvConfig::instance()->get('CONSULT_EMAILS_GROUPS');
        $consultant_emails = array();
        foreach($consultant_email_groups as $emails) {
            foreach ($emails as $email) {
                $consultant_emails[] = $email;
            }
        }
        $consultant_emails = array_unique($consultant_emails);
        sort($consultant_emails);
        
        $users_id_list = array();
        foreach($consultant_emails as $email) {
            $user = get_user_by('email', $email);
            if($user) {
                $users_id_list[] = $user->ID;
            }
        }
        return $users_id_list;
    }
    
    public static function get_consultant_user($project_name = 'itv') {
        $consultant_emails = ItvConfig::instance()->get('CONSULT_EMAILS');
        
        $consultant_email_groups = ItvConfig::instance()->get('CONSULT_EMAILS_GROUPS');
        if(isset($consultant_email_groups[$project_name])) {
            $consultant_emails = $consultant_email_groups[$project_name];
        }
        
        $max_index = count($consultant_emails) - 1;
        $rand_index = rand(0, $max_index);
        $rand_email = $consultant_emails[$rand_index];
        
        $user = get_user_by('email', $rand_email);
        return $user;
    }
    
    public static function create($task_id) {
        $params = array(
            'post_type' => 'consult',
            'post_title' => get_the_title( $task_id ),
            'post_status' => 'publish',
        );
        
        $consult_id = wp_insert_post($params);
        
        $term = get_term_by('slug', 'new', 'consult_state');
        if($term) {
            wp_set_post_terms( $consult_id, $term->term_id, 'consult_state' );
        }
        
        $term = get_term_by('slug', 'itv', 'consult_source');
        if($term) {
            wp_set_post_terms( $consult_id, $term->term_id, 'consult_source' );
        }
        
        p2p_type('task-consult')->connect($task_id, $consult_id, array());
        
        $consultant = static::get_consultant_user('itv');
        if($consultant) {
            $consult_datetime = static::get_consultant_consult_datetime($consultant);
            update_post_meta($consult_id, 'consult_moment', $consult_datetime);
            
            p2p_type('consult-consultant')->connect($consult_id, $consultant->ID, array());
            
            static::tst_send_admin_notif_consult_needed($task_id, $consultant);
            static::tst_send_user_notif_consult_needed($task_id, $consultant);
        }
    }
    
    public static function get_consultant_cfg_val($email, $key) {
        $consultant_cfg = ItvConfig::instance()->get('CONSULTANT_CONFIG');
        if(isset($consultant_cfg[$email])) {
            $consultant_cfg = $consultant_cfg[$email];
        }
        else {
            $consultant_cfg = $consultant_cfg['default'];
        }
        return isset($consultant_cfg[$key]) ? $consultant_cfg[$key] : null;
    }
    
    public static function create_external($consult_data, $source_slug) {
        $params = array(
            'post_type' => 'consult',
            'post_title' => $consult_data['post_title'],
            'post_content' => $consult_data['post_content'],
            'post_status' => 'publish',
        );
        
        $consult_id = wp_insert_post($params);
        
        update_post_meta($consult_id, 'external_user_name', $consult_data['user_name']);
        update_post_meta($consult_id, 'external_user_email', $consult_data['user_email']);
        update_post_meta($consult_id, 'external_post_link', $consult_data['post_link']);
        
        $term = get_term_by('slug', 'new', 'consult_state');
        if($term) {
            wp_set_post_terms( $consult_id, $term->term_id, 'consult_state' );
        }
        
        $term = get_term_by('slug', $source_slug, 'consult_source');
        if($term) {
            wp_set_post_terms( $consult_id, $term->term_id, 'consult_source' );
        }
        
        $consultant = static::get_consultant_user($source_slug);
        if($consultant) {
            $consult_datetime = static::get_consultant_consult_datetime($consultant);
            update_post_meta($consult_id, 'consult_moment', $consult_datetime);
            
            p2p_type('consult-consultant')->connect($consult_id, $consultant->ID, array());
        
            static::tst_send_admin_notif_consult_needed_external($consult_id, $consultant);
            static::tst_send_user_notif_consult_needed_external($consult_id, $consultant);
        }
    }

    public static function tst_send_admin_notif_consult_needed($post_id, $consultant) {
        $itv_config = ItvConfig::instance();
    
        $consult_emails = $itv_config->get('CONSULT_EMAILS');
        $email_from = $itv_config->get('EMAIL_FROM');
    
        $task = get_post($post_id);
        
        $consult = get_posts( array(
            'connected_type' => 'task-consult',
            'connected_items' => $post_id
        ));
        $consult = count($consult) > 0 ? $consult[0] : null;
        
        $consult_source = wp_get_post_terms( $consult->ID, 'consult_source');
        $consult_source = count($consult_source) ? $consult_source[0] : null;
        $consult_source_name = $consult_source ? $consult_source->name : '';
        $consult_source_slug = $consult_source ? $consult_source->slug : '';
        
        $consult_moment = get_post_meta($consult->ID, 'consult_moment', true);
        $consult_moment = static::get_consult_moment_by_datetime($consult_moment);
        
        if($task && count($consult_emails) > 0) {
            $task_author = (isset($task->post_author)) ? get_user_by('id', $task->post_author) : false;
            
            $to = $consultant->user_email;
            $other_emails = array_slice($consult_emails, 1);
            
            $message = __('itv_email_test_consult_needed_message', 'tst');
            $data = array(
                '{{consult_week_day}}' => $consult_moment['week_day_str'],
                '{{consult_date}}' => $consult_moment['date_str'],
                '{{consult_time}}' => $consult_moment['time_str'],
                '{{task_url}}' => '<a href="' . get_permalink($post_id) . '">' . get_permalink($post_id) . '</a>',
                '{{task_title}}' => get_the_title($post_id),
                '{{task_content}}' => $task->post_content,
                '{{consultant_name}}' => $consultant->user_firstname . ' ' . $consultant->user_lastname,
                '{{consult_source}}' => $consult_source_name,
                '{{author_name}}' => $task_author ? $task_author->user_firstname . ' ' . $task_author->user_lastname : '',
                '{{author_contact_email}}' => $task_author ? $task_author->user_email : '',
                '{{author_contact_skype}}' => $task_author ? get_user_meta($task_author->ID, 'user_skype', true) : '',
                '{{author_contact_user_contacts}}' => $task_author ? get_user_meta($task_author->ID, 'user_contacts', true) : '',
                '{{author_contact_twitter}}' => $task_author ? get_user_meta($task_author->ID, 'twitter', true) : '',
                '{{author_contact_facebook}}' => $task_author ? get_user_meta($task_author->ID, 'facebook', true) : '',
                '{{author_contact_vk}}' => $task_author ? get_user_meta($task_author->ID, 'vk', true) : '',
                '{{author_contact_googleplus}}' => $task_author ? get_user_meta($task_author->ID, 'googleplus', true) : '',
            );
            $message = str_replace(array_keys($data), $data, $message);
            $message = str_replace("\\", "", $message);
            $message = nl2br($message);
    
            $subject = __('itv_email_test_consult_needed_subject', 'tst');
            $subject = str_replace(array_keys($data), $data, $subject);
    
            $headers  = 'MIME-Version: 1.0' . "\r\n";
            $headers .= 'Content-type: text/html; charset=UTF-8' . "\r\n";
            $headers .= 'From: ' . __('ITVounteer', 'tst') . ' <'.$email_from.'>' . "\r\n";
            if(count($other_emails) > 0) {
                $headers .= 'Cc: ' . implode(', ', $other_emails) . "\r\n";
            }
            wp_mail($to, $subject, $message, $headers);
        }
    }
    
    public static function tst_send_user_notif_consult_needed($post_id, $consultant) {
        $itv_config = ItvConfig::instance();
    
        $consult_email_from = $itv_config->get('CONSULT_EMAIL_FROM');
        $consult_emails = $itv_config->get('CONSULT_EMAILS');
        $consult_bcc_emails = array_unique(array_merge($consult_emails, $itv_config->get('CONSULT_BCC_EMAILS')));
        
        $task = get_post($post_id);
        $task_author = (isset($task->post_author)) ? get_user_by('id', $task->post_author) : false;
        if($task_author) {
            $to = $task_author->user_email;
            
            $consult = get_posts( array(
                'connected_type' => 'task-consult',
                'connected_items' => $post_id
            ));
            $consult = count($consult) > 0 ? $consult[0] : null;
            
            $consult_moment = get_post_meta($consult->ID, 'consult_moment', true);
            $consult_moment = static::get_consult_moment_by_datetime($consult_moment);
            
            ItvAtvetka::instance()->mail('consult_needed_author_notification', [
                'mailto' => $to,
                'consult_week_day' => $consult_moment['week_day_str'],
                'consult_date' => $consult_moment['date_str'],
                'consult_time' => $consult_moment['time_str'],
                'task_url' => '<a href="' . get_permalink($post_id) . '">' . get_permalink($post_id) . '</a>',
                'task_title' => get_the_title($post_id),
                'consultant_name' => $consultant->user_firstname . ' ' . $consultant->user_lastname,
                'consultant_email' => $consultant->user_email,
                'consultant_skype' => get_user_meta($consultant->ID, 'user_skype', true),
                
                'reply-email' => $consult_email_from,
                'from' => __('ITVounteer', 'tst') . ' <'.$consult_email_from.'>',
                'bcc' => implode(', ', $consult_bcc_emails),
            ]);
        
        }
    
    }
    
    public static function tst_send_admin_notif_consult_needed_external($consult_id, $consultant) {
        $itv_config = ItvConfig::instance();
    
        $consult_emails = $itv_config->get('CONSULT_EMAILS');
        $email_from = $itv_config->get('EMAIL_FROM');
    
        $consult_source = wp_get_post_terms( $consult_id, 'consult_source');
        $consult_source = count($consult_source) ? $consult_source[0] : null;
        $consult_source_name = $consult_source ? $consult_source->name : '';
        $consult_source_slug = $consult_source ? $consult_source->slug : '';
        
        $external_user_name = get_post_meta($consult_id, 'external_user_name', true);
        $external_user_email = get_post_meta($consult_id, 'external_user_email', true);
        $external_post_link = get_post_meta($consult_id, 'external_post_link', true);
        
        $consult = get_post($consult_id);
        
        if(count($consult_emails) > 0) {
            $to = $consultant->user_email;
            $other_emails = array_slice($consult_emails, 1);
            
            $consult_moment = get_post_meta($consult_id, 'consult_moment', true);
            $consult_moment = static::get_consult_moment_by_datetime($consult_moment);
            
            $message = __('itv_email_test_consult_needed_message', 'tst');
            $data = array(
                '{{consult_week_day}}' => $consult_moment['week_day_str'],
                '{{consult_date}}' => $consult_moment['date_str'],
                '{{consult_time}}' => $consult_moment['time_str'],
                '{{task_url}}' => '<a href="' . $external_post_link . '">' . $external_post_link . '</a>',
                '{{task_title}}' => get_the_title($consult_id),
                '{{task_content}}' => $consult ? $consult->post_content : '',
                '{{consult_source}}' => $consult_source_name,
                '{{consultant_name}}' => $consultant->user_firstname . ' ' . $consultant->user_lastname,
                '{{author_name}}' => $external_user_name,
                '{{author_contact_email}}' => $external_user_email,
                '{{author_contact_skype}}' => '',
                '{{author_contact_user_contacts}}' => '',
                '{{author_contact_twitter}}' => '',
                '{{author_contact_facebook}}' => '',
                '{{author_contact_vk}}' => '',
                '{{author_contact_googleplus}}' => '',
            );
            $message = str_replace(array_keys($data), $data, $message);
            $message = str_replace("\\", "", $message);
            $message = nl2br($message);
    
            $subject = __('itv_email_test_consult_needed_subject', 'tst');
            $subject = str_replace(array_keys($data), $data, $subject);
    
            $headers  = 'MIME-Version: 1.0' . "\r\n";
            $headers .= 'Content-type: text/html; charset=UTF-8' . "\r\n";
            $headers .= 'From: ' . __('ITVounteer', 'tst') . ' <'.$email_from.'>' . "\r\n";
            if(count($other_emails) > 0) {
                $headers .= 'Cc: ' . implode(', ', $other_emails) . "\r\n";
            }
            wp_mail($to, $subject, $message, $headers);
        }
    }
    
    public static function tst_send_user_notif_consult_needed_external($consult_id, $consultant) {
        $itv_config = ItvConfig::instance();
    
        $consult_email_from = $itv_config->get('CONSULT_EMAIL_FROM');
        $consult_emails = $itv_config->get('CONSULT_EMAILS');
        $consult_bcc_emails = array_unique(array_merge($consult_emails, $itv_config->get('CONSULT_BCC_EMAILS')));
        
        $consult_source = wp_get_post_terms( $consult_id, 'consult_source');
        $consult_source = count($consult_source) ? $consult_source[0] : null;
        $consult_source_name = $consult_source ? $consult_source->name : '';
        $consult_source_slug = $consult_source ? $consult_source->slug : '';
        
        $external_user_name = get_post_meta($consult_id, 'external_user_name', true);
        $external_user_email = get_post_meta($consult_id, 'external_user_email', true);
        $external_post_link = get_post_meta($consult_id, 'external_post_link', true);
        
        if($external_user_email) {
            $to = $external_user_email;
    
            $consult_moment = get_post_meta($consult_id, 'consult_moment', true);
            $consult_moment = static::get_consult_moment_by_datetime($consult_moment);
    
            $message = __('itv_email_test_consult_needed_notification_' . $consult_source_slug, 'tst');
            if('itv_email_test_consult_needed_notification_' . $consult_source_slug == $message) {
                $message = __('itv_email_test_consult_needed_notification_ext', 'tst');
            }
            
            $data = array(
                '{{consult_week_day}}' => $consult_moment['week_day_str'],
                '{{consult_date}}' => $consult_moment['date_str'],
                '{{consult_time}}' => $consult_moment['time_str'],
                '{{task_url}}' => '<a href="' . $external_post_link . '">' . $external_post_link . '</a>',
                '{{task_title}}' => get_the_title($post_id),
                '{{consultant_name}}' => $consultant->user_firstname . ' ' . $consultant->user_lastname,
                '{{consultant_email}}' => $consultant->user_email,
                '{{consultant_skype}}' => get_user_meta($consultant->ID, 'user_skype', true),
                '{{author_name}}' => $external_user_name,
            );
            $message = str_replace(array_keys($data), $data, $message);
            $message = str_replace("\\", "", $message);
            $message = nl2br($message);
    
            $subject = __('itv_email_test_consult_needed_notification_subject_' . $consult_source_slug, 'tst');
            if('itv_email_test_consult_needed_notification_subject_' . $consult_source_slug == $message) {
                $subject = __('itv_email_test_consult_needed_notification_subject_ext', 'tst');
            }
            
            $headers  = 'MIME-Version: 1.0' . "\r\n";
            $headers .= 'Content-type: text/html; charset=UTF-8' . "\r\n";
            $headers .= 'From: ' . __('ITVounteer', 'tst') . ' <'.$consult_email_from.'>' . "\r\n";
            $headers .= 'Bcc: ' . implode(', ', $consult_bcc_emails) . "\r\n";
    
            wp_mail($to, $subject, $message, $headers);
        }
    
    }
    
    public static function get_consult_moment() {
        $datetime = static::get_consult_datetime();
        return static::get_consult_moment_by_datetime($datetime);
    }
    
    public static function get_consult_datetime($date = '', $time = '') {
        $phptime = time() + 24 * 3600;
        
        $consult_week_day = (int)date('w', $phptime);
        if($consult_week_day == 0) {
            $phptime += 24 * 3600;
        }
        elseif($consult_week_day == 6) {
            $phptime += 2 * 24 * 3600;
        }
        
        if(!$date) {
            $date = date('Y-m-d', $phptime);
        }
        
        if($time) {
            if(preg_match('/^\d{2}:\d{2}$/', $time)) {
                $time .= ':00';
            }
            $date .= ' ' . $time;
        }
        else {
            $date .= ' 12:00:00';
        }
        
        return $date;
    }
    
    public static function get_consult_moment_by_datetime($datetime) {
        $phptime = strtotime($datetime);
        $consult_date = date('d.m.Y', $phptime);
        
        $consult_week_day = (int)date('w', $phptime);
        $consult_week_day_str = __('itv_week_day_' . $consult_week_day, 'tst');
        
        $time_str = date('H:i', $phptime);
        
        return array('week_day_str' => $consult_week_day_str, 'date_str' => $consult_date, 'time_str' => $time_str);
    }
    
    public static function get_consultant_consult_datetime($consultant) {
        $datetime = '';
        $consult_time = self::get_consultant_cfg_val($consultant->user_email, 'time');
        $datetime = static::get_consult_datetime('', $consult_time);
        while(static::is_consultant_time_buzy($consultant->ID, $datetime)) {
            $date = new DateTime($datetime);
            $date->add(new DateInterval('PT1H'));
            $datetime = static::get_consult_datetime($date->format('Y-m-d'), $date->format('H:i'));
        }
        return $datetime;
    }
    
    public static function is_consultant_time_buzy($user_id, $datetime_str) {
        $args = array(
            'post_type' => 'consult',
            'meta_query' => array(
                array(
                    'key' => 'consult_moment',
                    'value' => $datetime_str,
                    'compare' => '=',
                )
            )
        );
        $query = new WP_Query($args);
        $ret = false;
        while ($query->have_posts()) { 
            $query->the_post();
            $post = $query->post;
            $consultant = $post ? ItvConsult::get_consult_consultant($post) : null;
            if($consultant && $consultant->ID == $user_id) {
                $ret = true;
                break;
            }
        }
        return $ret;
    }
    
    public static function get_consult_consultant($post) {
        $users = get_users( array(
            'connected_type' => 'consult-consultant',
            'connected_items' => $post
        ));
        return count($users) ? $users[0] : null;
    }
}

// consultations
function itv_filter_consult_by_state() {
    return ItvConsult::filter_consult_by_state();
}
add_action('restrict_manage_posts', 'itv_filter_consult_by_state');

function itv_convert_term_id_to_term_slug_in_query($query) {
    return ItvConsult::convert_term_id_to_term_slug_in_query($query);
}
add_filter('parse_query', 'itv_convert_term_id_to_term_slug_in_query');

function array_push_after($src,$in,$pos){
    if(is_int($pos)) $R=array_merge(array_slice($src,0,$pos+1), $in, array_slice($src,$pos+1));
    else{
        foreach($src as $k=>$v){
            $R[$k]=$v;
            if($k==$pos)$R=array_merge($R,$in);
        }
    }return $R;
}

function itv_consult_manage_columns($columns) {
    global $typenow;
    if($typenow == 'consult') {
        unset($columns['p2p-to-task-consult']);
        unset($columns['taxonomy-consult_state']);
        unset($columns['subscribe-reloaded']);
        unset($columns['title']);
        unset($columns['date']);
        $columns = array_push_after($columns, array('custom-consult-state' => __('Consult state custom column', 'tst')), 'taxonomy-consult_source');
        $columns = array_push_after($columns, array('consult-task-title' => __('Consult task title', 'tst')), 'cb');
        $columns['consult-datetime'] = __('Consult Date', 'tst');
    }
    return $columns;
}

function itv_consult_manage_custom_columns($column) {
    global $post;
    if($column == 'consult-task-title') {
        $tasks = get_posts( array(
            'connected_type' => 'task-consult',
            'connected_items' => $post->ID
        ));
        $task = count($tasks) > 0 ? $tasks[0] : null;
        
        if($task) {
            $view_task_link = "<a href='".get_post_permalink($task->ID)."' target='_blank'>" . $post->post_title . "</a>";
            $edit_task_link = " <a title='".__('Edit task', 'tst')."' href='".get_edit_post_link($task->ID)."' target='_blank' class='dashicons-before dashicons-edit'></a>";
            $edit_consult_link = " <a title='".__('Consult settings', 'tst')."' href='".get_edit_post_link($post->ID)."' target='_blank' class='dashicons-before dashicons-admin-generic'></a>";
            echo $view_task_link . $edit_task_link . $edit_consult_link;
        }
        else {
            $external_post_link = get_post_meta($post->ID, 'external_post_link', true);
            $view_task_link = "<a href='".$external_post_link."' target='_blank'>" . $post->post_title . "</a>";
            $edit_consult_link = " <a title='".__('Consult settings', 'tst')."' href='".get_edit_post_link($post->ID)."' target='_blank' class='dashicons-before dashicons-admin-generic'></a>";
            echo $view_task_link . ' ' . $edit_consult_link;
        }
    }
    elseif($column == 'p2p-from-consult-consultant') {
        $consultant = ItvConsult::get_consult_consultant($post);
        $consultant_id = $consultant ? $consultant->ID : false;
        ItvConsult::show_consultants_dropdown($consultant_id, true, array(
            'name' => 'one_consult_consultant', 
            'id' => 'one_consult_consultant' . $post->ID, 
            'class' => 'one_consult_consultant'
        ));
    }
    elseif($column == 'custom-consult-state') {
        $taxonomy  = 'consult_state';
        $selected = wp_get_post_terms( $post->ID, 'consult_state');
        wp_dropdown_categories(array(
            'taxonomy'        => $taxonomy,
            'name'            => $taxonomy,
            'orderby'         => 'name',
            'selected'        => count($selected) ? $selected[0]->term_id : false,
            'show_count'      => false,
            'hide_empty'      => false,
            'name' => 'one_consult_state',
            'id' => 'one_consult_state' . $post->ID, 
            'class' => 'one_consult_state',
        ));
    }
    elseif($column == 'consult-datetime') {
        $datetime = get_post_meta($post->ID, 'consult_moment', true);
        if(!preg_match('/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/', ''.$datetime)) {
            $datetime = '';
        }
        $datetime = preg_replace('/:\d{2}$/', '', $datetime);
        echo '<input type="text" value="'. $datetime . '" class="consult-datetime-input-field" id="'.'one_consult_datetime' . $post->ID.'" />';
    }
}

function itv_consult_custom_content() {
    $current_site = get_current_blog_id();
    if($current_site == 1){
        ItvConsult::init_consult();
    }
}
add_action('init', 'itv_consult_custom_content', 25);

function itv_consult_admin_init() {
    add_filter('manage_posts_columns', 'itv_consult_manage_columns');
    add_action("manage_posts_custom_column", "itv_consult_manage_custom_columns");
}
add_action('admin_init' , 'itv_consult_admin_init');

function itv_consult_change_datetime() {
    $res = array('status' => 'error');
    try {
        update_post_meta( (int)$_POST['consult_id'], 'consult_moment', $_POST['datetime'] . ':00' );
        $res = array('status' => 'ok');
    }
    catch(Exception $ex) {}

    wp_die(json_encode($res));
}
add_action('wp_ajax_change-consult-datetime', 'itv_consult_change_datetime');

function itv_consult_change_state() {
    $res = array('status' => 'error');
    try {
        wp_set_post_terms( (int)$_POST['consult_id'], (int)$_POST['state_term_id'], 'consult_state', false );
        
        // update old type consultation request
        $tasks = get_posts( array(
            'connected_type' => 'task-consult',
            'connected_items' => (int)$_POST['consult_id']
        ));
        $task = count($tasks) > 0 ? $tasks[0] : null;
        if($task) {
            $term = get_term((int)$_POST['state_term_id'], 'consult_state');
            if($term && $term->slug == 'done') {
                update_field('is_tst_consult_done', true, $task->ID);
            }
            else {
                update_field('is_tst_consult_done', false, $task->ID);
            }
        }
        
        $res = array('status' => 'ok');
    }
    catch(Exception $ex) {}
    
    wp_die(json_encode($res));
}
add_action('wp_ajax_change-consult-state', 'itv_consult_change_state');

function itv_consult_change_consultant() {
    $res = array('status' => 'error');
    try {
        $users = get_users( array(
            'connected_type' => 'consult-consultant',
            'connected_items' => (int)$_POST['consult_id']
        ));
        foreach($users as $user) {
            p2p_type('consult-consultant')->disconnect( (int)$_POST['consult_id'], $user->ID );
        }
        p2p_type('consult-consultant')->connect( (int)$_POST['consult_id'], (int)$_POST['consultant_id'], array());
        
        $res = array('status' => 'ok');
    }
    catch(Exception $ex) {}
    
    wp_die(json_encode($res));
}
add_action('wp_ajax_change-consult-consultant', 'itv_consult_change_consultant');

function itv_consult_custom_author( $author_link ) {
    global $typenow;
    global $post;
    if($typenow == 'consult') {
        $external_user_name = get_post_meta($post->ID, 'external_user_name', true);
        $external_user_email = get_post_meta($post->ID, 'external_user_email', true);
        if($external_user_email || $external_user_email) {
            $author_link = '<span class="consult-external-author">'.$external_user_name . '<br />' . $external_user_email.'</span>';
        }
    }
    return $author_link;
}

function itv_change_consult_author_in_list() {
    add_filter(
        'the_author',
        'itv_consult_custom_author',
        100,
        1
    );
}
add_action('admin_head-edit.php', 'itv_change_consult_author_in_list');
