<?php
class archive_model{
	
	public function _construct(){
		
	}
	
	public function mark_archive(){
		
	}
	
	public function archive($bolo_id){
		$servername = "localhost";
		$username = "root";
		$password = "";
		$dbname = "bolo_creator";
				
		// Create connection
		$conn = new mysqli($servername, $username, $password, $dbname);
		// Check connection
		if ($conn->connect_error) {
		    die("Connection failed: " . $conn->connect_error);
		}		
				
		//mark bolo as archived
		$sql2 = <<<SQL
	    UPDATE wp_flierform
	    SET archive = TRUE
	    WHERE bolo_id = "$boloid"
SQL;
		
		if(!$result = $conn->query($sql2)){
		    die('There was an error running the query [' . $db->error . ']');
		}
		
		//archive the bolo
		$author = get_current_user_id();		
		$sql = <<<SQL
	    INSERT INTO bolo_archive
	    SELECT *, "$author" AS archive_author, CURRENT_TIMESTAMP()
	    FROM wp_flierform	    
	    WHERE bolo_id = "$boloid"
SQL;
		
		if(!$result = $conn->query($sql)){
		    die('There was an error running the query [' . $db->error . ']');
		}	
	}
}//end class archive_model

?>