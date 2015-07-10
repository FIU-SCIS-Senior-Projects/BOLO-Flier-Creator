<?php
/**
 * Template Name: BoloSelected
 *
 * @package Inkness
 */
?>

<?php //1488 ?>
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
$background = 'watermark.jpg';

?>
<?php $prop1 = $_GET['idBolo'];?>

   <?php include_once('Model_Bolo.php');
    $bolo = new Model_Bolo();
    $resultProp1= $bolo->infoBolo($prop1);
    $picture = $bolo->loadPicture();


    while ($row= mysqli_fetch_array($resultProp1))
    {

        $resultId =  $row['bolo_id'];
        $resultAddr = $row['address'];
        $resultAdt = $row['adtnlinfo'];
        $resultDob = $row['dob'];
        $resultHair = $row['haircolor'];
        $resultHeight = $row['height'];
        $resultHeight = $row['height'];
        $pathImage = $row['image'];
        $resultName = $row['myName'];
		$resultlastName = $row['lastName'];
        $resultRace = $row['race'];
        $resultCat = $row['selectcat'];
        $resultSex = $row['sex'];
        $resultSumm = $row['summary'];
        $resultTattoo = $row['tattoos'];
        $resultWeight = $row['weight'];
        $resultLicense = $row['license'];
		$resultDate = $row['datecreated'];
		$author = $row['author'];
		$update = $row['update_status'];
		$link = $row['link'];
    }
	
	$author_name = $bolo->loadAuthor($author);
    
    //get user info
    
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "bolo_creator";
    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
    
    $sectionSQL = <<<SQL
    SELECT meta_value
    FROM wp_usermeta
    WHERE user_id="$author" AND meta_key="Section"
SQL;
    $sectionResults = $conn->query($sectionSQL);
    $section = $sectionResults->fetch_assoc();

    $rankSQL = <<<SQL
    SELECT meta_value
    FROM wp_usermeta
    WHERE user_id="$author" AND meta_key="Rank"
SQL;
    $rankResults = $conn->query($rankSQL);
    $rank = $rankResults->fetch_assoc();
    
 ?>

 <?php include_once('inc/header_view_bolo.php'); 
 	$head = new head();
	$head->make_banner($author);
 ?>


 <div class="redirects" style="position: relative; left: 52px; bottom: 25px;">
    <a href="http://bolo.cs.fiu.edu/bolofliercreator/"><font size="6" color="green" font-weight: "bold">Home</font></a>
    <td>&emsp;&emsp;&emsp;&emsp;</td>
    <a href="http://bolo.cs.fiu.edu/bolofliercreator/?page_id=284"><font size="6" color="green" font-weight: "bold">Search</font></a>
 </div>
 <div class="container">

	<div class="row" >
    	<div class="col-md-4">
    	<div style="width: 320px;">	
        <!-- make the image link to the full view in a new tab -->
		<div class="item">
		    <a href="http://bolo.cs.fiu.edu/bolofliercreator/?page_id=1534&pic=<?php echo $pathImage?>" target="_blank">
		       
		       <?php $img = '/bolofliercreator/wp-content/themes/inkness/'.$pathImage;?>
		       
		        <img style="width: 320px;" src="<?php echo $img; ?>" attributes="#"\>
		       
		    </a>
		    <div class="popup" attributes="#"></div>
		</div>
		
    	 <?php	
	    	 if($link !== ""){
	    	 	echo "<a  target = '_blank' href= $link  >Video Link  </a>";
			 }
    	 ?>
    	 	
        </div>
         </div>
        
        
        
        
       
    <!---     <div

           <a title = "print screen" alt="print screen" align = "center"  onclick="window.print()";"target="_blank"  style ="cursor: pointer; color:green; font-weight: bold;">Print</a>              
          </div>
       
       <div
           <a title = "save pdf" "target="_blank"  style ="cursor: pointer; color:green; font-weight: bold;">Save as PDF</a>              
          </div>
   -->    
       
       
        <div class="col-md-8">
        <table class="table table-bordered" border="0">
  <tbody>
    <tr>
      <td><h4>            
 
 <h1 style="text-align:left; font-size:40px; text-transform:uppercase; color:red; font-weight: bold;"> <?php echo "$resultCat" ?> </h1>
       
     <!---category-->
                  
          </h4></td>
    </tr>
  </tbody>
</table>
<br>
 
        <p style="font-size:15px; padding-left:12px;">Subject Info:</p>
          <table  border="0" class="table table-bordered" >
  <tbody>
    
    <tr>
      <td><h4>Name:<?php echo "&nbsp" . "$resultName" . "&nbsp" ."$resultlastName" ?></h4></td>
    
      <td><h4>D.O.B:<?php echo "$resultDob "?></h4></td>

      <td><h4>License #:<?php echo "$resultLicense "?></h4></td>
    </tr>
    <tr>
      <td><h4>Race:<?php echo " $resultRace"?></h4></td>
     <td><h4>Sex:<?php echo " $resultSex"?></h4></td>
     <td><h4>Height:<?php echo " $resultHeight"?></h4></td>
    </tr>
    <tr>
      <td><h4>Weight:<?php echo " $resultWeight"?></h4></td>
      <td><h4>Hair Color:<?php echo "$resultHair"?></h4></td>
	  <td><h4>Bolo ID:<?php echo "$resultId"?></h4></td>
      
    </tr>
    <tr>
      <td><h4>Address:<?php echo "$resultAddr"?></h4></td>
     <td><h4>Tattoos/Scars:<?php  echo " $resultTattoo"?></h4></td>
      <td>&nbsp;</td>         
      
    </tr>
  </tbody>
</table>
<?php
	if($update != ''){
		echo '<h1 style="text-align:left; font-size:40px; text-transform:uppercase; color:red; font-weight: bold;">UPDATE: '.$update.'</h1>';
	}
?>
        </div>

    
 <!--- Table-->
<div class="container">
    <div class="row">
        <div class="col-md-12" style="padding-left:25px; padding-right:25px; padding-top:25px;">
            <p style=" min-height:70px; font-size:18px;"><td><p>
			 <td><h4>Bolo Created Date:<?php  echo " $resultDate"?></h4></td>
                   
        </div>
    
    </div>

 
 
<div class="container">
    <div class="row">
        <div class="col-md-12" style="padding-left:25px; padding-right:25px; padding-top:25px;">
            <p style=" min-height:70px; font-size:18px;"><td><p>
            <?php echo "<h4> Additional Info:</h4> $resultAdt"?> </p></td>
        
        </div>
    
    </div>


</div> <!--- AdditionalInfo-->

<div class="container">
    <div class="row">
        <div class="col-md-12" style="padding-left:25px; padding-right:25px; padding-top:25px;">
            <p style=" min-height:70px; font-size:18px;"><td>
                <h4>Summary: <?php echo " $resultSumm"?></h4></td>
      
        </div>
    
    </div>


</div> <!--- Summary-->

    
    
<div class="container">
    <div class="row">
         <div class="col-md-12" style="border: 1px solid #7e7e7e; padding: 15px;">
            <p style="font-size:12px;"><em>Contact Information:</em>
            	Any Agency having questions regarding this document may contact <?php echo $section['meta_value'];?> <?php echo $rank['meta_value'] ?> <?php echo $author_name; ?>.
            	</p>
        </div>
    </div>

</div> <!--- Contact information-->



 

<!--<a href="searchBolo.php" > Start Search</a>-->



             <!-- #main -->
    <!-- #primary -->