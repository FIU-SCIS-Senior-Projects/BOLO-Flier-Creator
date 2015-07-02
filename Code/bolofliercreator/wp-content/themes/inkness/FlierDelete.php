<?php
	include "flier_model.php";
    $boloID = $_GET[boloID];
	
	$flier = new FlierModel;
    $flier->remove($boloID);

?>