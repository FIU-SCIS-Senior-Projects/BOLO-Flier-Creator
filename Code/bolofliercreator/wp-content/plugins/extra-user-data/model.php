<?php
class model{
	public function _constuct(){
		
	}
	
	/*
	 * This function returns the list of the police agencies currently subscribed
	 * to the BOLO Project. (to be used when creting the dropbox for the agency field
	 * in the officer profile page)
	 */
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
	    SELECT name
	    FROM `agencies`
SQL;
		if(!$result = $conn->query($sql)){
		    die('There was an error running the query [' . $db->error . ']');
		}
		
		mysqli_close($conn); 
		return $result;
	}//end get_angencies
	
	public function get_badge(){
		
	}	
	
}

?>