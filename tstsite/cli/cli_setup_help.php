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
	$tax = 'help_category';
	
    $posts_data = [
        [
            'post_title' => "Как правильно дать название задачи?",
            'post_name' => 'kak-pravilno-dat-nazvanie-zadachi',
            'post_content' => "
<h1>Как правильно дать название задачи?</h1>
<p>Хороший заголовок содержит в себе краткое и точное описание задачи, с учетом её специфики.</p>
<p>Например: «сделать сайт благотворительной организации» — плохой заголовок. «Настроить сайт на WP для поиска пропавших граждан РФ» — лучше.</p>
<p>В хорошем заголовке должны быть указана желаемая технология, например:</p>
<ul>
 <li>сайт на WP</li>
 <li>приложение под андроид</li>
 <li>макет в EPS</li>
 <li>и так далее.</li>
</ul>
<p>Указание на то, для чего это всё (кратко, в два-три слова):</p>
<ul>
 <li>поиск граждан,</li>
 <li>помощь детям,</li>
 <li>помощь домашним животным,</li>
 <li>помощь врачам.</li>
</ul>
<p>Хороший заголовок содержит в себе краткое и точное описание задачи, с учетом её специфики.</p>
<p>Например: «сделать сайт благотворительной организации» — плохой заголовок. «Настроить сайт на WP для поиска пропавших граждан РФ» — лучше.</p>
<p>Хороший заголовок содержит в себе краткое и точное описание задачи, с учетом её специфики.</p>
<p>Например: «сделать сайт благотворительной организации» — плохой заголовок. «Настроить сайт на WP для поиска пропавших граждан РФ» — лучше.</p>
<p>Хороший заголовок содержит в себе краткое и точное описание задачи, с учетом её специфики.</p>
<p>Например: «сделать сайт благотворительной организации» — плохой заголовок. «Настроить сайт на WP для поиска пропавших граждан РФ» — лучше.</p>
",
            'tax_terms' => array(
                $tax => ['org-advices'],
            ),

        ],
    ];
	    
    $terms = array(
        array('slug' => "org-advices", 'name' => "Советы для организаций",),
    );	
    Itv_Setup_Utils::setup_terms_data($terms, $tax);
    
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
