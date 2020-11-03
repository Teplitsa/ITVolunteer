<?php

function itv_news_cta_shortcode( $atts ){
    $a = shortcode_atts( array(
        'title' => 'Выбрать волонтера',
        'url' => site_url('/members'),
    ), $atts );

    if(empty($atts['title']) || empty($atts['url'])) {
        return '';
    }

    if(!preg_match("/^https?:\/\/.*/", $atts['url'])) {
        $atts['url'] = site_url($atts['url']);
    }

    ob_start();

    ?>

<div class="news-article-cta">
  <a href="<?php echo $atts['url'];?>" class="news-article-cta__primary-button"><?php echo $atts['title'];?></a>
</div>

    <?php

    return ob_get_clean();
}
add_shortcode( 'news_cta', 'itv_news_cta_shortcode' );