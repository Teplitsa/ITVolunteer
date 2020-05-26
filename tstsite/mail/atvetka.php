<?php
class ItvAtvetka {
    
    private static $_instance = NULL;
    
    public function __construct() {
    }
    
    public static function instance() {
        if (ItvAtvetka::$_instance == NULL) {
            ItvAtvetka::$_instance = new ItvAtvetka ();
        }
        return ItvAtvetka::$_instance;
    }
    
    public function mail($mail_slug, $data) {
        $atvetka_data = $data;
        
        // add common data
        $common_data['mail_icon_url'] = get_template_directory_uri() . "/assets_email/img";
        
        $atvetka_data['email_placeholders'] = [];
        foreach(array_merge($data, $common_data) as $k => $v) {
            $atvetka_data['email_placeholders']["{{$k}}"] = $v;
        }
        
        error_log(print_r($atvetka_data, true));        
        do_action('atv_email_notification', $mail_slug, $atvetka_data);        
    }
}
