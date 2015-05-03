<?php

class delete_model{
	
	public function _construc(){
	}//end constructor
	
	
	
	/*
	 * this function returns all the info of the bolo matching the id 
	 * @param $boloid the id of the bolo you want the info of
	 * @return the mysqli_result object
	 */
	public function get_bolo($boloid){
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
	    FROM `wp_flierform`
	    WHERE bolo_id = "$boloid"
SQL;
		if(!$result = $conn->query($sql)){
		    die('There was an error running the query [' . $db->error . ']');
		}
		
		mysqli_close($conn); 
		return $result;
	}//end get_bolo
	
	/**
	 * creates a new bolo given all the parameters
	 */
	public function new_bolo($selectcat, $myName, $dob, $DLnumber, $race, $sex, $height, $weight, $haircolor, $address, $tattoos,
			$adtnlinfo, $summary, $newfilename, $val, $rel, $clas, $author_id){
		
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
	    INSERT INTO `wp_flierform` (selectcat, myName, dob,license,race, sex, height, weight, haircolor, address, tattoos,adtnlinfo,summary,image,validity,reliability,classification,author)
	    VALUES ('$selectcat', '$myName', '$dob', '$DLnumber', '$race', '$sex', '$height', '$weight', '$haircolor', '$address', '$tattoos', '$adtnlinfo', '$summary', '$newfilename', '$val', '$rel', '$clas', '$author_id')
SQL;
		
		if(!$result = $conn->query($sql)){
		    die('There was an error running the query [' . $db->error . ']');
		}
		mysqli_close($conn);
	}//end new_bolo
	
	public function delete($boloid){
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
	    DELETE FROM `wp_flierform`
	    WHERE bolo_id = "$boloid"
SQL;
		
		if(!$result = $conn->query($sql)){
		    die('There was an error running the query [' . $db->error . ']');
		}
		mysqli_close($conn);
	}
			
			
	
	/**
	 * returns the image attribute of the corresponding bolo id
	 */
	public function get_old_img($id){
		
	}
		
		
	
}//end class



?>