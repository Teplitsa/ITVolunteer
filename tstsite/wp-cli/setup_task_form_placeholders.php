<?php

require_once get_template_directory() . '/inc/models/TaskFormPlaceholders.php';
require_once get_template_directory() . '/cli/utils.php';

/**
 * Updates a post's title.
 *
 * @param array $args
 * @param array $assoc_args
 *
 * Usage: `wp jb-update-post-title --id=123 --title="New post title"`
 */
function itv_setup_task_form_placeholders( $args = array(), $assoc_args = array() ) {
    // Get arguments.
    $arguments = wp_parse_args(
        $assoc_args,
        array(
        )
    );

    // Arguments are okay, update the post.
    $posts_data = [
        [
            'post_title' => 'Подсказки для поля "Название задачи"',
            'post_name'  => \ITV\models\TaskFormPlaceholders::$post_name_prefix . 'title',
            'post_content' => <<<HTML
<!-- wp:paragraph -->
<p>Например, «Разместить счётчик на сайте»</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Например, «Создать логотип для градозащитной организации»</p>
<!-- /wp:paragraph -->
HTML,            
        ],
        [
            'post_title' => 'Подсказки для поля "Опишите, что нужно сделать"',
            'post_name'  => \ITV\models\TaskFormPlaceholders::$post_name_prefix . 'description',
            'post_content' => <<<HTML
<!-- wp:paragraph -->
<p>Какая задача стоит перед IT-волонтером?</p>
<!-- /wp:paragraph -->
HTML,            
        ],
        [
            'post_title' => 'Подсказки для поля "Что должно получится в результате"',
            'post_name'  => \ITV\models\TaskFormPlaceholders::$post_name_prefix . 'result',
            'post_content' => <<<HTML
<!-- wp:paragraph -->
<p>Каково ваше видение завершенной задачи</p>
<!-- /wp:paragraph -->
HTML,            
        ],
        [
            'post_title' => 'Подсказки для поля "Эффект от работы"',
            'post_name'  => \ITV\models\TaskFormPlaceholders::$post_name_prefix . 'impact',
            'post_content' => <<<HTML
<!-- wp:paragraph -->
<p>Кому поможет проект, в котором будет помогать волонтер</p>
<!-- /wp:paragraph -->
HTML,            
        ],
        [
            'post_title' => 'Подсказки для поля "Примеры, которые вам нравятся"',
            'post_name'  => \ITV\models\TaskFormPlaceholders::$post_name_prefix . 'references',
            'post_content' => <<<HTML
<!-- wp:paragraph -->
<p>Примеры или "референсы" позволят волонтеру значительно лучше понять ваш замысел</p>
<!-- /wp:paragraph -->
HTML,            
        ],
        [
            'post_title' => 'Подсказки для поля "Ссылки на внешние файлы"',
            'post_name'  => \ITV\models\TaskFormPlaceholders::$post_name_prefix . 'externalFileLinks',
            'post_content' => <<<HTML
<!-- wp:paragraph -->
<p>Например, на Техническое задание или какие-то другие внешние файлы</p>
<!-- /wp:paragraph -->
HTML,            
        ],
    ];
    Itv_Setup_Utils::setup_posts_data($posts_data, \ITV\models\TaskFormPlaceholders::$post_type);

    // Show success message.
    WP_CLI::success( 'Placeholders setup completed successfully.' );
}

// Add the command.
if ( defined( 'WP_CLI' ) && WP_CLI ) {
    WP_CLI::add_command( 'itv-setup-task-form-placeholders', 'itv_setup_task_form_placeholders' );
}