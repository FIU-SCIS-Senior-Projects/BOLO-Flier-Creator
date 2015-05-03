<?php

class bolo_pdf{
	
	public function _construct(){
		
	}
	
	/**
	 * creates a pdf document version of the bolo passed as a parameter.
	 * the bolo fits in one single a4 size paper
	 * the pdf document is downloaded automatically or prompted to open or save; depends on the browser being used 
	 * 
	 * @param $bolo this must be a mysqli_result object containing the bolo
	 * you want to create a pdf of
	 */
	public function save_pdf($bolo){
		
		include("mpdf60/mpdf.php");

		$bolo_row = $bolo->fetch_assoc();
		
		//echo $ag_name = get_user_meta(get_current_user_id(), "agency", true);
		$path="/bolofliercreator/wp-content/themes/inkness/".$bolo_row['image'];
		$img = "http://bolo.cs.fiu.edu/bolofliercreator/wp-content/themes/inkness/".$bolo_row['image'];		       		
				
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
				
		$agency = $bolo_row['agency'];
		$sql2 = <<<SQL
		SELECT *
		FROM agencies
		WHERE name="$agency"
SQL;
			
		if(!$result = $conn->query($sql2)){
		    die('There was an error running the query [' . $db->error . ']');
		}
		$row = $result->fetch_assoc();
		
		$id=$bolo_row['author'];
		$sql3 = <<<SQL
		SELECT display_name
		FROM wp_users
		WHERE ID="$id"
SQL;
			
		if(!$result3 = $conn->query($sql3)){
		    die('There was an error running the query [' . $db->error . ']');
		}
		$author = $result3->fetch_assoc();
		
		
		
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
				
		'<h1 style="text-align:center; font-size:32px; text-transform:uppercase; color:red; font-weight: bold;">'.$bolo_row['selectcat'].'</h1>'.		
		
		'<table style="width:100%">'.
		'<tbody>'.    
		
		'<tr>'.	
		'<td rowspan="5"><img style="height: 200px" src="'.$img.'" attributes="#"\></td>'.
		'</tr>'.
		
		'<tr>'.	
		'<td></td>'.
		'<td><p style="font-weight: bold;">Name: </p>'.$bolo_row ['myName'].' '.$bolo_row['lastName'].'</td>'.
		'<td><p style="font-weight: bold;">D.O.B: </p>'.$bolo_row ['dob'].'</td>'.
		'<td><p style="font-weight: bold;">License #: </p>'.$bolo_row ['license'].'</td>'.
		'</tr>'.
		
		'<tr>'.
		'<td></td>'.
		'<td><p style="font-weight: bold;">Race: </p>'.$bolo_row ['race'].'</td>'.
		'<td><p style="font-weight: bold;">Sex: </p>'.$bolo_row ['sex'].'</td>'.
		'<td><p style="font-weight: bold;">Height: </p>'.$bolo_row ['height'].'</td>'.
		'</tr>'.
		
		'<tr>'.
		'<td></td>'.
		'<td><p style="font-weight: bold;">Weight: </p>'.$bolo_row ['weight'].'</td>'.
		'<td><p style="font-weight: bold;">Hair Color: </p>'.$bolo_row ['haircolor'].'</td>'.
		'<td><p style="font-weight: bold;">Bolo ID: </td>'.
		'</tr>'.
		
		'<tr>'.
		'<td></td>'.
		'<td><p style="font-weight: bold;">Address: </p>'.$bolo_row ['address'].'</td>'.
		'<td><p style="font-weight: bold;">Tattoos/Scars: </p>'.$bolo_row ['tattoos'].'</td>'.
		'<td></td>'.
		'</tr>'.				
		
		'</tbody>'.
		'</table>'		
		;
		
		$html3=
		'<br>'.
		'Date Created: '. $bolo_row['datecreated'].
		'<p style="font-size:14px; font-weight: bold;">Additional Info: </p>'.$bolo_row['adtnlinfo'].
		
		'<br><br>'.		
		'<p style="font-size:14px; font-weight: bold;">Summary: </p>'.$bolo_row['summary']
		;
		
		$html4=
		'<div class="container">
		<div class="row" style="padding-top:15px;">
		<div class="col-md-12">
		<p style="font-weight: bold;">Source Reliability: </p>'. $bolo_row['reliability'].'
			
		</div>
		</div>
			   
		<div class="row" style="padding-top:15px;">
		<div class="col-md-12">
		<p style="font-weight: bold;">Content Validity: </p>'. $bolo_row['validity'].'
			
		</div>
		</div>
			
		<div class="row" style="padding-top:15px;">
		<div class="col-md-12">
		<p style="font-weight: bold;">Information Classification: </p>'. $bolo_row['classification'].' 
			
		</div>
		</div>    
			    			    
		</div>'.
		
		'<br><br>'.
		'Any Agency having questions regarding this document may contact: ' . $author['display_name']
     ;
		
		$mpdf=new mPDF('c','A4','','',15,15,15,15,15,15); 

		$mpdf->SetDisplayMode('fullpage');
		
		$mpdf->list_indent_first_level = 0;	// 1 or 0 - whether to indent the first level of a list
				
		//$stylesheet = file_get_contents('mpdf60/examples/mpdfstyletables.css');
		$mpdf->WriteHTML('mpdf60/examples/mpdfstyletables.css',1);
		
		$mpdf->WriteHTML($html.$html2.$html3.$html4,2);
		
		$mpdf->Output('mpdf.pdf','D');
		
		echo $html.$html2;
	}//end function save pdf
	
	
}//end class bolo_pdf
?>