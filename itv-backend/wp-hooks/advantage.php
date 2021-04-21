<?php

use ITV\models\Advantage;

add_action('save_post_' . Advantage::$post_type, ['ITV\models\Advantage', 'update_item_cache'], 10, 1);
add_action('after_delete_post', ['ITV\models\Advantage', 'delete_item_cache'], 10, 2);