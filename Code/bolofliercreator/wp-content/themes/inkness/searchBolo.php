<?php
/**
 * Template Name: Search Bolo
 *
 * @package Inkness
 */
?>

<head>
<meta charset="UTF-8">
<title>Search Form</title>
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

<?php
    include_once'Model_Bolo.php';
    $bolo=new Model_Bolo();
    $resultIds = $bolo->loadIds();
    $resultAddr = $bolo->loadAddr();
    //$resultAdt = $bolo->loadAdtnlinfo();
    $resultClass = $bolo->loadClass();
    $resultDob = $bolo->loadDob();
    $resultHair = $bolo->loadHairColor();
    //$resultHeight = $bolo->loadHeight();
    $resultLicense = $bolo->loadLicense();
    $resultName = $bolo->loadName();
    $resultRace = $bolo->loadRace();
    $resultReli = $bolo->loadReli();
    $resulCat = $bolo->loadCat();
    $resultSex = $bolo->loadSex();
    //$resultSumm = $bolo->loadSumm();
    //$resultTattoo = $bolo->loadTattoo();
    $resultValidity = $bolo->loadValidity();
    //$resultWeight = $bolo->loadWeight();
    $resultCat = $bolo->loadCat();
	$picture = $bolo->loadPicture();
	$resultDate = $bolo->loadDateCreated();
?>

<div class="container">
	<div class="row">
		<div class="col-md-9">    
    	<div class="form-group">
        	
        	
<form action="<?php echo get_template_directory_uri();?>../ResultSearchBolo.php"  id="buscarForm" method="post"> 
        <div class="col-md-6">
        <br>
            <label>Select Id: &nbsp;</label>
                
                <select id="id" name="id" style="width:200px;" class="form-control" >
                    <option>  </option >

                    <?php
                    while ($row= mysqli_fetch_array($resultIds))  {
                        $prop1 = $row['bolo_id'];
                        echo "<option > $prop1 </option >";
                        echo($prop1);
                    }
                    ?>

                </select>
               
                
           </div>
               
         
  <div class="col-md-6">
  <br>
                <label>Name: &nbsp;</label>
                

                <select id="name" name="name" style="width:200px;" class="form-control" >
                    <option >  </option >

                    <?php
                    while ($row= mysqli_fetch_array($resultName))  {
                        $prop2 = $row['myName'];
                        echo "<option > $prop2 </option >";

                    }
                    ?>

                </select>
          
  </div>
           <br>     
          <div class="col-md-6"> <br>     
                <label>Select Address:</label>

                <select id="addr" name="addr" class="form-control" style="width:200px;" >
                    <option >  </option >

                    <?php
                    while ($row= mysqli_fetch_array($resultAddr))  {
                        $prop2 = $row['address'];
                        echo "<option > $prop2 </option >";

                    }
                    ?>

                </select>
                <br>
</div>
 
           
                <br>
            <div class="col-md-6"><br>    
                <label>Select Classification:</label>
                

                <select id="classif" name="classif" style="width:200px;" class="form-control" >
                    <option >  </option >

                    <?php
                    while ($row= mysqli_fetch_array($resultClass))  {
                        $prop2 = $row['classification'];
                        echo "<option > $prop2 </option >";

                    }
                    ?>

                </select>
    <br>
  </div>      
                <br>
        <div class="col-md-6">    
                <label>Select DOB:</label>
               
             
                <select id="dob" name="dob" style="width:200px;" class="form-control" >
                    <option >  </option >

                    <?php
                    while ($row= mysqli_fetch_array($resultDob))  {
                        $prop2 = $row['dob'];
                        echo "<option > $prop2 </option >";

                    }
                    ?>

                </select>
                <br>
      </div>
                <br>
          <div class="col-md-6">    
                <label>Select Hair Color:</label>
                

                <select id="hcolor" name="hcolor" style="width:200px;" class="form-control">
                    <option >  </option >

                    <?php
                    while ($row= mysqli_fetch_array($resultHair))  {
                        $prop2 = $row['haircolor'];
                        echo "<option > $prop2 </option >";

                    }
                    ?>

                </select>
		<br>
          </div>
                <br>
            <div class="col-md-6">    
                <label>Select License:</label>
                
                <select id="lic" name="lic" style="width:200px;" class="form-control" >
                    <option >  </option >

                    <?php
                    while ($row= mysqli_fetch_array($resultLicense))  {
                        $prop2 = $row['license'];
                        echo "<option > $prop2 </option >";

                    }
                    ?>

                </select>
                <br>
        </div>   
                <br>
           <div class="col-md-6">
                <label>Select Race:</label>
         
                    
                <select id="race" name="race"  style="width:200px;" class="form-control"  >
                    <option >  </option >

                    <?php
                    while ($row= mysqli_fetch_array($resultRace))  {
                        $prop2 = $row['race'];
                        echo "<option > $prop2 </option >";

                    }
                    ?>

                </select>
                <br>
        </div>  
                <br>
          <div class="col-md-6">       
                <label>Select Reliability:</label>
               

                <select id="reli" name="reli" style="width:200px;" class="form-control"  >
                    <option >  </option >

                    <?php
                    while ($row= mysqli_fetch_array($resultReli))  {
                        $prop2 = $row['reliability'];
                        echo "<option > $prop2 </option >";

                    }
                    ?>

                </select>
           </div>
                <br>
            <div class="col-md-6">     
                <label>Select Category:</label>
                

                <select id="cat" name="cat" style="width:200px;" class="form-control"  >
                    <option >  </option >

                    <?php
                    while ($row= mysqli_fetch_array($resultCat))  {
                        $prop2 = $row['selectcat'];
                        echo "<option > $prop2 </option >";

                    }
                    ?>

                </select>
                <br>
         </div>
                <br>
                
           <div class="col-md-6">      
                <label>Select Sex</label>
             

                <select id="sex" name="sex" style="width:200px;" class="form-control"  >
                    <option >  </option >

                    <?php
                    while ($row= mysqli_fetch_array($resultSex))  {
                        $prop2 = $row['sex'];
                        echo "<option > $prop2 </option >";

                    }
                    ?>

                </select>
                <br>
          </div> 
                <br>
                
              <div class="col-md-6">   
                <label>Select Validity</label>
                

                <select id="val" name="val" style="width:200px;" class="form-control"  >
                    <option >  </option >

                    <?php
                    while ($row= mysqli_fetch_array($resultValidity))  {
                        $prop2 = $row['validity'];
                        echo "<option > $prop2 </option >";

                    }
                    ?>

                </select>
                <br>
              </div>  
                <br>
          <button type="button submit" class="btn btn-primary">Search</button>
                <!--<input type="submit" value="Search">-->






</form>
   	<br>
    <br>			
    
    	  </div>
		</div>
	</div>
</div>


