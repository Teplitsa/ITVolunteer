<?php

use ITV\models\News;

add_action('save_post_' . News::$post_type, ['ITV\models\News', 'update_item_cache'], 10, 1);
add_action('after_delete_post', ['ITV\models\News', 'delete_item_cache'], 10, 2);
