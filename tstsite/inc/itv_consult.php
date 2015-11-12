<?php

class ItvConsult {
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
                #'value_field'     => 'slug', // this option does not work properly
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
            $selected = isset($_GET['user']) ? $_GET['user'] : '';
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
        $consultant_emails = ItvConfig::instance()->get('CONSULT_EMAILS');
        $users_id_list = array();
        foreach($consultant_emails as $email) {
            $user = get_user_by('email', $email);
            if($user) {
                $users_id_list[] = $user->ID;
            }
        }
        return $users_id_list;
    }
    
    public static function get_consultant_user() {
        $consultant_emails = ItvConfig::instance()->get('CONSULT_EMAILS');
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
        
        $consultant = static::get_consultant_user();
        if($consultant) {
            p2p_type('consult-consultant')->connect($consult_id, $consultant->ID, array());
            
            static::tst_send_admin_notif_consult_needed($task_id);
            static::tst_send_user_notif_consult_needed($task_id);
        }
    }

    function tst_send_admin_notif_consult_needed($post_id) {
        $itv_config = ItvConfig::instance();
    
        $consult_emails = $itv_config->get('CONSULT_EMAILS');
        $email_from = $itv_config->get('EMAIL_FROM');
    
        $task = get_post($post_id);
    
        if($task && count($consult_emails) > 0) {
            $to = $consult_emails[0];
            $other_emails = array_slice($consult_emails, 1);
            $message = __('itv_email_test_consult_needed_message', 'tst');
            $data = array(
                            '{{task_url}}' => '<a href="' . get_permalink($post_id) . '">' . get_permalink($post_id) . '</a>',
                            '{{task_title}}' => get_the_title($post_id),
                            '{{task_content}}' => $task->post_content
            );
            $message = str_replace(array_keys($data), $data, $message);
            $message = str_replace("\\", "", $message);
            $message = nl2br($message);
    
            $subject = __('itv_email_test_consult_needed_subject', 'tst');
    
            $headers  = 'MIME-Version: 1.0' . "\r\n";
            $headers .= 'Content-type: text/html; charset=UTF-8' . "\r\n";
            $headers .= 'From: ' . __('ITVounteer', 'tst') . ' <'.$email_from.'>' . "\r\n";
            if(count($other_emails) > 0) {
                $headers .= 'Cc: ' . implode(', ', $other_emails) . "\r\n";
            }
            wp_mail($to, $subject, $message, $headers);
        }
    }
    
    function tst_send_user_notif_consult_needed($post_id) {
        $itv_config = ItvConfig::instance();
    
        $consult_email_from = $itv_config->get('CONSULT_EMAIL_FROM');
        $consult_emails = $itv_config->get('CONSULT_EMAILS');
    
        $task = get_post($post_id);
        $task_author = (isset($task->post_author)) ? get_user_by('id', $task->post_author) : false;
        if($task_author) {
            $to = $task_author->user_email;
    
            $consult_week_day = (int)date('w');
    
            $consult_date_dif = 0;
            if($consult_week_day >= 0 && $consult_week_day < 5) {
                $consult_date_dif = 1;
            }
            else {
                $consult_date_dif = 8 - $consult_week_day;
            }
            $consult_date = date('d.m.Y', time() + $consult_date_dif * 24 * 3600);
    
            if($consult_week_day >=5) {
                $consult_week_day = 1;
            }
            else {
                $consult_week_day += 1;
            }
            $consult_week_day_str =  __('itv_week_day_' . $consult_week_day, 'tst');
    
            $message = __('itv_email_test_consult_needed_notification', 'tst');
            $data = array(
                            '{{consult_week_day}}' => $consult_week_day_str,
                            '{{consult_date}}' => $consult_date,
                            '{{task_url}}' => '<a href="' . get_permalink($post_id) . '">' . get_permalink($post_id) . '</a>',
                            '{{task_title}}' => get_the_title($post_id),
            );
            $message = str_replace(array_keys($data), $data, $message);
            $message = str_replace("\\", "", $message);
            $message = nl2br($message);
    
            $subject = __('itv_email_test_consult_needed_notification_subject', 'tst');
    
            $headers  = 'MIME-Version: 1.0' . "\r\n";
            $headers .= 'Content-type: text/html; charset=UTF-8' . "\r\n";
            $headers .= 'From: ' . __('ITVounteer', 'tst') . ' <'.$consult_email_from.'>' . "\r\n";
            $headers .= 'Bcc: ' . implode(', ', $consult_emails) . "\r\n";
    
            wp_mail($to, $subject, $message, $headers);
        }
    
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
        $columns = array_push_after($columns, array('custom-consult-state' => __('Consult state custom column', 'tst')), 'taxonomy-consult_source');
    }
    return $columns;
}

function itv_consult_manage_custom_columns($column) {
    global $post;
    if($column == 'p2p-from-consult-consultant') {
        $users = get_users( array(
            'connected_type' => 'consult-consultant',
            'connected_items' => $post
        ));
        $consultant_id = count($users) ? $users[0]->ID : false;
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
}

function itv_consult_admin_init() {
    add_filter('manage_posts_columns', 'itv_consult_manage_columns');
    add_action("manage_posts_custom_column", "itv_consult_manage_custom_columns");
}
add_action('admin_init' , 'itv_consult_admin_init');

function itv_consult_change_state() {
    $res = array('status' => 'error');
    try {
        wp_set_post_terms( $_POST['consult_id'], $_POST['state_term_id'], 'consult_state', false );
        $res = array('status' => 'ok');
    }
    catch(Exception $ex) {}
    sleep(1);
    wp_die(json_encode($res));
}
add_action('wp_ajax_change-consult-state', 'itv_consult_change_state');

function itv_consult_change_consultant() {
    $res = array('status' => 'error');
    try {
        #wp_set_post_terms( $_POST['consult_id'], $_POST['consultant_term_id'], 'consult_state' );
        $res = array('status' => 'ok');
    }
    catch(Exception $ex) {}
    sleep(1);
    wp_die(json_encode($res));
}
add_action('wp_ajax_change-consult-consultant', 'itv_consult_change_consultant');

__("Show All Consult states", 'tst');
