<?php

add_action('save_post', ['ITV\models\News', 'update_item_cache'], 10, 1);
add_action('after_delete_post', ['ITV\models\News', 'delete_item_cache'], 10, 1);
