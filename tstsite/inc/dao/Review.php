<?php
namespace ITV\dao;

use \ITV\dao\ITVDAO;

class Review extends ITVDAO {
    protected $table = 'str_reviews';
}

class ReviewAuthor extends ITVDAO {
    protected $table = 'str_reviews_author';
}

?>
 