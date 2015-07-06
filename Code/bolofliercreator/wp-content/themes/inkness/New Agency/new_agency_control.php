<?php
/**
 * Template Name: New Agency Controller Page
 *
 * @package Inkness
 */
 ?>
 <?php //page 1510 ?>
 
 
 <?php
if(isset($_GET['function3']))
{
    update_agency();
}
 
function update_agency()
{
	
	//case a Logo is uploaded when updating an agency
    if(isset($_FILES["logo"]) && $_FILES["logo"]["name"] !== '' ){
        $tmp_name = $_FILES["logo"]["tmp_name"];
        $uploadfilename = $_FILES["logo"]["name"];
    $saveddate = date("mdy-Hms");
    $newfilename = "uploads/".$saveddate."_".$uploadfilename;
    $logourl = 'http://'.$_SERVER['SERVER_NAME'].dirname($_SERVER['REQUEST_URI']).'/'.$newfilename;
    
    if (move_uploaded_file($tmp_name, $newfilename)){
        $msg = "File uploaded";
    }
	
	
	//case a Shield is uploaded when updating an agency
    if(isset($_FILES["shield"]) && $_FILES["shield"]["name"] !== '' ){
        $tmp_name = $_FILES["shield"]["tmp_name"];
        $uploadfilename = $_FILES["shield"]["name"];
    $saveddate = date("mdy-Hms");
    $newfilename = "uploads/".$saveddate."_".$uploadfilename;
    $shieldurl = 'http://'.$_SERVER['SERVER_NAME'].dirname($_SERVER['REQUEST_URI']).'/'.$newfilename;
    
    if (move_uploaded_file($tmp_name, $newfilename)){
        $msg = "File uploaded";
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
}
?>


 <?php
if(isset($_GET['function']))
{
    save_agency();
}

function save_agency(){
	
	//case a Logo is uploaded when updating an agency
    if(isset($_FILES["logo"]) && $_FILES["logo"]["name"] !== '' ){
        $tmp_name = $_FILES["logo"]["tmp_name"];
        $uploadfilename = $_FILES["logo"]["name"];
    $saveddate = date("mdy-Hms");
    $newfilename = "uploads/".$saveddate."_".$uploadfilename;
    $logourl = 'http://'.$_SERVER['SERVER_NAME'].dirname($_SERVER['REQUEST_URI']).'/'.$newfilename;
    
    if (move_uploaded_file($tmp_name, $newfilename)){
        $msg = "File uploaded";
    }
	
	
	//case a Shield is uploaded when updating an agency
    if(isset($_FILES["shield"]) && $_FILES["shield"]["name"] !== '' ){
        $tmp_name = $_FILES["shield"]["tmp_name"];
        $uploadfilename = $_FILES["shield"]["name"];
    $saveddate = date("mdy-Hms");
    $newfilename = "uploads/".$saveddate."_".$uploadfilename;
    $shieldurl = 'http://'.$_SERVER['SERVER_NAME'].dirname($_SERVER['REQUEST_URI']).'/'.$newfilename;
    
    if (move_uploaded_file($tmp_name, $newfilename)){
        $msg = "File uploaded";
    }
	
	$name = $_POST["a_name"];
	$address = $_POST["address"];
	$city =$_POST["city"];
	$zip = $_POST["zip"];
	$phone = $_POST["phone"];
	

	
	include_once('new_agency_model.php');
	$model = new agency_model();
	$model->save_agency($name, $address, $city, $zip, $phone, $logourl, $shieldurl);	
	header('Location: /bolofliercreator/?page_id=1508');
}

?>

<?php
if(isset($_GET['function2']))
{
    new_agency();
}
function new_agency(){
	header('Location: /bolofliercreator/?page_id=1512');
}
?>

<?php
	class agency_control{
		
		public function _contruct(){
			
		}
		
		public function get_agencies(){
			include_once('new_agency_model.php');
			$model = new agency_model();
			return $model->get_agencies();
		}
		
		public function getAgency($idAgency)
		{
			include_once("new_agency_model.php");
			$model = new agency_model();
			$result = $model->getAgency($idAgency);
			return $result->fetch_assoc();
			
		}
		

	}
	
?>
