<?php

namespace ITV\cli;

use ITV\models\{Task, MongoClient, MemberManager, MemberRatingDoers};

if (!class_exists('\WP_CLI')) {
    return;
}

class UserRoles
{
    function setup($args, $assoc_args)
    {
        $this->add_custom_roles();
        $this->convert_roles();
        $this->convert_paseka_members();

        \WP_CLI::success(__('User roles setup successfully completed.', 'itv-backend'));
    }

    function add_custom_roles()
    {
        add_role( MemberManager::$ROLE_DOER, __('Volunteer', 'itv-backend') );
        add_role( MemberManager::$ROLE_AUTHOR, __('Customer', 'itv-backend') );
        add_role( MemberManager::$ROLE_PASEKA_MEMBER, __('Paseka member', 'itv-backend') );
    }

    function convert_roles()
    {
        global $wpdb;

        $current_user_id = \get_current_user_id(); // set by --user param
        $user_id_list = $current_user_id ? [$current_user_id] : $wpdb->get_col( $wpdb->prepare( 
            "SELECT users.ID
                FROM        {$wpdb->users} users
                ORDER BY    users.id"
        ));

        $role_mapping = [
            'doer' => MemberManager::$ROLE_DOER,
            'author' => MemberManager::$ROLE_AUTHOR,
        ];

        foreach($user_id_list as $user_id) {
            \WP_CLI::line("user: " . $user_id);

            $user_data = \get_userdata($user_id);
            \WP_CLI::line("roles: " . implode(", ", $user_data->roles));

            if(!in_array(MemberManager::$ROLE_DOER, $user_data->roles) && !in_array(MemberManager::$ROLE_AUTHOR, $user_data->roles)) {
                $role = \get_user_meta($user_id, MemberManager::$meta_role, true);
                if($role && !empty($role_mapping[$role])) {
                    $user = new \WP_User($user_id);
                    $user->add_role( $role_mapping[$role] );
                    \WP_CLI::line("add role: " . $role_mapping[$role]);
                }
            }
            
        }        
    }

    function convert_paseka_members()
    {
        global $wpdb;

        $current_user_id = \get_current_user_id(); // set by --user param
        $user_id_list = $current_user_id ? [$current_user_id] : $wpdb->get_col( $wpdb->prepare( 
            "SELECT users.ID
                FROM        {$wpdb->users} users
                ORDER BY    users.id"
        ));

        $role_mapping = [
            'doer' => MemberManager::$ROLE_DOER,
            'author' => MemberManager::$ROLE_AUTHOR,
        ];

        foreach($user_id_list as $user_id) {
            \WP_CLI::line("user: " . $user_id);

            $user_data = \get_userdata($user_id);
            \WP_CLI::line("roles: " . implode(", ", $user_data->roles));

            if(!in_array(MemberManager::$ROLE_PASEKA_MEMBER, $user_data->roles)) {
                $user = new \WP_User($user_id);
                if(boolval(\itv_is_user_paseka_member($user_id))) {
                    \WP_CLI::line("add role: " . MemberManager::$ROLE_PASEKA_MEMBER);
                    $user->add_role( MemberManager::$ROLE_PASEKA_MEMBER );
                }
            }
            
        }        
    }
}

\WP_CLI::add_command('itv_user_roles', '\ITV\cli\UserRoles');
