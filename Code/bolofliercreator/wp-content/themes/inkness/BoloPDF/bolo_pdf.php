<?php

class bolo_pdf{
    
    public function _construct(){
        
    }
    
    public function save_pdf($bolo, $display, $auth){
    //include("mpdf60/mpdf.php");
    //$bolo = $bolo->fetch_assoc();
    $this->save($bolo->fetch_assoc(), $display, $auth);
        
        
    }//end function save pdf
    
    /**
     * creates a pdf document version of the bolo passed as a parameter.
     * the bolo fits in one single a4 size paper
     * the pdf document is downloaded automatically or prompted to open or save; depends on the browser being used 
     * 
     * @param $bolo this must be a mysqli_result object containing the bolo
     * you want to create a pdf of
     * 
     * @param $display indicates whether to simply display the PDF or download it
     */
    public function save($bolo, $display, $auth){
        
        include("mpdf60/mpdf.php");
        $bolo = $bolo;
        //echo $ag_name = get_user_meta(get_current_user_id(), "agency", true);
        $path="/bolofliercreator/wp-content/themes/inkness/".$bolo['image'];
        $img = "http://bolo.cs.fiu.edu/bolofliercreator/wp-content/themes/inkness/".$bolo['image'];                 
                
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
                
        $agency = $bolo['agency'];
        $sql2 = <<<SQL
        SELECT *
        FROM agencies
        WHERE name="$agency"
SQL;
            
        if(!$result = $conn->query($sql2)){
            die('There was an error running the query [' . $db->error . ']');
        }
        $row = $result->fetch_assoc();
        
        $id=$bolo['author'];
        $sql3 = <<<SQL
        SELECT display_name
        FROM wp_users
        WHERE ID="$id"
SQL;
            
        if(!$result3 = $conn->query($sql3)){
            die('There was an error running the query [' . $db->error . ']');
        }
        $author = $result3->fetch_assoc();
        
        $sectionSQL = <<<SQL
        SELECT meta_value
        FROM wp_usermeta
        WHERE user_id="$id" AND meta_key="Section"
SQL;
        $sectionResults = $conn->query($sectionSQL);
        $section = $sectionResults->fetch_assoc();

        $rankSQL = <<<SQL
        SELECT meta_value
        FROM wp_usermeta
        WHERE user_id="$id" AND meta_key="Rank"
SQL;
        $rankResults = $conn->query($rankSQL);
        $rank = $rankResults->fetch_assoc();
        
        $html=    
                
        '<table style="width:100%; align=center">'.
        '<tbody>'. 
           
        '<tr>'.
        '<td><img style="width:100;" src="'. $row['logo1'] .'"></td>'.
        '<td></td>'.
        '<td></td>'.
        '<td></td>'.
        '<td><p style="text-align:center; font-size:12px; text-transform:uppercase; color:red;">Unclassified// for official use only// law enforcement sensitive </p>
        <h1 style="text-align:center; font-size:16px; margin-bottom:2px; font-weight: bold;">'. $row['name'].' Police Department</h1>
        <h3 style="text-align:center; font-size:14px; line-height:1.2em; font-weight:300;"><em>'.$row['st_address'].'<br>'. $row['city'] .', FL, '. $row['zip'] .'<br>'. $row['phone'] .'</em></h3></td>'.
        '<td><img style="width:100;" src="'. $row['logo2'] .'"></td>'.
        '</tr>'.
        
        '</tbody>'.
        '</table>'
        
        ;
        
        $html2=
                
        '<h1 style="text-align:center; font-size:32px; text-transform:uppercase; color:red; font-weight: bold;">'.$bolo['selectcat'].'</h1>'.       
        
        '<table style="width:100%">'.
        '<tbody>'.    
        
        '<tr>'. 
        '<td rowspan="5"><img style="height: 200px" src="'.$img.'" attributes="#"\></td>'.
        '</tr>'.
        
        '<tr>'. 
        '<td></td>'.
        '<td><p style="font-weight: bold;">Name: </p>'.$bolo ['myName'].' '.$bolo['lastName'].'</td>'.
        '<td><p style="font-weight: bold;">D.O.B: </p>'.$bolo ['dob'].'</td>'.
        '<td><p style="font-weight: bold;">License #: </p>'.$bolo ['license'].'</td>'.
        '</tr>'.
        
        '<tr>'.
        '<td></td>'.
        '<td><p style="font-weight: bold;">Race: </p>'.$bolo ['race'].'</td>'.
        '<td><p style="font-weight: bold;">Sex: </p>'.$bolo ['sex'].'</td>'.
        '<td><p style="font-weight: bold;">Height: </p>'.$bolo ['height'].'</td>'.
        '</tr>'.
        
        '<tr>'.
        '<td></td>'.
        '<td><p style="font-weight: bold;">Weight: </p>'.$bolo ['weight'].'</td>'.
        '<td><p style="font-weight: bold;">Hair Color: </p>'.$bolo ['haircolor'].'</td>'.
        '<td><p style="font-weight: bold;">Bolo ID: </p>'.$bolo ['bolo_id'].' </td>'.
        '</tr>'.
        
        '<tr>'.
        '<td></td>'.
        '<td><p style="font-weight: bold;">Address: </p>'.$bolo ['address'].'</td>'.
        '<td><p style="font-weight: bold;">Tattoos/Scars: </p>'.$bolo ['tattoos'].'</td>'.
        '<td></td>'.
        '</tr>'.                
        
        '</tbody>'.
        '</table>'      
        ;
        
        $html3=
        '<br>'.
        'Date Created: '. $bolo['datecreated'].
        '<p style="font-size:14px; font-weight: bold;">Additional Info: </p>'.$bolo['adtnlinfo'].
        
        '<br><br>'.     
        '<p style="font-size:14px; font-weight: bold;">Summary: </p>'.$bolo['summary']
        ;
        
        $html4=
        
        '<br><br>'.
        'Any Agency having questions regarding this document may contact: ' . $section['meta_value'] . " " . $rank['meta_value'] . " " . $author['display_name']
     ;
        
        $mpdf=new mPDF('c','A4','','',15,15,15,15,15,15); 

        $mpdf->SetDisplayMode('fullpage');
        
        $mpdf->list_indent_first_level = 0; // 1 or 0 - whether to indent the first level of a list
                
        //$stylesheet = file_get_contents('mpdf60/examples/mpdfstyletables.css');
        $mpdf->WriteHTML('mpdf60/examples/mpdfstyletables.css',1);
        
        $mpdf->WriteHTML($html.$html2.$html3.$html4,2);
        
        if($display===TRUE)
        {
            if (realpath('uploads/preview' . $auth . '.pdf'))
           {
               //delete the preview file
               unlink('uploads/preview' . $auth . '.pdf');
           } 
            
            //save on the server for retrieval
            $mpdf->Output('uploads/preview' . $auth . '.pdf', 'F');
        }else{
            $mpdf->Output('mpdf.pdf','D');
        
            echo $html.$html2;
        }
        
    }
    
    

    
    
}//end class bolo_pdf
?>