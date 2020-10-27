<?php

set_time_limit (0);
ini_set('memory_limit','256M');

try {
	$time_start = microtime(true);
	include('cli_common.php');
	echo 'Memory before anything: '.memory_get_usage(true).chr(10);
    echo 'START'.chr(10).chr(10);

    global $wpdb;

    // tags
    $tax = 'post_tag';
    $top_level_terms = [
        array('slug' => "web-and-dev", 'name' => "Веб-сайты и разработка",),
        array('slug' => "design", 'name' => "Дизайн и оформление",),
        array('slug' => "marketing", 'name' => "Маркетинг и коммуникации",),
        array('slug' => "foto-and-video", 'name' => "Фото и видео",),
        array('slug' => "analytics", 'name' => "Аналитика",),
        array('slug' => "legal-services", 'name' => "Юридические услуги",),
    ];
    Itv_Setup_Utils::setup_terms_data($terms, $tax);

    $sub_level_terms = [
        'web-and-dev' => [
            ['slug' => "audit-and-seo", 'name' => "Аудит и SEO", 'old_terms' => ['seo-poiskovaya-optimizatsiya-2', 'audit-sajtov-2']],
            ['slug' => "database", 'name' => "Базы данных", 'old_terms' => ['bazy-dannyh']],
            ['slug' => "markup", 'name' => "Верстка", 'old_terms' => ['veb-sajt', 'programmirovanie', 'vyorstka-2']],
            ['slug' => "leyka-and-payment", 'name' => "Лейка и платежные системы",],
            ['slug' => "mobile-dev", 'name' => "Мобильная разработка", 'old_terms' => ['prilozhenie-dlya-mobilnyh', 'android', 'ios']],
            ['slug' => "site-migration", 'name' => "Перенос и настройка сайта",],
            ['slug' => "site-and-landing", 'name' => "Сайты и лендинги под ключ", 'old_terms' => ['sajt-pod-klyuch-2']],
            ['slug' => "techsupport", 'name' => "Техподдержка и хостинг",],
            ['slug' => "kandinsky", 'name' => "Установка «Кандинского»",],
            ['slug' => "digital-security", 'name' => "Цифровая безопасность",
            ['slug' => "wordpress", 'name' => "WordPress", 'old_terms' => ['wordpress', 'obuchenie-konsultatsii-2', 'testirovanie-2']],
        ],
        'design' => [
            ['slug' => "banners", 'name' => "Баннеры", 'old_terms' => ['bannery']],
            ['slug' => "brandbook", 'name' => "Брендбук", 'old_terms' => ['firmennyj-stil-2']],
            ['slug' => "web-design", 'name' => "Веб-дизайн", 'old_terms' => ['neslozhno', 'dizajn-sajtov-2', 'vdumchivo']],
            ['slug' => "infographics", 'name' => "Инфографика", 'old_terms' => ['infografika-2']],
            ['slug' => "picture", 'name' => "Иллюстрации и рисунки", 'old_terms' => ['risunki-i-illyustratsii-2']],
            ['slug' => "logo", 'name' => "Логотипы", 'old_terms' => ['logotipy-2', 'vektornaya-grafika-2']],
            ['slug' => "presentation-and-report", 'name' => "Презентации и отчёты", 'old_terms' => ['reklama-prezentatsii-2', 'powerpoint-2']],
            ['slug' => "polygraphy", 'name' => "Полиграфия", 'old_terms' => ['poligrafiya-2', 'materials-2']],
            ['slug' => "social-networking", 'name' => "Соцсети", 'old_terms' => ['oformlenie-sotssetej-2']],
        ],
        'marketing' => [
            ['slug' => "contextual-ads", 'name' => "Контекстная реклама",],
            ['slug' => "creative-campaigns", 'name' => "Креативные кампании",],
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
        ],
        'foto-and-video' => [
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
        ],
        'analytics' => [
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
            ['slug' => "", 'name' => "",],
        ],
        'legal-services' => [
            ['slug' => "", 'name' => "",],
        ],
    ];

    // nko tags

    chr(10) . chr(10);
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
