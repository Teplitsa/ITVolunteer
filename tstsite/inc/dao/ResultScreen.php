<?php
namespace ITV\dao;

use \ITV\dao\ITVDAO;

class ResultScreen extends ITVDAO {
    public $timestamps = false;
    protected $table = 'str_itv_res_screens';
    
    public function get_image($size = 'avatar') {
        $name = __('Result screenshot', 'tst');
        return wp_get_attachment_image( $this->image_id, $size, false, array('alt' => $name, 'title'=> $name));
    }
    
    public function get_full_image_src() {
        $ret = wp_get_attachment_image_src( $this->image_id, 'full' );
        
        if($ret) {
            $ret = $ret[0];
        }
        else {
            $ret = '';
        }
        
        return $ret;
    }
}
