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
        array('slug' => "legal-services", 'name' => "Юридические услуги", 'old_terms' => ['yuridicheskie-uslugi']),
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
            ['slug' => "contextual-ads", 'name' => "Контекстная реклама", 'old_terms' => ['kontekstnaya-reklama-2', 'marketing-i-reklama-2']],
            ['slug' => "creative-campaigns", 'name' => "Креативные кампании", 'old_terms' => ['reklamnye-kampanii-planirovanie-2', 'nejming-2   ']],
            ['slug' => "crowdfunding", 'name' => "Краудфандинг",],
            ['slug' => "copywriting", 'name' => "Копирайтинг", 'old_terms' => ['kopirajting-2', 'teksty-2']],
            ['slug' => "targeting", 'name' => "Таргетинг", 'old_terms' => ['pr-2']],
            ['slug' => "press-release", 'name' => "Пресс-релизы", 'old_terms' => ['press-relizy-2']],
            ['slug' => "translation", 'name' => "Переводы", 'old_terms' => ['perevody-2']],
            ['slug' => "newsletter", 'name' => "Рассылки",],
            ['slug' => "fundraising", 'name' => "Фандрайзинг",],
            ['slug' => "google-grants", 'name' => "Google Grants",],
            ['slug' => "smm", 'name' => "SMM", 'old_terms' => ['smm', 'fb']],
        ],
        'foto-and-video' => [
            ['slug' => "video-edit", 'name' => "Видеомонтаж", 'old_terms' => ['video', 'videomontazh-2']],
            ['slug' => "photo-edit", 'name' => "Обработка фото", 'old_terms' => ['fotografiya-2']],
            ['slug' => "filming", 'name' => "Съёмка", 'old_terms' => ['videosyomka-2']],
        ],
        'analytics' => [
            ['slug' => "data", 'name' => "Данные",],
            ['slug' => "yandex-metrica", 'name' => "Яндекс.Метрика",],
            ['slug' => "google-analytics", 'name' => "Google Analytics",],
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
