<?php


require_once ("connection.php");

class EmailModel {

    public function __construct()
    {

    }

    public function loadIds()
    {
        $conn=new data_access();
        $sql="SELECT ID FROM wp_users";
        return $conn->execute_query($sql);
    }
	
	public function loadEmail()
    {
        $conn=new data_access();
        //$sql="SELECT user_email FROM wp_users";
		$sql='SELECT * FROM `wp_users` INNER JOIN `wp_usermeta` ON `wp_users`.ID=`wp_usermeta`.user_id WHERE meta_key="alert" AND meta_value="true" ';        
		
        return $conn->execute_query($sql);
    }
	
	public function getlast()
    {
        $conn=new data_access();
       
	  $sql = <<<SQL
	    	SELECT bolo_id
	    	FROM `wp_flierform` ORDER BY bolo_id DESC LIMIT 1
SQL;
	   
	  return $conn->execute_query($sql);

    }
}
?>	


	