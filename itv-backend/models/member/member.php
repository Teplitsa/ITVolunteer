<?php

namespace ITV\models;

use \ITV\dao\ReviewAuthor;
use \ITV\dao\Review;

use \ITV\models\MemberTasks;
use \ITV\models\PartnerIcon;

class Member
{
    public $user;

    public function __construct($user)
    {

        if ((is_int($user) || is_string($user)) && absint($user)) {

            $user = absint($user);
            $this->user = get_user_by('id', $user);

            if (!$this->user) {
                return null;
            }
        } else if (is_a($user, 'WP_User')) {

            $this->user = $user;
        } else {
            return null;
        }
    }
}

class MemberManager
{
    public static $meta_role = 'itv_role';
    public static $meta_telegram_chat_banner = 'hide_telegram_chat_banner';
    public static $META_PARTNER_ICON = 'partner_icon';

    public static $rest_context_view_card = 'view_card';

    public static $ROLE_DOER = 'doer';
    public static $ROLE_AUTHOR = 'customer';
    public static $ROLE_PASEKA_MEMBER = 'paseka_member';
    public static $EXCLUSIVE_ROLES = ['doer', 'customer'];

    public static $FIELD_FULL_NAME = 'fullName';
    public static $FIELD_AVATAR = 'itvAvatar';
    public static $FIELD_AUTHOR_REVIEWS_COUNT = 'authorReviewsCount';
    public static $FIELD_DOER_REVIEWS_COUNT = 'doerReviewsCount';
    public static $FIELD_REVIEWS_COUNT = 'reviewsCount';
    public static $FIELD_RATING = 'rating';
    public static $FIELD_XP = 'xp';
    public static $FIELD_ITV_ROLE = 'itvRole';
    public static $FIELD_IS_PASEKA_MEMBER = 'isPasekaMember';
    public static $FIELD_ITV_ROLE_TITLE = 'itvRoleTitle';
    public static $FIELD_IS_HYBRID = 'isHybrid';
    public static $FIELD_RATING_SOLVED_TASKS_COUNT = 'ratingSolvedTasksCount';
    public static $FIELD_RATING_SOLVED_TASKS_POSITION = 'ratingSolvedTasksPosition';
    public static $FIELD_PARTNER_ICON = 'partnerIcon';

    private function __lang()
    {
        __('member_role_doer', 'itv-backend');
        __('member_role_author', 'itv-backend');
    }

    public function get_member_itv_role($user_id)
    {
        // $role = get_user_meta($user_id, self::$meta_role, true);
        $user = new \WP_User($user_id);

        return in_array(self::$ROLE_AUTHOR, $user->roles)
            ? self::$ROLE_AUTHOR
            : (in_array(self::$ROLE_DOER, $user->roles)
                ? self::$ROLE_DOER
                : null);
    }

    public function get_default_itv_role()
    {
        return self::$ROLE_DOER;
    }

    public function validate_itv_role($role)
    {
        return $role === self::$ROLE_DOER || $role === self::$ROLE_AUTHOR;
    }

    public function set_member_itv_role($user_id, $itvRole)
    {
        // update_user_meta($user_id, self::$meta_role, $itvRole);
        $user = new \WP_User($user_id);

        $remove_roles = array_diff(self::$EXCLUSIVE_ROLES, [$itvRole]);
        foreach ($remove_roles as $role) {
            $user->remove_role($role);
        }

        $user->add_role($itvRole);
    }

    public function is_hybrid_profile($user_id)
    {
        $user_role = $this->get_member_itv_role($user_id);
        $member_tasks = new MemberTasks($user_id);
        return $user_role === self::$ROLE_AUTHOR ? $member_tasks->has_member_completed_tasks() : $member_tasks->has_member_created_tasks();
    }

    public function get_member_name($user_id)
    {
        return tst_get_member_name($user_id);
    }

