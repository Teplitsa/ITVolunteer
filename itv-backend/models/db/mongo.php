<?php

namespace ITV\models;

final class MongoClient
{
    const PROTOCOL = "mongodb";
    const HOST = "localhost";
    const PORT = "27017";

    private static ?MongoClient $instance = null;

    private static ?\MongoDB\Client $client = null;

    public static function getInstance(): \MongoDB\Client
    {
        if (static::$instance === null) {
            static::$instance = new static();

            try {
                static::$instance::$client = new \MongoDB\Client(self::PROTOCOL . "://" . self::HOST . ":" . self::PORT);
            } catch (\Exception $e) {
                echo 'Не удалось подключиться к базе данных (mongodb): ',  $e->getMessage(), "\n";
            }
        }

        return static::$instance::$client;
    }

    private function __construct()
    {
    }

    private function __clone()
    {
    }

    private function __wakeup()
    {
    }
}
