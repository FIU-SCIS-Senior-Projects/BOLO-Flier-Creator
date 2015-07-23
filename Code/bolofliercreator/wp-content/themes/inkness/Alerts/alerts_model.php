<?php

class alert_model{
	
	public function _construct(){
		
	}
	
	/**
	 * gets the status of whether the user wants to receive alerts
	 * @param the id of the user
	 * @return true or false depending on whether the user wants to receive alerts
	 */
	public function get_alert($user){
		
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
	    SELECT meta_value
	    FROM `wp_users`
	    INNER JOIN `wp_usermeta`
	    ON `wp_users`.ID=`wp_usermeta`.user_id
	    WHERE meta_key="alert" AND user_id="$user"
SQL;
	
		if(!$result = $conn->query($sql)){
			    die('There was an error running the query [' . $db->error . ']');
		}
		
		$row = $result->fetch_assoc();
		return $row['meta_value'];
	
	}//end function get_alert
	
	/**
	 * updates the status of if the user wants to receive alerts
	 * @param $user the id of the current user (is a number)
	 * @param $status if the user wants to receive alartes (true or false)
	 */
	public function update_alert($user, $status){
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
		SELECT count(*) FROM wp_usermeta WHERE user_id="$user" AND meta_key="alert"
SQL;
		if(!$result = $conn->query($sql)){
		    die('There was an error running the query [' . $db->error . ']');
		}
		
		$row = $result->fetch_assoc();
		if($row)
		{
			$sql = <<<SQL
				UPDATE wp_usermeta
				SET meta_value="$status"
				WHERE meta_key="alert" AND user_id="$user"
SQL;
				if(!$result = $conn->query($sql)){
					die('There was an error running the query [' . $db->error . ']');
				}
		}
		else
		{
			$sql = <<<SQL
				INSERT INTO wp_usermeta (user_id, meta_key, meta_value) VALUES ("$user","alert","$status")
SQL;
				if(!$result = $conn->query($sql)){
					die('There was an error running the query [' . $db->error . ']');
				}
		}
		
		mysqli_close($conn);
	}//end function uptade_alert
	
	
}//end class
?>