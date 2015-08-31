<?php
/**
 * The template for displaying search forms 
 */
?>
<form method="get" class="searchform" action="<?php echo esc_url( home_url( '/' ) ); ?>" role="search">		

<div class="row">
	
	<div class="col-md-10">
		<input type="search" class="search-field form-control" name="s" value="<?php echo esc_attr( get_search_query() ); ?>">
	</div>
	
	<div class="col-md-2">
		<div class="sbutton-holder">
			<input type="submit" class="search-submit btn btn-primary btn-block" value="<?php _e('Search', 'tst');?>">
		</div>
	</div>
</div>
</form>
