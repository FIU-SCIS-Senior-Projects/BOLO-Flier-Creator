<?php
/**
 * Template Name: Bolo Form 
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


<?php
get_header(); ?>
              
			
 <?php include ('inc/headers.php'); ?>

	
<div class="container">
	<div class="row">
		<div class="col-md-9">
			<div class="form-group">
				

<form action="<?php echo get_template_directory_uri();?>../page-flier.php" method="POST" enctype="multipart/form-data">
	

 
<div class="controls">
	<div class="col-md-6">
	 <label class="control-label" for="selectbasic">Category</label>
	 <br />
   	  <select id="selectcat" name="selectcat" class="input-xlarge">
      <option value =""></option>
      <option>Fraud</option>
      <option>Wanted Subject</option>
      <option>Robbery</option>
      <option>Missing Person</option>
      <option>Domestic Security</option>
      <option>Criminal Intelligence</option>
      <option>Homicide</option>
      <option>Sex Offence</option>
    </select>
   </div>
  </div>


<!-- File Button --> 
<div class="control-group">
    <div class="col-md-6">
    <label class="control-label" for="picture">Upload Image</label>
  <div class="controls">
    <input type="hidden" name="MAX-FILE_SIZE" value="102400">
    <input type = "file" name="picture" id="picture" accept="image/*"/>
   </div>
  </div>
 </div> 

<br>
<!-- Text input-->
<div class="control-group">
    <div class="col-md-12">
  <label class="control-label" for="myName">Name</label>
   <div class="controls">
    <input id="name" name="myName" placeholder="" class="input-xlarge" type="text">
    
   </div>
  </div>
 </div>
<br>



</script>

<!-- Text input-->
<div class="control-group">

  <div class="col-md-6">
  <label class="control-label" for="dob">D.O.B.</label>
  <div class="controls">
    <input id="dob" name="dob" placeholder="YYYY/MM/DD" class="input-xlarge" >
    
      
  </div>
 </div>
</div>


<br>
<!-- Text input-->
<div class="control-group">
<div class="col-md-6">
  <label class="control-label" for="DLnumber">DL Number</label>
  <div class="controls">
    <input id="DLnumber" name="DLnumber" placeholder="" class="input-xlarge" type="text">
    
  </div>
 </div>
</div>
<br>
<!-- Select Basic -->
<div class="control-group">
    <div class="col-md-6">
  <label class="control-label" for="race">Race</label>
  <div class="controls">
    <select id="race" name="race" class="input-xlarge">
     <option value =""></option>
      <option>Hispanic</option>
      <option>White</option>
      <option>Asian</option>
      <option>Black or African American</option>
      <option>America Indian or Alaska Native</option>
        <option>Native Hawaiian or Other Pacific Islander</option>
    </select>
  </div>
 </div>
</div>
<br>
<!-- Select Basic -->
<div class="control-group">
<div class="col-md-6">
  <label class="control-label" for="sex">Sex</label>
  <div class="controls">
    <select id="sex" name="sex" class="input-xlarge">
    <option value =""></option>
      <option>Male</option>
      <option>Female</option>
    </select>
  </div>
 </div>
</div>
<br>
<!-- Text input-->
<div class="control-group">
<div class="col-md-6">
  <label class="control-label" for="height">Height</label>
  <div class="controls">
    <input id="height" name="height" placeholder="" class="input-xlarge" type="text">
    
  </div>
 </div>
</div>
<br>

<div class="control-group">
<div class="col-md-6">
  <label class="control-label" for="weight">Weight</label>
  <div class="controls">
    <input id="weight" name="weight" placeholder="" class="input-xlarge" type="text">
    
  </div>
 </div>
</div>
<br>
<!-- Select Basic -->
<div class="control-group">
<div class="col-md-6">
  <label class="control-label" for="haircolor">Hair Color</label>
  <div class="controls">
    <select id="haircolor" name="haircolor" class="input-xlarge">
     <option value =""></option>
      <option>Black</option>
      <option>Blonde</option>
      <option>Red</option>
      <option>Brown</option>
      <option>Gray</option>
      <option>White</option>
      <option>Sandy</option>
      <option>Bald (No hair)</option>
    </select>
  </div>
 </div>
</div>
<br>

<!-- Textarea -->
<div class="control-group">
    <div class="col-md-6">
  <label class="control-label" for="tattoos">Tattoos/Scars</label>
  <div class="controls">                     
     <textarea id="tattoos" name="tattoos"></textarea>
  </div>
 </div>
</div>

<br>
<!-- Text input-->
<div class="control-group">
<div class="col-md-12">
  <label class="control-label" for="address">Last Known Address</label>
  <div class="controls">
    <input id="address" name="address" placeholder="" class="input-xlarge" type="text">
    
  </div>
 </div>
</div>
<br>
<!-- Textarea -->
<div class="control-group">
<div class="col-md-12">
  <label class="control-label" for="adtnl-info">Additional Info</label>
  <div class="controls">                     
    <textarea id="adtnlinfo" name="adtnlinfo"></textarea>
  </div>
 </div>
</div>
<br>
<!-- Textarea -->
<div class="control-group">
<div class="col-md-12">
  <label class="control-label" for="summary">Summary</label>
  <div class="controls">                     
    <textarea id="summary" name="summary"></textarea>
  </div>
 </div>
</div>
<br>

<!-- Multiple Checkboxes (inline) -->
<div class="control-group">
<div class="col-md-12">
  <label class="control-label" for="source">Source Reliability</label>
  <div class="controls">
  <label class="checkbox-inline"></label>
  	<label class="checkbox-inline"><input type="checkbox" name= "reliability[]" value ="Reliable">Reliable</label>
    <label class="checkbox-inline"><input type="checkbox" name= "reliability[]" value ="Usually Reliable">Usually Reliable</label>
    <label class="checkbox-inline"><input type="checkbox" name= "reliability[]" value ="Unreliable">Unreliable</label>
    <label class="checkbox-inline"><input type="checkbox" name= "reliability[]" value ="Unknown">Unknown</label>
    <label class="checkbox-inline"><input type="hidden" name= "reliability[]" value =""</label>  
 </div>
</div>
</div>


<!-- Multiple Checkboxes (inline) -->
<div class="control-group">
<div class="col-md-12">
  <label class="control-label" for="content">Content Validity</label>
  <div class="controls">
  <label class="checkbox-inline"></label>
    <label class="checkbox-inline"><input type="checkbox" name= "validity[]" value ="Confirmed">Confirmed</label>
    <label class="checkbox-inline"><input type="checkbox" name= "validity[]" value ="Probable">Probable</label>
    <label class="checkbox-inline"><input type="checkbox" name= "validity[]" value ="Doubtful">Doubtful</label>
    <label class="checkbox-inline"><input type="checkbox" name= "validity[]" value ="Cannot be determined">Cannot be determined</label>
    <label class="checkbox-inline"><input type="hidden" name= "validity[]" value =" "></label>
    
  </div>
 </div>
</div>
<!-- Multiple Checkboxes (inline) -->
<div class="control-group">
 <div class="col-md-12">
  <label class="control-label" for="content">Information Classification</label>
  <div class="controls">
    
    <label class="checkbox-inline"></label>
    <label class="checkbox-inline"><input type="checkbox" name= "classification[]" value ="For Official Use Only (FOUO)"> For Official Use Only (FOUO)</label>
    <label class="checkbox-inline"><input type="checkbox" name= "classification[]" value ="Law Enforcement Sensitive">Law Enforcement Sensitive</label>
    <label class="checkbox-inline"><input type="checkbox" name= "classification[]" value = "Contains Personal Identifier Information (PII)">Contains Personal Identifier Information (PII)</label>
    <label class="checkbox-inline"><input type="checkbox" name= "classification[]" value ="Public">Public</label>
    <label class="checkbox-inline"><input type="checkbox" name= "classification[]" value ="Contains Information on US Person or a Lawful Permanent Resident (LPR)">Contains Information on US Person or a Lawful Permanent Resident (LPR)</label>
    <label class="checkbox-inline"><input type="hidden" name= "classification[]" value =""></label>
   </div>
  </div>
 </div>



<!-- Button -->

<div class="control-group">
    <div class="col-md-12">
 <br/><br/>
    <button  id="submit" name="submit"  class="btn btn-primary" align = "right">Submit</button>
   
   </div>
  </div>
  </form>
  
  


</div>
</div>
</div>
</div>
  
</div>


</html>
					 
				
	 	

<?php get_footer(); ?>









