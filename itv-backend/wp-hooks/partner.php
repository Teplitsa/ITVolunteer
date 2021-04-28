<?php

use ITV\models\Partner;

add_action('save_post_' . Partner::$post_type, ['ITV\models\Partner', 'update_item_cache'], 10, 1);
add_action('after_delete_post', ['ITV\models\Partner', 'delete_item_cache'], 10, 1);