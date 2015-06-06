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


/**
	 * gets 24 bolos for the specified agency
	 * @param $agency_name for the name of the agency, to select the last 24 bolos overal enter $agency_name = 'Show ALL'
	 * @param offset for offset from the most recent bolo archive: 0 will get the most recent 24, offset = 24 would
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
	    WHERE archive = TRUE
	    ORDER BY edit_date DESC LIMIT $offset,24
SQL;
		}
		else{
			$sql = <<<SQL
	    SELECT *
	    FROM `wp_flierform` 
	    WHERE archive = TRUE AND agency="$agency_name"
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
?>
