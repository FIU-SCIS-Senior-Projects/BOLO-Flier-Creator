<?php

class agency_model{
	
	public function _construc(){
	}//end constructor
	
	/*
	 * 
	 */
	public function save_agency($name, $address, $city, $zip, $phone){
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
		
		$sql = <<<SQL
	    INSERT INTO `agencies` (name, st_address, city, zip, phone)
	    VALUES ('$name', '$address', '$city', '$zip', '$phone')
SQL;
		if(!$result = $conn->query($sql)){
		    die('There was an error running the query [' . $db->error . ']');
		}
		
		mysqli_close($conn); 
		return $result;
	}//end 
	
	public function get_agencies(){
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
		
		$sql = <<<SQL
	    SELECT *
	    FROM agencies
SQL;
		if(!$result = $conn->query($sql)){
		    die('There was an error running the query [' . $db->error . ']');
		}
		
		mysqli_close($conn); 
		return $result;
	}
		
		
	
}//end class



?>