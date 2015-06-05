<?php
/**
 * Template Name: Archive Page
 *
 * @package Inkness
 */
?>

<?php
	include_once("ArchiveBolo/archive_model.php");
	include_once("ArchiveBolo/archive_view.php");

	$model 		= new archive_model();
	$agencies 	= $model->get_agencies();
	$view 		= new archive_view();
	
	//get the bolos for the desired agency (default value = 'Show ALL')
	$result = $model->get_data($_POST['agency'], $_POST['offset']+0);
	
	//update the view with the new data
	$view->update_view($result, $data, $agencies, $_POST['agency'], $_POST['offset']+0);
?>

<script type="text/javascript">
    document.getElementById("myButton").onclick = function () {
        location.href = "?page_id=6";
    };
</script>
