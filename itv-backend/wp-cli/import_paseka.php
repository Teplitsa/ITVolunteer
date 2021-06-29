<?php

namespace ITV\cli;

use ITV\models\MemberManager;

if (!class_exists('\WP_CLI')) {
    return;
}

require_once(get_theme_file_path() . '/post-types/paseka.php');

class PasekaImport
{
    private const BLOG_ID_PASEKA = 2;
    private const BLOG_ID_ITV = 1;

    private static $paseka_members_post_type = 'member';

    function import_members($args, $assoc_args)
    {
        switch_to_blog( self::BLOG_ID_PASEKA );

        $args = [
            'post_type' => self::$paseka_members_post_type,
            'post_status' => 'publish',
            'posts_per_page' => -1,
            'fields' => 'ids',
            // 'connected_type' => 'user_member',
            // 'name' => 'studiya-mozga',
        ];
    
        $q = new \WP_Query($args);
        $paseka_members = $q->get_posts();

        foreach($paseka_members as $member_id) {
            \WP_CLI::line(sprintf( __('Member ID: %s', 'itv-backend'), $member_id) );

            $member = get_post($member_id);
            \WP_CLI::line(sprintf( __('Member: [%s] %s', 'itv-backend'), $member->post_name, $member->post_title) );

            $is_inactive_member = boolval(get_post_meta($member_id, 'inactive_member', true));
            if($is_inactive_member) {
                \WP_CLI::line(sprintf( __('Inactive member: [%s] %s', 'itv-backend'), $member->post_name, $member->post_title) );
                continue;
            }

            $arr = [
                'connected_type' => 'user_member',
                'connected_direction' => 'from',
                'connected_items' => $member_id,
            ];
            $users = get_users($arr);

            \WP_CLI::line(sprintf( __('Users count: %s.', 'itv-backend'), count($users)) );

            $is_new_user_created = false;
            $is_new_on_itv = false;

            if(!count($users)) {
                \WP_CLI::line(sprintf( __('No users connected to: %s', 'itv-backend'), $member_id) );
                \WP_CLI::line(sprintf( __('No users connected member paseka link: %s', 'itv-backend'), get_permalink($member_id)) );

                $user = $this->create_new_paseka_user($member);
                $is_new_user_created = true;
            }
            else {
                $user = $users[0];
                \WP_CLI::line(sprintf( __('Existing user: [%s] %s', 'itv-backend'), $user->ID, $user->user_nicename) );
            }

            $user_blogs = get_blogs_of_user($user->ID);
            \WP_CLI::line(sprintf( __('User blogs: %s', 'itv-backend'), implode(",", array_map(function($user_blog) {
                return $user_blog->userblog_id;
            }, $user_blogs))) );

            if(!is_user_member_of_blog($user->ID, self::BLOG_ID_ITV)) {
                \WP_CLI::line(sprintf( __('Not ITV user. Add to ITV: [%s] %s', 'itv-backend'), $user->ID, $user->user_nicename) );
                $this->add_user_on_itv($user);
                $is_new_on_itv = true;
            }
            else {
                \WP_CLI::line(sprintf( __('Already ITV user: [%s] %s', 'itv-backend'), $user->ID, $user->user_nicename) );
            }

            if($is_new_user_created) {
                \WP_CLI::line(sprintf( __('New user profile link: %s', 'itv-backend'), get_site_url(self::BLOG_ID_ITV, '/members/' . $user->user_nicename)) );
                \WP_CLI::line(sprintf( __('Edit new user account: %s', 'itv-backend'), get_site_url(self::BLOG_ID_ITV, "/wp-admin/user-edit.php?user_id=" . $user->ID)) );
            }

            $this->update_itv_user_meta($user, $member, $is_new_on_itv);
        }
        
        \WP_CLI::success(__('Members imported.', 'itv-backend'));
    }

    public function update_itv_user_meta($user, $member, $is_new_on_itv) {
        $user_participation = get_user_meta($user->ID, 'user_participation', true);
        if(!empty($user_participation)) {
            array_push($user_participation, 'paseka');
            $user_participation = array_unique($user_participation);
        }
        else {
            $user_participation = ['paseka'];
        }           

        update_user_meta($user->ID, 'user_participation', $user_participation);

        if($is_new_on_itv) {
            update_user_meta($user->ID, 'user_workplace', $member->post_title);
            update_user_meta($user->ID, 'user_workplace_desc', $member->post_content);
        }
    }

    public function create_new_paseka_user($member)
    {
        $itv_login = itv_get_unique_user_login(itv_translit_sanitize("paseka-" . $member->post_name));
        $user_params = array(
            'user_login' => $itv_login,
            'user_email' => $itv_login . "@ngo2.ru",
            'user_pass' => wp_generate_password(),
            'first_name' => filter_var($member->post_title, FILTER_SANITIZE_STRING),
            'user_url' => get_post_meta($member->ID, 'doer_url', true),
            'role' => 'author',
        );
        // print_r($user_params);
        $reg_result = wp_insert_user($user_params);

        $user = null;

        if(!$reg_result || is_wp_error($reg_result)) {
            if(is_wp_error($reg_result)) {
                \WP_CLI::line(sprintf( __('User creation error: %s', 'itv-backend'), $reg_result->get_error_message() ) );
            }
            \WP_CLI::error(sprintf( __('User creation failed: %s', 'itv-backend'), get_permalink($member_id) ) );
        }
        else {
            $user = get_user_by('id', $reg_result);
            $connection_result = p2p_type('user_member')->connect($member, $user, array());

            \WP_CLI::line(sprintf( __('New user created: [%s] %s', 'itv-backend'), $user->ID, $user->user_nicename) );
        }

        return $user;
    }

    public function add_user_on_itv($user)
    {
        add_user_to_blog(self::BLOG_ID_ITV, $user->ID, 'author');

        switch_to_blog( self::BLOG_ID_ITV );
        $itv_user = get_user_by('id', $user->ID);
        $itv_user->add_role( MemberManager::$ROLE_PASEKA_MEMBER );
        $itv_user->add_role( MemberManager::$ROLE_DOER );
        switch_to_blog( self::BLOG_ID_PASEKA );
    }
}

\WP_CLI::add_command('itv_import_paseka', '\ITV\cli\PasekaImport');