    public function get_property($response_data, $property_name, $request)
    {
        $value = null;
        $user_id = $response_data['id'];

        switch ($property_name) {
            case self::$FIELD_FULL_NAME:
                $value = $this->get_member_name($user_id);
                break;

            case self::$FIELD_AVATAR:
                $value = itv_avatar_url($user_id);
                break;

            case self::$FIELD_AUTHOR_REVIEWS_COUNT:
                $value = ReviewAuthor::where(['author_id' => $user_id])->count();
                break;

            case self::$FIELD_DOER_REVIEWS_COUNT:
                $value = Review::where(['doer_id' => $user_id])->count();
                break;

            case self::$FIELD_REVIEWS_COUNT:
                $as_author = ReviewAuthor::where(['author_id' => $user_id])->count();
                $as_doer = Review::where(['doer_id' => $user_id])->count();
                $value = $as_author + $as_doer;
                break;

            case self::$FIELD_RATING:
                $ratings = [];

                $reviews_as_author = ReviewAuthor::where(['author_id' => $user_id])->get();
                foreach ($reviews_as_author as $review) {
                    if ($review['rating']) {
                        $ratings[] = $review['rating'];
                    }

                    if ($review['communication_rating']) {
                        $ratings[] = $review['communication_rating'];
                    }
                }

                $reviews_as_doer = Review::where(['doer_id' => $user_id])->get();
                foreach ($reviews_as_doer as $review) {
                    if ($review['rating']) {
                        $ratings[] = $review['rating'];
                    }

                    if ($review['communication_rating']) {
                        $ratings[] = $review['communication_rating'];
                    }
                }

                $value = !empty($ratings) ? array_sum($ratings) / count($ratings) : 0;
                break;

            case self::$FIELD_XP:
                $value = (int) UserXPModel::instance()->get_user_xp($user_id);
                break;

            case self::$FIELD_ITV_ROLE:
                $value = $this->get_member_itv_role($user_id);
                break;

            case self::$FIELD_IS_PASEKA_MEMBER:
                $value = $this->is_paseka_member($user_id);
                break;

            case self::$FIELD_ITV_ROLE_TITLE:
                $role = $this->get_member_itv_role($user_id);
                $value = $role ? __('member_role_' . $role, 'itv-backend') : "";
                break;

            case self::$FIELD_IS_HYBRID:
                $value = $this->is_hybrid_profile($user_id);
                break;

            case self::$FIELD_RATING_SOLVED_TASKS_COUNT:
                $value = 0;
                break;

            case self::$FIELD_RATING_SOLVED_TASKS_POSITION:
                $value = 0;
                break;

            case self::$FIELD_PARTNER_ICON:
                $value = PartnerIcon::get_icon($user_id, self::$META_PARTNER_ICON);
                break;
        }

        return $value;
    }

    public function is_paseka_member($user_id)
    {
        // return boolval(\itv_is_user_paseka_member($user->ID));
        $user = new \WP_User($user_id);
        return in_array(self::$ROLE_PASEKA_MEMBER, $user->roles);
    }

    public function get_paseka_members()
    {
        $args = [
            'fields' => 'ID',
            'role' => self::$ROLE_PASEKA_MEMBER,
        ];

        $user_query = new \WP_User_Query($args);
        return $user_query->get_results();
    }

    public function get_volunteers()
    {
        $args = [
            'fields' => 'ID',
            'role' => self::$ROLE_DOER,
        ];

        $user_query = new \WP_User_Query($args);
        return $user_query->get_results();
    }

