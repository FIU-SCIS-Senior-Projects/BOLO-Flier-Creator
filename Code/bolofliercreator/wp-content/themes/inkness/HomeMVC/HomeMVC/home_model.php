<?php

class home_model{
	
	public function _construct(){
		
	}//end contrurctor
	
	
	/**
	 * gets 24 bolos for the specified agency
	 * @param $agency_name for the name of the agency, to select the last 24 bolos overal enter $agency_name = 'Show ALL'
	 * @param offset for offset from the most recent bolo created: 0 will get the most recent 24, offset = 24 would
	 * 			get bolos 24 to 48, and so on
	 */
	public function get_data($agency_name, $offset){		
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
		
		if($agency_name == 'Show All' || $agency_name ==''){
			$sql = <<<SQL
	    SELECT *
	    FROM `wp_flierform` 
	    WHERE archive = FALSE
	    ORDER BY edit_date DESC LIMIT $offset,24
SQL;
		}
		else{
			$sql = <<<SQL
	    SELECT *
	    FROM `wp_flierform` 
	    WHERE archive = FALSE AND agency="$agency_name"
	    ORDER BY edit_date DESC LIMIT $offset,24
SQL;
		}
		
		if(!$result = $conn->query($sql)){
		    die('There was an error running the query [' . $db->error . ']');
		}
		
		mysqli_close($conn);
	
	return $result;
	}//end get_data
	
	/**
	 * gets the list of all the agencies enrolled
	 * @return a mysqli_result object with all the agencies
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
	    FROM agencies	    
SQL;
		if(!$result = $conn->query($sql)){
		    die('There was an error running the query [' . $db->error . ']');
		}
		
		mysqli_close($conn);
		return $result;
	}
	
    public function get_user(){
        
    }




}//end class home_model

?>