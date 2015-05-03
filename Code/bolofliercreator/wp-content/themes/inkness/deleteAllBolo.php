<?php
/**
 * Template Name: Delete Purges Bolo
 *
 * @package Inkness
 */
?>
<?php //page 1530?>
<head>
<meta charset="UTF-8">
<title>Delete Purge Bolo</title>
<link rel="stylesheet" href="custom-styles.css">
<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">

<!-- Optional theme -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap-theme.min.css">

<!-- Latest compiled and minified JavaScript -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>

    <script src="jquery-1.6.2.min.js"></script>
    <script src="jquery-ui-1.8.15.custom.min.js"></script>
    <link rel="stylesheet" href="jqueryCalendar.css">



</head>
<?php
get_header(); ?>


<body>
<div class="container">
    <div class="row">
        <div class="col-md-9">
            <div class="form-group">
                <?php
                    include_once'Model_Bolo.php';
                    $bolo = new Model_Bolo();
					if($_GET['idate']!=""){
						$iniDate=$_GET['idate'];
					}else{
						echo("<h3>Sorry, something wrong has occurred</h3>");
					}
					if($_GET['edate']!=""){	
					$endDate=$_GET['edate'];
					}else{	
					echo("<h3>Sorry, something wrong has occurred</h3>");
					}
                    
                    $result = $bolo->deleteAll($iniDate,$endDate);
                    if($result)
                    {
                        echo("<h3>Bolo deleted successfully!!!</h3>");
                    }else{
                        echo("<h3>Some DATABASE error has occurred</h3>");
                    }

                ?>
            </div>
        </div>
    </div>
</div>

</body>



<?php get_footer(); ?>
