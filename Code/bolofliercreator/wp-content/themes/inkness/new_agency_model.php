<?php

include_once ("connection.php");

class agency_model{
	
	public function _construc(){
	}//end constructor
	
	/*
	 * 
	 */
	public function save_agency($name, $address, $city, $zip, $phone, $logo, $shield){
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
		
/* 		$sql = <<<SQL
	    INSERT INTO `agencies` (name, st_address, city, zip, phone, logo1, logo2)
	    VALUES ('$name', '$address', '$city', '$zip', '$phone', $logo, $shield)
SQL; */

		$sql = <<<SQL
	    INSERT INTO `agencies` (name, st_address, city, zip, phone, logo1, logo2)
	    VALUES ('$name', '$address', '$city', '$zip', '$phone', '$logo', '$shield')
SQL;

		if(!$result = $conn->query($sql)){
		    die('There was an error creating the agency.');
		}
		
		mysqli_close($conn); 
		return $result;
	}//end 
	
	// EDIT AGENCY
	public function update_agency($idAgency, $name, $address, $city, $zip, $phone, $logo, $shield){
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
	    UPDATE agencies
		SET name = "$name", st_address = "$address", city = "$city", zip = "$zip", phone = "$phone"
	   WHERE id = "$idAgency"
SQL;
		if(!$result = $conn->query($sql)){
		    die('There was an error running the query [' . $db->error . ']');
		}
		
		if(isset($logo))
		{
			$sql = <<<SQL
	    UPDATE agencies
		SET logo1 = "$logo"
	   WHERE id = "$idAgency"
SQL;
			$conn->query($sql);
			
		}
		
		if(isset($shield))
		{
			$sql = <<<SQL
	    UPDATE agencies
		SET logo2 = "$shield"
	   WHERE id = "$idAgency"
SQL;
			$conn->query($sql);
		}
		
		mysqli_close($conn);
	
		//return $result;
	}//END EDIT AGENCY 
	
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
		
		
		
		//method to get a specific AGENCY to edit
	public function getAgency($idAgency){
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
		WHERE id = "$idAgency"
SQL;
		if(!$result = $conn->query($sql)){
		    die('There was an error running the query [' . $db->error . ']');
		}
		
		mysqli_close($conn); 
		return $result;
	}		
	
}//end class
?>
