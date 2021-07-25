<?php

if (!defined('ITV_PLUGIN')) {
    error_log('[ITV ERROR]: ITV Plugin not installed');
}

load_theme_textdomain('itv-backend', get_theme_file_path() . '/lang');

require_once(get_theme_file_path() . '/vendor/autoload.php');
require_once(get_theme_file_path() . '/config.php');

// utils
require_once(get_theme_file_path() . '/utils/upload_image.php');

// system models
require_once(get_theme_file_path() . '/models/db/mongo.php');
require_once(get_theme_file_path() . '/models/cache.php');
require_once(get_theme_file_path() . '/models/auth.php');
require_once(get_theme_file_path() . '/models/mail.php');

// models
require_once(get_theme_file_path() . '/models/common/cacheable.php');
require_once(get_theme_file_path() . '/models/db/mongo.php');
require_once(get_theme_file_path() . '/models/member/portfolio.php');
require_once(get_theme_file_path() . '/models/member/member.php');
require_once(get_theme_file_path() . '/models/task/task.php');
require_once(get_theme_file_path() . '/models/member/member-tasks.php');
require_once(get_theme_file_path() . '/models/member/notif.php');
require_once(get_theme_file_path() . '/models/news/news.php');
require_once(get_theme_file_path() . '/models/advantage/advantage.php');
require_once(get_theme_file_path() . '/models/faq/faq.php');
require_once(get_theme_file_path() . '/models/partner/partner.php');
require_once(get_theme_file_path() . '/models/review/review.php');
require_once(get_theme_file_path() . '/models/stats/stats.php');
require_once(get_theme_file_path() . '/models/member/member-rating.php');
require_once(get_theme_file_path() . '/models/taxonomy/reward.php');
require_once(get_theme_file_path() . '/models/telegram.php');

// post-types
require_once(get_theme_file_path() . '/post-types/portfolio_work.php');
require_once(get_theme_file_path() . '/post-types/platform_advantage.php');
require_once(get_theme_file_path() . '/post-types/faq.php');
require_once(get_theme_file_path() . '/post-types/review.php');
require_once(get_theme_file_path() . '/post-types/platform_partner.php');

// taxonomies
require_once(get_theme_file_path() . '/taxonomies/platform_user_role.php');

// rest-api
require_once(get_theme_file_path() . '/rest-api/auth.php');
require_once(get_theme_file_path() . '/rest-api/member/portfolio.php');
require_once(get_theme_file_path() . '/rest-api/member/role.php');
require_once(get_theme_file_path() . '/rest-api/member/member.php');
require_once(get_theme_file_path() . '/rest-api/member/review.php');
require_once(get_theme_file_path() . '/rest-api/member/notif.php');
require_once(get_theme_file_path() . '/rest-api/member/ratingList.php');
require_once(get_theme_file_path() . '/rest-api/task/task.php');

// wp-cli
require_once(get_theme_file_path() . '/wp-cli/set_members_itv_role.php');
require_once(get_theme_file_path() . '/wp-cli/cache.php');
require_once(get_theme_file_path() . '/wp-cli/insert_platform_user_role_terms.php');
require_once(get_theme_file_path() . '/wp-cli/load_platform_advantages.php');
require_once(get_theme_file_path() . '/wp-cli/load_faqs.php');
require_once(get_theme_file_path() . '/wp-cli/load_platform_partners.php');
require_once(get_theme_file_path() . '/wp-cli/load_reviews.php');
require_once(get_theme_file_path() . '/wp-cli/member_rating.php');
require_once(get_theme_file_path() . '/wp-cli/update_rewards_v2.php');
require_once(get_theme_file_path() . '/wp-cli/setup_mail.php');
require_once(get_theme_file_path() . '/wp-cli/setup_user_roles.php');
require_once(get_theme_file_path() . '/wp-cli/inform_about_tasks.php');
require_once(get_theme_file_path() . '/wp-cli/social_posting.php');
require_once(get_theme_file_path() . '/wp-cli/import_paseka.php');
require_once(get_theme_file_path() . '/wp-cli/inactive_users.php');

// register hooks
require_once(get_theme_file_path() . '/wp-hooks/general.php');
require_once(get_theme_file_path() . '/wp-hooks/news.php');
require_once(get_theme_file_path() . '/wp-hooks/advantage.php');
require_once(get_theme_file_path() . '/wp-hooks/faq.php');
require_once(get_theme_file_path() . '/wp-hooks/partner.php');
require_once(get_theme_file_path() . '/wp-hooks/review.php');
require_once(get_theme_file_path() . '/wp-hooks/stats.php');
require_once(get_theme_file_path() . '/wp-hooks/task.php');
require_once(get_theme_file_path() . '/wp-hooks/auth.php');
require_once(get_theme_file_path() . '/wp-hooks/mail.php');
