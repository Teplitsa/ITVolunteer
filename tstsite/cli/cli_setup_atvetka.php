<?php

set_time_limit (0);
ini_set('memory_limit','256M');

use Pelago\Emogrifier\CssInliner;

try {
	$time_start = microtime(true);
	include('cli_common.php');
	echo 'Memory before anything: '.memory_get_usage(true).chr(10).chr(10);
	
	$posts_data = [];
	$terms = [];
	$tax = 'atv_notif_events';
	
	foreach(\ItvEmailTemplates::instance()->get_all_email_templates() as $email_name => $email_template) {
        $message_title = $email_template['title'];
        
	    $message_content = !empty(\ItvEmailTemplates::instance()->email_templates_atvetka_style[$email_name]) ? \ItvEmailTemplates::instance()->email_templates_atvetka_style[$email_name]['text'] : $email_template['text'];
	    $message_content = preg_replace('/\{\{([a-z_]+)\}\}/', '{\1}', $message_content);
	    $message_content = wpautop( $message_content );	    
	    
	    ob_start();
	    include(get_template_directory() . '/mail/message_template.php');
	    $message_content = ob_get_clean();
	    
	    $message_content = CssInliner::fromHtml($message_content)->inlineCss()->render();
	    $message_content = preg_replace('/[\r\n]/', '', $message_content);
	    
	    $posts_data[] = [
            'post_title' => $message_title,
            'post_content' => $message_content,
	        'post_content_raw' => $message_content,
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
