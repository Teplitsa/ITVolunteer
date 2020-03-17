<?php
namespace ITV\GraphQL\Model;

class ItvComment extends \WPGraphQL\Model\Comment {
    
	public function __construct( \WP_Comment $comment ) {
	    
	    $allowed_restricted_fields = [
	        'id',
	        'ID',
	        'commentId',
	        'contentRendered',
	        'date',
	        'dateGmt',
	        'karma',
	        'type',
	        'commentedOnId',
	        'comment_post_ID',
	        'approved',
	        'comment_parent_id',
	        'isRestricted',
	        'userId',
	    ];
	    
	    $this->data = $comment;
	    
	    if ( empty( $this->data ) ) {
	        throw new \Exception( sprintf( __( 'An empty data set was used to initialize the modeling of this %s object', 'wp-graphql' ), $this->get_model_name() ) );
	    }
	    
	    $this->restricted_cap            = 'moderate_comments';
	    $this->allowed_restricted_fields = $allowed_restricted_fields;
	    $this->owner                     = $comment->user_id;
	    $this->current_user              = wp_get_current_user();
	    
	    if ( 'private' === $this->get_visibility() ) {
	        return;
	    }
	    
	    $this->init();
	    self::prepare_fields();
	}

}

class ItvUser extends \WPGraphQL\Model\User {
    
    protected function is_private() {
        
//         if ( ! current_user_can( 'list_users' ) && false === $this->owner_matches_current_user() ) {
//             if ( ! count_user_posts( absint( $this->data->ID ), \WPGraphQL::get_allowed_post_types(), true ) ) {
//                 return true;
//             }
//         }
        
        return false;
        
    }
    
}
