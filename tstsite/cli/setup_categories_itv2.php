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
    $post_type = 'tasks';
    $top_level_terms = [
        array('slug' => "web-and-dev", 'name' => "Веб-сайты и разработка",),
        array('slug' => "design", 'name' => "Дизайн и оформление",),
        array('slug' => "marketing", 'name' => "Маркетинг и коммуникации",),
        array('slug' => "foto-and-video", 'name' => "Фото и видео",),
        array('slug' => "analytics", 'name' => "Аналитика",),
        array('slug' => "legal-services", 'name' => "Юридические услуги", 'old_terms' => ['yuridicheskie-uslugi']),
    ];

    $sub_level_terms = [
        'web-and-dev' => [
            ['slug' => "audit-and-seo", 'name' => "Аудит и SEO", 'old_terms' => ['seo-poiskovaya-optimizatsiya-2', 'audit-sajtov-2']],
            ['slug' => "database", 'name' => "Базы данных", 'old_terms' => ['bazy-dannyh']],
            ['slug' => "markup", 'name' => "Верстка", 'old_terms' => ['veb-sajt', 'programmirovanie', 'vyorstka-2']],
            ['slug' => "leyka-and-payment", 'name' => "Лейка и платежные системы",],
            ['slug' => "mobile-dev", 'name' => "Мобильная разработка", 'old_terms' => ['prilozhenie-dlya-mobilnyh', 'android', 'ios']],
            ['slug' => "site-migration", 'name' => "Перенос и настройка сайта",],
            ['slug' => "site-and-landing", 'name' => "Сайты и лендинги под ключ", 'old_terms' => ['sajt-pod-klyuch-2']],
            ['slug' => "techsupport", 'name' => "Техподдержка и хостинг"],
            ['slug' => "kandinsky", 'name' => "Установка «Кандинского»"],
            ['slug' => "digital-security", 'name' => "Цифровая безопасность"],
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
            ['slug' => "creative-campaigns", 'name' => "Креативные кампании", 'old_terms' => ['reklamnye-kampanii-planirovanie-2', 'nejming-2']],
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

    itv_setup_tax_terms($tax, $top_level_terms, $sub_level_terms, $post_type);

    // nko tags
    $tax = 'nko_task_tag';
    $top_level_terms = [
        array('slug' => "help-people", 'name' => "Помогать людям в беде", 'old_terms' => ['blagotvoritelnost', 'deti-i-podrostki', 'lyudi-s-invalidnostyu', 'pall']),
        array('slug' => "improve-urban", 'name' => "Улучшить городскую среду"),
        array('slug' => "save-nature", 'name' => "Спасти природу и животных", 'old_terms' => ['zhivotnye', 'ekologiya']),
        array('slug' => "make-world-fair", 'name' => "Сделать мир справедливее", 'old_terms' => ['meropriyatiya', 'prava-cheloveka']),
        array('slug' => "system-solutions", 'name' => "Заниматься системными решениями", 'old_terms' => ['sotsialnoe-predprinimatelstvo']),
    ];

    $sub_level_terms = [
        'help-people' => [
            ['slug' => "homeless-people", 'name' => "Бездомным"],
            ['slug' => "children-crisis-families", 'name' => "Детям из кризисных семей"],
            ['slug' => "help-orphans", 'name' => "Детям-сиротам"],
            ['slug' => "people-disabilities", 'name' => "Людям с инвалидностью"],
            ['slug' => "help-ill-people", 'name' => "Людям с тяжелыми заболеваниями"],
            ['slug' => "help-migrants", 'name' => "Мигрантам и беженцам"],
            ['slug' => "help-drug-users", 'name' => "Наркопотребителям"],
            ['slug' => "help-prisoners", 'name' => "Заключенным и осужденным, вышедшим на свободу"],
            ['slug' => "help-old-people", 'name' => "Пожилым и ветеранам"],
            ['slug' => "survivors-violence", 'name' => "Пострадавшим от насилия"],
            ['slug' => "help-hospices", 'name' => "Хосписам"],
        ],
        'improve-urban' => [
            ['slug' => "landscaping", 'name' => "Благоустройство"],
            ['slug' => "bike", 'name' => "Велодвижение"],
            ['slug' => "urban-projects", 'name' => "Городские проекты"],
            ['slug' => "city-protection", 'name' => "Градозащита"],
            ['slug' => "accessible-environment", 'name' => "Доступная среда"],
            ['slug' => "local-community", 'name' => "Местное сообщество"],
            ['slug' => "rural-projects", 'name' => "Сельские проекты"],
            ['slug' => "cultural-heritage", 'name' => "Сохранение культурного наследия"],
        ],
        'save-nature' => [
            ['slug' => "homeless-animals", 'name' => "Бездомные животные"],
            ['slug' => "biodiversity", 'name' => "Биоразнообразие"],
            ['slug' => "wildlife-protection", 'name' => "Защита диких животных"],
            ['slug' => "separate-collection", 'name' => "Раздельный сбор"],
            ['slug' => "responsible-consumption", 'name' => "Ответственное потребление"],
            ['slug' => "ecologic-education", 'name' => "Экопросвещение"],
            ['slug' => "ecologic-disasters", 'name' => "Экологические бедствия"],
        ],
        'make-world-fair' => [
            ['slug' => "gender-equality", 'name' => "Гендерное равенство"],
            ['slug' => "access-education", 'name' => "Доступ к образованию"],
            ['slug' => "inclusive-projects", 'name' => "Инклюзивные проекты"],
            ['slug' => "lgbt-community", 'name' => "ЛГБТ-сообщество"],
            ['slug' => "independent-media", 'name' => "Независимые СМИ"],
            ['slug' => "open-science", 'name' => "Открытая наука"],
            ['slug' => "human-rights", 'name' => "Права человека"],
        ],
        'system-solutions' => [
            ['slug' => "fighting-poverty", 'name' => "Борьба с бедностью"],
            ['slug' => "infrastructure-projects", 'name' => "Инфраструктурные проекты"],
            ['slug' => "ngo-resource-centers", 'name' => "Ресурсные центры НКО"],
            ['slug' => "charity-development", 'name' => "Развитие благотворительности"],
            ['slug' => "volunteering-development", 'name' => "Развитие волонтерства"],
        ],
   ];

   itv_setup_tax_terms($tax, $top_level_terms, $sub_level_terms, $post_type);

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

function itv_setup_tax_terms($tax, $top_level_terms, $sub_level_terms, $post_type) {
    Itv_Setup_Utils::setup_terms_data($top_level_terms, $tax, true);
    Itv_Setup_Utils::link_posts_from_old_to_new_terms($top_level_terms, $tax, $post_type);

    foreach($sub_level_terms as $top_term_slug => $sub_terms) {
        $top_term = get_term_by('slug', $top_term_slug, $tax);
        if($top_term === false) {
            throw new Exception("term not found:" . $top_term_slug);
        }

        foreach($sub_terms as $i => $sub_term) {
            echo "set parent term: " . $top_term->slug . " for term: " . $sub_term['slug'] . "\n";
            $sub_terms[$i]['parent'] = $top_term->term_id;
        }

        Itv_Setup_Utils::setup_terms_data($sub_terms, $tax, true);
        Itv_Setup_Utils::link_posts_from_old_to_new_terms($sub_terms, $tax, $post_type);
    }
    Itv_Setup_Utils::delete_terms_beoynd_parents($tax, $top_level_terms);
}