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
        $resultClass = $row['classification'];
        $resultDob = $row['dob'];
        $resultHair = $row['haircolor'];
        $resultHeight = $row['height'];
        $resultHeight = $row['height'];
        $pathImage = $row['image'];
        $resultName = $row['myName'];
        $resultRace = $row['race'];
        $resultReli = $row['reliability'];
        $resultCat = $row['selectcat'];
        $resultSex = $row['sex'];
        $resultSumm = $row['summary'];
        $resultTattoo = $row['tattoos'];
        $resultValidity = $row['validity'];
        $resultWeight = $row['weight'];
        $resultLicense = $row['license'];
		$resultDate = $row['datecreated'];
    }
 ?>

 <?php include ('inc/headers.php'); ?>
 
 
 <div class="container">
	<div class="row" >
    	<div class="col-md-4">
    	<div style="width: 320px;">	
        <?php
        
		echo '<img style="width: 320px;" src="', $pathImage, '" />';
			
		?>
        </div>
         </div>
        
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
      <td><h4>Name:<?php echo "$resultName" ?></h4></td>
    
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
    <div class="row" style="padding-top:25px;">
    <div class="col-md-12">
      <h4>Source Reliability:<?php echo "$resultReli" ?> </h4> 

    </div>
    </div>
   
<div class="row" style="padding-top:25px;">
    <div class="col-md-12">
     <h4>Content Validity: <?php echo "$resultValidity" ?> </h4> 

    </div>
    </div>

<div class="row" style="padding-top:25px;">
    <div class="col-md-12">
      <h4>Information Classification:<?php echo "$resultClass" ?> </h4> 

    </div>
    </div>    
    
    
     </div>
    
    
<div class="container">
    <div class="row">
         <div class="col-md-12" style="border: 1px solid #7e7e7e; padding: 15px;">
            <p style="font-size:12px;"><em>Contact Information:</em> Any Agency having questions regarding this document may contact Detective Julian Perez or Sergeant Carlos Villanueva at 305-234-2100.</p>
        
        </div>
    </div>

</div> <!--- Contact information-->






<!--<a href="searchBolo.php" > Start Search</a>-->

<a href="http://localhost/bolofliercreator/?page_id=284">Start Search</a>


                
             <!-- #main -->
    <!-- #primary -->