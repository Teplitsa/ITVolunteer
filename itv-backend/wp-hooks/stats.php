<?php

add_action('user_register', ['ITV\models\MemberStats', 'update_cache'], 10, 1);
add_action('deleted_user', ['ITV\models\MemberStats', 'update_cache'], 10, 1);

add_action('transition_post_status', ['ITV\models\TaskStats', 'update_cache'], 10, 3);
