<?php

namespace ITV\cli;

if (!class_exists('\WP_CLI')) {
    return;
}

class Mail
{
    function setup_mail($args, $assoc_args)
    {
        $mail_name = !empty($args) ? $args[0] : "";

        if(!$mail_name) {
            \WP_CLI::error(__('Empty mail name.', 'itv-backend'));
            return;
        }

        \WP_CLI::line(sprintf(__('Setup email: %s', 'itv-backend'), $mail_name));
        
        $mail = new \ITV\models\Mail();
        $mail->setup_atvetka_email($mail_name);

        \WP_CLI::success(__('Email setup successfully completed.', 'itv-backend'));
    }
}

\WP_CLI::add_command('itv_mail', '\ITV\cli\Mail');
