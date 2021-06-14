<?php

namespace ITV\models;

class Telegram
{
    const CHAT_ID = "-1001064353411";   // teplobot_denisch_chan1
    const BOT_TOKEN = "211692230:AAHzLETi85BrtyF3Q_ZlCsU83DJqCMkxABU";
    const ALLOWED_TAGS = '<b><i><u><s><a><code><pre>';

    public function publish_task($task) {
        $title = apply_filters( 'the_title', $task->post_title );
        $content = \strip_tags( get_the_excerpt( $task ), self::ALLOWED_TAGS);
        $content = \preg_replace("/\&nbsp;.*?\&hellip;<\/a>$/", "...", $content);
        $content = \preg_replace("/[.]+$/", "...", $content);

        $link = get_permalink( $task );

        $message = "<b>{$title}</b>\n\n{$content}\n\n{$link}";

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