    public static function get_authors_with_no_tasks(?int $registered_earlier_in_months = null, ?int $registered_later_in_months = null): ?array
    {
        global $wpdb;

        if (
            empty($registered_earlier_in_months) && empty($registered_later_in_months) ||
            !is_int($registered_earlier_in_months) && !is_int($registered_later_in_months) ||
            is_int($registered_earlier_in_months) && $registered_earlier_in_months <= 0 ||
            is_int($registered_later_in_months) && $registered_later_in_months <= 0
        ) {
            trigger_error(\__('MemberManager::get_authors_with_no_tasks - invalid function arguments.', 'itv-backend'), E_USER_WARNING);

            return null;
        }

        $earlier_clause = !is_int($registered_earlier_in_months) || $registered_earlier_in_months <= 0 ? "" : "AND users.user_registered < DATE_SUB(NOW(), INTERVAL {$registered_earlier_in_months} MONTH)";

        $later_clause = !is_int($registered_later_in_months) || $registered_later_in_months <= 0 ? "" : "AND users.user_registered > DATE_SUB(NOW(), INTERVAL {$registered_later_in_months} MONTH)";

        $authors = $wpdb->get_results(
            <<<SQL
                SELECT 
                    users.ID AS user_id,
                    users.display_name AS user_name,
                    DATE_FORMAT(users.user_registered,'%d.%m.%Y') AS user_registered_at,
                    users.user_email,
                    CONCAT('https://itvist.org/members/',users.user_nicename) AS user_link
                FROM
                    {$wpdb->usermeta} AS user_meta,
                    {$wpdb->users} AS users
                WHERE
                    user_meta.meta_key = 'itv_role' 
                AND
                    user_meta.meta_value = 'author' 
                AND
                    user_meta.user_id NOT IN (
                        SELECT
                            DISTINCT assoc_user_id AS user_id
                        FROM
                            {$wpdb->prefix}itv_task_actions_log
                        WHERE
                            action = 'create'
                    ) 
                AND users.ID = user_meta.user_id
                {$earlier_clause}
                {$later_clause}
            SQL,
            \ARRAY_A
        );

        return $authors;
    }

    public static function get_volunteers_with_no_activity(?int $registered_earlier_in_months = null, ?int $registered_later_in_months = null): ?array
    {
        global $wpdb;

        if (
            empty($registered_earlier_in_months) && empty($registered_later_in_months) ||
            !is_int($registered_earlier_in_months) && !is_int($registered_later_in_months) ||
            is_int($registered_earlier_in_months) && $registered_earlier_in_months <= 0 ||
            is_int($registered_later_in_months) && $registered_later_in_months <= 0
        ) {
            trigger_error(\__('MemberManager::get_volunteers_with_no_activity - invalid function arguments.', 'itv-backend'), E_USER_WARNING);

            return null;
        }

        $earlier_clause = !is_int($registered_earlier_in_months) || $registered_earlier_in_months <= 0 ? "" : "AND users.user_registered < DATE_SUB(NOW(), INTERVAL {$registered_earlier_in_months} MONTH)";

        $later_clause = !is_int($registered_later_in_months) || $registered_later_in_months <= 0 ? "" : "AND users.user_registered > DATE_SUB(NOW(), INTERVAL {$registered_later_in_months} MONTH)";

        $volunteers = $wpdb->get_results(
            <<<SQL
                SELECT 
                    users.ID AS user_id,
                    users.display_name AS user_name,
                    DATE_FORMAT(users.user_registered,'%d.%m.%Y') AS user_registered_at,
                    users.user_email,
                    CONCAT('https://itvist.org/members/',users.user_nicename) AS user_link
                FROM
                    {$wpdb->usermeta} AS user_meta,
                    {$wpdb->users} AS users
                WHERE
                    user_meta.meta_key = 'itv_role' 
                AND
                    user_meta.meta_value = 'doer' 
                AND
                    user_meta.user_id NOT IN (
                        SELECT
                            DISTINCT assoc_user_id AS user_id
                        FROM
                            {$wpdb->prefix}itv_task_actions_log
                        WHERE
                            action = 'add_candidate'
                    ) 
                AND users.ID = user_meta.user_id
                {$earlier_clause}
                {$later_clause}
            SQL,
            \ARRAY_A
        );

        return $volunteers;
    }

