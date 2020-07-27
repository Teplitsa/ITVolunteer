<?php

set_time_limit (0);
ini_set('memory_limit','256M');

use Pelago\Emogrifier\CssInliner;

try {
	$time_start = microtime(true);
	include('cli_common.php');
	echo 'Memory before anything: '.memory_get_usage(true).chr(10).chr(10);
	
	$posts_data = [];
	
    $posts_data = [
        [
            'post_title' => "Что должен знать автор задачи перед ее постановкой",
            'post_name' => "create_task_agreement",
            'post_content' => <<<HTML
<!-- wp:paragraph -->
<p>Публикуя задачу на платформе IT-волонтер, я соглашаюсь с правилами.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>Я ставлю задачу от имени некоммерческой организации или инициативы</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Для IT-волонтеров важны некоммерческие цели и социальный эффект от той помощи, которую они вам оказывают. Поэтому они готовы помогать только социально ориентированным некоммерческим организациям, социальным проектам и инициативам.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>К сожалению, на платформе не публикуются задачи от коммерческих, религиозных или политических организаций. <a href="/conditions/" target="_blank">Почему?</a></p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>Я понимаю, как работать с волонтерами, и хочу заботиться об их мотивации</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p><a href="/sovety-dlya-nko-uspeshnye-zadachi/" target="_blank">Прочитайте</a>, какие советы дают опытные IT-волонтеры: как правильно поставить задачу, как мотивировать помогать вам, как избежать распространенных ошибок.</p>
<!-- /wp:paragraph -->
HTML,
        ],
    ];
	    
	Itv_Setup_Utils::setup_posts_data($posts_data, "page");
	
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
