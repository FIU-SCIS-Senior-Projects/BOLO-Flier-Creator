<?php
/**
 * Template Name: header
 *
 * @package Inkness
 */
 ?>

<?php
include("header_model.php");

//find out the current user's agency (theres some jumping thru hoops, 
//will be fixed soon: when BoloSelected.php is added to wordpress)

//case gettin header for new bolo (new bolo form)
$ag_name = get_user_meta(get_current_user_id(), "agency", true);

//get the information of the agency
$model = new header_model();
$result = $model->get_agency($ag_name);
$row = $result->fetch_assoc();
?>
<div class="container">		
	<div id = "pcstation" class="col-md-2" style="text-align:center; padding-top: 25px;">
		<img src="<?php echo $row['logo1'] ?>" width="120" height="137">	
	</div>
	<div class="col-md-8" style=" padding-top: 25px;">
		<p style="text-align:center; font-size:15px; text-transform:uppercase; margin-top:10px; color:red;">Unclassified// for official use only// law enforcement sensitive </p>
		<h1 style="text-align:center; font-size:24px; margin-bottom:2px; font-weight: bold;"><?php echo $row['name'] ?> Police Department</h1>
		<h3 style="text-align:center; font-size:20px; line-height:1.2em; font-weight:300;"><em><?php echo $row['st_address'] ?><br><?php echo $row['city'] ?>, FL, <?php echo $row['zip'] ?><br><?php echo $row['phone'] ?></em></h3>	
	</div>
	<div class="col-md-2" style="text-align:center; padding-top: 25px;">	    
		<img src="<?php echo $row['logo2'] ?>" width="118" height="160">
	</div>
	<div class = "col-md-12" style="border-bottom: 1px solid #7b7b7b;  margin-bottom: 40px;"></div>	
</div>	

