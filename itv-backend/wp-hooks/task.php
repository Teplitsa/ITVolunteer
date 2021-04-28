<?php

use ITV\models\Task;

add_action('save_post_' . Task::$post_type, ['ITV\models\Task', 'update_item_cache'], 10, 1);
add_action('after_delete_post', ['ITV\models\Task', 'delete_item_cache'], 10, 1);
