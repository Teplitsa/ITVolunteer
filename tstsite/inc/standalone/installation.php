<?php

function itv_theme_setup_options() {
    global $wpdb;
    
    $check_itv_pages = $wpdb->get_var("SELECT COUNT(*) FROM `str_posts` WHERE `post_type` = 'page' AND `post_name` IN ('member-tasks', 'techpage') ");
    if(!$check_itv_pages) {
        $url = site_url();
        $find = array( 'http://', 'https://' );
        $replace = '';
        $url_no_http = str_replace( $find, $replace, $url );
        
        $url_no_http = str_replace( '/', '\/', $url_no_http );
        $url = str_replace( '/', '\/', $url);
            
        $command = "sed 's/https:\/\/itv.te-st.ru/" . $url . "/g' ";
        $command .= get_template_directory() . '/itv-new.sql';
        $command .= " | sed 's/itv.te-st.ru/" . $url_no_http . "/g' ";
        $command .= " | " . "mysql -h " . DB_HOST . " -u ".DB_USER." --password=" . DB_PASSWORD . " " . DB_NAME;
        
        $output = shell_exec($command);
    }
}

add_action("after_switch_theme", "itv_theme_setup_options");
