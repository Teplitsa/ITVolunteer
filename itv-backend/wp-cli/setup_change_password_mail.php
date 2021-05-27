<?php

namespace ITV\cli;

if (!class_exists('\WP_CLI')) {
    return;
}

class Mail
{
    function setup_change_password()
    {
        $mail = new \ITV\models\Mail();
        $mail->setup_atvetka_email('change_password');
        $mail->setup_atvetka_email('retrieve_password');

        \WP_CLI::success(__('Password change email setup successfully completed.', 'itv-backend'));
    }
}

\WP_CLI::add_command('itv_mail', '\ITV\cli\Mail');
