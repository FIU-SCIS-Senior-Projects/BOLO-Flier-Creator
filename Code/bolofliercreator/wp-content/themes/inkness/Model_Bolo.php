<?php
/**
 * 
 * User: DanaePerez
 * Date: 23/02/15
 * Time: 8:43
 */

require_once ("conexion.php");

class Model_Bolo {

    public function __construct()
    {

    }

    public function loadIds()
    {
        $conn=new data_access();
        $sql="SELECT bolo_id FROM wp_flierform";
        return $conn->execute_query($sql);
    }
	
	public function loadName()
    {
        $conn=new data_access();
        $sql="SELECT DISTINCT myName FROM wp_flierform";

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

    public function resultadoBusqueda($p1,$p2,$p3,$p4,$p5,$p6,$p7,$p8,$p9,$p10,$p11,$p12)
    {   
	    $activeWhere = false;
        $sql = "SELECT * 
        FROM wp_flierform";
        if(strlen($p1)>0)
        {
            $sql.=" WHERE bolo_id = '".$p1."'";
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
                $sql.=" WHERE address = '".$p3."'";
                $activeWhere = true;
            }
            else
            {
                $sql.=" AND address = '".$p3."'";
            }
        }

        
        if(strlen($p4)>0)
        {
            if($activeWhere==false)
            {
                $sql.=" WHERE classification = '".$p4."'";
                $activeWhere = true;
            }
            else
            {
                $sql.=" AND classification = '".$p4."'";
            }
        }
        if(strlen($p5)>0)
        {
            if($activeWhere==false)
            {
                $sql.=" WHERE dob = '".$p5."'";
                $activeWhere = true;
            }
            else
            {
                $sql.=" AND dob = '".$p5."'";
            }
        }
        if(strlen($p6)>0)
        {
            if($activeWhere==false)
            {
                $sql.=" WHERE haircolor = '".$p6."'";
                $activeWhere = true;
            }
            else
            {
                $sql.=" AND haircolor = '".$p6."'";
            }
        }
        
        if(strlen($p7)>0)
        {
            if($activeWhere==false)
            {
                $sql.=" WHERE license = '".$p7."'";
                $activeWhere = true;
            }
            else
            {
                $sql.=" AND license = '".$p7."'";
            }
        }
        if(strlen($p8)>0)
        {
            if($activeWhere==false)
            {
                $sql.=" WHERE race = '".$p8."'";
                $activeWhere = true;
            }
            else
            {
                $sql.=" AND race = '".$p8."'";
            }
        }
        if(strlen($p9)>0)
        {
            if($activeWhere==false)
            {
                $sql.=" WHERE reliability = '".$p9."'";
                $activeWhere = true;
            }
            else
            {
                $sql.=" AND reliability = '".$p9."'";
            }
        }
        
        if(strlen($p10)>0)
        {
            if($activeWhere==false)
            {
                $sql.=" WHERE sex = '".$p10."'";
                $activeWhere = true;
            }
            else
            {
                $sql.=" AND sex = '".$p10."'";
            }
        }
        if(strlen($p11)>0)
        {
            if($activeWhere==false)
            {
                $sql.=" WHERE selectcat = '".$p11."'";
                $activeWhere = true;
            }
            else
            {
                $sql.=" AND selectcat = '".$p11."'";
            }
        }
       
        if(strlen($p12)>0)
        {
            if($activeWhere==false)
            {
                $sql.=" WHERE validity = '".$p12."'";
                $activeWhere = true;
            }
            else
            {
                $sql.=" AND validity = '".$p12."'";
            }
        }
		
		
		
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
} 