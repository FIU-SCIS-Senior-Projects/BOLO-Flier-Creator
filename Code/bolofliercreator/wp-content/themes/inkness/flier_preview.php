<?php

include_once 'flier_model.php';
include "BoloPDF/bolo_pdf.php";

$tmp_name = $_FILES["picture"]["tmp_name"];

//case a picture is uploaded when creating a bolo
if($_FILES["picture"]["name"] !== '' ){
	$uploadfilename = $_FILES["picture"]["name"];
$saveddate = date("mdy-Hms");
$newfilename = "uploads/".$saveddate."_".$uploadfilename;
$uploadurl = 'http://'.$_SERVER['SERVER_NAME'].dirname($_SERVER['REQUEST_URI']).'/'.$newfilename;

if (move_uploaded_file($tmp_name, $newfilename)):
	$msg = "File uploaded";
endif; //move uploaded file
}
else{// if no pic is uploaded, default to a no image available pic
	$newfilename = "uploads/nopic.png";		
}

$selectcat=$_POST ['selectcat'];
$myName=$_POST ['myName']; 
$lastName=$_POST ['lastName']; 
$dob=$_POST ['dob'];
$DLnumber=$_POST ['DLnumber'];
$race=$_POST ['race'];
$sex=$_POST ['sex'];
$height=$_POST ['height'];
$weight=$_POST ['weight'];
$haircolor=$_POST ['haircolor'];
$address=$_POST ['address'];
$tattoos=$_POST ['tattoos'];
$adtnlinfo=$_POST ['adtnlinfo'];
$summary=$_POST ['summary'];
$author = $_POST['author'];
$agency = $_POST['agency'];
$link = $_POST['link'];
$vcheckboxes= implode(' ', $_POST['validity']);
$rcheckboxes= implode(' ', $_POST['reliability']);
$clacheckboxes= implode(' ', $_POST['classification']);
//delete the preview BOLO if it exists
    if (realpath('uploads/preview' . $author . '.pdf'))
   {
       //delete the preview file
       unlink('uploads/preview' . $author . '.pdf');
   } 

//submit information for pdf creation
$flier = new FlierModel();
$flier->submit_pdf($selectcat, $myName, $lastName, $dob, $DLnumber, $race, $sex, $height, $weight, $haircolor, $address, $tattoos,$summary, $rcheckboxes,$vcheckboxes,$clacheckboxes,$adtnlinfo,$newfilename,$author,$agency,$link);    

$result = $flier->get_bolo();

$doc = new bolo_pdf();
//created pdf using submitted information
$doc->save_pdf($result, TRUE, $author);

$preview_src = "wp-content/themes/inkness/uploads/preview" . $author . ".pdf";
$ua = strtolower($_SERVER['HTTP_USER_AGENT']);
if (stripos($ua, 'android') !== false || stripos($ua, 'iphone') !== false || stripos($ua, 'ipad') !== false) {
	$mobile = TRUE;
} else {
	$mobile = FALSE;
}
//remove PDF info after it has been displayed
$flier->remove_pdf($selectcat, $myName, $lastName, $dob, $DLnumber, $race, $sex, $height, $weight, $haircolor, $address, $tattoos,$summary, $rcheckboxes,$vcheckboxes,$clacheckboxes,$adtnlinfo,$newfilename,$author,$agency,$link);    
header('Content-Type: application/json');
echo json_encode(array('preview_url' => $preview_src, 'mobile' => $mobile));

?>