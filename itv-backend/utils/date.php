<?php

namespace ITV\utils;

class Date
{
    const MONTH_LIST = [
        'января',
        'февраля',
        'марта',
        'апреля',
        'мая',
        'июня',
        'июля',
        'августа',
        'сентября',
        'октября',
        'ноября',
        'декабря',
    ];

    public static function get_localized_date_dd_month_name($mysql_date)
    {
        $time = strtotime($mysql_date);

        $month_number = intval(date("n", $time));
        $month_index = $month_number - 1;
        $month_name = empty(self::MONTH_LIST[$month_index]) ? "" : self::MONTH_LIST[$month_index];

        $day_number = date("j", $time);

        return $day_number . " " . $month_name;
    }
}

