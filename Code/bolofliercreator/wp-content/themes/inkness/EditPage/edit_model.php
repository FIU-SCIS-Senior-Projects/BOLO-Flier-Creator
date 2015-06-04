<?php

class edit_model{
	
	public function _construc(){
	}//end constructor
	
	public function pout(){
		return "hello people";
	}
	
	/*
	 * this function returns all the bolos the current user can edit
	 * (ie the user currently loged in)
	 * @return a mysqli_result object with the bolos
	 */
	public function get_user_bolos(){
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
		
		//current user is admin: get all bolos
		if(current_user_can( 'activate_plugins' )){
			$sql = <<<SQL
		    SELECT *
		    FROM `wp_flierform`
		    WHERE archive = FALSE
		    ORDER BY datecreated DESC    
SQL;
		}
		//current user is supervisor, get his agency bolos
		elseif(current_user_can( 'edit_other_pages' )){
			$ag_name = get_user_meta(get_current_user_id(), "agency", true);
			$sql = <<<SQL
		    SELECT *
		    FROM wp_flierform
		    WHERE agency = "$ag_name" AND archive = FALSE
		    ORDER BY datecreated DESC
SQL;
		}
		else{//if is tier1 get only his bolos
			$author = get_current_user_id();
			$sql = <<<SQL
		    SELECT *
		    FROM `wp_flierform`
		    WHERE author = "$author" AND archive = FALSE
		    ORDER BY datecreated DESC
SQL;
		}
		
        $result = $conn->query($sql);
        
		// if(!$result = $conn->query($sql)){
		    // die('There was an error running the query [' . $db->error . ']');
		// }
		
		mysqli_close($conn); 
		return $result;
	}//end get_user_bolos
	
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
        $result = $conn->query($sql);
		// if(!$result = $conn->query($sql)){
		    // die('There was an error running the query [' . $db->error . ']');
		// }
		
		mysqli_close($conn); 
		return $result;
	}//end get_bolo
	
	/**
	 * updates a bolo given all the parameters
	 */
	public function update_bolo($boloid, $selectcat, $myName, $lastName, $dob, $DLnumber, $race, $sex, $height, $weight, $haircolor, $address, $tattoos,
			$adtnlinfo, $summary, $newfilename, $val, $rel, $clas, $update, $author_id, $link){
		
		$servername = "localhost";
		$username = "root";
		$password = "";
		$dbname = "bolo_creator";
				
        $queryResults = true;
		// Create connection
		$conn = new mysqli($servername, $username, $password, $dbname);
		// Check connection
		if ($conn->connect_error) {
		    die("Connection failed: " . $conn->connect_error);
		}		
/*		
		$sql = <<<SQL
	    INSERT INTO `wp_flierform` (selectcat, myName, lastName, dob,license,race, sex, height, weight, haircolor, address, tattoos,adtnlinfo,summary,image,validity,reliability,classification,author)
	    VALUES ('$selectcat', '$myName', '$lastName', '$dob', '$DLnumber', '$race', '$sex', '$height', '$weight', '$haircolor', '$address', '$tattoos', 
  '$adtnlinfo', '$summary', '$newfilename', '$val', '$rel', '$clas', '$author_id')
SQL;
*/		
		
		$sql2 = <<<SQL
		UPDATE wp_flierform
		SET edit_author="$author_id"
		WHERE bolo_id="$boloid"
SQL;
        //$result = $conn->query($sql2);
		if(!$result = $conn->query($sql2)){
		    $queryResults = false;
		}
		
		$sql1 = <<<SQL
		INSERT INTO `edit_history`
		SELECT *
		FROM `wp_flierform`
		WHERE bolo_id="$boloid"
SQL;
        //$result = $conn->query($sql1);
		if(!$result = $conn->query($sql1)){
		    $queryResults = false;
		}
		
/* These next three sql queries are for updating an already created BOLO.
         * After all the queries execute, a boolean value is returned; this acts
         * as a check to make sure that all the queries in this class execute
         * correctly so one can inform the admin of errors.*/
        
        $updateSQL = <<<SQL
        UPDATE `wp_flierform`
        SET selectcat="$selectcat", edit_date=CURRENT_TIMESTAMP(), myName="$myName", lastName="$lastName", dob="$dob"
        WHERE bolo_id = "$boloid"
SQL;
        if(!$updateResult = $conn->query($updateSQL)){
            return false;
            //$queryResults = false;
        }
        
        $updateSQL2 = <<<SQL
        UPDATE `wp_flierform`
        SET license="$DLnumber", weight="$weight", haircolor="$haircolor", address="$address", tattoos="$tattoos", adtnlinfo="$adtnlinfo", summary="$summary"
        WHERE bolo_id = "$boloid"
SQL;
        if(!$updateResult2 = $conn->query($updateSQL2)){
            return false;
            //$queryResults = false;
        }
        
        $updateSQL3 = <<<SQL
        UPDATE `wp_flierform`
        SET race="$race", sex="$sex", height="$height", validity="$val", reliability="$rel", classification="$clas", update_status="$update", edit_author="$author_id", link = "$link", image="$newfilename"
        WHERE bolo_id = "$boloid"
SQL;
        if(!$updateResult3 = $conn->query($updateSQL3)){
            return false;
        }
        mysqli_close($conn);
        
        return $queryResults;
	}//end new_bolo
	
	/**
	 * archives the bolo matching the given id from the database
	 * That is: copies the desired bolo into the bolo_archive table
	 * and marks it as archived in the wp_flierform table
	 * 
	 * There is some redundancy in this function: a bolo is marked as archived in the wp_formflier
	 * and then copied into bolo_archive. It could be one of the two ways: either marked as archived
	 * and kept in wp_flierform or copied into bolo_archive and deleted from wp_flierform. It was done this
	 * because BOLOs must not be deleted ever. So it servers as a backup/failsafe
	 */
	public function archive($boloid){
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
        $result = $conn->query($sql2);
		
		// if(!$result = $conn->query($sql2)){
		    // die('There was an error running the query1 [' . $db->error . ']');
		// }
		
		//archive the bolo
		$author = get_current_user_id();		
		$sql = <<<SQL
	    INSERT INTO bolo_archive
	    SELECT *, "$author" AS archive_author, CURRENT_TIMESTAMP()
	    FROM wp_flierform	    
	    WHERE bolo_id = "$boloid"
SQL;
		$result = $conn->query($sql);
        
		// if(!$result = $conn->query($sql)){
		    // die('There was an error running the query2 [' . $db->error . ']');
		// }			
		
	}
		
	
	/**
	 * returns the image attribute of the corresponding bolo id
	 */
	public function get_old_img($id){
		
	}
	
}//end class



?>