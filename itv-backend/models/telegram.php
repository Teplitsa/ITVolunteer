<?php

namespace ITV\models;

class Telegram
{
    const CHAT_ID = ITV_TELEGRAM_CHAT_ID;
    const BOT_TOKEN = ITV_TELEGRAM_BOT_TOKEN;
    const ALLOWED_TAGS = '<b><i><u><s><a><code><pre>';

    public function publish_task($task) {
        $title = apply_filters( 'the_title', $task->post_title );
        $content = \strip_tags( get_the_excerpt( $task ), self::ALLOWED_TAGS);
        $content = \preg_replace("/(\&nbsp;)?<a.*?\&hellip;<\/a>$/", "...", $content);
        $content = \preg_replace("/&hellip;/", "...", $content);
        $content = \preg_replace("/[.]+$/", "...", $content);
        $content = \htmlspecialchars_decode($content);

        $link = get_permalink( $task );

        $message = "<b>{$title}</b>\n{$content}\n{$link}\n\n";

        // print("message: " . $message);

        $this->send_message($message);
    }

    private function send_message($message) {
    
        $url = "https://api.telegram.org/bot" . self::BOT_TOKEN . "/sendMessage?parse_mode=html&chat_id=" . self::CHAT_ID;
        $url = $url . "&text=" . urlencode($message);
        $ch = curl_init();

        $opt = array(
                CURLOPT_URL => $url,
                CURLOPT_RETURNTRANSFER => true
        );

        curl_setopt_array($ch, $opt);
        $result = curl_exec($ch);
        curl_close($ch);

        // print_r($result);

        return $result;
    }    
}