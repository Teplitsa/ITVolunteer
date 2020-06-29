<?php

set_time_limit(0);
ini_set("memory_limit", "256M");

try {
    $time_start = microtime(true);
    include("cli_common.php");
    echo "Memory before anything: " . memory_get_usage(true) . chr(10) . chr(10);

    global $wpdb;

    echo "Updating Paseka page" . chr(10);

    $paseka_page_id = $wpdb->get_var($wpdb->prepare(
        <<<SQL
        SELECT 
            ID 
        FROM 
            {$wpdb->posts} 
        WHERE 
            post_status = 'publish' 
        AND 
            post_type = 'page' 
        AND 
            post_title = %s
        SQL,
        "Пасека"
    ));

    if ($paseka_page_id) {
        echo "Paseka page ALREADY EXISTS" . chr(10);
    } else {
        $paseka = array(
            "post_title"   => "Пасека",
            "post_type"    => "page",
            "post_name"    => "paseka",
            "post_status"  => "publish",
            "post_content" => <<<HTML
                <h2>Умеем и&nbsp;любим работать для решения социальных проблем и&nbsp;развития общего блага!</h2>
                <p>Пасека&nbsp;— это сообщество более 150 специалистов из&nbsp;веб-студий, агентств, IT-компаний и&nbsp;независимых профессионалов, которые умеют и&nbsp;любят работать с&nbsp;некоммерческими организациями и&nbsp;социальными проектами.</p>
                <p>Участники Пасеки&nbsp;— это социально-ориентированные дизайнеры и&nbsp;эксперты в&nbsp;цифровой трансформации. У&nbsp;каждого из&nbsp;них есть хотя&nbsp;бы&nbsp;одна история успеха в&nbsp;работе с&nbsp;активистами. Пасечники могут первыми откликаться на&nbsp;часть запросов на&nbsp;платформе ИТ-волонтер. Чаще всего, это оплачиваемые задачи, которые требуют командной работы и&nbsp;комплексного решения.</p>
            HTML,
        );

        Itv_Setup_Utils::setup_posts_data(array($paseka), "page");

        unset($paseka);

        echo "Paseka page update DONE" . chr(10);
    }

    unset($paseka_page_id);

    //Final
    echo "Memory " . memory_get_usage(true) . chr(10);
    echo "Total execution time in sec: " . (microtime(true) - $time_start) . chr(10) . chr(10);
} catch (ItvNotCLIRunException $ex) {
    echo $ex->getMessage() . "\n";
} catch (ItvCLIHostNotSetException $ex) {
    echo $ex->getMessage() . "\n";
} catch (Exception $ex) {
    echo $ex;
}
