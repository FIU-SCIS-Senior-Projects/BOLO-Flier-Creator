
<?php
/**
 * Template Name: Edit List Page Control
 *
 * @package Inkness
 */
?>
<?php //page 1500?>

<?php

include_once("edit_model.php");
include_once("edit_list_view.php");

$mymodel = new edit_model();
$myview = new edit_list_view();

$data = $mymodel->get_user_bolos();

$myview->bolos_for_edit($data);
?>
