<?php

use ITV\models\Review;

add_action('save_post_' . Review::$post_type, ['ITV\models\Review', 'update_item_cache'], 10, 1);
add_action('after_delete_post', ['ITV\models\Review', 'delete_item_cache'], 10, 2);