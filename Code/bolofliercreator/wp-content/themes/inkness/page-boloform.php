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
				

<!--<form action="?page_id=1481" method="POST" enctype="multipart/form-data">-->
	
<form action="<?php echo get_template_directory_uri();?>../flier_controller.php" method="POST" enctype="multipart/form-data">
 
 
 <!--Shows modal when preview is clicked -->
<?php if($show_modal):?>
  <script> $('#myModal').modal();</script>
<?php endif;?>
 
 <!-- MODAL BELOW FOR BOLO PREVIEW!!! -->
<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title" id="myModalLabel">Preview</h4>
      </div>
      <div class="modal-body">
          
          <!-- I get the user id and concat it with the default preview location on the database, but only after the modal has loaded -->
          $('#myModal').on('shown.bs.modal', function()) {
              
              <div id="pdfauthor" style="display: none;">
                <?php 
                    echo wp_get_current_user()->ID; 
                ?>
              </div>
              <script>
                  var div = document.getElementById("pdfauthor");
                  var authorName = div.textContent;
                  var pdf = "uploads/preview";
                  var previewLocation = pdf.concat(authorName);
                  var location = document.getElementById('pdfPreview').value = previewLocation;
              </script>
                  <!-- After concatenation I use the variable to retrieve it and display it in the modal -->
              <!-- <input type="text" id="pdfPreview" name="pdfPreview"/> -->
              < object data="pdfPreview" type='application/pdf'>
                   < embed src="pdfPreview" type='application/pdf'></embed>
              </object>
          
          }
          
      </div>
      <div class="modal-footer">
        <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        <button  type="submit" value="pdf" name"pdf" class="btn btn-primary" align = "right">Save as PDF</button>
        <button  type="submit" value="save" name="save" class="btn btn-primary" align = "right">Submit</button>
        <!-- <button type="button" class="btn btn-primary">Save changes</button> -->
      </div>
    </div>
  </div>
</div
 <!-- end of modal -->
 
<div class="controls">
	<div class="col-md-6">
	 <label class="control-label" for="selectbasic">Category</label>
	 <br />
   	  <select id="selectcat" name="selectcat" class="input-xlarge">
      <option value =""></option>
      <option>ARSON</option>
      <option>BURGLARY</option>
      <option>DOMESTIC SECURITY</option>
      <option>ESCAPE</option>
      <option>FRAUD</option>
      <option>HOME INVASION</option>
      <option>HOMICIDE</option>
      <option>MISSING JUVENILE</option>
      <option>MISSING PERSON</option>
      <option>NARCOTICS</option>
      <option>NEED TO IDENTIFY</option>
      <option>OFFICER SAFETY</option>
      <option>PC TO ARREST</option>
      <option>ROBBERY</option>
      <option>RUNAWAY</option>
      <option>SEX OFFENSE</option>
      <option>SITUATIONAL AWARENESS</option>
      <option>THEFT - AUTO</option>
      <option>THEFT - BOAT</option>
      <option>THEFT - GRAND</option>
      <option>THEFT - PETIT</option>
      <option>WANTED</option>
      <option>FIELD INTERVIEW</option>
      <option>INFORMATION</option>
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


<div class="control-group">

  <div class="col-md-12">
  <label class="control-label" for="dob">Video Link</label>
  <div class="controls">
    <input id="link" name="link"  class="input-xlarge" >
    
      
  </div>
 </div>
</div>



<!-- Text input-->
<div class="control-group">
    <div class="col-md-6">
  <label class="control-label" for="myName">Name</label>
   <div class="controls">
    <input id="name" name="myName" placeholder="" class="input-xlarge" type="text">
   </div>
     </div>
 </div>
 
   <div class="control-group">
    <div class="col-md-6">
   <label class="control-label" for="LastName">Last Name</label>
   <div class="controls">
    <input id="lastName" name="lastName" placeholder="" class="input-xlarge" type="text">    
   </div>
  </div>
 </div>
 



<input id="author" name="author" value="<?php echo wp_get_current_user()->ID; ?>" type="hidden"/>
<input id="agency" name="agency" value="<?php echo get_user_meta(get_current_user_id(), "agency", true); ?>" type="hidden"/>
		 



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
    <div class="col-md-4">
 <br/><br/>
  <button  type="submit" value="save" name="save" class="btn btn-primary" align = "right">Submit</button>

   </div>
  </div>
  
  <div class="control-group">
    <div class="col-md-4">
 <br/><br/>
  <button  type="submit" value="preview" name="preview" class="btn btn-primary" align = "center">Preview</button>

   </div>
  </div>
  
  
  <div class="control-group">
    <div class="col-md-4">
 <br/><br/>
  <button  type="submit" value="pdf" name"pdf" class="btn btn-primary" align = "right">Save as PDF</button>
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









