<?php


require_once ("connection.php");

class Model_Bolo {

    public function __construct()
    {

    }

    public function loadIds()
    {
        $conn=new data_access();
        $sql="SELECT $agency FROM wp_flierform";
        return $conn->execute_query($sql);
    }
	
	public function loadName()
    {
        $conn=new data_access();
        $sql="SELECT DISTINCT myName FROM wp_flierform";

        return $conn->execute_query($sql);

    }

		public function loadLastName()
    {
        $conn=new data_access();
        $sql="SELECT DISTINCT lastName FROM wp_flierform";

        return $conn->execute_query($sql);

    }	
    public function loadAddr()
    {
        $conn=new data_access();
        $sql="SELECT DISTINCT address FROM wp_flierform";

        return $conn->execute_query($sql);

    }

    public function loadClass()
    {
        $conn=new data_access();
        $sql="SELECT classification FROM wp_flierform";

        return $conn->execute_query($sql);

    }

    public function loadDob()
    {
        $conn=new data_access();
        $sql="SELECT DISTINCT dob FROM wp_flierform";

        return $conn->execute_query($sql);

    }

    public function loadHairColor()
    {
        $conn=new data_access();
        $sql="SELECT DISTINCT haircolor FROM wp_flierform";

        return $conn->execute_query($sql);

    }

    

    public function loadLicense()
    {
        $conn=new data_access();
        $sql="SELECT DISTINCT license FROM wp_flierform";

        return $conn->execute_query($sql);

    }

    

    public function loadRace()
    {
        $conn=new data_access();
        $sql="SELECT DISTINCT race FROM wp_flierform";

        return $conn->execute_query($sql);

    }

    public function loadReli()
    {
        $conn=new data_access();
        $sql="SELECT DISTINCT reliability FROM wp_flierform";

        return $conn->execute_query($sql);

    }

    

    public function loadSex()
    {
        $conn=new data_access();
        $sql="SELECT DISTINCT sex FROM wp_flierform";

        return $conn->execute_query($sql);

    }
	
	public function loadCat()
    {
        $conn=new data_access();
        $sql="SELECT DISTINCT selectcat FROM wp_flierform";

        return $conn->execute_query($sql);

    }
	
    public function loadValidity()
    {
        $conn=new data_access();
        $sql="SELECT DISTINCT validity FROM wp_flierform";

        return $conn->execute_query($sql);

    }

	
	public function loadDateCreated()
    {
        $conn=new data_access();
        $sql="SELECT datecreated FROM wp_flierform ";

        return $conn->execute_query($sql);

    }
	public function loadPicture()
    {
        $conn=new data_access();
        $sql="SELECT image FROM wp_flierform";

        return $conn->execute_query($sql);

    }
    
	/**
	 * gets all the agency column from the wp_flierform
	 */
	public function loadAgency()
    {
        $conn=new data_access();
        $sql="SELECT DISTINCT agency FROM wp_flierform";

        return $conn->execute_query($sql);
    }
    
    
	/**
	 * get the author name, based on the given user id
	 */
	public function loadAuthor($author_id){
		$conn=new data_access();
		
		$sql = <<<SQL
	    SELECT display_name
	    FROM `wp_users`
	    WHERE ID="$author_id"
SQL;
		$result = $conn->execute_query($sql);
		$row= mysqli_fetch_array($result);
        return $row['display_name'];
	}
	
	
	public function loadLink()
    {
        $conn=new data_access();
        $sql="SELECT link FROM wp_flierform";

        return $conn->execute_query($sql);
    }
    
	
	
