<?php
namespace ITV\dao;

use \ITV\dao\ITVDAO;

class Review extends ITVDAO {
    public $timestamps = false;
    protected $table = 'str_reviews';
}

class ReviewAuthor extends ITVDAO {
    public $timestamps = false;
    protected $table = 'str_reviews_author';
}

class ThankYou extends ITVDAO {
    public $timestamps = false;
    protected $table = 'str_itv_thankyou';
}
