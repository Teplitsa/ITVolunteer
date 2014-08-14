<?php
/**
 * The Sidebar 
 */

global $tst_side_w; 
 
 
$sidebar = 'common';
?>
<div id="secondary" class="widget-area bit-<?php echo $tst_side_w;?>" role="complementary">

	<?php dynamic_sidebar($sidebar.'-sidebar'); ?>

	
</div>