    public static function get_authors_created_a_task(?int $created_earlier_in_months = null, ?int $created_later_in_months = null): ?array
    {
        global $wpdb;

        if (
            empty($created_earlier_in_months) && empty($created_later_in_months) ||
            !is_int($created_earlier_in_months) && !is_int($created_later_in_months) ||
            is_int($created_earlier_in_months) && $created_earlier_in_months <= 0 ||
            is_int($created_later_in_months) && $created_later_in_months <= 0
        ) {
            trigger_error(\__('MemberManager::get_authors_created_a_task - invalid function arguments.', 'itv-backend'), E_USER_WARNING);

            return null;
        }

        $earlier_clause = !is_int($created_earlier_in_months) || $created_earlier_in_months <= 0 ? "" : "AND action_time < DATE_SUB(NOW(), INTERVAL {$created_earlier_in_months} MONTH)";

        $later_clause = !is_int($created_later_in_months) || $created_later_in_months <= 0 ? "" : "AND action_time > DATE_SUB(NOW(), INTERVAL {$created_later_in_months} MONTH)";

        $authors = $wpdb->get_results(
            <<<SQL
                SELECT 
                    user_actions.assoc_user_id AS user_id,
                    users.display_name AS user_name,
                    DATE_FORMAT(users.user_registered,'%d.%m.%Y') AS user_registered_at,
                    users.user_email,
                    CONCAT('https://itvist.org/members/',users.user_nicename) AS user_link
                FROM
                    {$wpdb->prefix}itv_task_actions_log AS user_actions,
                    {$wpdb->posts} AS posts,
                    {$wpdb->users} AS users
                WHERE
                    action = 'create'
                AND
                    task_id NOT IN (
                        SELECT
                            task_id
                        FROM
                            {$wpdb->prefix}itv_task_actions_log
                        WHERE
                            action = 'close'
                    ) 
                AND
                    posts.ID = task_id 
                AND
                    posts.post_status NOT IN ('archived', 'closed', 'in_work') 
                AND
                    user_actions.assoc_user_id = users.ID
                {$earlier_clause}
                {$later_clause}
                GROUP BY  user_actions.assoc_user_id
            SQL,
            \ARRAY_A
        );

        return $authors;
    }

    public static function get_volunteers_become_candidates(?int $become_earlier_in_months = null, ?int $become_later_in_months = null): ?array
    {
        global $wpdb;

        if (
            empty($become_earlier_in_months) && empty($become_later_in_months) ||
            !is_int($become_earlier_in_months) && !is_int($become_later_in_months) ||
            is_int($become_earlier_in_months) && $become_earlier_in_months <= 0 ||
            is_int($become_later_in_months) && $become_later_in_months <= 0
        ) {
            trigger_error(\__('MemberManager::get_volunteers_become_candidates - invalid function arguments.', 'itv-backend'), E_USER_WARNING);

            return null;
        }

        $earlier_clause = !is_int($become_earlier_in_months) || $become_earlier_in_months <= 0 ? "" : "AND users.user_registered < DATE_SUB(NOW(), INTERVAL {$become_earlier_in_months} MONTH)";

        $later_clause = !is_int($become_later_in_months) || $become_later_in_months <= 0 ? "" : "AND users.user_registered > DATE_SUB(NOW(), INTERVAL {$become_later_in_months} MONTH)";

        $volunteers = $wpdb->get_results(
            <<<SQL
                SELECT 
                    user_actions.assoc_user_id AS user_id,
                    users.display_name AS user_name,
                    DATE_FORMAT(users.user_registered,'%d.%m.%Y') AS user_registered_at,
                    users.user_email,
                    CONCAT('https://itvist.org/members/',users.user_nicename) AS user_link
                FROM
                    {$wpdb->prefix}itv_task_actions_log AS user_actions,
                    {$wpdb->users} AS users
                WHERE
                    action = 'add_candidate'  
                AND
                    user_actions.assoc_user_id NOT IN (
                        SELECT
                            DISTINCT assoc_user_id AS user_id
                        FROM
                            {$wpdb->prefix}itv_task_actions_log
                        WHERE
                            action = 'approve_candidate'
                    ) 
                AND
                    user_actions.assoc_user_id = users.ID
                {$earlier_clause}
                {$later_clause}
                GROUP BY user_actions.assoc_user_id
            SQL,
            \ARRAY_A
        );

        return $volunteers;
    }
}
