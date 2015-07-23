<?php
/**
 * Template Name: Alerts Controler Page
 *
 * @package Inkness
 * 
 * ?page_id=1556
 */
?>
 
<?php

class alert_control{
	public function _construc(){		
	}
	
	/**
	 * gets if the user wants notifications
	 */
	public function get_info(){
		include'alerts_model.php';

		$model = new alert_model();
		//get_user_meta(get_current_user_id(), "agency", true);
		
		$alert = $model->get_alert(get_current_user_id());
		
		return $alert;
	}
}//end class alert_control
?>

<?php
if(isset($_GET['function']))
{
    update();
}


function update(){
	
	$user		 = $_POST['user_id'];
	$id_agencies = '';
	
	/// Populate the Agencies  array. (id of each selected agency)
	$i=0;
	foreach( $_POST as $stuff => $val1 ) {
		if( !is_array( $stuff ) &&  strncasecmp($stuff,'check-',6) == 0) {
			$id_agencies = $id_agencies . '<' . substr_replace($stuff,'',0,6) . '>';
			$i++;
		}
	}

	foreach($id_agencies as $ida)
		echo $ida . '<br/>';
	
	include'alerts_model.php';

	$model = new alert_model();	
	$model->update_alert($user, $id_agencies);
	
	header('Location: /bolofliercreator/?page_id=1561');
}






?>