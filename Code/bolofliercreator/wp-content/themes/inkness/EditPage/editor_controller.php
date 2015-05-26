<?php
/**
 * Template Name: Editor Controler Page
 *
 * @package Inkness
 */
 ?>
 <?php //page  It serves as controller for the bolo editor?>
<?php
/**
include_once("edit_model.php");
include_once("editor_view.php");

$model = new edit_model();
//$view = new editor_view();

$result = $model->get_bolo($_GET['idBolo']);

//$view->draw_editor($result->fetch_assoc());
$row = $result->fetch_assoc();

$url = "/bolofliercreator/wp-content/themes/inkness/editPage/editor_view.php"; 
//echo $url;
echo "<script>window.location = '$url'      </script>";
*/
?>

<?php
class editor_controller{
	
	public function _contruct(){
	}
	
	/*
	 * request the model object for the desired bolo
	 * @param the id of the bolo
	 * @returns an associative array with the info of the bolo
	 */
	public function get_bolo($boloId){
		include_once("edit_model.php");
		$model = new edit_model();
		$result = $model->get_bolo($boloId);
		return $result->fetch_assoc();
	}
	
	
}//end class editor_controller
?>

<?php
if(isset($_GET['function']))
{
    update();
}

/*
 * This method request an update of the bolo
 */
function update(){
    include_once("edit_model.php");
    $model = new edit_model();
    	
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
	$val= implode(' ', $_POST['validity']);
	$rel= implode(' ', $_POST['reliability']);
	$clas= implode(' ', $_POST['classification']);
	$editor_id = $_POST['editor_id'];
	$update = $_POST['update'];
	$link = $_POST['link'];
	$queryResult = false;
		
	//if a new photo is uploaded, save it and send it for updating
	if ($_FILES["picture"]["name"] !== '' ){
		
		$tmp_name = $_FILES["picture"]["tmp_name"];
		$uploadfilename = $_FILES["picture"]["name"];
		$saveddate = date("mdy-Hms");
		$newfilename = "../uploads/".$saveddate."_".$uploadfilename;
		$filename_for_sql = "uploads/".$saveddate."_".$uploadfilename;
     	$uploadurl = 'http://'.$_SERVER['SERVER_NAME'].dirname($_SERVER['REQUEST_URI']).'/'.$newfilename;

		if (move_uploaded_file($tmp_name, $newfilename)){
		    $msg = "File uploaded";
		}//move uploaded file
				
		$queryResult = $model->update_bolo($_POST['bolo_id'], $selectcat, $myName, $lastName, $dob, $DLnumber, $race, $sex, $height, $weight, $haircolor, $address, $tattoos,
        $adtnlinfo, $summary, $newfilename, $val, $rel, $clas, $update, $editor_id,$link);
	}
	//otherwise, just keep the old picture
	else{
		$result = $model->get_bolo($_POST['bolo_id']);
		$row = $result->fetch_assoc();
		$old_pic = $row['image'];
		$queryResult = $model->update_bolo($_POST['bolo_id'], $selectcat, $myName, $lastName, $dob, $DLnumber, $race, $sex, $height, $weight, $haircolor, $address, $tattoos,
			$adtnlinfo, $summary, $old_pic, $val, $rel, $clas, $update, $editor_id,$link);
	}
	//delete old bolo
	//$model->delete($_POST['bolo_id']);
	//go back to home page after all is said and done
	if ($queryResult == true){
	   header('Location: /bolofliercreator/');    
	}
    else{
        header('Location: /bolofliercreator/editFailure.php');
    }
}
?>

