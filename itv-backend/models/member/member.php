<?php
namespace ITV\models;

use \ITV\dao\ReviewAuthor;
use \ITV\dao\Review;

use \ITV\models\MemberTasks;

class Member {
    public $user;

    public function __construct($user) {

        if((is_int($user) || is_string($user)) && absint($user)) {

            $user = absint($user);
            $this->user = get_user_by('id', $user);

            if( !$this->user ) {
                return null;
            }

        } else if(is_a($user, 'WP_User')) {

            $this->user = $user;

        } else {
            return null;
        }
    }    
}

class MemberManager {
    public static $meta_role = 'itv_role';

    public static $rest_context_view_card = 'view_card';

    public static $ROLE_DOER = 'doer';
    public static $ROLE_AUTHOR = 'author';

    public static $FIELD_FULL_NAME = 'fullName';
    public static $FIELD_AVATAR = 'itvAvatar';
    public static $FIELD_AUTHOR_REVIEWS_COUNT = 'authorReviewsCount';
    public static $FIELD_DOER_REVIEWS_COUNT = 'doerReviewsCount';
    public static $FIELD_REVIEWS_COUNT = 'reviewsCount';
    public static $FIELD_RATING = 'rating';
    public static $FIELD_XP = 'xp';
    public static $FIELD_ITV_ROLE = 'itvRole';
    public static $FIELD_ITV_ROLE_TITLE = 'itvRoleTitle';
    public static $FIELD_IS_HYBRID = 'isHybrid';

    public function get_member_role($user_id) {
        $role = get_user_meta($user_id, self::$meta_role, true);

        if(!$role) {
            $role = $this->get_default_role();
        }

        return $role;
    }

    public function get_default_role() {
        return self::$ROLE_DOER;
    }

    public function validate_role($role) {
        return $role === self::$ROLE_DOER || $role === self::$ROLE_AUTHOR;
    }

    public function get_property($response_data, $property_name, $request) {
        $value = null;
        $user_id = $response_data['id'];

        switch($property_name) {
            case self::$FIELD_FULL_NAME:
                $value = tst_get_member_name( $user_id );
                break;

            case self::$FIELD_AVATAR:
                $value = itv_avatar_url( $user_id );
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
                foreach($reviews_as_author as $review) {
                    if($review['rating']) {
                        $ratings[] = $review['rating'];
                    }

                    if($review['communication_rating']) {
                        $ratings[] = $review['communication_rating'];
                    }
                }

                $reviews_as_doer = Review::where(['doer_id' => $user_id])->get();
                foreach($reviews_as_doer as $review) {
                    if($review['rating']) {
                        $ratings[] = $review['rating'];
                    }

                    if($review['communication_rating']) {
                        $ratings[] = $review['communication_rating'];
                    }
                }
                
                $value = !empty($ratings) ? array_sum($ratings) / count($ratings) : 0;
                break;

            case self::$FIELD_XP:
                $value = (int) UserXPModel::instance()->get_user_xp($user_id);
                break;

            case self::$FIELD_ITV_ROLE:
                $value = $this->get_member_role($user_id);
                break;

            case self::$FIELD_ITV_ROLE_TITLE:
                $role = $this->get_member_role($user_id);
                $value = $role ? __('member_role_' . $role, 'itv-backend') : "";
                break;

            case self::$FIELD_IS_HYBRID:
                $member_tasks = new MemberTasks($user_id);
                $value = $member_tasks->isMemberHasCreatedAndCompletedTasks();
                break;

        }
        
        return $value;
    }

}

// __('member_role_doer', 'itv-backend');
// __('member_role_author', 'itv-backend');