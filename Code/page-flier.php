<?php
/*
Danae I. Perez Tillan
Senior Project Class

This contains all the part need it to create the flier.  When an user click on submit button in the form, its generate the output of the form.  


*/
/**
 * Template Name: Fliers 
 *
 * @package Inkness
 */
?>

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



	                   
<div id="primary" class="content-area col-md-8">
		<main id="main" class="site-main" role="main">
		
					
 <?php include ('inc/headers.php'); ?>

<?php 
// This allows users upload a picture,and saved with an unique name.  This included in the picture's name the date and stamp time.
// Avoid the replacement of any suspect picture
$original_name = $_FILES["picture"]["original_name"];
		$uploadpicturename = $_FILES["picture"]["name"];
		$saveddate = date("mdy-Hms");
		$newpicturename = "uploads/".$saveddate."_".$uploadpicturename;
     	$uploadurl = 'http://'.$_SERVER['SERVER_NAME'].dirname($_SERVER['REQUEST_URI']).'/'.$newpicturename;

		if (move_uploaded_file($original_name, $newpicturename)):
			$msg = "Picture uploaded";
		endif; 
  ?> 

<div class="container">
	<div class="row">
		<div class="col-md-8">
			<div class="form-group">
				
  <div class="container">
    	<div class="row">
        	<h1 style="text-align:center; font-size:25px; text-transform:uppercase; color:red; font-weight: bold; 35px;"> <?php
$selectcat=$_POST ['selectcat'];

echo $selectcat
?> </h1>
      	</div>
    </div> <!---category-->

	<div class="container">
	<div class="row" >
    	<div class="col-md-4">
    	<div style="width: 320px;">	
        <?php        
		echo '<img style="width: 320px;" src="', $newpicturename, '" />';
		?>
        </div>
         </div>
        <div class="col-md-8">
        <table class="table table-bordered" border="0">
  <tbody>
    <tr>
      <td><h4><?php
$title=$_POST ['title'];

echo "Title: $title "
	
?></h4></td>
    </tr>
  </tbody>
</table>
<br>
        
        <p style="font-size:15px; padding-left:12px;">Subject Info:</p>
          <table  border="0" class="table table-bordered" >
  <tbody>
    
    <tr>
      <td><h4><?php
$myName=$_POST ['myName'];

echo "Name: $myName "
?></h4></td>
    
      <td><h4><?php
$dob=$_POST ['dob'];

echo "D.O.B: $dob "

?></h4></td>

      <td><h4><?php
$DLnumber=$_POST ['DLnumber'];

echo "License #: $DLnumber "
?></h4></td>
    </tr>
    <tr>
      <td><h4><?php
$race=$_POST ['race'];

echo "Race: $race"?></h4></td>
     <td><h4><?php
$sex=$_POST ['sex'];

echo "Sex: $sex"?></h4></td>
     <td><h4><?php
$height=$_POST ['height'];

echo "Height: $height"?></h4></td>
    </tr>
    <tr>
      <td><h4><?php
$weight=$_POST ['weight'];

echo "Weight: $weight"?></h4></td>
      <td><h4><?php
$haircolor=$_POST ['haircolor'];

echo "Hair Color: $haircolor"?></h4></td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td><h4><?php
$address=$_POST ['address'];

echo "Address: $address"?></h4></td>
     <td><h4><?php
$tattoos=$_POST ['tattoos'];

echo "Tattoos/Scars: $tattoos"?></h4></td>
      <td>&nbsp;</td>
    </tr>
  </tbody>
</table>
        </div>

	</div>
</div> <!--- Table-->

<div class="container">
	<div class="row">
    	<div class="col-md-12" style="padding-left:25px; padding-right:25px; padding-top:25px;">
        	<p style=" min-height:70px; font-size:18px;"><td><p><?php
$adtnlinfo=$_POST ['adtnlinfo'];

