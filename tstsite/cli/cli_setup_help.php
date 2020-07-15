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
	
    $posts_data = [
        [
            'post_title' => "Я ставлю задачу от имени некоммерческой организации или инициативы",
            'post_content' => "
<p>
Для IT-волонтеров важны некоммерческие цели и социальный эффект от той помощи, которую они вам оказывают. Поэтому они готовы помогать только социально ориентированным некоммерческим организациям, социальным проектам и инициативам.              
</p>
<p>
К сожалению, на платформе не публикуются задачи от коммерческих, религиозных или политических организаций. Почему? (Линк на правила со списком СО НКО.)
</p>
",
        ],
    ];
	    
    $terms = array(
        // array('slug' => "", 'name' => "",),
    );	
    // Itv_Setup_Utils::setup_terms_data($terms, $tax);
    
	Itv_Setup_Utils::setup_posts_data($posts_data, "help");
	
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