	//Purge
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
			$sql.=" WHERE archive = TRUE";
		}
		else{
			$sql.=" AND archive = TRUE";
		}
		
        $conn = new data_access();
        //echo($sql);
        return $conn->execute_query($sql);

    }
    
    public function deleteAll($date1, $date2)
    {
        $activeWhere = false;
        $sql = "DELETE FROM wp_flierform"; 
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
			$sql.=" AND archive = TRUE";
        $conn = new data_access();
        //echo($sql);
        return $conn->execute_query($sql);

    }
	
	
	
	
	
	
	
    public function searchResults($p1,$p2,$p3,$p4,$p5,$p6,$p7,$p8,$p9,$p10,$p11,$p12,$p13,$p14)
    {   
	    $activeWhere = false;
        $sql = "SELECT * 
        FROM wp_flierform";
        if(strlen($p1)>0)
        {
            $sql.=" WHERE agency = '".$p1."'";
            $activeWhere = true;
        }
        if(strlen($p2)>0)
        {
            if($activeWhere==false)
            {
                $sql.=" WHERE myName = '".$p2."'";
                $activeWhere = true;
            }
            else
            {
                $sql.=" AND myName = '".$p2."'";
            }
        }
		
		 if(strlen($p3)>0)
        {
            if($activeWhere==false)
            {
                $sql.=" WHERE lastName = '".$p3."'";
                $activeWhere = true;
            }
            else
            {
                $sql.=" AND lastName = '".$p3."'";
            }
        }

        if(strlen($p4)>0)
        {
            if($activeWhere==false)
            {
                $sql.=" WHERE address = '".$p4."'";
                $activeWhere = true;
            }
            else
            {
                $sql.=" AND address = '".$p4."'";
            }
        }

        
        if(strlen($p5)>0)
        {
            if($activeWhere==false)
            {
                $sql.=" WHERE classification = '".$p5."'";
                $activeWhere = true;
            }
            else
            {
                $sql.=" AND classification = '".$p5."'";
            }
        }
        if(strlen($p6)>0)
        {
            if($activeWhere==false)
            {
                $sql.=" WHERE dob = '".$p6."'";
                $activeWhere = true;
            }
            else
            {
                $sql.=" AND dob = '".$p6."'";
            }
        }
        if(strlen($p7)>0)
        {
            if($activeWhere==false)
            {
                $sql.=" WHERE haircolor = '".$p7."'";
                $activeWhere = true;
            }
            else
            {
                $sql.=" AND haircolor = '".$p7."'";
            }
        }
        
        if(strlen($p8)>0)
        {
            if($activeWhere==false)
            {
                $sql.=" WHERE license = '".$p8."'";
                $activeWhere = true;
            }
            else
            {
                $sql.=" AND license = '".$p8."'";
            }
        }
        if(strlen($p9)>0)
        {
            if($activeWhere==false)
            {
                $sql.=" WHERE race = '".$p9."'";
                $activeWhere = true;
            }
            else
            {
                $sql.=" AND race = '".$p9."'";
            }
        }
        if(strlen($p10)>0)
        {
            if($activeWhere==false)
            {
                $sql.=" WHERE reliability = '".$p10."'";
                $activeWhere = true;
            }
            else
            {
                $sql.=" AND reliability = '".$p10."'";
            }
        }
        
        if(strlen($p11)>0)
        {
            if($activeWhere==false)
            {
                $sql.=" WHERE sex = '".$p11."'";
                $activeWhere = true;
            }
            else
            {
                $sql.=" AND sex = '".$p11."'";
            }
        }
        if(strlen($p12)>0)
        {
            if($activeWhere==false)
            {
                $sql.=" WHERE selectcat = '".$p12."'";
                $activeWhere = true;
            }
            else
            {
                $sql.=" AND selectcat = '".$p12."'";
            }
        }
       
        if(strlen($p13)>0)
        {
            if($activeWhere==false)
            {
                $sql.=" WHERE validity = '".$p13."'";
                $activeWhere = true;
            }
            else
            {
                $sql.=" AND validity = '".$p13."'";
            }
        }
        
         if(strlen($p14)>0)
        {
            if($activeWhere==false)
            {
                $sql.=" WHERE link = '".$p14."'";
                $activeWhere = true;
            }
            else
            {
                $sql.=" AND link = '".$p14."'";
            }
        }
		
		
		$sql.= " AND archive = FALSE";
		
		$sql.= " ORDER BY datecreated DESC ";

        $conn=new data_access();
       // echo($sql);
        return $conn->execute_query($sql);
    }

    public function infoBolo($idBolo)
    {
        $conn=new data_access();
        $sql="SELECT * FROM wp_flierform WHERE bolo_id = '".$idBolo."'";
      //  echo($sql);
        return $conn->execute_query($sql);
    }
	
	 public function deleteBolo($idBolo)
    {
        $conn=new data_access();

        $sql="DELETE FROM wp_flierform WHERE bolo_id = '".$idBolo."'";
        return $conn->execute_query($sql);
    }
	
	public function deleteAllBolo($idBolo)
    {
		
        $conn=new data_access();
		$i = 0;
        $result = "";
        $result;
		while ($i < count($idBolo))  {
			$sql="DELETE FROM wp_flierform WHERE bolo_id = '".$idBolo[$i]."'";
                     
			$result = $conn->execute_query($sql);
			$i++;

                    }
        
        
        return $result ;
    }
	
	public function archive($bolo_id){
		
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
	
} 