echo "<h4> Additional Info:</h4> $adtnlinfo"?> </p></td></p>
        
        </div>
    
    </div>


</div> <!--- AdditionalInfo-->

<div class="container">
	<div class="row">
    	<div class="col-md-12" style="padding-left:25px; padding-right:25px; padding-top:25px;">
        	<p style=" min-height:70px; font-size:18px;"><td><p>
        		<?php
$summary=$_POST ['summary'];

echo "<h4>Summary:</h4> $summary"?></p></td></p>
      
        </div>
    
    </div>


</div> <!--- Summary-->


<div class="container">
	<div class="row">
   	  <div class="col-md-12" style="border: 1px solid #7e7e7e; padding: 15px;">
        	<p style="font-size:12px;"><em>Contact Information:</em> Any Agency having questions regarding this document may contact Detective Julian Perez or Sergeant Carlos Villanueva at 305-234-2100.</p>
        
        </div>
    </div>

</div> <!--- Contact information-->

<div class="container">
	<div class="row" style="padding-top:25px;">
    <div class="col-md-12">
      <?php
    //initialize
/*
For the check-boxes, I created in the form a blank hidden field in order to be able to take empty request for the users.  
First, the null post was checked, if this is true do nothing, else it will take the information selected, and display it in the flier.

*/  
if ($_POST['reliability'] == null){		
//do nothing
} elseif ( $reliability = count($_POST['reliability']) ? $_POST['reliability'] : array());
echo '<span style="font-weight:bold;">Source Reliability:</span>';
echo "<br>";
echo   count($reliability) ? implode('&nbsp;&nbsp; ',$reliability) : 'Nothing';
echo "<br>";
echo "<br>";
if ($_POST['validity'] == null){		
//do nothing
} elseif ( $validity = count($_POST['validity']) ? $_POST['validity'] : array());
echo '<span style="font-weight:bold;">Content Validity:</span>';
echo "<br>";
echo   count($validity) ? implode('&nbsp;&nbsp; ',$validity) : 'Nothing';
echo "<br>";
echo "<br>";

if ($_POST['classification'] == null){		
//do nothing
} elseif ( $classification = count($_POST['classification']) ? $_POST['classification'] : array());
echo '<span style="font-weight:bold;">Information Classification:</span>';
echo "<br>";
echo   count($classification) ? implode('&nbsp;&nbsp; ',$classification) : 'Nothing';

  ?>  
   
    </div>
    </div>


<div class="container">
	<div class="row">
    
    	<div class="col-md-12">
        	
        	<p style="text-align:center; font-size:15px; text-transform:uppercase; margin-top:15px; color:red; font-weight: bold">Unclassified// for official use only// law enforcement sensitive </p>
            <br><br>
        </div>
    </div>

</div>
 </div><!---- Closing Container-->
 
 
</div>
</div>
</div>
</div>
</div>

<?php

// This is to test the database.  when submitting the form, the fields information entered needs to be inserted in the Database.
$db_host = 'localhost';
$db_username = 'root';
$db_password = '';
$db_name = 'bolo_creator';



$conn = new mysqli ($db_host, $db_username, $db_password, $db_name);
if ($conn->connect_error){
	die("Connection Failed:" .$conn->connect_error);
}
    $res = "INSERT INTO wp_flierform (selectcat, title, myName, dob, race, sex, height, weight, haircolor,tattoos,adtnlinfo,summary) 
    VALUES ('$selectcat', '$title', '$myName', '$dob', '$race', '$sex', '$height', '$weight', '$haircolor', '$tattoos', '$adtnlinfo', '$summary')";
   
    if ($conn->query($res) === TRUE)
    {
    	echo "Bolo flier created successfully";			
    			 		
    	
    }else{
    	echo "Error:" .$res . "<br> . $conn->error";
			
    }
	
	$conn->close();

?>
</html>
					 
				
	 		</main><!-- #main -->
	</div><!-- #primary -->











