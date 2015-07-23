
<?php
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
?>


<?php
include_once'flier_model.php';
include_once'flier_view.php';

    $flier = new FlierModel();
	$view  =  new Flier_View();
    $showModal = false;
	
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

//session_start();

    //initialize

//case the user clicks on save
if(isset($_POST["save"]) && $_POST["save"]) {
 	
	$flier->submit ($selectcat, $myName, $lastName, $dob, $DLnumber, $race, $sex, $height, $weight, $haircolor, $address, $tattoos,$summary, $adtnlinfo, $newfilename, $author, $agency, $link);
	$data = $flier->getlast();

	$result = $data->fetch_assoc(); 
	$id = $result['bolo_id']; 
	$url = "/bolofliercreator/wp-content/themes/inkness/BoloSelected.php?idBolo=" . $id;
	echo "<script>window.location = '$url'      </script>";
    
   if (realpath('uploads/preview' . $author . '.pdf'))
   {
       //delete the preview file
       unlink('uploads/preview' . $author. '.pdf');
   } 

    //submit information for pdf creation
    $flier = new FlierModel();
    $flier->submit_pdf($selectcat, $myName, $lastName, $dob, $DLnumber, $race, $sex, $height, $weight, $haircolor, $address, $tattoos,$summary, $adtnlinfo,$newfilename,$author,$agency,$link, TRUE);    
    
    $result = $flier->get_bolo();
    include"BoloPDF/bolo_pdf.php";
    $doc = new bolo_pdf();
    //created pdf using submitted information
    $doc->save_pdf($result, TRUE, $author);
   
   //send email with PDF file
    include_once'emailController.php';
	
	
    //delete the generated pdf
    //$flier->remove_pdf($selectcat, $myName, $lastName, $dob, $DLnumber, $race, $sex, $height, $weight, $haircolor, $address, $tattoos,$summary, $rcheckboxes,$vcheckboxes,$clacheckboxes,$adtnlinfo,$newfilename,$author,$agency,$link);
   	//die();
}
//if preview button was clicked
elseif(isset($_POST["preview"]) && $_POST["preview"]) {
    
    //submit information for pdf creation
    $flier->submit_pdf($selectcat, $myName, $lastName, $dob, $DLnumber, $race, $sex, $height, $weight, $haircolor, $address, $tattoos,$summary, $adtnlinfo, $newfilename, $author, $agency, $link);    
    
    $result = $flier->get_bolo();
    
    include"BoloPDF/bolo_pdf.php";
    $doc = new bolo_pdf();
    //created pdf using submitted information
    $doc->save_pdf($result, TRUE, $author);
    //set to true to display modal
    $showModal = true;
	
	//$_SESSION['showModal'] = TRUE;
	
	$ua = strtolower($_SERVER['HTTP_USER_AGENT']);
	//if (stripos($ua, 'android') !== false || stripos($ua, 'iphone') !== false || stripos($ua, 'ipad') !== false) {
	//	$_SESSION['isMobile'] = TRUE;
	//}
    //session_write_close();
	header("Location: http://bolo.cs.fiu.edu/bolofliercreator/?page_id=6");
	//remove PDF info after it has been displayed
    $flier->remove_pdf($selectcat, $myName, $lastName, $dob, $DLnumber, $race, $sex, $height, $weight, $haircolor, $address, $tattoos,$summary, $adtnlinfo, $newfilename, $author, $agency, $link);
    
    //set to false so another BOLO may be shown
    $showModal = false;
}
//case the user clicks on Save as PDF (the flier will be saved on a diff table only for the PDFs, completely
//independent from the regular bolos)
else{	
	$flier->submit_pdf($selectcat, $myName, $lastName, $dob, $DLnumber, $race, $sex, $height, $weight, $haircolor, $address, $tattoos, $summary, $adtnlinfo, $newfilename, $author, $agency, $link);	
	
	$result = $flier->get_bolo();
	include"BoloPDF/bolo_pdf.php";
	$doc = new bolo_pdf();
	$doc->save_pdf($result, FALSE, $author);
	
}
 //session_unset();

?>