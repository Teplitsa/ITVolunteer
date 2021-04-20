<?php

use ITV\models\Task;

add_action("save_post_" . Task::POST_TYPE, "Task::update_item_cache");