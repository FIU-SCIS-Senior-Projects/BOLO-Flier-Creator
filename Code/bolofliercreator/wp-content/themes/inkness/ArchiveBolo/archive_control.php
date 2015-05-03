<?php

/**
 * Template Name: Archive Control Page
 *
 * @package Inkness
 * 
 * page 1539
 */
 ?>
 


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
                    
                    $result = $bolo->archive($iniDate,$endDate);
					                   
                        echo("<h3>Bolo archived successfully!!!</h3>");
                    

                ?>
            </div>
        </div>
    </div>
</div>

</body>



<?php get_footer(); ?>
