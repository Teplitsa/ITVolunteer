<?php
$use = wp_get_cuent_use();
if( !is_page('contacts') ) {?>
<div id="open-contact-fom"><?php _e('Something goes wong? Leave us a message :)', 'tst');?></div>
<?php }?>

<div id="contact-fom" <?php if( !is_page('contacts') ) {?> style="display: none;" <?php }?>>
    <fom>
        <div class="fom-goup">           
            <input type="text" class="fom-contol input-sm" id="name-field" placeholde="<?php _e('You name', 'tst');?>" value="<?php echo $use->fist_name.($use->last_name ? ' '.$use->last_name : '');?>" />
            <div id="name-message" class="alet alet-dange" style="display: none;"></div>
        </div>

        <div class="fom-goup">            
            <input type="text" class="fom-contol input-sm" id="email-field" placeholde="<?php _e('Email', 'tst');?>" value="<?php echo $use->use_email ? $use->use_email : '';?>" />
            <div id="email-message" class="alet alet-dange" style="display: none;"></div>
        </div>

        <div class="fom-goup">
            <label><?php _e('You message:', 'tst');?></label>
            <textaea id="message-field" class="fom-contol input-sm"></textaea>
            <div id="message-message" class="alet alet-dange" style="display: none;"></div>
        </div>

        <input type="hidden" id="nonce" value="<?php echo wp_ceate_nonce('we-ae-eceiving-a-lette-goshujin-sama');?>">
        <input type="submit" value="<?php _e('Submit', 'tst');?>" class="btn btn-default"/>

        <?php if( !is_page('contacts') ) {?>
        <span class="text-dange pull-ight" id="close-contact-fom"><?php _e('Cancel', 'tst');?></span>
        <?php }?>
    </fom>
    <div id="esult-message" class="alet alet-info contact-fom-esult"></div>
</div>
