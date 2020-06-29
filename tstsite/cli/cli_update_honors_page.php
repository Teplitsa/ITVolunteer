<?php

set_time_limit(0);
ini_set("memory_limit", "256M");

try {
    $time_start = microtime(true);
    include("cli_common.php");
    echo "Memory before anything: " . memory_get_usage(true) . chr(10) . chr(10);

    global $wpdb;

    echo "Updating Honors page" . chr(10);

    $honors_page_id = $wpdb->get_var($wpdb->prepare(
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
        "Награды"
    ));

    if ($honors_page_id) {
        echo "Honors page ALREADY EXISTS" . chr(10);
    } else {
        $honors_list_images = array();

        $honors_list_image_alts = array(
            "Символические подарки",
            "Впечатления и интересные события",
            "Полезные услуги",
            "Отзывы и продвижение",
            "Небольшое денежное вознаграждение/небольшой гонорар",
            "Денежное вознаграждение/бюджет",
        );

        for ($i = 0; $i < 6; $i++) {
            $media_id = Itv_Setup_Utils::upload_locale_media(TEMPLATEPATH . "/data/nagrady/honors-" . ($i + 1) . ".svg", $honors_list_image_alts[$i]);
            $honors_list_images[] = array(
                "media_id"  => $media_id,
                "media_uri" => wp_get_attachment_url($media_id)
            );
        }

        $honors = array(
            "post_author"  => 3442, // admin
            "post_title"   => "Награды",
            "post_type"    => "page",
            "post_name"    => "nagrady",
            "post_status"  => "publish",
            "post_content" => <<<HTML
                <!-- wp:paragraph -->
                <p>Основная награда для любого волонтёра&nbsp;— реальный эффект от&nbsp;помощи и&nbsp;продуктивное общение по&nbsp;задаче.</p>
                <!-- /wp:paragraph -->

                <!-- wp:paragraph -->
                <p>Заботьтесь о&nbsp;мотивации волонтёров. Небольшими наградами вы&nbsp;можете отблагодарить их&nbsp;за&nbsp;помощь. Вот примеры&nbsp;— от&nbsp;символическим подарков до&nbsp;денежных вознаграждений.</p>
                <!-- /wp:paragraph -->

                <!-- wp:media-text {"mediaId":{$honors_list_images[0]['media_id']},"mediaLink":"{$honors_list_images[0]['media_uri']}","mediaType":"image"} -->
                <div class="wp-block-media-text alignwide is-stacked-on-mobile"><figure class="wp-block-media-text__media"><img src="{$honors_list_images[0]['media_uri']}" alt="{$honors_list_image_alts[0]}" class="wp-image-{$honors_list_images[0]['media_id']}"/></figure><div class="wp-block-media-text__content"><!-- wp:heading {"level":3} -->
                <h3>Символические подарки</h3>
                <!-- /wp:heading -->

                <!-- wp:paragraph -->
                <p>Сделайте приятные символические подарки. Например, необычные вещи, авторские поделки, приятные сувениры, подарки, сделанные вашими подопечными.</p>
                <!-- /wp:paragraph --></div></div>
                <!-- /wp:media-text -->

                <!-- wp:media-text {"mediaId":{$honors_list_images[1]['media_id']},"mediaLink":"{$honors_list_images[1]['media_uri']}","mediaType":"image"} -->
                <div class="wp-block-media-text alignwide is-stacked-on-mobile"><figure class="wp-block-media-text__media"><img src="{$honors_list_images[1]['media_uri']}" alt="{$honors_list_image_alts[1]}" class="wp-image-{$honors_list_images[1]['media_id']}"/></figure><div class="wp-block-media-text__content"><!-- wp:heading {"level":3} -->
                <h3>Впечатления и интересные события</h3>
                <!-- /wp:heading -->

                <!-- wp:paragraph -->
                <p>Организуйте необычные впечатления для волонтеров и поделитесь своим уникальным опытом. Например, встречи с вашими подопечными, необычные экскурсии, пригласительные билеты, ознакомительные поездки.</p>
                <!-- /wp:paragraph --></div></div>
                <!-- /wp:media-text -->

                <!-- wp:media-text {"mediaId":{$honors_list_images[2]['media_id']},"mediaLink":"{$honors_list_images[2]['media_uri']}","mediaType":"image"} -->
                <div class="wp-block-media-text alignwide is-stacked-on-mobile"><figure class="wp-block-media-text__media"><img src="{$honors_list_images[2]['media_uri']}" alt="{$honors_list_image_alts[2]}" class="wp-image-{$honors_list_images[2]['media_id']}"/></figure><div class="wp-block-media-text__content"><!-- wp:heading {"level":3} -->
                <h3>Полезные услуги</h3>
                <!-- /wp:heading -->

                <!-- wp:paragraph -->
                <p>Вы можете быть полезными для волонтера. У вас есть богатый опыт, знания и ресурсы. Проведите полноценную юридическую консультацию, психологическую консультацию, онлайн-тренинг.</p>
                <!-- /wp:paragraph --></div></div>
                <!-- /wp:media-text -->

                <!-- wp:media-text {"mediaId":{$honors_list_images[3]['media_id']},"mediaLink":"{$honors_list_images[3]['media_uri']}","mediaType":"image"} -->
                <div class="wp-block-media-text alignwide is-stacked-on-mobile"><figure class="wp-block-media-text__media"><img src="{$honors_list_images[3]['media_uri']}" alt="{$honors_list_image_alts[3]}" class="wp-image-{$honors_list_images[3]['media_id']}"/></figure><div class="wp-block-media-text__content"><!-- wp:heading {"level":3} -->
                <h3>Отзывы и продвижение</h3>
                <!-- /wp:heading -->

                <!-- wp:paragraph -->
                <p>Сделайте благодарность, оформите отзыв и помогите в продвижении услуг волонтера. Например, вы можете подготовить рекомендательное письмо, разместить информацию о волонтере на своем сайте, поставить логотип, сделать посты в соцсетях, написать новость на партнерских ресурсах.</p>
                <!-- /wp:paragraph --></div></div>
                <!-- /wp:media-text -->

                <!-- wp:media-text {"mediaId":{$honors_list_images[4]['media_id']},"mediaLink":"{$honors_list_images[4]['media_uri']}","mediaType":"image"} -->
                <div class="wp-block-media-text alignwide is-stacked-on-mobile"><figure class="wp-block-media-text__media"><img src="{$honors_list_images[4]['media_uri']}" alt="{$honors_list_image_alts[4]}" class="wp-image-{$honors_list_images[4]['media_id']}"/></figure><div class="wp-block-media-text__content"><!-- wp:heading {"level":3} -->
                <h3>Небольшое денежное вознаграждение/небольшой гонорар</h3>
                <!-- /wp:heading -->

                <!-- wp:paragraph -->
                <p>Предложите волонтерам небольшой гонорар, если ставите сложную и масштабную задачу.</p>
                <!-- /wp:paragraph --></div></div>
                <!-- /wp:media-text -->

                <!-- wp:media-text {"mediaId":{$honors_list_images[5]['media_id']},"mediaLink":"{$honors_list_images[5]['media_uri']}","mediaType":"image"} -->
                <div class="wp-block-media-text alignwide is-stacked-on-mobile"><figure class="wp-block-media-text__media"><img src="{$honors_list_images[5]['media_uri']}" alt="{$honors_list_image_alts[5]}" class="wp-image-{$honors_list_images[5]['media_id']}"/></figure><div class="wp-block-media-text__content"><!-- wp:heading {"level":3} -->
                <h3>Денежное вознаграждение/бюджет</h3>
                <!-- /wp:heading -->

                <!-- wp:paragraph -->
                <p>Обсудите бюджет, если для реализации проекта вам нужна веб-студия или команда специалистов.</p>
                <!-- /wp:paragraph --></div></div>
                <!-- /wp:media-text -->
HTML,
        );

        Itv_Setup_Utils::setup_posts_data(array($honors), "page");

        unset($honors);

        echo "Honors page update DONE" . chr(10);
    }

    unset($honors_page_id);

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
