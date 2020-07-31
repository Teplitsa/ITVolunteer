<?php

set_time_limit(0);
ini_set("memory_limit", "256M");

try {
    $time_start = microtime(true);
    include("cli_common.php");
    echo "Memory before anything: " . memory_get_usage(true) . chr(10) . chr(10);

    global $wpdb;

    echo "Add rating columns" . chr(10);

    $result_db = array(
        "reviews"        => false,
        "reviews_author" => false,
    );

    $result_db["reviews"] = $wpdb->query(
        $wpdb->prepare(
            <<<SQL
            ALTER TABLE {$wpdb->prefix}reviews
            ADD COLUMN communication_rating SMALLINT UNSIGNED NOT NULL DEFAULT 0 AFTER rating
            SQL
        )
    );

    $result_db["reviews_author"] = $wpdb->query(
        $wpdb->prepare(
            <<<SQL
            ALTER TABLE {$wpdb->prefix}reviews_author
            ADD COLUMN communication_rating SMALLINT UNSIGNED NOT NULL DEFAULT 0 AFTER rating
            SQL
        )
    );

    if ($result_db["reviews"] === false) {
        echo "Add rating column operation (reviews) FAILED" . chr(10);
    } else {
        echo "Add rating column operation (reviews) DONE" . chr(10);
    }

    if ($result_db["reviews_author"] === false) {
        echo "Add rating column operation (reviews_author) FAILED" . chr(10);
    } else {
        echo "Add rating column operation (reviews_author) DONE" . chr(10);
    }

    unset($result);

    //Final
    echo "Memory " . memory_get_usage(true) . chr(10);
    echo "Total execution time in sec: " . (microtime(true) - $time_start) . chr(10) . chr(10);
} catch (ItvNotCLIRunException $ex) {
    echo $ex->getMessage() . "\n";
} catch (ItvCLIHostNotSetException $ex) {
    echo $ex->getMessage() . "\n";
} catch (Exception $ex) {
    echo $ex;
}
