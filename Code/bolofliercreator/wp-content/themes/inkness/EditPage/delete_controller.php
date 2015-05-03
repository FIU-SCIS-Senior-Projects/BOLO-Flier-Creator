<?php
/**
 * Template Name: Delete Controller Page
 *
 * @package Inkness
 */
 ?>
 
<?php //page1532?>

<?php //called delete_controller, but actually controls the archive function?>

<?php include 'edit_model.php';

  $model = new edit_model();
  $boloid= $_GET['idBolo'];
  $model->archive($boloid);
  
  
  header('Location: /bolofliercreator/?page_id=1500');
   



