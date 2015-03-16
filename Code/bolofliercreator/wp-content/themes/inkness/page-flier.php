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
$tmp_name = $_FILES["picture"]["tmp_name"];
		$uploadfilename = $_FILES["picture"]["name"];
		$saveddate = date("mdy-Hms");
		$newfilename = "uploads/".$saveddate."_".$uploadfilename;
     	$uploadurl = 'http://'.$_SERVER['SERVER_NAME'].dirname($_SERVER['REQUEST_URI']).'/'.$newfilename;

		if (move_uploaded_file($tmp_name, $newfilename)):
			$msg = "File uploaded";
		
		
		endif; //move uploaded file
  ?> 
    </div> <!----->
<div class="container">
	<div class="row" >
    	<div class="col-md-4">
    	<div style="width: 320px;">	
        <?php
        
		echo '<img style="width: 320px;" src="', $newfilename, '" />';
			
		?>
        </div>
         </div>
        <div class="col-md-8">
        <table class="table table-bordered" border="0">
  <tbody>
    <tr>
      <td><h4>
      					
  
        	<h1 style="text-align:left; font-size:40px; text-transform:uppercase; color:red; font-weight: bold;"> 
   <?php
$selectcat=$_POST ['selectcat'];

echo $selectcat
?> </h1>
   	
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
     <td><h4>
     	<?php
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
 
 <!-- Date Display-->
<div class="control-group">
    <div class="col-md-6">
    
   <?php
echo "<h4>Created Date :</h4>" .date("Y/m/d"); ?>
   
   
  </div>
 </div>
				
 
</div>
</div>
</div>
</div>
</div>




<?php
$db_host = 'localhost';
$db_username = 'root';
$db_password = '';
$db_name = 'bolo_creator';

$conn = new mysqli ($db_host, $db_username, $db_password, $db_name);

if ($conn->connect_error){
	die("Connection Failed:" .$conn->connect_error);
}
    $vcheckboxes= implode(' ', $_POST['validity']);
	$rcheckboxes= implode(' ', $_POST['reliability']);
	$clacheckboxes= implode(' ', $_POST['classification']);
	
	

	if (empty($_POST['selectcat']) && empty($_POST ['myName'])){
 echo("<p>Please review the form:</p>\n");
}else
{
    $res = "INSERT INTO wp_flierform (selectcat, myName, dob,license,race, sex, height, weight, haircolor,tattoos,adtnlinfo,summary,image,validity,reliability,classification) 
    VALUES ('$selectcat', '$myName', '$dob', '$DLnumber', '$race', '$sex', '$height', '$weight', '$haircolor', '$tattoos', '$adtnlinfo','$summary' ,'$newfilename','$vcheckboxes','$rcheckboxes','$clacheckboxes ')";

    if ($conn->query($res) === TRUE)
    {
    	echo "Bolo flier created successfully";			
    			 		
    	
    }else{
    	echo "Error:" .$res . "<br> . $conn->error";
			
    }
	
	
}	
	$conn->close();
?>


<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "bolo_creator";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
 } 

$sql = "SELECT selectcat, myName, dob, race, sex, height, weight, haircolor,tattoos,adtnlinfo,summary FROM wp_flierform";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo "<table><tr><th>selectcat</th><th>myName</th><th>dob</th><th>race</th><th>dob</th>sex</tr>";
    // output data of each row
    while($row = $result->fetch_assoc()) {
        echo "<tr><td>".$row["selectcat"]."</td><td>".$row["myName"]."</td><td> ".$row["dob"]."</td><td>".$row["race"]."</td><td> ".$row["sex"]."</td></tr>";
    }
    echo "</table>";
} else {
    echo "0 results";
}
 $conn->close();
 ?> 

</html>
				
	 		</main><!-- #main -->
	</div><!-- #primary -->
