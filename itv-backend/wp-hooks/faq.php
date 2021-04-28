<?php

use ITV\models\Faq;

add_action('save_post_' . Faq::$post_type, ['ITV\models\Faq', 'update_item_cache'], 10, 1);
add_action('after_delete_post', ['ITV\models\Faq', 'delete_item_cache'], 10, 1);