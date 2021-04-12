<?php

require_once(get_theme_file_path() . '/vendor/autoload.php');
require_once(get_theme_file_path() . '/config.php');

// utils
require_once(get_theme_file_path() . '/utils/encode.php');

// system models
require_once(get_theme_file_path() . '/models/db/mongo.php');
require_once(get_theme_file_path() . '/models/auth.php');

// models
require_once(get_theme_file_path() . '/models/member/portfolio.php');
require_once(get_theme_file_path() . '/models/member/member.php');
require_once(get_theme_file_path() . '/models/task/task.php');
require_once(get_theme_file_path() . '/models/member/member-tasks.php');
require_once(get_theme_file_path() . '/models/member/notif.php');

// post-types
require_once(get_theme_file_path() . '/post-types/portfolio_work.php');

// rest-api
require_once(get_theme_file_path() . '/rest-api/auth.php');
require_once(get_theme_file_path() . '/rest-api/member/portfolio.php');
require_once(get_theme_file_path() . '/rest-api/member/role.php');
require_once(get_theme_file_path() . '/rest-api/member/member.php');
require_once(get_theme_file_path() . '/rest-api/member/review.php');
require_once(get_theme_file_path() . '/rest-api/member/notif.php');
require_once(get_theme_file_path() . '/rest-api/task/task.php');

// wp-cli
require_once(get_theme_file_path() . '/wp-cli/set_members_itv_role.php');
require_once(get_theme_file_path() . '/wp-cli/cache.php');

// register hooks
require_once(get_theme_file_path() . '/wp-hooks/general.php');
require_once(get_theme_file_path() . '/wp-hooks/task.php');
require_once(get_theme_file_path() . '/wp-hooks/auth.php');
