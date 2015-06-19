<?php
/**
 * Template Name: New Agency Controller Page
 *
 * @package Inkness
 */
 ?>
 <?php //page 1510 ?>
 
<?php
if(isset($_GET['function']))
{
    save_agency();
}
else
{
	update_agency();
}
	

function save_agency(){
	$name = $_POST["a_name"];
	$address = $_POST["address"];
	$city =$_POST["city"];
	$zip = $_POST["zip"];
	$phone = $_POST["phone"];
	
function update_agency(){
	$name = $_POST["a_name"];
	$address = $_POST["address"];
	$city =$_POST["city"];
	$zip = $_POST["zip"];
	$phone = $_POST["phone"];
	
	
	include_once('new_agency_model.php');
	$model = new agency_model();
	$model->save_agency($name, $address, $city, $zip, $phone);	
	header('Location: /bolofliercreator/?page_id=1508');
	
	//update agency
	include_once('new_agency_model.php');
	$model = new agency_model();
	$model->update_agency($name, $address, $city, $zip, $phone);	
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
	}
?>
