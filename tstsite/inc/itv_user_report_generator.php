<?php
class ItvUserReportGenerator {
    
    public function run($wpdb) {
        $users_query_params = array (
            'exclude' => ACCOUNT_DELETED_ID 
        );
        $user_query = new WP_User_Query ( $users_query_params );
        $wpdb->query ( "TRUNCATE str_users_report" );
        
        foreach ( $user_query->results as $user ) {
            
            $user_avatar = get_user_meta ( $user->ID, 'user_avatar', true );
            $is_uploaded_avatar = $user_avatar ? 1 : 0;
            
            $company_logo = get_user_meta ( $user->ID, 'user_company_logo', true );
            $is_uploaded_company_logo = $company_logo ? 1 : 0;
            
            $skills = tst_get_member_user_skills_string ( $user->ID );
            $role = tst_get_member_role_name ( $user );
            
            $user_activity = tst_get_member_activity ( $user );
            $created_tasks = $user_activity ['created'];
            $solved_tasks = $user_activity ['solved'];
            $working_tasks = count ( tst_get_user_working_tasks ( $user->ID, 'in_work' ) );
            
            // old way
            
            $reg_source_name = tstmu_get_user_reg_source_name ( $user->ID );
            $last_login = get_user_last_login_time ( $user );
            if ($last_login == '0000-00-00 00:00') {
                $last_login = '';
            }
            
            $wpdb->query ( $wpdb->prepare ( "
                    INSERT INTO " . $wpdb->prefix . "users_report
                    SET
                    ID = %d,
                    user_login = %s,
                    user_nicename = %s,
                    user_email = %s,
                    user_registered = %s,
                    display_name = %s,
                    spam = %d,
                    deleted = %d,
                    is_uploaded_avatar = %d,
                    user_city = %s,
                    user_workplace = %s,
                    is_uploaded_company_logo = %d,
                    user_speciality = %s,
                    description = %s,
                    user_website = %s,
                    user_skype = %s,
                    twitter = %s,
                    facebook = %s,
                    vk = %s,
                    googleplus = %s,
                    user_skills = %s,
                    user_contacts = %s,
                    role = %s,
                    created_tasks = %s,
                    working_tasks = %s,
                    solved_tasks = %s,
                    last_login = %s,
                    reg_source = %s
                    ", $user->ID, $user->user_login, $user->user_nicename, $user->user_email, $user->user_registered, $user->display_name, $user->spam, $user->deleted, $is_uploaded_avatar, get_user_meta ( $user->ID, 'user_city', true ), get_user_meta ( $user->ID, 'user_workplace', true ), $is_uploaded_company_logo, get_user_meta ( $user->ID, 'user_speciality', true ), str_replace ( array (
                "\n",
                "\r" 
            ), '', get_user_meta ( $user->ID, 'description', true ) ), $user->user_url, get_user_meta ( $user->ID, 'user_skype', true ), get_user_meta ( $user->ID, 'twitter', true ), get_user_meta ( $user->ID, 'facebook', true ), get_user_meta ( $user->ID, 'vk', true ), get_user_meta ( $user->ID, 'googleplus', true ), $skills, str_replace ( array (
                "\n",
                "\r" 
            ), '', get_user_meta ( $user->ID, 'user_contacts', true ) ), $role, $created_tasks, $working_tasks, $solved_tasks, $last_login, $reg_source_name ) );
        }
    }
    
    public function export_csv($wpdb, $to_file) {
        $sql = "describe " . $wpdb->prefix . "users_report";
        $columns = $wpdb->get_results ( $sql );
        $column_names = [ ];
        foreach ( $columns as $k => $v ) {
            $column_names [] = $v->Field;
        }
        
        $fp = fopen ( $to_file, 'w' );
        fputcsv ( $fp, $column_names, ";", "\"" );
        fclose ( $fp );
        
        $limit = 500;
        $offset = 0;
        while ( true ) {
            $sql = "SELECT * FROM " . $wpdb->prefix . "users_report LIMIT $offset, $limit";
            $records = $wpdb->get_results ( $sql, ARRAY_A );
            
            $fp = fopen ( $to_file, 'a' );
            foreach ( $records as $k => $row ) {
                fputcsv ( $fp, $row, ";", "\"" );
            }
            fclose ( $fp );
            $offset += $limit;
            
            if (count ( $records ) < $limit) {
                break;
            }
        }
    }
}
