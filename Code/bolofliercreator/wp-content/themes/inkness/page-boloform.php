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

<!-- JQuery for Preview Submittal -->
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">

<!-- Latest compiled and minified JavaScript -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>

</head>


<?php get_header(); ?>
    
 <?php include ('inc/headers.php'); ?>
 
 <script>
 $(document).ready(function() {
    $('#preview').click(function() {
        var data = new FormData($('#boloForm').get(0));
        data.append('picture', $('#picture').get(0).files[0]);
        $.ajax({
          url: 'wp-content/themes/inkness/flier_preview.php',
          data: data,
          type: 'POST',
          processData: false,
          contentType: false,
          success: function(data) {
              data = $.parseJSON(data);
              console.log(data);            // data.preview_url
            if (data.mobile) {
                
                setTimeout(function() {
                  window.open(data.preview_url);
                  // For iOS Apps
                    var a = document.createElement('a');
                    a.setAttribute("href", data.preview_url);
                    a.setAttribute("target","_blank");
                    var dispatch = document.createEvent("HTMLEvents");
                    dispatch.initEvent("click", true, true);
                    a.dispatchEvent(dispatch);
                //}
                }, 1500);
                //$('#objectPrev').attr("src", data.preview_url);
                //$('#previewBOLOid').attr("value", data.preview_url);
            } else {
                $('#objectPrev').attr("src", data.preview_url);
                $('#previewBOLOid').attr("value", data.boloID);
            }
            
            $('#myModal').modal();
            setTimeout(function(){
                previewDelete(data.boloID);
            }, 1800);
            
          },
          error: function() {
            console.log("Error with form.");
          }
        });
    }) 
 });
  function previewDelete(boloID)
 {
     var link = "wp-content/themes/inkness/FlierDelete.php?boloID=" + boloID;
     $.ajax({
          url: link,
          type: 'GET',
          processData: false,
          contentType: false,
          success: function(data) {
              console.log("Deleted bolo " + boloID);
          },
          error: function() {
            console.log("Error with delete.");
          }
        });
 }
 </script>


    
<div class="container">
    <div class="row">
        <div class="col-md-9">
            <div class="form-group">
                


<!--<form action="?page_id=1481" method="POST" enctype="multipart/form-data">-->
    
<form id="boloForm" action="<?php echo get_template_directory_uri();?>../flier_controller.php" method="POST" enctype="multipart/form-data" name="boloCreate">
 
 
<div class="controls">
    <div class="col-md-6">
     <label class="control-label" for="selectbasic">Category</label>
     <br />
      <select id="selectcat" name="selectcat" class="input-xlarge">
      <option value=""></option>
      <option value="ARSON">ARSON</option>
      <option value="BURGLARY">BURGLARY</option>
      <option value="DOMESTIC SECURITY">DOMESTIC SECURITY</option>
      <option value="ESCAPE">ESCAPE</option>
      <option value="FRAUD">FRAUD</option>
      <option value="HOME INVASION">HOME INVASION</option>
      <option value="HOMICIDE">HOMICIDE</option>
      <option value="MISSING JUVENILE">MISSING JUVENILE</option>
      <option value="MISSING PERSON">MISSING PERSON</option>
      <option value="NARCOTICS">NARCOTICS</option>
      <option value="NEED TO IDENTIFY">NEED TO IDENTIFY</option>
      <option value="OFFICER SAFETY">OFFICER SAFETY</option>
      <option value="PC TO ARREST">PC TO ARREST</option>
      <option value="ROBBERY">ROBBERY</option>
      <option value="RUNAWAY">RUNAWAY</option>
      <option value="SEX OFFENSE">SEX OFFENSE</option>
      <option value="SITUATIONAL AWARENESS">SITUATIONAL AWARENESS</option>
      <option value="THEFT _ AUTO">THEFT - AUTO</option>
      <option value="THEFT - BOAT">THEFT - BOAT</option>
      <option value="THEFT - GRAND">THEFT - GRAND</option>
      <option value="THEFT - PETIT">THEFT - PETIT</option>
      <option value="WANTED">WANTED</option>
      <option value="FIELD INTERVIEW">FIELD INTERVIEW</option>
      <option value="INFORMATION">INFORMATION</option>
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
    <input id="link" name="link"  class="input-xlarge" style="width: 72%">
    
      
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
<input id="previewBOLOid" name="previewBOLOid" value="" type="hidden"/>              



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
      <option value="Hispanic">Hispanic</option>
      <option value="White">White</option>
      <option value="Asian">Asian</option>
      <option value="Black or African American">Black or African American</option>
      <option value="American Indian or Alaska Native">America Indian or Alaska Native</option>
        <option value="Native Hawaiian or Other Pacific Islander">Native Hawaiian or Other Pacific Islander</option>
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
      <option value="Black">Black</option>
      <option value="Blonde">Blonde</option>
      <option value="Red">Red</option>
      <option value="Brown">Brown</option>
      <option value="Gray">Gray</option>
      <option value="White">White</option>
      <option value="Sandy">Sandy</option>
      <option value="Bald (No hair)">Bald (No hair)</option>
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
    <textarea id="adtnlinfo" name="adtnlinfo" style="height: 20%"></textarea>
  </div>
 </div>
</div>
<br>
<!-- Textarea -->
<div class="control-group">
<div class="col-md-12">
  <label class="control-label" for="summary">Summary</label>
  <div class="controls">                     
    <textarea id="summary" name="summary" style="height: 20%"></textarea>
  </div>
 </div>
</div>
<br>

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
  <a href="#" id="preview" class="btn btn-primary" align = "center">Preview</a>

   </div>
  </div>
  
  <div class="control-group">
    <div class="col-md-4">
 <br/><br/>
  <button  type="submit" value="pdf" name="pdf" class="btn btn-primary" align = "right">Save as PDF</button>
     </div>
  </div>
  
  <style>

.modal-backdrop{
    z-index:0;
}
<?php 
    $ua = strtolower($_SERVER['HTTP_USER_AGENT']);
    if (stripos($ua, 'android') === false && stripos($ua, 'iphone') === false && stripos($ua, 'ipad') === false):
    ?>
.modal-content{
    width:180%;
}
<?php endif; ?>

</style>


</style>

 <!-- MODAL BELOW FOR BOLO PREVIEW -->
<div class="modal fade" id="myModal">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">Preview</h4>
      </div>
      <div class="modal-body">
          
          <!-- I get the user id and concat it with the default preview location on the database, but only after the modal has loaded -->
          <!-- TODO: make more secure, wp-content/.../ should not be visible to user -->
            <!--<div id="mobilePreview" style="display: none">
                Opening preview in new window...
            </div> -->
            <?php 
        $ua = strtolower($_SERVER['HTTP_USER_AGENT']);
        if (stripos($ua, 'android') === false && stripos($ua, 'iphone') === false && stripos($ua, 'ipad') === false):
        ?>
            <div id="normalPreview">
                
                <iframe id="objectPrev" style="width:100%; height:500px" src=""></iframe>
                  <!-- After concatenation I use the variable to retrieve it and display it in the modal 
              <object id="objectPrev" data="" type='application/pdf' style="width: 100%; height: 600px">
                   <embed id="embedPrev" src="" type='application/pdf'></embed> -->
              </object>
            </div>
          <?php else: ?>
            <div id="mobilePreview">
                    Opening preview in new window...
            </div>
          
          <?php endif; ?>
          
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

  
  </form>

</div>
</div>
</div>
</div>
  
</div>



</html>
                     
                
     
  
  

<?php get_footer(); ?>









