<?php

add_action('profile_update', ['ITV\models\MemberStats', 'update_cache'], 10, 1);
add_action('delete_user', ['ITV\models\MemberStats', 'update_cache'], 10, 1);

add_action('transition_post_status', ['ITV\models\TaskStats', 'update_cache'], 10, 3);
