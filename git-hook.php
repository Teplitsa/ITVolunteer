<?php

$secret = '5H8Vc5ITvBulfsdQ3AKgVcR3L3AqTufg';
$log = '/home/dev/tmp/git-hook-itv.log';

$params_text = print_r($_POST, true) . print_r($_SERVER, true);

$post_body = file_get_contents('php://input');
$security = $_SERVER['HTTP_X_HUB_SIGNATURE'];
$hmac = 'sha1=' . hash_hmac('sha1', $post_body, $secret);

$params_text .= "\nhmac=".$hmac."\nsecurity=" . $security . "\n";

file_put_contents($log, "\n========================hook call ".date('Y-m-d H:i:s')."====================\n".$params_text, FILE_APPEND);

ob_start();

if( $hmac != $security ) {
	echo('git hook access denied!');
}
elseif(@$_SERVER['HTTP_X_GITHUB_EVENT'] == 'push') {
    
	#system('cd /home/dev/web/ngo2.ru/public_html/gitup/code.work; git pull;');
    system('php /home/dev/web/testplugins.ngo2.ru/public_html/wp-content/themes/sync.php');
    
}
else {
	echo('no action');
}

$out = ob_get_clean();
file_put_contents($log, $out, FILE_APPEND);

echo nl2br($out);