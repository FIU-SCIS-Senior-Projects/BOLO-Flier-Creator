<?php

//ARCHIVE
require_once ("connection.php");

class Model_Bolo {

    public function __construct()
    {

    }
	
    
	public function searchdate($date1, $date2)
    {
        $activeWhere = false;
        $sql = "SELECT bolo_id, myName, selectcat, datecreated
        FROM wp_flierform";
        if(strlen($date1)>0)
        {
            $sql.=" WHERE datecreated >= '".$date1."'";
            $activeWhere = true;
        }
        if(strlen($date2)>0)
        {
            if($activeWhere==false)
            {
                $sql.=" WHERE datecreated <= '".$date2."'";
                $activeWhere = true;
            }
            else
            {
                $sql.=" AND datecreated <= '".$date2."'";
            }
        }
		if(strlen($date1)<=0 && strlen($date2)<=0){
			$sql.=" WHERE archive = FALSE";
		}
		else{
			$sql.=" AND archive = FALSE";
		}
        $conn = new data_access();
        //echo($sql);
        return $conn->execute_query($sql);

    }
    
    	
	
	public function archive($date1, $date2)
    {
        $activeWhere = false;
        $sql = "UPDATE wp_flierform SET archive = TRUE"; 
        if(strlen($date1)>0)
        {
            $sql.=" WHERE datecreated >= '".$date1."'";
            $activeWhere = true;
        }
        if(strlen($date2)>0)
        {
            if($activeWhere==false)
            {
                $sql.=" WHERE datecreated <= '".$date2."'";
                $activeWhere = true;
            }
            else
            {
                $sql.=" AND datecreated <= '".$date2."'";
            }
        }

        $conn = new data_access();
        //echo($sql);
      $flag1 =  $conn->execute_query($sql);
		
		//Insert to Archive Table
		$author = get_current_user_id();
		$activeWhere = false;
        $sql = "INSERT INTO bolo_archive SELECT *, '$author' AS archive_author, CURRENT_TIMESTAMP() FROM wp_flierform"; 
        if(strlen($date1)>0)
        {
            $sql.=" WHERE datecreated >= '".$date1."'";
            $activeWhere = true;
        }
        if(strlen($date2)>0)
        {
            if($activeWhere==false)
            {
                $sql.=" WHERE datecreated <= '".$date2."'";
                $activeWhere = true;
            }
            else
            {
                $sql.=" AND datecreated <= '".$date2."'";
            }
        }

        $conn = new data_access();
        //echo($sql);
        $falg2 = $conn->execute_query($sql);
		
		return $flag1 && $flag2;
    }
		
		
	
} 