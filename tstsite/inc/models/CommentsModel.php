<?php

namespace ITV\models;

require_once 'ITVModel.php';
require_once dirname(__FILE__) . '/../dao/Comments.php';

use \ITV\dao\CommentLike;

class CommentsLikeModel extends ITVSingletonModel
{
    protected static $_instance = null;

    public function __construct()
    {
    }

    public function is_user_comment_like($user_id, $comment_id)
    {
        $filter = ['comment_id' => $comment_id, 'user_id' => $user_id];
        return CommentLike::where($filter)->count() > 0;
    }

    public function add_user_comment_like($user_id, $comment_id)
    {
        $like = new CommentLike();

        $like->comment_id = $comment_id;
        $like->user_id = $user_id;

        $like->save();
    }

    public function remove_user_comment_like($user_id, $comment_id)
    {
        $filter = ['comment_id' => $comment_id, 'user_id' => $user_id];
        CommentLike::where($filter)->delete();
    }
}
