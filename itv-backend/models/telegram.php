<?php

namespace ITV\models;

use ITV\utils\Date;

class Telegram
{
    const CHAT_ID = ITV_TELEGRAM_CHAT_ID;
    const BOT_TOKEN = ITV_TELEGRAM_BOT_TOKEN;
    const ALLOWED_TAGS = '<b><i><u><s><a><code><pre>';

    public function publish_task($task)
    {
        $title = apply_filters( 'the_title', $task->post_title );
        $organizationName = tst_get_member_field( 'user_workplace', $task->post_author );

        $deadline_mysql = itv_get_task_deadline_date($task->ID, $task->post_date);
        $deadline = Date::get_localized_date_dd_month_name($deadline_mysql);

        $rewardTags = wp_get_post_terms( $task->ID, 'reward');
        $reward = empty($rewardTags) ? null : $rewardTags[0];
        $rewardTitle = $reward ? $reward->name : "";
        $rewardText = $rewardTitle ? "Условия: {$rewardTitle}\n" : "";

        $tags = wp_get_post_terms( $task->ID, 'post_tag');
        $tagsListString = empty($tags) ? "" : implode(", ", array_map(function($tag) {return $tag->name;}, $tags));
        $tagsText = count($tags) > 1 ? "по направленям {$tagsListString}" : "по направлению {$tagsListString}";

        $content = \strip_tags( get_the_excerpt( $task ), self::ALLOWED_TAGS);
        $content = \preg_replace("/(\&nbsp;)?<a.*?\&hellip;<\/a>$/", "...", $content);
        $content = \preg_replace("/&hellip;/", "...", $content);
        $content = \preg_replace("/[.]+$/", "...", $content);
        $content = \htmlspecialchars_decode($content);

        $link = get_permalink( $task );

        $message = "<b>Дедлайн {$deadline} - {$title}</b>\n\nДорогие пасечники,\n\nУ нас новая задача от {$organizationName} {$tagsText}\n\n"
            . "Суть в следующем: {$content}\n\n"
            . $rewardText
            . "Если интересно, присоединяйтесь!\n";

        // print("message: " . $message);

        $replyMarkupData = [
            "inline_keyboard" => [
                [
                    ["text" => "Перейти к задаче", "url" => $link],
                ]
            ]
        ];

        $this->send_message($message, $replyMarkupData);
    }

    private function send_message($message, $replyMarkupData=null) {
    
        $url = "https://api.telegram.org/bot" . self::BOT_TOKEN . "/sendMessage?parse_mode=html&chat_id=" . self::CHAT_ID;
        $url .= "&text=" . urlencode($message);

        if($replyMarkupData) {
            $replyMarkup = wp_json_encode($replyMarkupData);
            $url .= "&reply_markup={$replyMarkup}";
        }
        // print("url:\n" . $url . "\n\n");

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