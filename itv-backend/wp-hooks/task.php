<?php

use ITV\models\Task;

add_action("save_post_" . Task::POST_TYPE, "\ITV\models\Task::update_item_cache");