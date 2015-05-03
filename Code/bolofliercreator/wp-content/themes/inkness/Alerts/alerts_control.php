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

/*
 * This method request and update of the bolo
 */
function update(){
	
	$alert= implode(' ', $_POST['alert']);
	$user = $_POST['user_id'];
	
	include'alerts_model.php';

	$model = new alert_model();	
	
	$model->update_alert($user, $alert);
	
	header('Location: /bolofliercreator/?page_id=1561');
}






?>