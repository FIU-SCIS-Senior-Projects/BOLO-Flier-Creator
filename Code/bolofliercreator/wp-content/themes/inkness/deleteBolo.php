<?php
/**
 * Template Name: Delete Bolo
 *
 * @package Inkness
 */
?>
<?php//page 1492?>
<head>
<meta charset="UTF-8">
<title>Bolo Form</title>
<link rel="stylesheet" href="custom-styles.css">
<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">

<!-- Optional theme -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap-theme.min.css">

<!-- Latest compiled and minified JavaScript -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>
</head>

<?php
get_header(); ?>
<body>
<div class="container">
    <div class="row" >
        <div class="col-md-4">
            <div style="width: 320px;">
                 <?php 
				
                 if($_POST['idBolo']!="")
                 {
                     $id = $_POST['idBolo'];
                 }else
                 {
                     echo("<h3>Sorry something wrong has occurred</h3>");
                 }
				 

                 include_once'Model_Bolo.php';
                 $bolo = new Model_Bolo();
                 $result = $bolo->deleteBolo($id);
                 if($result)
                 {
                     echo("<h3>Bolo deleted successfully!</h3>");
                 }else{
                     echo("<h3>Some DATABASE error has occurred</h3>");
                 }
                 ?>
            </div>
        </div>
    </div>
</div>


</body>