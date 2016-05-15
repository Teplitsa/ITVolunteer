<?php if( !defined('WPINC') ) die;
/**
 * Global filters and modifications
 **/

if(!function_exists('tstmu_is_ssl')){
	function tstmu_is_ssl(){
		
		if(defined('TST_FORCE_SSL') && TST_FORCE_SSL)
			return true;
		
		return is_ssl();
	}
}

