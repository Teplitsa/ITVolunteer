<?php
$user = wp_get_current_user();
if( !is_page('contacts') ) {?>
<div id="open-contact-form"><?php _e('Something goes wrong? Leave us a message :)', 'tst');?></div>
<?php }?>

<div id="contact-form" <?php if( !is_page('contacts') ) {?> style="display: none;" <?php }?>>
    <form>
        <div class="form-group">           
            <input type="text" class="form-control input-sm" id="name-field" placeholder="<?php _e('Your name', 'tst');?>" value="<?php echo $user->first_name.($user->last_name ? ' '.$user->last_name : '');?>" />
            <div id="name-message" class="alert alert-danger" style="display: none;"></div>
        </div>

        <div class="form-group">            
            <input type="text" class="form-control input-sm" id="email-field" placeholder="<?php _e('Email', 'tst');?>" value="<?php echo $user->user_email ? $user->user_email : '';?>" />
            <div id="email-message" class="alert alert-danger" style="display: none;"></div>
        </div>

        <div class="form-group">
            <label><?php _e('Your message:', 'tst');?></label>
            <textarea id="message-field" class="form-control input-sm"></textarea>
            <div id="message-message" class="alert alert-danger" style="display: none;"></div>
        </div>

        <input type="hidden" id="nonce" value="<?php echo wp_create_nonce('we-are-receiving-a-letter-goshujin-sama');?>">
        <input type="submit" value="<?php _e('Submit', 'tst');?>" class="btn btn-default"/>

        <?php if( !is_page('contacts') ) {?>
        <span class="text-danger pull-right" id="close-contact-form"><?php _e('Cancel', 'tst');?></span>
        <?php }?>
    </form>
    <div id="result-message" class="alert alert-info contact-form-result"></div>
</div>
