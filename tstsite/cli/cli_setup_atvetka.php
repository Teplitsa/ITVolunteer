<?php

set_time_limit (0);
ini_set('memory_limit','256M');

try {
	$time_start = microtime(true);
	include('cli_common.php');
	echo 'Memory before anything: '.memory_get_usage(true).chr(10).chr(10);
	
	$posts_data = [];
	$terms = [];
	$tax = 'atv_notif_events';
	
	foreach(\ItvEmailTemplates::instance()->get_all_email_templates() as $email_name => $email_template) {
	    $email_template_text = !empty(\ItvEmailTemplates::instance()->email_templates_atvetka_style[$email_name]) ? \ItvEmailTemplates::instance()->email_templates_atvetka_style[$email_name]['text'] : $email_template['text'];
	    $email_template_text = preg_replace('/\{\{([a-z_]+)\}\}/', '{\1}', $email_template_text);
	    
	    $posts_data[] = [
            'post_title' => $email_template['title'],
            'post_content' => $email_template_text,
            'post_name' => $email_name,
            'tax_terms' => array(
                $tax => array($email_name),
            ),
	    ];
	    
        $terms = array(
            array('slug' => $email_name, 'name' => $email_name,),
        );
	}
	
    Itv_Setup_Utils::setup_terms_data($terms, $tax);
	Itv_Setup_Utils::setup_posts_data($posts_data, ATV_Email_Notification::POST_TYPE);
    
	echo 'DONE'.chr(10);

	//Final
	echo 'Memory '.memory_get_usage(true).chr(10);
	echo 'Total execution time in sec: ' . (microtime(true) - $time_start).chr(10).chr(10);
    
}
catch (ItvNotCLIRunException $ex) {
	echo $ex->getMessage() . "\n";
}
catch (ItvCLIHostNotSetException $ex) {
	echo $ex->getMessage() . "\n";
}
catch (Exception $ex) {
	echo $ex;
}
