<?php

try {
	include('cli_common.php');

	$options = getopt("", array('file:', 'table:'));
	$to_file = isset($options['file']) ? $options['file'] : '';
	$table = isset($options['table']) ? $options['table'] : '';
	
	if(!empty($to_file)) {
	    echo "creating report...\n";
	    
	    $table = $wpdb->prefix . $table;
	    echo "from table: str_report_".$table. "\n";
	    
	    $to_file = getcwd() . "/" . $to_file;
	    echo "export to file: ".$to_file . "\n";
	    
	    $sql = "describe " . $table;
	    $columns = $wpdb->get_results ( $sql );
	    $column_names = [ ];
	    foreach ( $columns as $k => $v ) {
	        $column_names [] = $v->Field;
	    }
	    
	    $fp = fopen ( $to_file, 'w' );
	    fputcsv ( $fp, $column_names, ";", "\"" );
	    fclose ( $fp );
	    
	    $limit = 500;
	    $offset = 0;
	    while ( true ) {
	        $sql = "SELECT * FROM " . $table . " LIMIT $offset, $limit";
	        $records = $wpdb->get_results ( $sql, ARRAY_A );
	    
	        $fp = fopen ( $to_file, 'a' );
	        foreach ( $records as $k => $row ) {
	            fputcsv ( $fp, $row, ";", "\"" );
	        }
	        fclose ( $fp );
	        $offset += $limit;
	    
	        if (count ( $records ) < $limit) {
	            break;
	        }
	    }
	}
	echo "done\n";
	
}
catch (ItvNotCLIRunException $ex) {
	echo $ex->getMessage() . "\n";
}
catch (ItvCLIHostNotSetException $ex) {
	echo $ex->getMessage() . "\n";
}
catch (Exception $ex) {
	echo $ex;
}
