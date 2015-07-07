<?php

	
	//case a Logo is uploaded when updating an agency
    if(isset($_FILES["logo"]) && $_FILES["logo"]["name"] !== '' ){
        $tmp_name = $_FILES["logo"]["tmp_name"];
        $uploadfilename = $_FILES["logo"]["name"];
    $saveddate = date("mdy-Hms");
    $newfilename = "agencies/".$uploadfilename;
    //$logourl = 'http://'.$_SERVER['SERVER_NAME'].dirname($_SERVER['REQUEST_URI']).'/'.$newfilename;
    $logourl = "http://bolo.cs.fiu.edu/bolofliercreator/wp-content/themes/inkness/agencies/" . $uploadfilename;
		if (move_uploaded_file($tmp_name, $newfilename)){
			$msg = "Logo file uploaded\n";
			echo($msg);
		}
		else{
			echo("Logo FAILURE!!\n");
		}
	}
	else{
		$logourl = null;
	}
	//case a Shield is uploaded when updating an agency
    if(isset($_FILES["shield"]) && $_FILES["shield"]["name"] !== '' ){
        $tmp_name = $_FILES["shield"]["tmp_name"];
        $uploadfilename = $_FILES["shield"]["name"];
    $saveddate = date("mdy-Hms");
    $newfilename = "agencies/".$uploadfilename;
    //$shieldurl = 'http://'.$_SERVER['SERVER_NAME'].dirname($_SERVER['REQUEST_URI']).'/'.$newfilename;
	$shieldurl = "http://bolo.cs.fiu.edu/bolofliercreator/wp-content/themes/inkness/agencies/" . $uploadfilename;
    
		if (move_uploaded_file($tmp_name, $newfilename)){
			$msg = "Shield file uploaded\r\n";
			echo($msg);
		}
		else{
			echo("Shield FAILURE!!\r\n");
		}
	}
	else{
		$shieldurl = null;
	}
	
	$idAgency = $_POST["id"];
	$name = $_POST["a_name"];
	$address = $_POST["address"];
	$city =$_POST["city"];
	$zip = $_POST["zip"];
	$phone = $_POST["phone"];
		
	//update agency
	include_once('new_agency_model.php');
	$model = new agency_model();
	$model->update_agency($idAgency, $name, $address, $city, $zip, $phone, $logourl, $shieldurl);	
	header('Location: /bolofliercreator/?page_id=1508');
?>